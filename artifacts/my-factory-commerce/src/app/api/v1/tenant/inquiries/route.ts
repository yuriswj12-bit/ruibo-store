import { NextResponse } from "next/server";
import { canTransitionInquiry } from "@/lib/inquiry-status";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const tenantId = request.headers.get("x-tenant-id");
  if (!tenantId) return NextResponse.json({ error: "TENANT_REQUIRED" }, { status: 400 });
  const body = await request.json();
  const current = await prisma.inquiry.findFirst({ where: { id: body.id, tenantId } });
  if (!current) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (!canTransitionInquiry(current.status, body.status)) {
    return NextResponse.json({ error: "INVALID_TRANSITION" }, { status: 400 });
  }
  const updated = await prisma.inquiry.update({ where: { id: current.id }, data: { status: body.status } });
  return NextResponse.json({ id: updated.id, status: updated.status });
}
