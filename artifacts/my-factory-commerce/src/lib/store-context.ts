import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export type StoreContext = {
  tenantId: string;
  name: string;
  slug: string;
  industryPreset: string;
  settings: {
    logoUrl?: string;
    primaryColor?: string;
    contactEmail?: string;
    whatsappNumber?: string;
    certImages?: string[];
    feishuWebhookUrl?: string;
  };
};

async function toContext(tenant: { id: string; name: string; slug: string; industryPreset: string; settings: unknown; status: string }): Promise<StoreContext | null> {
  if (!tenant || tenant.status !== "active") return null;
  return {
    tenantId: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    industryPreset: tenant.industryPreset,
    settings: (tenant.settings ?? {}) as StoreContext["settings"],
  };
}

export async function getStoreContext(): Promise<StoreContext | null> {
  const h = await headers();
  const tenantId = h.get("x-tenant-id");
  const tenant = tenantId
    ? await prisma.tenant.findUnique({ where: { id: tenantId } })
    : await prisma.tenant.findFirst({ where: { status: "active" }, orderBy: { createdAt: "asc" } });
  return tenant ? toContext(tenant) : null;
}

/** For admin pages: prefer the logged-in user's tenant membership. */
export async function getAdminStoreContext(): Promise<StoreContext | null> {
  const session = await getSession();
  if (session?.tenantId) {
    const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId } });
    if (tenant) return toContext(tenant);
  }
  return getStoreContext();
}

