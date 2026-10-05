import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, getStoreHome, placeSample } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { useI18n, vehicleLabel } from "@/lib/i18n";
import { UsdtCashier } from "@/components/store/usdt-cashier";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    sku: typeof search.sku === "string" ? search.sku : "",
    qty: Math.min(5, Math.max(1, Number(search.qty) || 1)),
    oe: typeof search.oe === "string" ? search.oe : "",
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [store, product] = await Promise.all([getStoreHome(), getProduct({ data: { sku: deps.sku } })]);
    return { store, product, qty: deps.qty, oe: deps.oe };
  },
  component: Checkout,
});

function Checkout() {
  const { t, lang } = useI18n();
  const { store, product, qty, oe } = Route.useLoaderData();
  const [result, setResult] = useState<{ id: string; amount: string; status: string } | null>(null);
  const [error, setError] = useState("");
  if (!store || !product) return <main className="wrap py-16">{t("pickSample")}</main>;
  const total = (Number(product.samplePrice) * qty).toFixed(2);
  const vehicle = String(product.specs.vehicle || "");
  const displayOe = oe || product.oes[0] || "";

  async function pay(gateway: "stripe" | "paypal" | "binance_pay" | "crypto_manual" | "gmpay", form: FormData) {
    setError("");
    try {
      const placed = await placeSample({
        data: {
          sku: product!.sku,
          quantity: qty,
          gateway,
          buyerName: String(form.get("name") || ""),
          country: String(form.get("country") || ""),
          matchedOe: oe,
          txHash: undefined,
        },
      });
      setResult(placed);
    } catch {
      setError(t("paymentFailed"));
    }
  }

  return (
    <StoreShell name={store.name} email={store.email}>
      <main className="wrap grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-card border border-line bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">{t("sample")}</p>
          <h1 className="mt-1 text-2xl">{displayOe}</h1>
          <p className="mt-2 text-sm text-muted">{vehicleLabel(lang, vehicle)}</p>
          <p className="mt-4">{t("qtyLine", { qty })}</p>
          <p className="text-2xl">USD ${total}</p>
          <p className="mt-3 text-sm text-muted">{t("previewNote")}</p>
        </aside>
        <form
          id="sample-checkout"
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="grid gap-2 rounded-card border border-line bg-card p-4 sm:grid-cols-2">
            <input name="name" required placeholder={t("fullName")} className="h-11 rounded-lg border border-line px-3" />
            <input name="country" required placeholder={t("country")} className="h-11 rounded-lg border border-line px-3" />
            <input name="address" required placeholder={t("address")} className="h-11 rounded-lg border border-line px-3 sm:col-span-2" />
          </div>
          <PayPanel title={t("card")} hint={t("cardHint")} onClick={(form) => pay("stripe", form)} />
          <PayPanel title={t("paypal")} hint={t("paypalHint")} onClick={(form) => pay("paypal", form)} />
          <UsdtCashier
            amount={total}
            onBeforeOpen={() => (document.getElementById("sample-checkout") as HTMLFormElement).reportValidity()}
            onPaid={async () => {
              const form = new FormData(document.getElementById("sample-checkout") as HTMLFormElement);
              await pay("gmpay", form);
            }}
          />
          {error && <p className="text-sm text-copper">{error}</p>}
          {result && (
            <p className="rounded-lg bg-copper-ink px-3 py-2 text-sm text-ink">
              {t("orderResult", {
                id: result.id.slice(0, 8),
                amount: result.amount,
                status: result.status === "paid" ? t("paid") : t("pendingReview"),
              })}
            </p>
          )}
        </form>
      </main>
    </StoreShell>
  );
}

function PayPanel({ title, hint, onClick }: { title: string; hint: string; onClick: (form: FormData) => void }) {
  const { t } = useI18n();
  return (
    <section className="rounded-card border border-line bg-card p-4">
      <h2 className="text-xl">{title}</h2>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      <button
        type="button"
        className="mt-3 h-11 rounded-lg bg-ink px-4 text-copper-ink"
        onClick={(event) => {
          const form = new FormData((event.currentTarget.form as HTMLFormElement));
          if (!form.get("name") || !form.get("country")) return;
          onClick(form);
        }}
      >
        {t("confirmNamed", { name: title })}
      </button>
    </section>
  );
}
