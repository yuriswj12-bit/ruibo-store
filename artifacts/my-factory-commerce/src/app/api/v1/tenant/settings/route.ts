import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheSet, tenantCacheKey, TENANT_CACHE_TTL } from "@/lib/redis";
import { requireTenantAdmin } from "@/lib/auth-guard";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const session = await requireTenantAdmin();
    const body = await request.json();
    const tenantId = session.tenantId;
    const current = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!current) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    const settings = {
      ...(current.settings as object),
      logoUrl: body.logoUrl || "",
      primaryColor: body.primaryColor || "#9a3412",
      contactEmail: body.contactEmail || "",
      whatsappNumber: body.whatsappNumber || "",
      feishuWebhookUrl: body.feishuWebhookUrl || "",
    };
    const domain = String(body.customDomain || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { settings, customDomain: domain || null },
    });
    if (domain) {
      await cacheSet(
        tenantCacheKey(domain),
        JSON.stringify({
          tenantId,
          industryPreset: tenant.industryPreset,
          slug: tenant.slug,
          name: tenant.name,
          status: tenant.status,
        }),
        TENANT_CACHE_TTL,
      );
    }
    return NextResponse.json({ id: tenant.id, customDomain: tenant.customDomain });
  } catch (error) {
    if (error instanceof Response) {
      const data = await error.json().catch(() => ({ error: "AUTH_FAILED" }));
      return NextResponse.json(data, { status: error.status });
    }
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
