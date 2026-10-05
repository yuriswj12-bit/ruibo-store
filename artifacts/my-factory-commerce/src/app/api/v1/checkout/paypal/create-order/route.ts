import { NextResponse } from "next/server";
import { createGuestSampleOrder } from "@/lib/sample-payment";
import { createPayPalOrder } from "@/lib/paypal";

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
      gateway: "paypal",
      shippingAddress: body.shippingAddress,
    });
    const paypal = await createPayPalOrder({
      orderId: order.id,
      amount: order.amountTotal.toString(),
      sku: order.product.sku,
    });
    return NextResponse.json({ paypalOrderId: paypal.id, orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PAYPAL_CREATE_FAILED";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
