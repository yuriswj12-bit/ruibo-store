import { NextResponse } from "next/server";
import { verifyBinanceWebhook } from "@/lib/binance-pay";
import { markSampleOrderPaid } from "@/lib/sample-payment";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw = await request.text();
  try {
    verifyBinanceWebhook(raw, request.headers);
    const body = JSON.parse(raw) as {
      bizStatus?: string;
      bizIdStr?: string;
      data?: string;
    };
    const paid = body.bizStatus === "PAY_SUCCESS" || body.bizStatus === "ORDER_PAID";
    if (!paid) return NextResponse.json({ returnCode: "SUCCESS", returnMessage: null });
    const data = body.data
      ? (JSON.parse(body.data) as { merchantTradeNo?: string; transactionId?: string })
      : {};
    const merchantTradeNo = data.merchantTradeNo;
    if (!merchantTradeNo) return NextResponse.json({ returnCode: "FAIL", returnMessage: "MISSING_ORDER" });
    const order = await prisma.sampleOrder.findFirst({ where: { paymentTxId: merchantTradeNo } });
    if (!order) return NextResponse.json({ returnCode: "FAIL", returnMessage: "SAMPLE_ORDER_NOT_FOUND" });
    await markSampleOrderPaid({
      orderId: order.id,
      paymentTxId: data.transactionId || body.bizIdStr || merchantTradeNo,
      gateway: "binance_pay",
    });
    return NextResponse.json({ returnCode: "SUCCESS", returnMessage: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "WEBHOOK_FAILED";
    return NextResponse.json({ returnCode: "FAIL", returnMessage: message });
  }
}
