import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { submitInquiry } from "@/lib/commerce.functions";
import { useI18n } from "@/lib/i18n";

export function DualAction({
  sku,
  title,
  samplePrice,
  sampleStock,
  matchedOe = "",
  whatsapp,
}: {
  sku: string;
  title: string;
  samplePrice: string;
  sampleStock: number;
  matchedOe?: string;
  whatsapp: string;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const cap = Math.max(1, Math.min(5, sampleStock));
  const total = (Number(samplePrice) * qty).toFixed(2);
  const wa = whatsapp.replace(/\D/g, "");

  async function send(formData: FormData) {
    setError("");
    try {
      await submitInquiry({
        data: {
          sku,
          customerName: String(formData.get("name") || ""),
          customerEmail: String(formData.get("email") || ""),
          whatsapp: String(formData.get("whatsapp") || ""),
          quantity: Number(formData.get("quantity") || 0) || undefined,
          country: String(formData.get("country") || ""),
          message: String(formData.get("message") || ""),
          matchedOe,
        },
      });
      setOpen(false);
      setDone(true);
    } catch {
      setError(t("inquiryFailed"));
    }
  }

  return (
    <section className="grid gap-4 rounded-card border border-line bg-card p-5 md:grid-cols-2">
      <div className="flex flex-col gap-3 md:border-r md:border-line md:pr-4">
        <h2 className="text-lg">{t("requestQuote")}</h2>
        <p className="text-sm text-muted">{t("requestQuoteHint")}</p>
        <button type="button" className="h-11 rounded-lg bg-ink px-4 text-copper-ink" onClick={() => setOpen(true)}>
          {t("requestQuote")}
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-lg">{t("orderSample")}</h2>
        <p className="text-sm text-muted">{t("sampleHint", { price: samplePrice, stock: sampleStock, cap })}</p>
        <label className="text-sm">
          {t("quantity")}
          <input
            type="number"
            min={1}
            max={cap}
            value={qty}
            onChange={(event) => setQty(Math.min(cap, Math.max(1, Number(event.target.value) || 1)))}
            className="mt-1 block h-11 w-24 rounded-lg border border-line px-2"
          />
        </label>
        <p className="font-medium">USD ${total}</p>
        <button
          type="button"
          disabled={sampleStock < 1}
          className="h-11 rounded-lg bg-copper px-4 text-copper-ink disabled:opacity-50"
          onClick={() => navigate({ to: "/checkout", search: { sku, qty, oe: matchedOe } })}
        >
          {t("orderSample")}
        </button>
      </div>
      {done && (
        <p className="text-sm text-brass md:col-span-2">
          {t("inquiryReceived")}{" "}
          {wa && <a className="underline" href={`https://wa.me/${wa}`}>{t("continueWa")}</a>}
        </p>
      )}
      {error && <p className="text-sm text-copper md:col-span-2">{error}</p>}
      {open && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/40 p-4">
          <form action={send} className="grid w-full max-w-lg gap-2 rounded-card bg-card p-5">
            <h3 className="text-xl">{t("bulkInquiry", { title })}</h3>
            <input name="name" required placeholder={t("name")} className="h-11 rounded-lg border border-line px-3" />
            <input name="email" type="email" required placeholder={t("workEmail")} className="h-11 rounded-lg border border-line px-3" />
            <input name="whatsapp" placeholder={t("whatsapp")} className="h-11 rounded-lg border border-line px-3" />
            <input name="country" placeholder={t("country")} className="h-11 rounded-lg border border-line px-3" />
            <input name="quantity" type="number" min={1} required placeholder={t("targetQty")} className="h-11 rounded-lg border border-line px-3" />
            <textarea name="message" required placeholder={t("requirements")} rows={4} className="rounded-lg border border-line px-3 py-2" />
            <div className="flex justify-end gap-2">
              <button type="button" className="h-11 rounded-lg border border-line px-4" onClick={() => setOpen(false)}>{t("cancel")}</button>
              <button type="submit" className="h-11 rounded-lg bg-ink px-4 text-copper-ink">{t("submitRfq")}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
