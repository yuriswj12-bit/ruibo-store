import { NextResponse } from "next/server";
import { attachCustomDomain, getCustomDomain } from "@/lib/vercel-dns";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function assertSuperAdmin(request: Request) {
  const role = request.headers.get("x-role");
  if (role !== "super_admin") throw new Error("FORBIDDEN");
}

export async function POST(request: Request) {
  try {
    assertSuperAdmin(request);
    const body = await request.json();
    if (!body.tenantId || !body.domain) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    const domain = String(body.domain).toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    const attached = await attachCustomDomain(domain);
    await prisma.tenant.update({ where: { id: body.tenantId }, data: { customDomain: domain } });
    return NextResponse.json(attached);
  } catch (error) {
    const message = error instanceof Error ? error.message : "DOMAIN_ATTACH_FAILED";
    const status = message === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(request: Request) {
  try {
    assertSuperAdmin(request);
    const domain = new URL(request.url).searchParams.get("domain");
    if (!domain) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    return NextResponse.json(await getCustomDomain(domain));
  } catch (error) {
    const message = error instanceof Error ? error.message : "DOMAIN_QUERY_FAILED";
    return NextResponse.json({ error: message }, { status: message === "FORBIDDEN" ? 403 : 400 });
  }
}
