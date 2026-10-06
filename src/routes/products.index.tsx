import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome, searchCatalog } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { LINES, MAKES, catalogSearch, lineImage } from "@/components/store/catalog";
import { useI18n, vehicleLabel } from "@/lib/i18n";
import { shownOem } from "@/lib/oe";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
    make: typeof search.make === "string" ? search.make : "",
    line: typeof search.line === "string" ? search.line : "",
    page: Math.max(1, Number(search.page) || 1),
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
  const pageSize = 12;
  const pages = Math.max(1, Math.ceil(products.length / pageSize));
  const page = Math.min(deps.page, pages);
  const visible = products.slice((page - 1) * pageSize, page * pageSize);
  const from = products.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(products.length, page * pageSize);
  return (
    <StoreShell name={store.name} email={store.email}>
      <section>
        <img src="/product-range-banner.png" alt="Our Product Range" className="h-auto w-full" />
      </section>
      <main className="wrap grid gap-8 py-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="grid content-start gap-4">
          <form className="grid gap-2" method="get">
            <input name="q" defaultValue={deps.q} placeholder={t("oemOrBosch")} className="h-11 rounded-lg border border-line bg-card px-3" />
            <input type="hidden" name="make" value={deps.make} />
            <input type="hidden" name="line" value={deps.line} />
            <button type="submit" className="h-11 rounded-lg bg-ink px-4 text-copper-ink">{t("filter")}</button>
          </form>
          <div>
            <p className="text-sm font-semibold">{t("navProducts")}</p>
            <ul className="mt-2 grid gap-1 text-sm">
              <li>
                <Link to="/products" search={catalogSearch({ q: deps.q })} className={deps.line === "" && deps.make === "" ? "font-semibold" : ""}>
                  {t("allVehicles")} ({store.products.length})
                </Link>
              </li>
              {LINES.map((item) => (
                <li key={item.id}>
                  <Link to="/products" search={catalogSearch({ q: deps.q, line: item.id })} className={deps.line === item.id ? "font-semibold" : ""}>
                    {t(item.title)} ({store.products.filter((product) => product.line === item.id).length})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="min-w-0">
          <p className="text-sm text-muted">{t("showing", { from, to, total: products.length })}</p>
          {deps.q && products[0]?.match === "exact" && products.length > 1 && (
            <p className="mt-3 rounded-card border border-line bg-card px-4 py-3 text-sm">{t("multiExact", { n: products.length })}</p>
          )}
          {deps.q && products[0]?.match === "prefix" && (
            <p className="mt-3 rounded-card border border-line bg-card px-4 py-3 text-sm">{t("prefixNote")}</p>
          )}
          <div className="mt-4 flex max-w-full flex-wrap gap-2">
            {MAKES.map((make) => (
              <Link
                key={make}
                to="/products"
                search={catalogSearch({ q: deps.q, make, line: "Automotive", page: 1 })}
                className={`rounded-full border px-3 py-1 text-sm ${deps.make === make ? "border-ink bg-ink text-copper-ink" : "border-line bg-card"}`}
              >
                {vehicleLabel(lang, make)}
              </Link>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => {
              const oem = shownOem(product.oes, deps.q);
              return (
                <Link key={product.sku} to="/products/$sku" params={{ sku: product.sku }} search={{ oe: oem }} className="min-w-0 overflow-hidden rounded-card border border-line bg-card">
                  <img src={lineImage(deps.line || product.line || "Automotive")} alt="" className="aspect-[4/3] w-full object-cover" />
                  <span className="block p-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-copper">{vehicleLabel(lang, product.vehicle)}</span>
                    <span className="block break-words text-2xl">{oem}</span>
                    <span className="block text-sm text-muted">{t("briefShort", { oe: oem, vehicle: vehicleLabel(lang, product.vehicle), price: product.samplePrice })}</span>
                  </span>
                </Link>
              );
            })}
            {products.length === 0 && <p className="text-muted">{t("noMatch")}</p>}
          </div>
          {pages > 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {Array.from({ length: pages }, (_, index) => index + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) < 2).map((n) => (
                <Link key={n} to="/products" search={{ ...deps, page: n }} className={`rounded-lg border px-3 py-2 text-sm ${n === page ? "border-ink bg-ink text-copper-ink" : "border-line bg-card"}`}>{n}</Link>
              ))}
            </div>
          )}
          <div className="mt-10 rounded-card bg-ink px-5 py-6 text-white">
            <h2 className="text-2xl">{t("cantFind")}</h2>
            <p className="mt-2 text-white/80">{t("cantFindBody")}</p>
            <Link to="/contact" className="mt-4 inline-block rounded-lg bg-copper px-4 py-2 text-sm font-semibold text-white">{t("navContact")}</Link>
          </div>
        </div>
      </main>
    </StoreShell>
  );
}
