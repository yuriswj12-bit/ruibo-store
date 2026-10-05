import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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

export async function getStoreContext(): Promise<StoreContext | null> {
  const h = await headers();
  const tenantId = h.get("x-tenant-id");
  const tenant = tenantId
    ? await prisma.tenant.findUnique({ where: { id: tenantId } })
    : await prisma.tenant.findFirst({ where: { status: "active" }, orderBy: { createdAt: "asc" } });
  if (!tenant || tenant.status !== "active") return null;
  return {
    tenantId: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    industryPreset: tenant.industryPreset,
    settings: (tenant.settings ?? {}) as StoreContext["settings"],
  };
}
