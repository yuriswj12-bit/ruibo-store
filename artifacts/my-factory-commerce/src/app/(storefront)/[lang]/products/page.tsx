import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStoreContext } from "@/lib/store-context";
import { normalizeOeNumber } from "@/lib/normalizer";

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; position?: string; make?: string }>;
}) {
  const { lang } = await params;
  const query = await searchParams;
  const store = await getStoreContext();
  if (!store) return null;
  const oe = query.q ? normalizeOeNumber(query.q) : "";
  const products = await prisma.product.findMany({
    where: {
      tenantId: store.tenantId,
      isPublished: true,
      ...(query.position ? { fitments: { some: { position: query.position } } } : {}),
      ...(query.make ? { fitments: { some: { make: query.make } } } : {}),
      ...(oe
        ? { oeNumbers: { some: { normalizedOe: { startsWith: oe } } } }
        : {}),
    },
    include: { oeNumbers: true, fitments: true },
    orderBy: { title: "asc" },
  });

  return (
    <main className="wrap" style={{ padding: "28px 0" }}>
      <p className="kicker">Catalog</p>
      <h1>Sensors in this factory</h1>
      <form style={{ display: "flex", gap: 8, margin: "12px 0 20px" }}>
        <input name="q" defaultValue={query.q} placeholder="OE, Bosch, Denso, Toyota" style={{ flex: 1, border: "1px solid #e4ddd2", borderRadius: 8, padding: "8px 10px" }} />
        <select name="position" defaultValue={query.position || ""} style={{ border: "1px solid #e4ddd2", borderRadius: 8, padding: "8px 10px" }}>
          <option value="">Any position</option>
          <option>Upstream</option>
          <option>Downstream</option>
        </select>
        <button type="submit">Filter</button>
      </form>
      <div className="product-grid">
        {products.map((product) => (
          <Link key={product.id} href={`/${lang}/products/${product.sku}`} className="card">
            <p className="sku">{product.sku}</p>
            <h3>{product.title}</h3>
            <p>{product.priceRange}</p>
            <p className="sku">Sample ${product.samplePrice.toString()} · MOQ {product.moq}</p>
            <p className="sku">{product.oeNumbers.map((item) => item.rawOe).join(" · ")}</p>
          </Link>
        ))}
        {products.length === 0 && <p>No published part matches this OE or position.</p>}
      </div>
    </main>
  );
}
