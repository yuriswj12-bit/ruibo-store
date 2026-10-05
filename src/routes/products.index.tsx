import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome, searchCatalog } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { LINES, MAKES, catalogSearch, lineImage } from "@/components/store/catalog";
import { moneyLabel, useI18n, vehicleLabel } from "@/lib/i18n";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
    make: typeof search.make === "string" ? search.make : "",
    line: typeof search.line === "string" ? search.line : "",
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [store, products] = await Promise.all([
      getStoreHome(),
      searchCatalog({ data: deps }),
    ]);
    return { store, products, deps };
  },
  component: Catalog,
});

function Catalog() {
  const { t, lang } = useI18n();
  const { store, products, deps } = Route.useLoaderData();
  if (!store) return null;
  const line = LINES.find((item) => item.id === deps.line);
  const title = deps.make ? vehicleLabel(lang, deps.make) : line ? t(line.title) : t("allVehicles");
  return (
    <StoreShell name={store.name} email={store.email}>
      <main className="wrap py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">{t("buyerCatalog")}</p>
        <h1 className="text-4xl">{title}</h1>
        {deps.q && products[0]?.match === "exact" && products.length > 1 && (
          <p className="mt-3 rounded-card border border-line bg-card px-4 py-3 text-sm">{t("multiExact", { n: products.length })}</p>
        )}
        {deps.q && products[0]?.match === "prefix" && (
          <p className="mt-3 rounded-card border border-line bg-card px-4 py-3 text-sm">{t("prefixNote")}</p>
        )}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <Link to="/products" search={catalogSearch({ q: deps.q })} className={`shrink-0 rounded-full border px-3 py-1 text-sm ${deps.make === "" ? "border-ink bg-ink text-copper-ink" : "border-line bg-card"}`}>
            {t("allVehicles")}
          </Link>
          {MAKES.map((make) => (
            <Link
              key={make}
              to="/products"
              search={catalogSearch({ q: deps.q, make, line: deps.line })}
              className={`shrink-0 rounded-full border px-3 py-1 text-sm ${deps.make === make ? "border-ink bg-ink text-copper-ink" : "border-line bg-card"}`}
            >
              {vehicleLabel(lang, make)}
            </Link>
          ))}
        </div>
        <form className="mt-4 flex flex-wrap gap-2" method="get">
          <input name="q" defaultValue={deps.q} placeholder={t("oemOrBosch")} className="h-11 min-w-48 flex-1 rounded-lg border border-line bg-card px-3" />
          <input type="hidden" name="make" value={deps.make} />
          <input type="hidden" name="line" value={deps.line} />
          <button type="submit" className="h-11 rounded-lg bg-ink px-4 text-copper-ink">{t("filter")}</button>
        </form>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link key={product.sku} to="/products/$sku" params={{ sku: product.sku }} className="overflow-hidden rounded-card border border-line bg-card">
              <img src={lineImage(deps.line || "Automotive")} alt="" className="aspect-square w-full object-cover" />
              <span className="block p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-copper">{vehicleLabel(lang, product.vehicle)}</span>
                <span className="block text-2xl">{product.sku}</span>
                <span className="block text-sm text-muted">{t("briefShort", { vehicle: vehicleLabel(lang, product.vehicle), price: product.samplePrice })}</span>
                <span className="mt-2 block text-sm">{product.oes.slice(0, 3).join(" · ")}</span>
                <span className="mt-2 block text-sm font-medium">
                  {t("sampleMeta", { price: product.samplePrice, moq: product.moq, range: moneyLabel(lang, product.priceRange) })}
                </span>
              </span>
            </Link>
          ))}
          {products.length === 0 && <p className="text-muted">{t("noMatch")}</p>}
        </div>
      </main>
    </StoreShell>
  );
}
