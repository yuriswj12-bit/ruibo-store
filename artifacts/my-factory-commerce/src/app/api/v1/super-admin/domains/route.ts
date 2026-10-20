import { NextResponse } from "next/server";
import { attachCustomDomain, getCustomDomain } from "@/lib/vercel-dns";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-guard";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireSuperAdmin();
    const body = await request.json();
    if (!body.tenantId || !body.domain) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    const domain = String(body.domain).toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    const attached = await attachCustomDomain(domain);
    await prisma.tenant.update({ where: { id: body.tenantId }, data: { customDomain: domain } });
    return NextResponse.json(attached);
  } catch (error) {
    if (error instanceof Response) {
      const data = await error.json().catch(() => ({ error: "AUTH_FAILED" }));
      return NextResponse.json(data, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "DOMAIN_ATTACH_FAILED";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    await requireSuperAdmin();
    const domain = new URL(request.url).searchParams.get("domain");
    if (!domain) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    return NextResponse.json(await getCustomDomain(domain));
  } catch (error) {
    if (error instanceof Response) {
      const data = await error.json().catch(() => ({ error: "AUTH_FAILED" }));
      return NextResponse.json(data, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "DOMAIN_QUERY_FAILED";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
