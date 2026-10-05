import { NextResponse } from "next/server";
import { importProductRows } from "@/lib/excel-import";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const tenantId = request.headers.get("x-tenant-id");
  if (!tenantId) return NextResponse.json({ error: "TENANT_REQUIRED" }, { status: 400 });
  const body = await request.json();
  if (!Array.isArray(body.rows)) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  const ids = await importProductRows(tenantId, body.rows);
  return NextResponse.json({ count: ids.length });
}
