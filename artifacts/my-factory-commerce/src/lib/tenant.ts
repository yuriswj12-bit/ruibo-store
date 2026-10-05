import { prisma } from "@/lib/prisma";
import { cacheSet, tenantCacheKey, TENANT_CACHE_TTL } from "@/lib/redis";

export type ResolvedTenant = {
  tenantId: string;
  industryPreset: string;
  slug: string;
  name: string;
  status: string;
};

export function parseHost(host: string): { host: string; slug: string | null } {
  const normalized = host.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
  const root = (process.env.PLATFORM_ROOT_DOMAIN ?? "").toLowerCase();
  if (!root || normalized === root || normalized === `www.${root}`) {
    return { host: normalized, slug: null };
  }
  if (normalized.endsWith(`.${root}`)) {
    const slug = normalized.slice(0, -(root.length + 1)).split(".")[0] || null;
    return { host: normalized, slug };
  }
  return { host: normalized, slug: null };
}

export async function resolveTenantByHost(rawHost: string): Promise<ResolvedTenant | null> {
  const { host, slug } = parseHost(rawHost);
  const tenant = await prisma.tenant.findFirst({
    where: {
      status: "active",
      OR: [
        { customDomain: host },
        { customDomain: host.replace(/^www\./, "") },
        ...(slug ? [{ slug }] : []),
      ],
    },
    select: { id: true, industryPreset: true, slug: true, name: true, status: true },
  });
  if (!tenant) return null;
  const resolved: ResolvedTenant = {
    tenantId: tenant.id,
    industryPreset: tenant.industryPreset,
    slug: tenant.slug,
    name: tenant.name,
    status: tenant.status,
  };
  await cacheSet(tenantCacheKey(host), JSON.stringify(resolved), TENANT_CACHE_TTL);
  return resolved;
}
