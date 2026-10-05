import { NextResponse } from "next/server";
import { resolveTenantByHost } from "@/lib/tenant";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (request.headers.get("x-internal-resolve") !== "1") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const host = new URL(request.url).searchParams.get("host") || "";
  const tenant = await resolveTenantByHost(host);
  return NextResponse.json({ tenant });
}
