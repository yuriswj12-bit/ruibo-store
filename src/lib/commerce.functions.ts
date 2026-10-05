import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { canMoveInquiry, normalizeOe } from "@/lib/oe";

const DEMO = "fac_xinda";

export type ProductCard = {
  sku: string;
  title: string;
  priceRange: string | null;
  samplePrice: string;
  sampleStock: number;
  moq: number;
  vehicle: string;
  oes: string[];
  /** exact = the typed OEM is on this SKU; prefix = only the start matches; all = no OEM query */
  match: "exact" | "prefix" | "all";
};

export type StoreHome = {
  name: string;
  email: string;
  whatsapp: string;
  products: ProductCard[];
};

async function demoFactory() {
  const sql = await getSql();
  const rows = await sql<{ id: string; name: string; contact_email: string; whatsapp: string }>`
    select id, name, contact_email, whatsapp from factories where id = ${DEMO} limit 1
  `;
  return rows[0] ?? null;
}

export const getStoreHome = createServerFn({ method: "GET" }).handler(async (): Promise<StoreHome | null> => {
  const factory = await demoFactory();
  if (!factory) return null;
  const sql = await getSql();
  const products = await sql<{
    sku: string;
    title: string;
    price_range: string | null;
    sample_price: string;
    sample_stock: number;
    moq: number;
    vehicle: string | null;
  }>`
    select sku, title, price_range, sample_price::text, sample_stock, moq, specs->>'vehicle' as vehicle
    from products where factory_id = ${factory.id} and published = true
    order by sku
  `;
  const oes = await sql<{ sku: string; raw_oe: string }>`
    select p.sku, o.raw_oe from oe_refs o
    join products p on p.id = o.product_id
    where p.factory_id = ${factory.id}
  `;
  return {
    name: factory.name,
    email: factory.contact_email,
    whatsapp: factory.whatsapp,
    products: products.map((product) => ({
      sku: product.sku,
      title: product.title,
      priceRange: product.price_range,
      samplePrice: product.sample_price,
      sampleStock: product.sample_stock,
      moq: product.moq,
      vehicle: product.vehicle ?? "",
      oes: oes.filter((oe) => oe.sku === product.sku).map((oe) => oe.raw_oe),
      match: "all",
    })),
  };
});

const filterInput = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  line: z.string().optional(),
});

export const searchCatalog = createServerFn({ method: "GET" })
  .validator(filterInput)
  .handler(async ({ data }): Promise<ProductCard[]> => {
    const sql = await getSql();
    const oe = data.q ? normalizeOe(data.q) : "";
    const make = data.make || "";
    const line = data.line || "";
    const products = await sql<{
      sku: string;
      title: string;
      price_range: string | null;
      sample_price: string;
      sample_stock: number;
      moq: number;
      vehicle: string | null;
      exact: boolean;
    }>`
      with hits as (
        select p.sku, p.title, p.price_range, p.sample_price::text as sample_price, p.sample_stock, p.moq,
               p.specs->>'vehicle' as vehicle,
               bool_or(o.normalized_oe = ${oe}) as exact
        from products p
        left join oe_refs o on o.product_id = p.id
        where p.factory_id = ${DEMO} and p.published = true
          and (${oe} = '' or o.normalized_oe = ${oe} or o.normalized_oe like ${oe + "%"})
          and (${make} = '' or p.specs->>'vehicle' = ${make})
          and (${line} = '' or p.specs->>'line' = ${line})
        group by p.sku, p.title, p.price_range, p.sample_price, p.sample_stock, p.moq, p.specs
      )
      select sku, title, price_range, sample_price, sample_stock, moq, vehicle, exact
      from hits
      where ${oe} = '' or exact or not exists (select 1 from hits h where h.exact)
      order by sku
    `;
    const matchedExact = oe !== "" && products.some((row) => row.exact === true);
    const oes = await sql<{ sku: string; raw_oe: string }>`
      select p.sku, o.raw_oe from oe_refs o join products p on p.id = o.product_id where p.factory_id = ${DEMO}
    `;
    return products.map((product) => ({
      sku: product.sku,
      title: product.title,
      priceRange: product.price_range,
      samplePrice: product.sample_price,
      sampleStock: product.sample_stock,
      moq: product.moq,
      vehicle: product.vehicle ?? "",
      oes: oes.filter((row) => row.sku === product.sku).map((row) => row.raw_oe),
      match: oe === "" ? "all" : matchedExact ? "exact" : "prefix",
    }));
  });

