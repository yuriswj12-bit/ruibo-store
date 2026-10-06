import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { InquiryForm } from "@/components/store/inquiry-form";
import { LINES, MAKES, catalogSearch, lineImage } from "@/components/store/catalog";
import { useI18n, vehicleLabel } from "@/lib/i18n";
import { shownOem } from "@/lib/oe";

export const Route = createFileRoute("/")({
  loader: () => getStoreHome(),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const store = Route.useLoaderData();
  if (!store) return <main className="wrap py-16">{t("catalogNotReady")}</main>;
  return (
    <StoreShell name={store.name} email={store.email} showSearch={false}>
      <section className="bg-paper">
        <div className="relative overflow-hidden bg-[#0a4d86] text-white">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[30%_center]"
            src="/sensor.mp4"
            poster="/auto.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="pointer-events-none absolute inset-0 bg-[#0c5ea8] mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 bg-[#083e70]/35" />
          <div className="relative wrap py-10 sm:py-14">
            <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-sm text-white">
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-amber-300" aria-hidden>
                    <circle cx="12" cy="9" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M9.2 13.2 8 20.5l4-2.1 4 2.1-1.2-7.3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                  {t("heroBadge")}
                </p>
                <h1 className="mt-6 max-w-xl whitespace-pre-line text-[2.6rem] font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {t("heroTitle")}
                </h1>
                <p className="mt-1 max-w-xl whitespace-pre-line text-[2.6rem] font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {t("heroAccent")}
                </p>
                <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base">{t("heroBody")}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/products" search={catalogSearch()} className="inline-flex items-center gap-2 rounded-lg bg-[#f5a623] px-5 py-3 text-sm font-semibold text-white">
                    {t("heroBrowse")} <span aria-hidden>→</span>
                  </Link>
                  <Link to="/downloads" className="rounded-lg border border-white/70 px-5 py-3 text-sm font-semibold text-white">
                    {t("heroCatalog")}
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-6 text-ink shadow-2xl sm:p-7">
                <h2 className="text-2xl font-semibold text-ink">{t("quoteTitle")}</h2>
                <p className="mt-1 mb-4 text-sm text-muted">{t("quoteHint")}</p>
                <InquiryForm hero />
              </div>
            </div>
          </div>
        </div>
        <dl className="wrap grid grid-cols-2 gap-4 border-t border-[#1d314c]/15 py-6 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-[#1d314c]/70">{t("statProducts")}</dt>
            <dd className="text-3xl text-[#1d314c]">302</dd>
          </div>
          <div>
            <dt className="text-xs text-[#1d314c]/70">{t("statOems")}</dt>
            <dd className="text-3xl text-[#1d314c]">601</dd>
          </div>
          <div>
            <dt className="text-xs text-[#1d314c]/70">{t("statLangs")}</dt>
            <dd className="text-3xl text-[#1d314c]">4</dd>
          </div>
          <div>
            <dt className="text-xs text-[#1d314c]/70">{t("statOrigin")}</dt>
            <dd className="text-3xl text-[#1d314c]">{t("statOriginValue")}</dd>
          </div>
        </dl>
      </section>
      <section className="wrap py-12">
        <h2 className="text-3xl">{t("pillarTitle")}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["pillarMake", "pillarMakeBody"],
            ["pillarCheck", "pillarCheckBody"],
            ["pillarExport", "pillarExportBody"],
            ["pillarPerson", "pillarPersonBody"],
          ].map(([title, body]) => (
            <article key={title} className="rounded-card border border-line bg-card p-4">
              <h3 className="text-xl">{t(title as "pillarMake")}</h3>
              <p className="mt-2 text-sm text-muted">{t(body as "pillarMakeBody")}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap pb-4">
        <h2 className="text-3xl">{t("solutionsTitle")}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LINES.map((line) => (
            <Link key={line.id} to="/products" search={catalogSearch({ line: line.id })} className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-card">
              <img src={line.image} alt={t(line.title)} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
              <span className="absolute bottom-3 left-3 rounded-full bg-card px-3 py-1 text-sm font-medium">{t(line.title)}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap py-8">
        <h2 className="text-3xl">{t("reliableTitle")}</h2>
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {[
            ["reliable1", "reliable1Body"],
            ["reliable2", "reliable2Body"],
            ["reliable3", "reliable3Body"],
          ].map(([title, body]) => (
            <article key={title} className="rounded-card border border-line bg-card p-4">
              <h3 className="text-xl">{t(title as "reliable1")}</h3>
              <p className="mt-2 text-sm text-muted">{t(body as "reliable1Body")}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap pb-4">
        <h2 className="text-3xl">{t("shopByVehicle")}</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {MAKES.map((make) => (
            <Link
              key={make}
              to="/products"
              search={catalogSearch({ make, line: "Automotive" })}
              className="shrink-0 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium hover:border-ink"
            >
              {vehicleLabel(lang, make)}
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap py-6">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-3xl">{t("ready")}</h2>
          <Link to="/products" search={catalogSearch()} className="text-sm font-medium text-brass">{t("allParts")}</Link>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {store.products.slice(0, 8).map((product) => {
            const oem = shownOem(product.oes);
            return (
            <Link key={product.sku} to="/products/$sku" params={{ sku: product.sku }} search={{ oe: oem }} className="w-64 shrink-0 overflow-hidden rounded-card border border-line bg-card">
              <img src={lineImage("Automotive")} alt="" className="aspect-square w-full object-cover" />
              <span className="block p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-copper">{vehicleLabel(lang, product.vehicle)}</span>
                <span className="mt-1 block text-2xl">{oem}</span>
                <span className="block text-sm text-muted">{t("briefShort", { oe: oem, vehicle: vehicleLabel(lang, product.vehicle), price: product.samplePrice })}</span>
                <span className="mt-2 block text-sm font-medium">{t("samplePrice", { price: product.samplePrice })}</span>
              </span>
            </Link>
            );
          })}
        </div>
      </section>
      <section className="wrap pb-10">
        <div className="rounded-card bg-ink px-6 py-8 text-white">
          <h2 className="text-3xl">{t("ctaTitle")}</h2>
          <p className="mt-2 max-w-xl text-white/80">{t("ctaBody")}</p>
          <Link to="/contact" className="mt-5 inline-block rounded-lg bg-copper px-5 py-3 text-sm font-semibold text-white">{t("navContact")}</Link>
        </div>
      </section>
    </StoreShell>
  );
}
