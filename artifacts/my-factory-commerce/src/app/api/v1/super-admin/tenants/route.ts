import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-guard";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireSuperAdmin();
    const body = await request.json();
    if (!body.name || !body.slug) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    const tenant = await prisma.tenant.create({
      data: {
        name: body.name,
        slug: String(body.slug).toLowerCase(),
        industryPreset: body.industryPreset || "auto_parts",
        customDomain: body.customDomain || null,
        settings: { primaryColor: "#9a3412", feishuWebhookUrl: process.env.FEISHU_WEBHOOK_URL || "" },
      },
    });
    return NextResponse.json({ id: tenant.id, slug: tenant.slug });
  } catch (error) {
    if (error instanceof Response) {
      const data = await error.json().catch(() => ({ error: "AUTH_FAILED" }));
      return NextResponse.json(data, { status: error.status });
    }
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
