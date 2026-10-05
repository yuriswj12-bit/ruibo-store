import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { markSampleOrderPaid } from "@/lib/sample-payment";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.paypalOrderId) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  try {
    const captured = await capturePayPalOrder(body.paypalOrderId);
    const orderId = body.orderId || captured.customId;
    if (!orderId) return NextResponse.json({ error: "MISSING_ORDER" }, { status: 400 });
    const order = await prisma.sampleOrder.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "SAMPLE_ORDER_NOT_FOUND" }, { status: 404 });
    await markSampleOrderPaid({ orderId: order.id, paymentTxId: captured.captureId, gateway: "paypal" });
    return NextResponse.json({ status: "paid", orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PAYPAL_CAPTURE_FAILED";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
