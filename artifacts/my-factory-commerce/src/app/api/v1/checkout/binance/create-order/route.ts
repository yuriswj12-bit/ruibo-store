import { NextResponse } from "next/server";
import { createGuestSampleOrder } from "@/lib/sample-payment";
import { createBinanceOrder } from "@/lib/binance-pay";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const tenantId = body.tenantId || request.headers.get("x-tenant-id");
  if (!tenantId || !body.productId || !body.shippingAddress) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }
  try {
    const order = await createGuestSampleOrder({
      tenantId,
      productId: body.productId,
      quantity: Number(body.quantity || 1),
      gateway: "binance_pay",
      shippingAddress: body.shippingAddress,
    });
    const merchantTradeNo = order.id.replace(/-/g, "");
    const binance = await createBinanceOrder({
      merchantTradeNo,
      amount: order.amountTotal.toString(),
      goodsName: order.product.title,
      sku: order.product.sku,
    });
    await prisma.sampleOrder.update({
      where: { id: order.id },
      data: { paymentTxId: merchantTradeNo },
    });
    return NextResponse.json({
      orderId: order.id,
      qrcodeLink: binance.qrcodeLink,
      checkoutUrl: binance.checkoutUrl,
      prepayId: binance.prepayId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "BINANCE_ORDER_FAILED";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
