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
    <StoreShell name={store.name} email={store.email} whatsapp={store.whatsapp} showSearch={false}>
      <section className="bg-paper">
        <div className="relative overflow-hidden bg-[#071e36] text-white">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[30%_center] grayscale contrast-125"
            src="/sensor.mp4"
            poster="/auto.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="pointer-events-none absolute inset-0 bg-[#092949] mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 bg-[#0e375e]/45" />
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
                <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.2] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                  <span className="text-white">{t("heroTitle")}</span>
                  <span className="mt-2 block text-[#d6ebff]">{t("heroAccent")}</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{t("heroBody")}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/products" search={catalogSearch()} className="inline-flex items-center gap-2 rounded-md bg-[#f5a623] px-6 py-3.5 text-base font-semibold text-white">
                    {t("heroBrowse")} <span aria-hidden>→</span>
                  </Link>
                  <Link to="/downloads" className="rounded-md border border-white/60 px-6 py-3.5 text-base font-semibold text-white">
                    {t("heroCatalog")}
                  </Link>
                </div>
                <div className="mt-6 h-px w-full bg-white/35" />
                <dl className="mt-8 grid w-full justify-between gap-x-8" style={{ gridTemplateColumns: "repeat(4, max-content)" }}>
                  {([
                    ["statYears", "statYearsLabel"],
                    ["statCount", "statCountLabel"],
                    ["statCountries", "statCountriesLabel"],
                    ["statRate", "statRateLabel"],
                  ] as const).map(([value, label]) => (
                    <div key={value} className="min-w-[6.5rem]">
                      <dd className="whitespace-nowrap text-3xl font-semibold leading-none tracking-tight text-white sm:text-4xl">{t(value)}</dd>
                      <dt className="mt-2 text-xs text-white/75 sm:text-sm">{t(label)}</dt>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-3xl bg-white p-6 text-ink shadow-2xl sm:p-7">
                <h2 className="text-2xl font-semibold text-ink">{t("quoteTitle")}</h2>
                <p className="mt-1 mb-4 text-sm text-muted">{t("quoteHint")}</p>
                <InquiryForm hero />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section data-page="2" className="bg-white py-16 sm:py-20">
        <div className="wrap">
          <p className="text-center text-sm font-medium text-[#6d5ce7]">{t("pillarEyebrow")}</p>
          <h2 className="mx-auto mt-3 max-w-4xl text-center text-3xl font-semibold tracking-tight text-[#1a1a2e] sm:text-4xl">{t("pillarTitle")}</h2>
          <p className="mx-auto mt-5 max-w-4xl text-center text-sm leading-7 text-[#5c6370] sm:text-base">{t("pillarIntro")}</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([
              ["pillarMake", "pillarMakeBody", "factory"],
              ["pillarCheck", "pillarCheckBody", "shield"],
              ["pillarExport", "pillarExportBody", "globe"],
              ["pillarPerson", "pillarPersonBody", "person"],
            ] as const).map(([title, body, icon]) => (
              <article key={title} className="rounded-2xl bg-[#f7f8fc] p-6 shadow-[0_8px_24px_rgba(20,20,40,0.04)]">
                <span className="grid size-12 place-items-center rounded-xl bg-[#efeafc] text-[#6d5ce7]">
                  {icon === "factory" && (
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <path d="M3 21V10l6 3V10l6 3V8l6 3v10" strokeLinejoin="round" />
                      <path d="M3 21h18" />
                    </svg>
                  )}
                  {icon === "shield" && (
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <path d="M12 3 5 6v6c0 4.2 2.8 7.2 7 9 4.2-1.8 7-4.8 7-9V6l-7-3Z" strokeLinejoin="round" />
                    </svg>
                  )}
                  {icon === "globe" && (
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <circle cx="12" cy="12" r="8" />
                      <path d="M4 12h16M12 4c2.2 2.4 3.3 5.1 3.3 8S14.2 17.6 12 20c-2.2-2.4-3.3-5.1-3.3-8S9.8 6.4 12 4Z" />
                    </svg>
                  )}
                  {icon === "person" && (
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <circle cx="12" cy="8" r="3" />
                      <path d="M6 19c1.2-2.4 3.2-3.5 6-3.5s4.8 1.1 6 3.5" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <h3 className="mt-8 text-lg font-semibold text-[#1a1a2e]">{t(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5c6370]">{t(body)}</p>
              </article>
            ))}
          </div>
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
