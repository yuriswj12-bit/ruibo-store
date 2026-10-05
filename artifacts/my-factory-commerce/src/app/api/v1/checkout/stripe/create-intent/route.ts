import { NextResponse } from "next/server";
import { createGuestSampleOrder } from "@/lib/sample-payment";
import { getStripe, toCents } from "@/lib/stripe";

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
      gateway: "stripe",
      shippingAddress: body.shippingAddress,
    });
    const intent = await getStripe().paymentIntents.create({
      amount: toCents(order.amountTotal.toString()),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { tenantId, orderId: order.id, sku: order.product.sku },
    });
    return NextResponse.json({ clientSecret: intent.client_secret, orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "STRIPE_INTENT_FAILED";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
