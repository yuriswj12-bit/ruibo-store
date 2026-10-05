import { createFileRoute, Link } from "@tanstack/react-router";
import { getProduct, getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { DualAction } from "@/components/store/dual-action";
import { moneyLabel, sensorTitle, specText, specValue, useI18n, vehicleLabel } from "@/lib/i18n";
import { lineImage } from "@/components/store/catalog";
import { normalizeOe } from "@/lib/oe";

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
  const others = matched ? product.oeBrands.filter((item) => item !== matched) : product.oeBrands;
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
          <section className="grid gap-3 rounded-card border border-line bg-card p-4">
            <h2 className="text-lg">{t("briefTitle")}</h2>
            <p>
              {t("briefBody", {
                sku: product.sku,
                vehicle: vehicle ? vehicleLabel(lang, vehicle) : product.sku,
                price: product.samplePrice,
                stock: product.sampleStock,
                moq: product.moq,
              })}
            </p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">{t("attrSku")}</dt>
                <dd className="font-medium">{product.sku}</dd>
              </div>
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
            <dl className="grid gap-3 border-t border-line pt-3 text-sm">
              <div>
                <dt className="text-muted">{t("buyThis")}</dt>
                <dd className="text-base font-medium">{product.sku}</dd>
              </div>
              {matched && (
                <div>
                  <dt className="text-muted">{t("numberYouTyped")}</dt>
                  <dd className="font-medium">{matched.raw}</dd>
                </div>
              )}
              {(matched ? others : product.oeBrands).length > 0 && (
                <div>
                  <dt className="text-muted">{matched ? t("otherNumbers") : t("samePartLine")}</dt>
                  <dd className="font-medium">
                    {(matched ? others : product.oeBrands).map((item) => item.raw).join(" · ")}
                    <span className="mt-1 block font-normal text-muted">{t("notAnother")}</span>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted">{t("shipLabel")}</dt>
                <dd className="font-medium">{t("shipOnly", { sku: product.sku })}</dd>
              </div>
            </dl>
            {product.shared.length > 0 && (
              <div className="border-t border-line pt-3 text-sm">
                <p>{t("sharedOem")}</p>
                <p className="mt-2 flex flex-wrap gap-2">
                  {product.shared.map((item) => (
                    <Link key={item.sku} to="/products/$sku" params={{ sku: item.sku }} search={{ oe }} className="rounded-full border border-line px-3 py-1 font-medium text-brass">
                      {vehicleLabel(lang, item.vehicle)} {item.sku}
                    </Link>
                  ))}
                </p>
              </div>
            )}
          </section>
          <DualAction
            sku={product.sku}
            title={sensorTitle(lang, vehicle, product.sku)}
            samplePrice={product.samplePrice}
            sampleStock={product.sampleStock}
            matchedOe={matched?.raw ?? ""}
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
