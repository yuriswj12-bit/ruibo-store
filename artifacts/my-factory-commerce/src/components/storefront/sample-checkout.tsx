"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useMemo, useState } from "react";

type Product = { id: string; sku: string; title: string; samplePrice: string };

type Props = {
  tenantId: string;
  lang: string;
  product: Product;
  quantity: number;
  stripePublishableKey: string;
  paypalClientId: string;
  usdtAddress: string;
};

type Address = {
  fullName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

const emptyAddress: Address = {
  fullName: "",
  address1: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
};

export function SampleCheckout(props: Props) {
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [clientSecret, setClientSecret] = useState("");
  const [qrcodeLink, setQrcodeLink] = useState("");
  const [txHash, setTxHash] = useState("");
  const [message, setMessage] = useState("");
  const total = useMemo(() => (Number(props.product.samplePrice) * props.quantity).toFixed(2), [props]);
  const stripePromise = useMemo(
    () => (props.stripePublishableKey ? loadStripe(props.stripePublishableKey) : null),
    [props.stripePublishableKey],
  );

  function patch<K extends keyof Address>(key: K, value: Address[K]) {
    setAddress((current) => ({ ...current, [key]: value }));
  }

  async function prepareStripe() {
    setMessage("");
    const res = await fetch("/api/v1/checkout/stripe/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-tenant-id": props.tenantId },
      body: JSON.stringify({ tenantId: props.tenantId, productId: props.product.id, quantity: props.quantity, shippingAddress: address }),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "STRIPE_INTENT_FAILED");
    setClientSecret(data.clientSecret);
  }

  async function prepareBinance() {
    setMessage("");
    const res = await fetch("/api/v1/checkout/binance/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-tenant-id": props.tenantId },
      body: JSON.stringify({ tenantId: props.tenantId, productId: props.product.id, quantity: props.quantity, shippingAddress: address }),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "BINANCE_ORDER_FAILED");
    setQrcodeLink(data.qrcodeLink);
  }

  async function submitUsdt(event: FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/v1/checkout/crypto/submit-tx", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-tenant-id": props.tenantId },
      body: JSON.stringify({
        tenantId: props.tenantId,
        productId: props.product.id,
        quantity: props.quantity,
        shippingAddress: address,
        txHash,
      }),
    });
    const data = await res.json();
    setMessage(res.ok ? `Submitted for review: ${data.orderId}` : data.error || "CRYPTO_SUBMIT_FAILED");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Sample</p>
        <h1 className="mt-1 text-lg font-semibold">{props.product.title}</h1>
        <p className="mt-2 text-sm text-zinc-600">{props.product.sku}</p>
        <p className="mt-4 text-sm">Qty {props.quantity}</p>
        <p className="text-xl font-semibold">USD ${total}</p>
      </aside>
      <div className="space-y-4">
        <form className="grid gap-2 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <input required placeholder="Full name" value={address.fullName} onChange={(e) => patch("fullName", e.target.value)} className="rounded border px-3 py-2" />
          <input required placeholder="Phone" value={address.phone} onChange={(e) => patch("phone", e.target.value)} className="rounded border px-3 py-2" />
          <input required placeholder="Address" value={address.address1} onChange={(e) => patch("address1", e.target.value)} className="rounded border px-3 py-2 sm:col-span-2" />
          <input required placeholder="City" value={address.city} onChange={(e) => patch("city", e.target.value)} className="rounded border px-3 py-2" />
          <input placeholder="State" value={address.state} onChange={(e) => patch("state", e.target.value)} className="rounded border px-3 py-2" />
          <input required placeholder="Postal code" value={address.postalCode} onChange={(e) => patch("postalCode", e.target.value)} className="rounded border px-3 py-2" />
          <input required placeholder="Country" value={address.country} onChange={(e) => patch("country", e.target.value)} className="rounded border px-3 py-2" />
        </form>

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold">Card</h2>
          {!clientSecret ? (
            <button type="button" onClick={prepareStripe} className="mt-3 rounded bg-zinc-900 px-3 py-2 text-sm text-white">Continue with card</button>
          ) : stripePromise ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CardForm lang={props.lang} />
            </Elements>
          ) : null}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="mb-3 font-semibold">PayPal</h2>
          {props.paypalClientId ? (
            <PayPalScriptProvider options={{ clientId: props.paypalClientId, currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "horizontal" }}
                createOrder={async () => {
                  const res = await fetch("/api/v1/checkout/paypal/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "x-tenant-id": props.tenantId },
                    body: JSON.stringify({ tenantId: props.tenantId, productId: props.product.id, quantity: props.quantity, shippingAddress: address }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "PAYPAL_CREATE_FAILED");
                  return data.paypalOrderId as string;
                }}
                onApprove={async (data) => {
                  const res = await fetch("/api/v1/checkout/paypal/capture-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paypalOrderId: data.orderID }),
                  });
                  const json = await res.json();
                  if (!res.ok) return setMessage(json.error || "PAYPAL_CAPTURE_FAILED");
                  window.location.href = `/${props.lang}/checkout/sample?paid=1&order=${json.orderId}`;
                }}
              />
            </PayPalScriptProvider>
          ) : (
            <p className="text-sm text-zinc-500">PayPal client id is not configured.</p>
          )}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold">Binance Pay</h2>
          <button type="button" onClick={prepareBinance} className="mt-3 rounded border px-3 py-2 text-sm">Show USDT QR</button>
          {qrcodeLink && <img src={qrcodeLink} alt="Binance Pay QR" className="mt-3 h-40 w-40" />}
          <form onSubmit={submitUsdt} className="mt-4 space-y-2 border-t pt-3">
            <p className="text-sm text-zinc-600">Static TRC20 fallback: {props.usdtAddress || "not configured"}</p>
            <input value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="TxHash" className="w-full rounded border px-3 py-2" />
            <button type="submit" className="rounded bg-amber-700 px-3 py-2 text-sm text-white">Submit hash for review</button>
          </form>
        </section>
        {message && <p className="text-sm text-zinc-700">{message}</p>}
      </div>
    </div>
  );
}

function CardForm({ lang }: { lang: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");

  async function pay(event: FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/${lang}/checkout/sample?paid=1` },
    });
    if (result.error) setError(result.error.message || "CARD_FAILED");
  }

  return (
    <form onSubmit={pay} className="mt-3 space-y-3">
      <PaymentElement />
      <button type="submit" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">Pay sample</button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
