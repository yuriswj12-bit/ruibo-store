import { NextResponse, type NextRequest } from "next/server";
import { detectLocale, isLocale } from "@/config/i18n";
import { edgeRedisGet, edgeRedisSet } from "@/lib/redis-edge";

const TENANT_CACHE_TTL = 60 * 60;

type TenantCache = {
  tenantId: string;
  industryPreset: string;
  slug: string;
  name: string;
  status: string;
};

const API_OR_ADMIN = ["/api", "/super-admin", "/portal", "/_next"];

function normalizeHost(request: NextRequest): string {
  const raw =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  return raw.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
}

function isAsset(pathname: string): boolean {
  return /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$/.test(pathname);
}

function isAdmin(pathname: string): boolean {
  return pathname === "/portal" || pathname.startsWith("/portal/") || pathname === "/super-admin" || pathname.startsWith("/super-admin/");
}

function isSkipped(pathname: string): boolean {
  if (API_OR_ADMIN.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return true;
  return isAsset(pathname);
}

/**
 * 核心路由中间件：域名解析 + 语种重定向 + 租户头注入。
 *
 * App Router 的 (storefront) 是路由组，不会出现在 URL 中。
 * 因此外部路径 /es/products 已由 app/(storefront)/[lang]/products 承接，
 * 这里不再 rewrite 到字面量 "/(storefront)/..."，而是：
 *   1. 无语言前缀时 302 到 /${lang}/...
 *   2. 有语言前缀时 next()，并把 x-tenant-id / x-tenant-preset 写入请求头
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isAsset(pathname) || pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  const host = normalizeHost(request);
  const tenant = await resolveTenant(request, host);

  if (isAdmin(pathname)) {
    if (!request.cookies.get("fc_session")?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tenant-host", host);
    if (tenant) {
      requestHeaders.set("x-tenant-id", tenant.tenantId);
      requestHeaders.set("x-tenant-preset", tenant.industryPreset);
      requestHeaders.set("x-tenant-slug", tenant.slug);
      requestHeaders.set("x-tenant-name", tenant.name);
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const platformHost = (process.env.PLATFORM_ROOT_DOMAIN ?? "").toLowerCase();
  const isPlatformApex = platformHost && (host === platformHost || host === `www.${platformHost}`);
  if (!tenant && isPlatformApex) return NextResponse.next();

  const segments = pathname.split("/").filter(Boolean);
  const maybeLang = segments[0] ?? "";
  const hasLang = isLocale(maybeLang);

  if (!hasLang) {
    const lang = detectLocale({
      country: request.headers.get("x-vercel-ip-country"),
      acceptLanguage: request.headers.get("accept-language"),
    });
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", maybeLang);
  requestHeaders.set("x-tenant-host", host);
  if (tenant) {
    requestHeaders.set("x-tenant-id", tenant.tenantId);
    requestHeaders.set("x-tenant-preset", tenant.industryPreset);
    requestHeaders.set("x-tenant-slug", tenant.slug);
    requestHeaders.set("x-tenant-name", tenant.name);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (tenant) {
    response.headers.set("x-tenant-id", tenant.tenantId);
    response.headers.set("x-tenant-preset", tenant.industryPreset);
  }
  return response;
}

async function resolveTenant(request: NextRequest, host: string): Promise<TenantCache | null> {
  if (!host) return null;
  const cacheKey = `domain:${host}`;

  const cached = await edgeRedisGet(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as TenantCache | null;
      if (parsed && parsed.tenantId) return parsed;
      if (cached === "null") return null;
    } catch {
      // 坏缓存继续回源
    }
  }

  // Edge 中间件不直接连 Prisma。未命中时打内部接口，由 Node 运行时查库并写 Redis。
  try {
    const url = new URL("/api/internal/resolve-tenant", request.url);
    url.searchParams.set("host", host);
    const res = await fetch(url, { headers: { "x-internal-resolve": "1" }, cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { tenant: TenantCache | null };
    await edgeRedisSet(cacheKey, JSON.stringify(data.tenant), TENANT_CACHE_TTL);
    return data.tenant;
  } catch {
    return null;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
