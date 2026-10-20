import { getSession, type Session } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Response(JSON.stringify({ error: "UNAUTHORIZED" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  return session;
}

export async function requireTenantAdmin(): Promise<Session & { tenantId: string }> {
  const session = await requireSession();
  if (!session.tenantId || (session.role !== "tenant_admin" && session.role !== "super_admin")) {
    throw new Response(JSON.stringify({ error: "FORBIDDEN" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  return session as Session & { tenantId: string };
}

export async function requireSuperAdmin(): Promise<Session> {
  const session = await requireSession();
  if (session.role !== "super_admin") {
    throw new Response(JSON.stringify({ error: "FORBIDDEN" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  return session;
}

export function jsonError(error: unknown): NextResponse {
  if (error instanceof Response) return NextResponse.json(JSON.parse(error.body as string), { status: error.status });
  const message = error instanceof Error ? error.message : "INTERNAL_ERROR";
  return NextResponse.json({ error: message }, { status: 500 });
}
