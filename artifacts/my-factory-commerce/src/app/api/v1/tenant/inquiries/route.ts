import { NextResponse } from "next/server";
import { canTransitionInquiry } from "@/lib/inquiry-status";
import { prisma } from "@/lib/prisma";
import { requireTenantAdmin } from "@/lib/auth-guard";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const session = await requireTenantAdmin();
    const body = await request.json();
    const tenantId = session.tenantId;
    const current = await prisma.inquiry.findFirst({ where: { id: body.id, tenantId } });
    if (!current) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    if (!canTransitionInquiry(current.status, body.status)) {
      return NextResponse.json({ error: "INVALID_TRANSITION" }, { status: 400 });
    }
    const updated = await prisma.inquiry.update({ where: { id: current.id }, data: { status: body.status } });
    return NextResponse.json({ id: updated.id, status: updated.status });
  } catch (error) {
    if (error instanceof Response) {
      const data = await error.json().catch(() => ({ error: "AUTH_FAILED" }));
      return NextResponse.json(data, { status: error.status });
    }
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
