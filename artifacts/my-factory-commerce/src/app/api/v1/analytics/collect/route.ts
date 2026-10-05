import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const tenantId = body.tenantId || request.headers.get("x-tenant-id");
  if (!tenantId || !body.eventType || !body.path) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }
  await prisma.analyticsEvent.create({
    data: {
      tenantId,
      eventType: body.eventType,
      path: body.path,
      targetId: body.targetId || null,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0] || null,
      country: request.headers.get("x-vercel-ip-country"),
      userAgent: request.headers.get("user-agent"),
    },
  });
  return NextResponse.json({ ok: true });
}
