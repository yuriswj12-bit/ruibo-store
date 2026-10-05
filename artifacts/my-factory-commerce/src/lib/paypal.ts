const base = () => process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

async function accessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PAYPAL_CREDENTIALS_MISSING");
  const res = await fetch(`${base()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || "PAYPAL_AUTH_FAILED");
  return data.access_token as string;
}

export async function createPayPalOrder(input: { orderId: string; amount: string; sku: string }) {
  const token = await accessToken();
  const res = await fetch(`${base()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: input.orderId,
          description: input.sku,
          amount: { currency_code: "USD", value: input.amount },
        },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "PAYPAL_CREATE_FAILED");
  return data as { id: string; status: string };
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await accessToken();
  const res = await fetch(`${base()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "PAYPAL_CAPTURE_FAILED");
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  return {
    paypalOrderId: data.id as string,
    captureId: (capture?.id as string) || (data.id as string),
    customId: data.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id
      || data.purchase_units?.[0]?.custom_id as string | undefined,
    status: data.status as string,
  };
}