export type ProductDetail = ProductCard & {
  pdfUrl: string | null;
  specs: Record<string, string | number>;
  oeBrands: { raw: string; brand: string | null }[];
  fitments: { year: number; make: string; model: string; engine: string; position: string | null }[];
  shared: { sku: string; vehicle: string }[];
};

export const getProduct = createServerFn({ method: "GET" })
  .validator(z.object({ sku: z.string() }))
  .handler(async ({ data }): Promise<ProductDetail | null> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      sku: string;
      title: string;
      price_range: string | null;
      sample_price: string;
      sample_stock: number;
      moq: number;
      pdf_url: string | null;
      specs: Record<string, string | number> | string;
    }>`
      select id, sku, title, price_range, sample_price::text, sample_stock, moq, pdf_url, specs
      from products where factory_id = ${DEMO} and sku = ${data.sku} and published = true limit 1
    `;
    const product = rows[0];
    if (!product) return null;
    const oes = await sql<{ raw_oe: string; brand: string | null }>`
      select raw_oe, brand from oe_refs where product_id = ${product.id}
    `;
    const fitments = await sql<{ year: number; make: string; model: string; engine: string; position: string | null }>`
      select year, make, model, engine, position from fitments where product_id = ${product.id} order by year
    `;
    const shared = await sql<{ sku: string; vehicle: string | null }>`
      select distinct p2.sku, p2.specs->>'vehicle' as vehicle
      from oe_refs o1
      join oe_refs o2 on o2.normalized_oe = o1.normalized_oe and o2.product_id <> o1.product_id
      join products p2 on p2.id = o2.product_id
      where o1.product_id = ${product.id} and p2.factory_id = ${DEMO} and p2.published = true
      order by p2.sku
    `;
    const specs = typeof product.specs === "string" ? (JSON.parse(product.specs) as Record<string, string | number>) : product.specs;
    return {
      sku: product.sku,
      title: product.title,
      priceRange: product.price_range,
      samplePrice: product.sample_price,
      sampleStock: product.sample_stock,
      moq: product.moq,
      vehicle: String(specs.vehicle ?? ""),
      oes: oes.map((oe) => oe.raw_oe),
      match: "all",
      pdfUrl: product.pdf_url,
      specs,
      oeBrands: oes.map((oe) => ({ raw: oe.raw_oe, brand: oe.brand })),
      fitments,
      shared: shared.map((row) => ({ sku: row.sku, vehicle: row.vehicle ?? "" })),
    };
  });

const cascadeInput = z.object({
  year: z.number().int().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
});

export const ymmCascade = createServerFn({ method: "GET" })
  .validator(cascadeInput)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (!data.year) {
      const years = await sql<{ year: number }>`
        select distinct f.year from fitments f
        join products p on p.id = f.product_id
        where p.factory_id = ${DEMO} and p.published = true
        order by f.year desc
      `;
      return { level: "years" as const, years: years.map((row) => row.year) };
    }
    if (!data.make) {
      const makes = await sql<{ make: string }>`
        select distinct f.make from fitments f
        join products p on p.id = f.product_id
        where p.factory_id = ${DEMO} and f.year = ${data.year}
        order by f.make
      `;
      return { level: "makes" as const, makes: makes.map((row) => row.make) };
    }
    if (!data.model) {
      const models = await sql<{ model: string }>`
        select distinct f.model from fitments f
        join products p on p.id = f.product_id
        where p.factory_id = ${DEMO} and f.year = ${data.year} and f.make = ${data.make}
        order by f.model
      `;
      return { level: "models" as const, models: models.map((row) => row.model) };
    }
    const rows = await sql<{ engine: string; sku: string; title: string; sample_price: string; position: string | null }>`
      select f.engine, p.sku, p.title, p.sample_price::text, f.position
      from fitments f join products p on p.id = f.product_id
      where p.factory_id = ${DEMO} and p.published = true
        and f.year = ${data.year} and f.make = ${data.make} and f.model = ${data.model}
      order by f.engine
    `;
    return {
      level: "engines" as const,
      engines: [...new Set(rows.map((row) => row.engine))],
      products: rows.map((row) => ({
        sku: row.sku,
        title: row.title,
        samplePrice: row.sample_price,
        engine: row.engine,
        position: row.position,
      })),
    };
  });

