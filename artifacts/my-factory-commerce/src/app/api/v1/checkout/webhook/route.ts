import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { markSampleOrderPaid } from "@/lib/sample-payment";

export const runtime = "nodejs";

/**
 * 样品收单 Webhook。
 * Stripe:  checkout.session.completed，metadata.orderId
 * PayPal:  PAYMENT.CAPTURE.COMPLETED，custom_id = orderId
 * Binance: BizStatus PAY_SUCCESS，passThroughInfo.orderId
 * 三者都落到 markSampleOrderPaid，靠 paymentTxId 唯一约束幂等。
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const gateway = url.searchParams.get("gateway");
  const raw = await request.text();

  try {
    if (gateway === "stripe") {
      const event = verifyStripe(raw, request.headers.get("stripe-signature"));
      if (event.type !== "checkout.session.completed") {
        return NextResponse.json({ received: true, ignored: true });
      }
      const session = event.data.object as {
        id: string;
        payment_status?: string;
        metadata?: { orderId?: string };
      };
      if (session.payment_status && session.payment_status !== "paid") {
        return NextResponse.json({ received: true, ignored: true });
      }
      const orderId = session.metadata?.orderId;
      if (!orderId) return NextResponse.json({ error: "MISSING_ORDER" }, { status: 400 });
      await markSampleOrderPaid({ orderId, paymentTxId: session.id, gateway: "stripe" });
      return NextResponse.json({ received: true });
    }

    if (gateway === "paypal") {
      const body = JSON.parse(raw) as {
        event_type?: string;
        resource?: { id?: string; custom_id?: string; status?: string };
      };
      if (body.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
        return NextResponse.json({ received: true, ignored: true });
      }
      const orderId = body.resource?.custom_id;
      const txId = body.resource?.id;
      if (!orderId || !txId) return NextResponse.json({ error: "MISSING_ORDER" }, { status: 400 });
      await markSampleOrderPaid({ orderId, paymentTxId: txId, gateway: "paypal" });
      return NextResponse.json({ received: true });
    }

    if (gateway === "binance_pay") {
      verifyBinance(raw, request.headers);
      const body = JSON.parse(raw) as {
        bizStatus?: string;
        bizIdStr?: string;
        data?: string;
      };
      if (body.bizStatus !== "PAY_SUCCESS") {
        return NextResponse.json({ returnCode: "SUCCESS", returnMessage: null });
      }
      const data = body.data ? (JSON.parse(body.data) as { merchantTradeNo?: string; transactionId?: string }) : {};
      const orderId = data.merchantTradeNo;
      const txId = data.transactionId || body.bizIdStr;
      if (!orderId || !txId) return NextResponse.json({ returnCode: "FAIL", returnMessage: "MISSING_ORDER" });
      await markSampleOrderPaid({ orderId, paymentTxId: txId, gateway: "binance_pay" });
      return NextResponse.json({ returnCode: "SUCCESS", returnMessage: null });
    }

    return NextResponse.json({ error: "UNKNOWN_GATEWAY" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "WEBHOOK_FAILED";
    const status = message === "INVALID_SIGNATURE" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

function verifyStripe(raw: string, signature: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signature) throw new Error("INVALID_SIGNATURE");
  const parts = Object.fromEntries(signature.split(",").map((item) => item.split("=") as [string, string]));
  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1) throw new Error("INVALID_SIGNATURE");
  const expected = createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("INVALID_SIGNATURE");
  return JSON.parse(raw) as { type: string; data: { object: unknown } };
}

function verifyBinance(raw: string, headers: Headers) {
  const secret = process.env.BINANCE_PAY_SECRET;
  const signature = headers.get("binancepay-signature");
  const timestamp = headers.get("binancepay-timestamp");
  const nonce = headers.get("binancepay-nonce");
  if (!secret || !signature || !timestamp || !nonce) throw new Error("INVALID_SIGNATURE");
  const payload = `${timestamp}\n${nonce}\n${raw}\n`;
  const expected = createHmac("sha512", secret).update(payload).digest("hex").toUpperCase();
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.toUpperCase());
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("INVALID_SIGNATURE");
}
