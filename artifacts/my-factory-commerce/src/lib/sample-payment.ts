import { prisma } from "@/lib/prisma";
import { sendFeishuNotification } from "@/lib/feishu";

type TenantSettings = {
  feishuWebhookUrl?: string;
  whatsappNumber?: string;
};

export async function markSampleOrderPaid(input: {
  orderId: string;
  paymentTxId: string;
  gateway: "stripe" | "paypal" | "binance_pay" | "crypto_manual";
}) {
  const existing = await prisma.sampleOrder.findFirst({
    where: {
      OR: [{ id: input.orderId }, { paymentTxId: input.paymentTxId }],
    },
    include: {
      product: { select: { title: true, sku: true } },
      tenant: { select: { name: true, settings: true } },
    },
  });
  if (!existing) {
    throw new Error("SAMPLE_ORDER_NOT_FOUND");
  }
  if (existing.paymentStatus === "paid") {
    return existing;
  }
  if (existing.paymentGateway !== input.gateway) {
    throw new Error("GATEWAY_MISMATCH");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.sampleOrder.update({
      where: { id: existing.id },
      data: { paymentStatus: "paid", paymentTxId: input.paymentTxId },
    });
    await tx.product.update({
      where: { id: existing.productId },
      data: { sampleStock: { decrement: existing.quantity } },
    });
    return order;
  });

  const settings = (existing.tenant.settings ?? {}) as TenantSettings;
  const address = existing.shippingAddress as { fullName?: string; country?: string; phone?: string };
  if (settings.feishuWebhookUrl) {
    await sendFeishuNotification(settings.feishuWebhookUrl, {
      tenantName: existing.tenant.name,
      type: "SAMPLE_PAID",
      customerName: address.fullName || "Sample buyer",
      contact: address.phone || input.paymentTxId,
      productTitle: existing.product.title,
      sku: existing.product.sku,
      quantity: existing.quantity,
      country: address.country,
      amount: existing.amountTotal.toString(),
    }).catch(() => undefined);
  }

  return updated;
}

type ShippingAddress = {
  fullName: string;
  address1: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export async function createGuestSampleOrder(input: {
  tenantId: string;
  productId: string;
  quantity: number;
  gateway: "stripe" | "paypal" | "binance_pay" | "crypto_manual";
  shippingAddress: ShippingAddress;
}) {
  if (input.quantity < 1 || input.quantity > 5) throw new Error("QTY_OUT_OF_RANGE");
  const product = await prisma.product.findFirst({
    where: { id: input.productId, tenantId: input.tenantId, isPublished: true },
  });
  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  if (product.sampleStock < input.quantity) throw new Error("OUT_OF_STOCK");
  const amount = Number(product.samplePrice) * input.quantity;
  return prisma.sampleOrder.create({
    data: {
      tenantId: input.tenantId,
      productId: product.id,
      quantity: input.quantity,
      amountTotal: amount.toFixed(2),
      currency: input.gateway === "binance_pay" ? "USDT" : "USD",
      paymentGateway: input.gateway,
      paymentStatus: "pending",
      shippingAddress: input.shippingAddress,
    },
    include: { product: { select: { sku: true, title: true, samplePrice: true } } },
  });
}

export async function markSamplePendingReview(input: { orderId: string; txHash: string }) {
  const existing = await prisma.sampleOrder.findUnique({
    where: { id: input.orderId },
    include: {
      product: { select: { title: true, sku: true } },
      tenant: { select: { name: true, settings: true } },
    },
  });
  if (!existing || existing.paymentGateway !== "crypto_manual") throw new Error("SAMPLE_ORDER_NOT_FOUND");
  const updated = await prisma.sampleOrder.update({
    where: { id: existing.id },
    data: { paymentStatus: "pending_review", paymentTxId: input.txHash },
  });
  const settings = (existing.tenant.settings ?? {}) as TenantSettings;
  const address = existing.shippingAddress as { fullName?: string; country?: string; phone?: string };
  const webhook = settings.feishuWebhookUrl || process.env.FEISHU_WEBHOOK_URL;
  if (webhook) {
    await sendFeishuNotification(webhook, {
      tenantName: existing.tenant.name,
      type: "SAMPLE_PAID",
      customerName: address.fullName || "USDT buyer",
      contact: address.phone || input.txHash,
      productTitle: existing.product.title,
      sku: existing.product.sku,
      quantity: existing.quantity,
      country: address.country,
      amount: existing.amountTotal.toString(),
      message: `TRC20 待人工核账\nTxHash: ${input.txHash}`,
    }).catch(() => undefined);
  }
  return updated;
}
