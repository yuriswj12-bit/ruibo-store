import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { markSampleOrderPaid } from "@/lib/sample-payment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 401 });
  try {
    const event = getStripe().webhooks.constructEvent(raw, signature, secret);
    if (event.type !== "payment_intent.succeeded") {
      return NextResponse.json({ received: true, ignored: true });
    }
    const intent = event.data.object;
    const orderId = intent.metadata?.orderId;
    if (!orderId) return NextResponse.json({ error: "MISSING_ORDER" }, { status: 400 });
    await markSampleOrderPaid({ orderId, paymentTxId: intent.id, gateway: "stripe" });
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "WEBHOOK_FAILED";
    const status = message === "INVALID_SIGNATURE" || message.includes("signature") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