const inquiryInput = z.object({
  sku: z.string().optional(),
  customerName: z.string().min(1).max(80),
  customerEmail: z.string().email(),
  whatsapp: z.string().max(40).optional(),
  quantity: z.number().int().positive().max(1000000).optional(),
  country: z.string().max(60).optional(),
  message: z.string().min(1).max(2000),
  matchedOe: z.string().max(80).optional(),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .validator(inquiryInput)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`
      insert into inquiries (id, factory_id, product_sku, customer_name, customer_email, whatsapp, quantity, country, message, matched_oe)
      values (${id}, ${DEMO}, ${data.sku ?? null}, ${data.customerName}, ${data.customerEmail}, ${data.whatsapp ?? null}, ${data.quantity ?? null}, ${data.country ?? null}, ${data.message}, ${data.matchedOe ?? ""})
    `;
    return { id };
  });

const orderInput = z.object({
  sku: z.string(),
  quantity: z.number().int().min(1).max(5),
  gateway: z.enum(["stripe", "paypal", "binance_pay", "crypto_manual", "gmpay"]),
  buyerName: z.string().min(1).max(80),
  country: z.string().min(1).max(60),
  txHash: z.string().max(120).optional(),
  matchedOe: z.string().max(80).optional(),
});

export const placeSample = createServerFn({ method: "POST" })
  .validator(orderInput)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const products = await sql<{ sample_price: string; sample_stock: number }>`
      select sample_price::text, sample_stock from products
      where factory_id = ${DEMO} and sku = ${data.sku} and published = true limit 1
    `;
    const product = products[0];
    if (!product) throw new Error("产品不存在");
    if (product.sample_stock < data.quantity) throw new Error("样品库存不足");
    const amount = (Number(product.sample_price) * data.quantity).toFixed(2);
    const id = crypto.randomUUID();
    const status = data.gateway === "crypto_manual" ? "pending_review" : "paid";
    await sql`
      insert into sample_orders (id, factory_id, product_sku, quantity, amount, gateway, status, buyer_name, country, matched_oe)
      values (${id}, ${DEMO}, ${data.sku}, ${data.quantity}, ${amount}, ${data.gateway}, ${status}, ${data.buyerName}, ${data.country}, ${data.matchedOe ?? ""})
    `;
    if (status === "paid") {
      await sql`update products set sample_stock = sample_stock - ${data.quantity} where factory_id = ${DEMO} and sku = ${data.sku}`;
    }
    return { id, amount, status };
  });

async function ownedFactory(userId: string) {
  const sql = await getSql();
  const mine = await sql<{ id: string; name: string; slug: string; contact_email: string; whatsapp: string; primary_color: string }>`
    select id, name, slug, contact_email, whatsapp, primary_color from factories where owner_user_id = ${userId} limit 1
  `;
  if (mine[0]) return mine[0];
  const claimed = await sql`
    update factories set owner_user_id = ${userId}
    where id = ${DEMO} and owner_user_id is null
    returning id, name, slug, contact_email, whatsapp, primary_color
  `;
  const row = claimed[0] as
    | { id: string; name: string; slug: string; contact_email: string; whatsapp: string; primary_color: string }
    | undefined;
  if (row) return row;
  const id = crypto.randomUUID();
  const created = await sql<{ id: string; name: string; slug: string; contact_email: string; whatsapp: string; primary_color: string }>`
    insert into factories (id, owner_user_id, name, slug, contact_email)
    values (${id}, ${userId}, '我的工厂', ${"factory-" + id.slice(0, 8)}, '')
    returning id, name, slug, contact_email, whatsapp, primary_color
  `;
  return created[0];
}

