import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { OeSearch } from "@/components/store/oe-search";
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
      <section className="relative overflow-hidden bg-[#ececec]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/sensor.mp4"
          poster="/auto.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="relative wrap grid items-center gap-6 py-10 lg:min-h-[520px] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-xl rounded-card border border-line bg-card/95 p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">{t("eyebrow")}</p>
            <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">{t("heroTitle")}</h1>
            <p className="mt-3 text-muted">{t("heroBody")}</p>
            <div className="mt-5">
              <OeSearch large />
            </div>
          </div>
        </div>
      </section>
      <section className="wrap py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LINES.map((line) => (
            <Link key={line.id} to="/products" search={catalogSearch({ line: line.id })} className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-card">
              <img src={line.image} alt={t(line.title)} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
              <span className="absolute bottom-3 left-3 rounded-full bg-card px-3 py-1 text-sm font-medium">{t(line.title)}</span>
            </Link>
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
    </StoreShell>
  );
}
