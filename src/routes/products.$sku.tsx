import { createFileRoute, Link } from "@tanstack/react-router";
import { getProduct, getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { InquiryForm } from "@/components/store/inquiry-form";
import { Reveal } from "@/components/store/reveal";
import { useI18n, vehicleLabel } from "@/lib/i18n";
import { lineImage } from "@/components/store/catalog";
import { skuImage } from "@/components/store/sku-photos";
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

const LINE_NAME = {
  Automotive: "tileAuto",
  Motorcycle: "tileMoto",
  Industrial: "tileInd",
  NOx: "tileNox",
} as const;

function lineName(line: string) {
  return LINE_NAME[line as keyof typeof LINE_NAME] ?? "tileAuto";
}

function ProductPage() {
  const { t, lang } = useI18n();
  const { oe } = Route.useSearch();
  const { store, product } = Route.useLoaderData();
  if (!store || !product) return <main className="wrap py-16">{t("notPublished")}</main>;
  const vehicle = String(product.specs.vehicle || "");
  const typed = normalizeOe(oe);
  const matched = product.oeBrands.find((item) => normalizeOe(item.raw) === typed);
  const displayOe = matched?.raw || shownOem(product.oes, oe);
  const photo = skuImage(product.sku) || lineImage(String(product.specs.line || "Automotive"));
  const related = store.products.filter((item) => item.vehicle === vehicle && item.sku !== product.sku).slice(0, 4);
  return (
    <StoreShell name={store.name} email={store.email}>
      <main className="wrap grid gap-6 py-8 lg:grid-cols-[420px_1fr]">
        <Reveal variant="right" className="grid content-start gap-3">
          <img src={photo} alt={displayOe} className="aspect-square w-full rounded-card border border-line bg-white object-contain" />
        </Reveal>
        <Reveal variant="left" className="grid gap-4">
          <p className="text-sm font-semibold text-[#071e36]">{t(lineName(product.line))}</p>
          <h1 className="text-4xl leading-tight">{displayOe}</h1>
          <p className="text-sm text-muted">
            {vehicle ? vehicleLabel(lang, vehicle) : ""}
            {vehicle ? " · " : ""}
            {t("colNumber")} {product.sku}
          </p>
          <section className="grid gap-3 rounded-card border border-line bg-card p-4">
            <h2 className="text-lg">{t("briefTitle")}</h2>
            <p className="leading-7 text-muted">{t("coverNote")}</p>
          </section>
          <section className="rounded-card border border-line bg-card p-4">
            <h2 className="text-lg">{t("colOem")}</h2>
            <ul className="mt-3 grid gap-2">
              {product.oes.map((oe) => (
                <li key={oe} className={normalizeOe(oe) === normalizeOe(displayOe) ? "font-semibold text-[#071e36]" : "text-sm text-muted"}>
                  {oe}
                </li>
              ))}
            </ul>
          </section>
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
          <section className="rounded-card border border-line bg-card p-4">
            <h2 className="text-lg">{t("productDetails")}</h2>
            <dl className="mt-4 grid gap-4">
              {([
                ["secOverview", "detailOverview"],
                ["secFeatures", "detailFeatures"],
                ["secAdvantages", "detailAdvantages"],
                ["secApps", "detailApps"],
                ["secQa", "detailQa"],
              ] as const).map(([title, body]) => (
                <div key={title}>
                  <dt className="font-semibold">{t(title)}</dt>
                  <dd className="mt-1 text-sm leading-6 text-muted">{t(body)}</dd>
                </div>
              ))}
            </dl>
          </section>
          {related.length > 0 && (
          <section>
            <h2 className="text-2xl">{t("related")}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => {
                const oem = shownOem(item.oes);
                return (
                  <Link key={item.sku} to="/products/$sku" params={{ sku: item.sku }} search={{ oe: oem }} className="rounded-card border border-line bg-card p-3">
                    <img src={skuImage(item.sku) || lineImage(item.line || "Automotive")} alt="" className="mb-2 h-24 w-full rounded bg-white object-contain" />
                    <span className="block font-medium">{oem}</span>
                    <span className="text-sm text-muted">{vehicleLabel(lang, item.vehicle)}</span>
                  </Link>
                );
              })}
            </div>
          </section>
          )}
          <section className="rounded-card border border-line bg-card p-4">
            <h2 className="mb-3 text-2xl">{t("sendInquiry")}</h2>
            <InquiryForm sku={product.sku} matchedOe={displayOe} />
          </section>
        </Reveal>
      </main>
    </StoreShell>
  );
}
