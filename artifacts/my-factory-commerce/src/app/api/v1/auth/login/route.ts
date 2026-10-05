import { NextResponse } from "next/server";
import { sessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");
  const user = await prisma.user.findUnique({
    where: { username },
    include: { memberships: { take: 1 } },
  });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }
  const token = signSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    tenantId: user.memberships[0]?.tenantId ?? null,
  });
  const cookie = sessionCookie(token);
  const res = NextResponse.json({ username: user.username, role: user.role });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
