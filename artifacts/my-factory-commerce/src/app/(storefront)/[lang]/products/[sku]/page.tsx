import { notFound } from "next/navigation";
import { DualActionBox } from "@/components/storefront/dual-action-box";
import { FitmentTable } from "@/components/storefront/fitment-table";
import { TrustBadges } from "@/components/storefront/trust-badges";
import { labelSpec } from "@/config/industry-presets/auto-parts";
import { getStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; sku: string }>;
}) {
  const { lang, sku } = await params;
  const store = await getStoreContext();
  if (!store) notFound();
  const product = await prisma.product.findUnique({
    where: { tenantId_sku: { tenantId: store.tenantId, sku } },
    include: { oeNumbers: true, fitments: { orderBy: { year: "asc" } } },
  });
  if (!product || !product.isPublished) notFound();
  const specs = product.specifications as Record<string, string | number>;

  return (
    <main className="wrap" style={{ padding: "28px 0", display: "grid", gap: 16 }}>
      <p className="kicker">{product.sku}</p>
      <h1 style={{ fontFamily: "Newsreader, Georgia, serif", fontWeight: 500, fontSize: 40, margin: 0 }}>{product.title}</h1>
      <p className="price">{product.priceRange} · MOQ {product.moq} · sample ${product.samplePrice.toString()}</p>
      <p>{product.oeNumbers.map((oe) => `${oe.brand || "OE"} ${oe.rawOe}`).join(" · ")}</p>
      {product.pdfAttachment && <a href={product.pdfAttachment}>Download spec PDF</a>}
      <DualActionBox
        tenantId={store.tenantId}
        lang={lang}
        whatsappNumber={store.settings.whatsappNumber}
        product={{
          sku: product.sku,
          title: product.title,
          samplePrice: product.samplePrice.toString(),
          sampleStock: product.sampleStock,
          pdfAttachment: product.pdfAttachment,
        }}
      />
      <section className="panel">
        <table>
          <tbody>
            {Object.entries(specs).map(([key, value]) => (
              <tr key={key}>
                <th>{labelSpec(key)}</th>
                <td>{String(value)}{key.includes("length") || key.includes("wrench") ? " mm" : ""}{key.includes("warranty") ? " years" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <FitmentTable oe={product.oeNumbers[0]?.rawOe || product.sku} fitments={product.fitments} />
      <TrustBadges certImages={store.settings.certImages} />
    </main>
  );
}
