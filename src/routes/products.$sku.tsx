import { createFileRoute } from "@tanstack/react-router";
import { getProduct, getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { DualAction } from "@/components/store/dual-action";
import { moneyLabel, sensorTitle, specText, specValue, useI18n, vehicleLabel } from "@/lib/i18n";
import { lineImage } from "@/components/store/catalog";

export const Route = createFileRoute("/products/$sku")({
  loader: async ({ params }) => {
    const [store, product] = await Promise.all([getStoreHome(), getProduct({ data: { sku: params.sku } })]);
    return { store, product };
  },
  component: ProductPage,
});

function ProductPage() {
  const { t, lang } = useI18n();
  const { store, product } = Route.useLoaderData();
  if (!store || !product) return <main className="wrap py-16">{t("notPublished")}</main>;
  const vehicle = String(product.specs.vehicle || "");
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
          <img src={lineImage(String(product.specs.line || "Automotive"))} alt={sensorTitle(lang, vehicle, product.sku)} className="aspect-square w-full rounded-card border border-line object-cover" />
          <p className="text-xs text-muted">{t("videoLabel")} · {t("photoLabel")}</p>
        </div>
        <div className="grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">{vehicle ? vehicleLabel(lang, vehicle) : product.sku}</p>
          <h1 className="text-4xl leading-tight">{product.sku}</h1>
          <p className="text-muted">{sensorTitle(lang, vehicle, product.sku)}</p>
          <p>{t("bulkLine", { range: moneyLabel(lang, product.priceRange), moq: product.moq, price: product.samplePrice })}</p>
          <p className="text-sm text-muted">{product.oeBrands.map((oe) => `${oe.brand || "OE"} ${oe.raw}`).join(" · ")}</p>
          <DualAction
            sku={product.sku}
            title={sensorTitle(lang, vehicle, product.sku)}
            samplePrice={product.samplePrice}
            sampleStock={product.sampleStock}
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
            <p className="border-b border-line px-4 py-3 text-sm">{t("fitsFor", { oe: product.oes[0] || product.sku })}</p>
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
