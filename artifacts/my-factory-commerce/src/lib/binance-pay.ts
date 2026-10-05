import { createHmac, createVerify, randomBytes } from "crypto";

const BINANCE_API = "https://bpay.binanceapi.com";

export type BinanceOrderResult = {
  prepayId: string;
  qrcodeLink: string;
  checkoutUrl: string;
  merchantTradeNo: string;
};

function nonce(): string {
  return randomBytes(16).toString("hex");
}

/** 出站请求按官方 Merchant API：payload = ts\\nnonce\\nbody\\n，HMAC-SHA512 大写十六进制。 */
export function signBinanceRequest(timestamp: string, nonceValue: string, body: string): string {
  const secret = process.env.BINANCE_PAY_SECRET_KEY;
  if (!secret) throw new Error("BINANCE_SECRET_MISSING");
  const payload = `${timestamp}\n${nonceValue}\n${body}\n`;
  return createHmac("sha512", secret).update(payload).digest("hex").toUpperCase();
}

/**
 * Webhook 先验 Binance 公钥。
 * 官方文档是 RSA-SHA256；规范包要求同时接受 RSA-SHA512。
 * 没有公钥时回退到与出站一致的 HMAC-SHA512。
 */
export function verifyBinanceWebhook(raw: string, headers: Headers): void {
  const timestamp = headers.get("binancepay-timestamp") || "";
  const nonceValue = headers.get("binancepay-nonce") || "";
  const signature = headers.get("binancepay-signature") || "";
  if (!timestamp || !nonceValue || !signature) throw new Error("INVALID_SIGNATURE");
  const payload = `${timestamp}\n${nonceValue}\n${raw}\n`;
  const publicKey = process.env.BINANCE_PAY_PUBLIC_KEY;
  if (publicKey) {
    const sha256 = createVerify("RSA-SHA256");
    sha256.update(payload);
    const ok256 = sha256.verify(publicKey, signature, "base64");
    const sha512 = createVerify("RSA-SHA512");
    sha512.update(payload);
    const ok512 = sha512.verify(publicKey, signature, "base64");
    if (!ok256 && !ok512) throw new Error("INVALID_SIGNATURE");
    return;
  }
  const expected = signBinanceRequest(timestamp, nonceValue, raw);
  if (expected !== signature.toUpperCase()) throw new Error("INVALID_SIGNATURE");
}

export async function createBinanceOrder(input: {
  merchantTradeNo: string;
  amount: string;
  goodsName: string;
  sku: string;
}): Promise<BinanceOrderResult> {
  const apiKey = process.env.BINANCE_PAY_API_KEY;
  if (!apiKey) throw new Error("BINANCE_KEY_MISSING");
  const body = JSON.stringify({
    env: { terminalType: "WEB" },
    merchantTradeNo: input.merchantTradeNo,
    orderAmount: Number(input.amount),
    currency: "USDT",
    description: input.goodsName,
    goodsDetails: [
      {
        goodsType: "01",
        goodsCategory: "Z000",
        referenceGoodsId: input.sku,
        goodsName: input.goodsName,
        goodsDetail: "Factory sample order",
      },
    ],
  });
  const timestamp = Date.now().toString();
  const nonceValue = nonce();
  const res = await fetch(`${BINANCE_API}/binancepay/openapi/v3/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "BinancePay-Timestamp": timestamp,
      "BinancePay-Nonce": nonceValue,
      "BinancePay-Certificate-SN": apiKey,
      "BinancePay-Signature": signBinanceRequest(timestamp, nonceValue, body),
    },
    body,
  });
  const data = await res.json();
  if (data.status !== "SUCCESS" || !data.data) {
    throw new Error(data.errorMessage || "BINANCE_ORDER_FAILED");
  }
  return {
    prepayId: data.data.prepayId,
    qrcodeLink: data.data.qrcodeLink,
    checkoutUrl: data.data.checkoutUrl,
    merchantTradeNo: input.merchantTradeNo,
  };
}
