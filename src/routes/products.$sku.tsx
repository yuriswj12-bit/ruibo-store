import { createFileRoute } from "@tanstack/react-router";
import { getProduct, getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { DualAction } from "@/components/store/dual-action";
import { moneyLabel, specText, specValue, useI18n, vehicleLabel } from "@/lib/i18n";
import { lineImage } from "@/components/store/catalog";
import { normalizeOe, shownOem } from "@/lib/oe";

export const Route = createFileRoute("/products/$sku")({
  validateSearch: (search: Record<string, unknown>) => ({
    oe: typeof search.oe === "string" ? search.oe : "",
  }),
  loader: async ({ params }) => {
    const [store, product] = await Promise.all([getStoreHome(), getProduct({ data: { sku: params.sku } })]);
    return { store, product };
  },
  component: ProductPage,
});

function ProductPage() {
  const { t, lang } = useI18n();
  const { oe } = Route.useSearch();
  const { store, product } = Route.useLoaderData();
  if (!store || !product) return <main className="wrap py-16">{t("notPublished")}</main>;
  const vehicle = String(product.specs.vehicle || "");
  const typed = normalizeOe(oe);
  const matched = product.oeBrands.find((item) => normalizeOe(item.raw) === typed);
  const displayOe = matched?.raw || shownOem(product.oes, oe);
  return (
    <StoreShell name={store.name} email={store.email}>
      <main className="wrap grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        <div className="grid content-start gap-3">
          <video
            src="/sensor.mp4"
            poster="/auto.jpg"
            controls
            playsInline
            className="aspect-square w-full rounded-card border border-line bg-card object-cover"
          />
          <img src={lineImage(String(product.specs.line || "Automotive"))} alt={displayOe} className="aspect-square w-full rounded-card border border-line object-cover" />
          <p className="text-xs text-muted">{t("videoLabel")} · {t("photoLabel")}</p>
        </div>
        <div className="grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">{vehicle ? vehicleLabel(lang, vehicle) : ""}</p>
          <h1 className="text-4xl leading-tight">{displayOe}</h1>
          <section className="grid gap-3 rounded-card border border-line bg-card p-4">
            <h2 className="text-lg">{t("briefTitle")}</h2>
            <p>
              {t("briefBody", {
                oe: displayOe,
                vehicle: vehicle ? vehicleLabel(lang, vehicle) : "",
                price: product.samplePrice,
                stock: product.sampleStock,
                moq: product.moq,
              })}
            </p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">{t("attrOrigin")}</dt>
                <dd className="font-medium">{t("originWenzhou")}</dd>
              </div>
              <div>
                <dt className="text-muted">{t("attrSample")}</dt>
                <dd className="font-medium">${product.samplePrice}</dd>
              </div>
              <div>
                <dt className="text-muted">{t("attrStock")}</dt>
                <dd className="font-medium">{t("stockPcs", { n: product.sampleStock })}</dd>
              </div>
              <div>
                <dt className="text-muted">{t("attrMoq")}</dt>
                <dd className="font-medium">{t("stockPcs", { n: product.moq })}</dd>
              </div>
              <div>
                <dt className="text-muted">{t("attrBulk")}</dt>
                <dd className="font-medium">{moneyLabel(lang, product.priceRange)}</dd>
              </div>
            </dl>
          </section>
          <DualAction
            sku={product.sku}
            title={displayOe}
            samplePrice={product.samplePrice}
            sampleStock={product.sampleStock}
            matchedOe={displayOe}
            whatsapp={store.whatsapp}
          />
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(product.specs).map(([key, value]) => (
                <tr key={key} className="border-t border-line">
                  <th className="py-2 pr-4 text-left font-medium">{specText(lang, key)}</th>
                  <td className="py-2">{specValue(lang, key, String(value))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {product.fitments.length > 0 && (
          <section className="overflow-x-auto rounded-card border border-line bg-card">
            <p className="border-b border-line px-4 py-3 text-sm">{t("fitsFor", { oe: displayOe })}</p>
            <table className="w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">{t("year")}</th>
                  <th className="px-4 py-2 font-medium">{t("make")}</th>
                  <th className="px-4 py-2 font-medium">{t("model")}</th>
                  <th className="px-4 py-2 font-medium">{t("engine")}</th>
                  <th className="px-4 py-2 font-medium">{t("position")}</th>
                </tr>
              </thead>
              <tbody>
                {product.fitments.map((row) => (
                  <tr key={`${row.year}-${row.engine}`} className="border-t border-line">
                    <td className="px-4 py-2 font-medium text-copper">{row.year}</td>
                    <td className="px-4 py-2">{row.make}</td>
                    <td className="px-4 py-2">{row.model}</td>
                    <td className="px-4 py-2">{row.engine}</td>
                    <td className="px-4 py-2">{row.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          )}
        </div>
      </main>
    </StoreShell>
  );
}
