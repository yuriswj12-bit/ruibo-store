import { NextResponse } from "next/server";
import { hashPassword, sessionCookie, signSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");
  const factoryName = String(body.factoryName || "").trim();
  if (!/^[a-z0-9_]{3,32}$/.test(username) || password.length < 8) {
    return NextResponse.json({ error: "用户名 3-32 位字母数字，密码至少 8 位" }, { status: 400 });
  }
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) return NextResponse.json({ error: "用户名已占用" }, { status: 409 });

  const slug = username.replace(/_/g, "-");
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: hashPassword(password),
      role: "tenant_admin",
      memberships: {
        create: {
          email: `${username}@factory.local`,
          role: "tenant_admin",
          tenant: {
            create: {
              name: factoryName || username,
              slug,
              industryPreset: "auto_parts",
              settings: { primaryColor: "#9a3412", feishuWebhookUrl: process.env.FEISHU_WEBHOOK_URL || "" },
            },
          },
        },
      },
    },
    include: { memberships: true },
  });
  const token = signSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    tenantId: user.memberships[0]?.tenantId ?? null,
  });
  const cookie = sessionCookie(token);
  const res = NextResponse.json({ username: user.username });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
