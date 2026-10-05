import { NextResponse } from "next/server";
import { createGuestSampleOrder, markSamplePendingReview } from "@/lib/sample-payment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const tenantId = body.tenantId || request.headers.get("x-tenant-id");
  if (!tenantId || !body.productId || !body.shippingAddress || !body.txHash) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }
  try {
    const order = await createGuestSampleOrder({
      tenantId,
      productId: body.productId,
      quantity: Number(body.quantity || 1),
      gateway: "crypto_manual",
      shippingAddress: body.shippingAddress,
    });
    await markSamplePendingReview({ orderId: order.id, txHash: String(body.txHash) });
    return NextResponse.json({ orderId: order.id, paymentStatus: "pending_review" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CRYPTO_SUBMIT_FAILED";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
