import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendFeishuNotification } from "@/lib/feishu";

export const runtime = "nodejs";

type Body = {
  productSku?: string;
  customerName?: string;
  company?: string;
  customerEmail?: string;
  customerWhatsapp?: string;
  quantity?: number;
  country?: string;
  message?: string;
};

export async function POST(request: Request) {
  const tenantId = request.headers.get("x-tenant-id");
  if (!tenantId) return NextResponse.json({ error: "TENANT_REQUIRED" }, { status: 400 });

  const body = (await request.json()) as Body;
  if (!body.customerName || !body.customerEmail || !body.message) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true, settings: true },
  });
  if (!tenant) return NextResponse.json({ error: "TENANT_NOT_FOUND" }, { status: 404 });

  const product = body.productSku
    ? await prisma.product.findUnique({
        where: { tenantId_sku: { tenantId, sku: body.productSku } },
        select: { id: true, sku: true, title: true },
      })
    : null;

  const note = [body.company ? `Company: ${body.company}` : "", body.message].filter(Boolean).join("\n");
  const inquiry = await prisma.inquiry.create({
    data: {
      tenantId,
      productId: product?.id,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerWhatsapp: body.customerWhatsapp || null,
      quantity: body.quantity || null,
      country: body.country || null,
      message: note,
    },
  });

  const settings = (tenant.settings ?? {}) as { feishuWebhookUrl?: string; whatsappNumber?: string };
  if (settings.feishuWebhookUrl) {
    await sendFeishuNotification(settings.feishuWebhookUrl, {
      tenantName: tenant.name,
      type: "NEW_RFQ",
      customerName: body.customerName,
      contact: body.customerWhatsapp || body.customerEmail,
      productTitle: product?.title || "General inquiry",
      sku: product?.sku || "-",
      quantity: body.quantity || 0,
      message: note,
      country: body.country,
    }).catch(() => undefined);
  }

  return NextResponse.json({
    id: inquiry.id,
    status: inquiry.status,
    whatsappNumber: settings.whatsappNumber || null,
  });
}
