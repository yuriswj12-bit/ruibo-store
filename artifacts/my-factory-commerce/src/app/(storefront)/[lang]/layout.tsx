import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackView } from "@/components/storefront/track-view";
import { getStoreContext } from "@/lib/store-context";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const store = await getStoreContext();
  if (!store) notFound();
  const color = store.settings.primaryColor || "#9a3412";
  const wa = store.settings.whatsappNumber?.replace(/\D/g, "");

  return (
    <div style={{ ["--brand" as string]: color }}>
      <div className="topbar">
        <div className="wrap">
          <span>Factory direct · IATF 16949 process control · Sample ships from stock</span>
          <span>{store.settings.contactEmail}</span>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap">
          <Link className="brand" href={`/${lang}`}>
            {store.settings.logoUrl ? <img src={store.settings.logoUrl} alt="" width={28} height={28} /> : <i />}
            {store.name}
          </Link>
          <nav>
            <Link href={`/${lang}/products`}>Catalog</Link>
            <Link href={`/${lang}/products?position=Downstream`}>O2 sensors</Link>
            {wa && <a href={`https://wa.me/${wa}`}>WhatsApp</a>}
            <Link href="/portal/dashboard">Factory desk</Link>
          </nav>
        </div>
      </header>
      {children}
      <TrackView tenantId={store.tenantId} path={`/${lang}`} />
      <footer className="site-footer">
        <div className="wrap">
          <p>OEM part numbers are used for cross-reference only. {store.name} is an independent manufacturer and is not affiliated with Bosch, Denso, Toyota, or Subaru.</p>
          <p>{store.slug} · {store.industryPreset}</p>
        </div>
      </footer>
    </div>
  );
}
