import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { InquiryForm } from "@/components/store/inquiry-form";
import { catalogSearch } from "@/components/store/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  loader: () => getStoreHome(),
  component: Home,
});

function Home() {
  const { t } = useI18n();
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
          <p className="text-center text-sm font-medium text-[#092949]">{t("pillarEyebrow")}</p>
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
                <span className="grid size-12 place-items-center rounded-xl bg-[#e6eef6] text-[#092949]">
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
      <section className="bg-[#f4f6fb] py-14 sm:py-16">
        <div className="wrap">
          <p className="text-sm font-medium text-[#092949]">{t("svcEyebrow")}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1a1a2e] sm:text-4xl">{t("svcTitle")}</h2>
              <p className="mt-3 max-w-xl text-sm text-[#5c6370] sm:text-base">{t("svcLead")}</p>
            </div>
            <Link to="/products" search={catalogSearch()} className="inline-flex items-center gap-2 rounded-lg bg-[#092949] px-5 py-3 text-sm font-semibold text-white">
              {t("svcAll")} <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {([
              ["/line-auto-bg.jpg", "Automotive", "tileAuto", "tileAutoBody"],
              ["/line-moto-bg.jpg", "Motorcycle", "tileMoto", "tileMotoBody"],
              ["/line-ind-bg.jpg", "Industrial", "tileInd", "tileIndBody"],
              ["/line-nox-bg.jpg", "NOx", "tileNox", "tileNoxBody"],
            ] as const).map(([src, line, title, body]) => (
              <Link key={line} to="/products" search={catalogSearch({ line })} className="block overflow-hidden rounded-2xl bg-white shadow-sm">
                <img src={src} alt="" className="aspect-[16/9] w-full object-cover" />
                <span className="block px-5 py-4 text-center">
                  <span className="block text-xl font-semibold text-[#1a1a2e]">{t(title)}</span>
                  <span className="mt-1 block text-sm leading-5 text-[#5c6370]">{t(body)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#092949]">{t("advEyebrow")}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#1a1a2e]">{t("advTitle")}</h2>
            <ul className="mt-8 grid gap-6">
              {([
                ["adv1", "adv1Body"],
                ["adv2", "adv2Body"],
                ["adv3", "adv3Body"],
              ] as const).map(([title, body]) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e6eef6] text-[#092949]">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e]">{t(title)}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#5c6370]">{t(body)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#092949] px-5 py-3 text-sm font-semibold text-white">
              {t("advMore")} <span aria-hidden>→</span>
            </Link>
          </div>
          <img src="/moto.jpg" alt="" className="h-80 w-full rounded-3xl object-cover sm:h-[420px]" />
        </div>
      </section>
      <TrustStrip />
      <section className="bg-[#071e36] py-16 text-center text-white">
        <div className="wrap">
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold sm:text-5xl">{t("ctaReady")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">{t("ctaReadyBody")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#1a1a2e]">
              {t("ctaContact")} <span aria-hidden>→</span>
            </Link>
            <Link to="/products" search={catalogSearch()} className="rounded-lg border border-white/70 px-5 py-3 text-sm font-semibold text-white">
              {t("heroBrowse")}
            </Link>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}

function TrustStrip() {
  const { t } = useI18n();
  const slides = [
    { src: "/industrial.jpg", cap: "trustCap1" },
    { src: "/sensor.jpg", cap: "trustCap2" },
    { src: "/auto.jpg", cap: "trustCap3" },
  ] as const;
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const go = (step: number) => setIndex((current) => (current + step + slides.length) % slides.length);
  return (
    <section className="bg-white py-16">
      <div className="wrap">
        <p className="text-center text-xs font-semibold tracking-[0.18em] text-[#092949]">{t("trustEyebrow")}</p>
        <h2 className="mt-2 text-center text-3xl font-semibold text-[#1a1a2e] sm:text-4xl">{t("trustTitle")}</h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-[#5c6370] sm:text-base">{t("trustLead")}</p>
        <div className="relative mt-8 overflow-hidden rounded-3xl">
          <img src={slide.src} alt="" className="h-72 w-full object-cover sm:h-[420px]" />
          <p className="absolute bottom-4 left-5 text-sm text-white drop-shadow">{t(slide.cap)}</p>
          <button type="button" aria-label="Previous" onClick={() => go(-1)} className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1a1a2e]">‹</button>
          <button type="button" aria-label="Next" onClick={() => go(1)} className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1a1a2e]">›</button>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((item, dot) => (
            <button key={item.src} type="button" aria-label={t(item.cap)} onClick={() => setIndex(dot)} className={dot === index ? "h-1.5 w-6 rounded-full bg-[#092949]" : "size-1.5 rounded-full bg-[#c5d4e4]"} />
          ))}
        </div>
      </div>
    </section>
  );
}