export const portalSnapshot = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const factory = await ownedFactory(context.userId);
    const sql = await getSql();
    const [inquiries, paid, products] = await Promise.all([
      sql<{ n: number }>`select count(*)::int as n from inquiries where factory_id = ${factory.id}`,
      sql<{ n: number }>`select count(*)::int as n from sample_orders where factory_id = ${factory.id} and status = 'paid'`,
      sql<{ n: number }>`select count(*)::int as n from products where factory_id = ${factory.id}`,
    ]);
    return {
      factory,
      counts: { inquiries: inquiries[0]?.n ?? 0, paid: paid[0]?.n ?? 0, products: products[0]?.n ?? 0 },
    };
  });

export const portalProducts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const factory = await ownedFactory(context.userId);
    const sql = await getSql();
    return sql<{ sku: string; title: string; moq: number; sample_price: string; sample_stock: number }>`
      select sku, title, moq, sample_price::text, sample_stock from products
      where factory_id = ${factory.id} order by title
    `;
  });

const importRow = z.object({
  SKU: z.string().min(1),
  Title: z.string().min(1),
  PriceRange: z.string().optional(),
  MOQ: z.string().optional(),
  SamplePrice: z.string().optional(),
  OE_Numbers: z.string().optional(),
});

export const importProducts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ rows: z.array(importRow).max(200) }))
  .handler(async ({ data, context }) => {
    const factory = await ownedFactory(context.userId);
    const sql = await getSql();
    let count = 0;
    for (const row of data.rows) {
      const id = crypto.randomUUID();
      const price = row.SamplePrice && Number(row.SamplePrice) > 0 ? row.SamplePrice : "0";
      await sql`
        insert into products (id, factory_id, sku, title, price_range, moq, sample_price, sample_stock)
        values (${id}, ${factory.id}, ${row.SKU.trim()}, ${row.Title.trim()}, ${row.PriceRange || null}, ${Number(row.MOQ || 1)}, ${price}, 20)
        on conflict (factory_id, sku) do update set title = excluded.title, price_range = excluded.price_range, moq = excluded.moq, sample_price = excluded.sample_price
      `;
      const product = await sql<{ id: string }>`select id from products where factory_id = ${factory.id} and sku = ${row.SKU.trim()}`;
      const productId = product[0]?.id;
      if (productId && row.OE_Numbers) {
        await sql`delete from oe_refs where product_id = ${productId}`;
        for (const raw of row.OE_Numbers.split(/[,;|/]/).map((item) => item.trim()).filter(Boolean)) {
          await sql`
            insert into oe_refs (id, product_id, raw_oe, normalized_oe)
            values (${crypto.randomUUID()}, ${productId}, ${raw}, ${normalizeOe(raw)})
          `;
        }
      }
      count += 1;
    }
    return { count };
  });

export const portalInquiries = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const factory = await ownedFactory(context.userId);
    const sql = await getSql();
    return sql<{
      id: string;
      customer_name: string;
      customer_email: string;
      country: string | null;
      product_sku: string | null;
      matched_oe: string | null;
      quantity: number | null;
      status: string;
      message: string;
      created_at: string;
    }>`
      select id, customer_name, customer_email, country, product_sku, matched_oe, quantity, status, message, created_at::text
      from inquiries where factory_id = ${factory.id} order by created_at desc
    `;
  });

export const moveInquiry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string(), status: z.string() }))
  .handler(async ({ data, context }) => {
    const factory = await ownedFactory(context.userId);
    const sql = await getSql();
    const current = await sql<{ status: string }>`
      select status from inquiries where id = ${data.id} and factory_id = ${factory.id}
    `;
    if (!current[0] || !canMoveInquiry(current[0].status, data.status)) throw new Error("不能这样改状态");
    await sql`update inquiries set status = ${data.status} where id = ${data.id} and factory_id = ${factory.id}`;
    return { ok: true };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      contactEmail: z.string().max(120),
      whatsapp: z.string().max(40),
      primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    }),
  )
  .handler(async ({ data, context }) => {
    const factory = await ownedFactory(context.userId);
    const sql = await getSql();
    await sql`
      update factories set contact_email = ${data.contactEmail}, whatsapp = ${data.whatsapp}, primary_color = ${data.primaryColor}
      where id = ${factory.id} and owner_user_id = ${context.userId}
    `;
    return { ok: true };
  });
