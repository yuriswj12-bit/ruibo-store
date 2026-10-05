"use client";

import { useMemo, useState } from "react";

type ProductLite = {
  sku: string;
  title: string;
  samplePrice: string;
  sampleStock: number;
  pdfAttachment?: string | null;
};

type Props = {
  tenantId: string;
  lang: string;
  product: ProductLite;
  whatsappNumber?: string;
};

const MAX_SAMPLE_QTY = 5;

export function DualActionBox({ tenantId, lang, product, whatsappNumber }: Props) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => (Number(product.samplePrice) * qty).toFixed(2), [product.samplePrice, qty]);
  const stockCap = Math.max(1, Math.min(MAX_SAMPLE_QTY, product.sampleStock));

  async function submitRfq(formData: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
        body: JSON.stringify({
          productSku: product.sku,
          customerName: String(formData.get("customerName") || ""),
          company: String(formData.get("company") || ""),
          customerEmail: String(formData.get("customerEmail") || ""),
          customerWhatsapp: String(formData.get("customerWhatsapp") || ""),
          quantity: Number(formData.get("quantity") || 0),
          country: String(formData.get("country") || ""),
          message: String(formData.get("message") || ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "RFQ_FAILED");
      setDone(data.whatsappNumber || whatsappNumber || "");
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "RFQ_FAILED");
    } finally {
      setSubmitting(false);
    }
  }

  function orderSample() {
    const url = `/${lang}/checkout/sample?sku=${encodeURIComponent(product.sku)}&qty=${qty}`;
    window.location.href = url;
  }

  return (
    <section className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 md:grid-cols-2">
      <div className="flex flex-col gap-3 border-zinc-200 md:border-r md:pr-4">
        <h3 className="text-base font-semibold text-zinc-900">Request Quote</h3>
        <p className="text-sm text-zinc-600">Bulk RFQ. MOQ applies. A sales engineer replies within one business day.</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Request Quote
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-zinc-900">Order Sample</h3>
        <p className="text-sm text-zinc-600">
          ${product.samplePrice} / pc · stock {product.sampleStock}. Limit {stockCap} pcs, no account required.
        </p>
        <label className="text-sm text-zinc-700">
          Quantity
          <input
            type="number"
            min={1}
            max={stockCap}
            value={qty}
            onChange={(event) => setQty(Math.min(stockCap, Math.max(1, Number(event.target.value) || 1)))}
            className="mt-1 w-24 rounded-md border border-zinc-300 px-2 py-1"
          />
        </label>
        <p className="text-sm font-medium">Total USD ${total}</p>
        <button
          type="button"
          onClick={orderSample}
          disabled={product.sampleStock < 1}
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Order Sample
        </button>
      </div>

      {done !== null && (
        <p className="md:col-span-2 text-sm text-emerald-700">
          RFQ received.{" "}
          {done ? (
            <a className="underline" href={`https://wa.me/${done.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
              Continue on WhatsApp
            </a>
          ) : (
            "Our team will email you shortly."
          )}
        </p>
      )}
      {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            action={submitRfq}
            className="w-full max-w-lg space-y-3 rounded-xl bg-white p-5"
          >
            <h4 className="text-lg font-semibold">Bulk inquiry · {product.sku}</h4>
            <input name="customerName" required placeholder="Name" className="w-full rounded border px-3 py-2" />
            <input name="company" placeholder="Company" className="w-full rounded border px-3 py-2" />
            <input name="customerEmail" type="email" required placeholder="Work email" className="w-full rounded border px-3 py-2" />
            <input name="customerWhatsapp" placeholder="WhatsApp" className="w-full rounded border px-3 py-2" />
            <input name="country" placeholder="Country" className="w-full rounded border px-3 py-2" />
            <input name="quantity" type="number" min={1} required placeholder="Target quantity" className="w-full rounded border px-3 py-2" />
            <textarea name="message" required placeholder="Requirements" className="w-full rounded border px-3 py-2" rows={4} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded border px-3 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
                {submitting ? "Sending…" : "Submit RFQ"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
