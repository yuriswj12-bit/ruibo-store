import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getProduct, getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { InquiryForm } from "@/components/store/inquiry-form";
import { Reveal } from "@/components/store/reveal";
import { useI18n, vehicleLabel } from "@/lib/i18n";
import { LINES, MAKES, catalogSearch, lineImage, brandFromCabinet } from "@/components/store/catalog";
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
  const navigate = useNavigate();
  const selectClass = "h-11 w-full rounded-lg border border-line bg-card px-3 text-sm";
  const present = new Set(store.products.map((item) => brandFromCabinet(item.sku, item.vehicle)).filter(Boolean));
  const brands = [
    ...MAKES.filter((brand) => present.has(brand)),
    ...[...present].filter((brand) => !MAKES.includes(brand as (typeof MAKES)[number])).sort(),
  ];
  return (
    <StoreShell name={store.name} email={store.email}>
      <main className="wrap grid gap-8 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Reveal variant="right" className="grid content-start gap-4">
          <form className="grid gap-2" action="/products">
            <p className="text-sm font-semibold">{t("findOem")}</p>
            <div className="flex">
              <input name="q" defaultValue={oe} placeholder={t("oemOrBosch")} className="h-11 min-w-0 flex-1 rounded-l-lg border border-line bg-card px-3" />
              <button type="submit" className="h-11 rounded-r-lg bg-[#071e36] px-4 text-sm font-semibold text-white">GO</button>
            </div>
          </form>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">{t("filterLine")}</span>
            <select className={selectClass} defaultValue={product.line} onChange={(event) => navigate({ to: "/products", search: catalogSearch({ line: event.target.value }) })}>
              <option value="">{t("allLines")}</option>
              {LINES.map((item) => (
                <option key={item.id} value={item.id}>{t(item.title)}</option>
              ))}
            </select>
          </label>
          {product.line === "Automotive" && (
            <>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold">{t("filterBrand")}</span>
                <select className={selectClass} defaultValue={vehicle} onChange={(event) => navigate({ to: "/products", search: catalogSearch({ line: "Automotive", make: event.target.value }) })}>
                  <option value="">{t("allBrands")}</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{vehicleLabel(lang, brand)}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold">{t("filterModel")}</span>
                <select className={selectClass} value="" disabled>
                  <option value="">{t("allModels")}</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold">{t("filterSeries")}</span>
                <select className={selectClass} value="" disabled>
                  <option value="">{t("allSeries")}</option>
                </select>
              </label>
            </>
          )}
        </Reveal>
        <div className="grid min-w-0 content-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Reveal variant="up" className="grid content-start gap-3">
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
        </Reveal>
                  {related.length > 0 && (
          <section className="lg:col-span-2">
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
          <section className="rounded-card border border-line bg-card p-4 lg:col-span-2">
            <h2 className="mb-3 text-2xl">{t("sendInquiry")}</h2>
            <InquiryForm sku={product.sku} matchedOe={displayOe} />
          </section>
        </div>
      </main>
    </StoreShell>
  );
}
