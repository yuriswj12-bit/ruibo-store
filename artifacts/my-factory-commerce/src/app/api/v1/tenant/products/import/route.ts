import { NextResponse } from "next/server";
import { importProductRows } from "@/lib/excel-import";
import { requireTenantAdmin } from "@/lib/auth-guard";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireTenantAdmin();
    const body = await request.json();
    if (!Array.isArray(body.rows)) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    const ids = await importProductRows(session.tenantId, body.rows);
    return NextResponse.json({ count: ids.length });
  } catch (error) {
    if (error instanceof Response) {
      const data = await error.json().catch(() => ({ error: "AUTH_FAILED" }));
      return NextResponse.json(data, { status: error.status });
    }
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
