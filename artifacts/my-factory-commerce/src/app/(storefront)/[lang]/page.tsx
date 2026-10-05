import Link from "next/link";
import { YmmFilter } from "@/components/storefront/ymm-filter";
import { OeSearchBar } from "@/components/storefront/oe-search-bar";
import { TrustBadges } from "@/components/storefront/trust-badges";
import { getStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const store = await getStoreContext();
  if (!store) return null;
  const products = await prisma.product.findMany({
    where: { tenantId: store.tenantId, isPublished: true },
    orderBy: { updatedAt: "desc" },
    take: 6,
    include: { oeNumbers: true },
  });

  return (
    <main className="wrap">
      <section className="hero">
        <div>
          <p className="kicker">Oxygen sensors · export line</p>
          <h1>Zirconia sensors built for the aftermarket, quoted like a factory.</h1>
          <p>Look up the vehicle, or paste a Bosch / Denso / Toyota number. Bulk RFQ and a 1–5 piece sample order sit on the same page.</p>
          <OeSearchBar lang={lang} />
        </div>
        <YmmFilter tenantId={store.tenantId} lang={lang} />
      </section>
      <TrustBadges certImages={store.settings.certImages} />
      <section style={{ marginTop: 28 }}>
        <h2>Published sensors</h2>
        <div className="product-grid">
          {products.map((product) => (
            <Link key={product.id} className="card" href={`/${lang}/products/${product.sku}`}>
              <p className="sku">{product.sku}</p>
              <h3>{product.title}</h3>
              <p className="price">{product.priceRange}</p>
              <p className="sku">{product.oeNumbers.map((oe) => oe.rawOe).join(" · ")}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
