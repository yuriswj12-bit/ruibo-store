import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/v1/storefront/ymm/cascade?tenantId&year&make&model
 * 只传 tenantId -> years desc
 * +year -> makes
 * +year+make -> models
 * +year+make+model -> engines + products
 * 所有查询都锁 product.tenantId，禁止跨站。
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId") || request.headers.get("x-tenant-id");
  if (!tenantId) return NextResponse.json({ error: "TENANT_REQUIRED" }, { status: 400 });

  const year = url.searchParams.get("year");
  const make = url.searchParams.get("make");
  const model = url.searchParams.get("model");
  const base = { product: { tenantId, isPublished: true } };

  if (!year) {
    const rows = await prisma.fitment.groupBy({
      by: ["year"],
      where: base,
      orderBy: { year: "desc" },
    });
    return NextResponse.json({ level: "years", years: rows.map((row) => row.year) });
  }

  const yearNum = Number(year);
  if (!Number.isInteger(yearNum)) return NextResponse.json({ error: "INVALID_YEAR" }, { status: 400 });

  if (!make) {
    const rows = await prisma.fitment.findMany({
      where: { ...base, year: yearNum },
      distinct: ["make"],
      select: { make: true },
      orderBy: { make: "asc" },
    });
    return NextResponse.json({ level: "makes", makes: rows.map((row) => row.make) });
  }

  if (!model) {
    const rows = await prisma.fitment.findMany({
      where: { ...base, year: yearNum, make },
      distinct: ["model"],
      select: { model: true },
      orderBy: { model: "asc" },
    });
    return NextResponse.json({ level: "models", models: rows.map((row) => row.model) });
  }

  const fitments = await prisma.fitment.findMany({
    where: { ...base, year: yearNum, make, model },
    select: {
      engine: true,
      position: true,
      product: { select: { id: true, sku: true, title: true, samplePrice: true } },
    },
    orderBy: { engine: "asc" },
  });
  const engines = Array.from(new Set(fitments.map((row) => row.engine)));
  const products = fitments.map((row) => ({
    id: row.product.id,
    sku: row.product.sku,
    title: row.product.title,
    samplePrice: row.product.samplePrice.toString(),
    engine: row.engine,
    position: row.position,
  }));
  return NextResponse.json({ level: "engines", engines, products });
}
