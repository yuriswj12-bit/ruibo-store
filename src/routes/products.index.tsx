import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getStoreHome, searchCatalog } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { LINES, MAKES, catalogSearch, lineImage, brandFromCabinet, type CatalogSearch } from "@/components/store/catalog";
import { skuImage } from "@/components/store/sku-photos";
import { Reveal } from "@/components/store/reveal";
import { useI18n, vehicleLabel } from "@/lib/i18n";
import { shownOem } from "@/lib/oe";

const LINE_NAME = {
  Automotive: "tileAuto",
  Motorcycle: "tileMoto",
  Industrial: "tileInd",
  NOx: "tileNox",
} as const;

function lineName(line: string) {
  return LINE_NAME[line as keyof typeof LINE_NAME] ?? "tileAuto";
}

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>) => {
    const line = typeof search.line === "string" ? search.line : "";
    return {
      q: typeof search.q === "string" ? search.q : "",
      make: line === "Automotive" && typeof search.make === "string" ? search.make : "",
      line,
      model: typeof search.model === "string" ? search.model : "",
      series: typeof search.series === "string" ? search.series : "",
      page: Math.max(1, Number(search.page) || 1),
    };
  },
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
  const navigate = useNavigate();
  const { store, products, deps } = Route.useLoaderData();
  if (!store) return null;
  const pageSize = 12;
  const pages = Math.max(1, Math.ceil(products.length / pageSize));
  const page = Math.min(deps.page, pages);
  const visible = products.slice((page - 1) * pageSize, page * pageSize);
  const from = products.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(products.length, page * pageSize);
  const present = new Set(
    store.products
      .filter((product) => !deps.line || product.line === deps.line)
      .map((product) => brandFromCabinet(product.sku, product.vehicle))
      .filter(Boolean),
  );
  const brands = [
    ...MAKES.filter((brand) => present.has(brand)),
    ...[...present].filter((brand) => !MAKES.includes(brand as (typeof MAKES)[number])).sort(),
  ];
  const go = (patch: Partial<typeof deps>) => {
    void navigate({ to: "/products", search: catalogSearch({ ...deps, page: 1, ...patch }) });
  };
  const selectClass = "h-11 w-full rounded-lg border border-line bg-card px-3 text-sm";
  return (
    <StoreShell name={store.name} email={store.email}>
      <Reveal variant="fade">
        <img src="/product-range-banner.png" alt="Our Product Range" className="h-auto w-full" />
      </Reveal>
      <main className="wrap grid gap-8 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Reveal variant="right" className="grid content-start gap-4">
          <form className="grid gap-2" method="get">
            <p className="text-sm font-semibold">{t("findOem")}</p>
            <div className="flex">
              <input name="q" defaultValue={deps.q} placeholder={t("oemOrBosch")} className="h-11 min-w-0 flex-1 rounded-l-lg border border-line bg-card px-3" />
              <button type="submit" className="h-11 rounded-r-lg bg-[#092949] px-4 text-sm font-semibold text-white">GO</button>
            </div>
            <input type="hidden" name="make" value={deps.make} />
            <input type="hidden" name="line" value={deps.line} />
          </form>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">{t("filterLine")}</span>
            <select
              className={selectClass}
              value={deps.line}
              onChange={(event) => go({ line: event.target.value, make: "", model: "", series: "" })}
            >
              <option value="">{t("allLines")}</option>
              {LINES.map((item) => (
                <option key={item.id} value={item.id}>{t(item.title)}</option>
              ))}
            </select>
          </label>
          {deps.line === "Automotive" && (
            <>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold">{t("filterBrand")}</span>
                <select
                  className={selectClass}
                  value={deps.make}
                  onChange={(event) => go({ make: event.target.value, model: "", series: "" })}
                >
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
        <Reveal variant="up" className="min-w-0">
          <p className="text-sm text-muted">{t("showing", { from, to, total: products.length })}</p>
          {deps.q && products[0]?.match === "exact" && products.length > 1 && (
            <p className="mt-3 rounded-card border border-line bg-card px-4 py-3 text-sm">{t("multiExact", { n: products.length })}</p>
          )}
          {deps.q && products[0]?.match === "prefix" && (
            <p className="mt-3 rounded-card border border-line bg-card px-4 py-3 text-sm">{t("prefixNote")}</p>
          )}
          <div className="mt-4 overflow-x-auto rounded-card border border-line bg-card">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#f4f6fb] text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-3 font-semibold">{t("colPicture")}</th>
                  <th className="px-3 py-3 font-semibold">{t("colNumber")}</th>
                  <th className="px-3 py-3 font-semibold">{t("colName")}</th>
                  <th className="px-3 py-3 font-semibold">{t("colOem")}</th>
                  <th className="px-3 py-3 font-semibold">{t("colAction")}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((product) => {
                  const oem = shownOem(product.oes, deps.q);
                  return (
                    <tr key={product.sku} className="border-t border-line align-top">
                      <td className="px-3 py-3">
                        <img src={skuImage(product.sku) || lineImage(product.line || "Automotive")} alt="" className="h-14 w-20 rounded bg-white object-contain" />
                      </td>
                      <td className="px-3 py-3">
                        <Link to="/products/$sku" params={{ sku: product.sku }} search={{ oe: oem }} className="font-semibold text-[#092949] underline">
                          {oem}
                        </Link>
                      </td>
                      <td className="px-3 py-3">{t(lineName(product.line))}</td>
                      <td className="px-3 py-3 text-xs leading-5 text-muted">{product.oes.join("\n")}</td>
                      <td className="px-3 py-3">
                        <Link to="/contact" className="inline-block rounded bg-[#092949] px-3 py-2 text-xs font-semibold text-white">{t("inquire")}</Link>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-muted">{deps.line && !deps.q && !deps.make ? t("lineEmpty") : t("noMatch")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <nav className="mt-6 flex flex-col items-center gap-3" aria-label="pagination">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <PageBtn search={{ ...deps, page: 1 }} disabled={page <= 1}>{"|<"}</PageBtn>
              <PageBtn search={{ ...deps, page: Math.max(1, page - 1) }} disabled={page <= 1}>{"<"}</PageBtn>
              {pageWindow(page, pages).map((item, index) => item === "..." ? (
                <span key={`gap-${index}`} className="grid h-9 min-w-9 place-items-center px-1 text-sm text-muted">...</span>
              ) : (
                <PageBtn key={item} search={{ ...deps, page: item }} current={item === page}>{item}</PageBtn>
              ))}
              <PageBtn search={{ ...deps, page: Math.min(pages, page + 1) }} disabled={page >= pages}>{">"}</PageBtn>
              <PageBtn search={{ ...deps, page: pages }} disabled={page >= pages}>{">|"}</PageBtn>
            </div>
            <p className="text-sm text-muted">{t("pageOf", { page, pages })}</p>
          </nav>
          <div className="mt-10 rounded-card bg-ink px-5 py-6 text-white">
            <h2 className="text-2xl">{t("cantFind")}</h2>
            <p className="mt-2 text-white/80">{t("cantFindBody")}</p>
            <Link to="/contact" className="mt-4 inline-block rounded-lg bg-copper px-4 py-2 text-sm font-semibold text-white">{t("navContact")}</Link>
          </div>
        </Reveal>
      </main>
    </StoreShell>
  );
}

function pageWindow(current: number, total: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, "...", total];
  if (current >= total - 3) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function PageBtn({
  search,
  disabled,
  current,
  children,
}: {
  search: CatalogSearch;
  disabled?: boolean;
  current?: boolean;
  children: React.ReactNode;
}) {
  const className = current
    ? "grid h-9 min-w-9 place-items-center rounded-lg bg-[#092949] px-2 text-sm font-semibold text-white"
    : "grid h-9 min-w-9 place-items-center rounded-lg border border-line bg-white px-2 text-sm text-ink hover:border-[#092949]";
  if (disabled) {
    return <span className="grid h-9 min-w-9 place-items-center rounded-lg border border-line bg-white px-2 text-sm text-muted opacity-40">{children}</span>;
  }
  return (
    <Link to="/products" search={search} className={className}>
      {children}
    </Link>
  );
}
