import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { SampleCheckout } from "@/components/storefront/sample-checkout";
import { prisma } from "@/lib/prisma";

export default async function SampleCheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ sku?: string; qty?: string; paid?: string }>;
}) {
  const { lang } = await params;
  const query = await searchParams;
  const tenantId = (await headers()).get("x-tenant-id");
  if (!tenantId || !query.sku) notFound();

  const product = await prisma.product.findUnique({
    where: { tenantId_sku: { tenantId, sku: query.sku } },
    select: { id: true, sku: true, title: true, samplePrice: true, sampleStock: true },
  });
  if (!product) notFound();
  const quantity = Math.min(5, Math.max(1, Number(query.qty || 1)));

  return (
    <main>
      {query.paid === "1" && (
        <p className="bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Payment submitted. Confirmation arrives after the gateway webhook.</p>
      )}
      <SampleCheckout
        tenantId={tenantId}
        lang={lang}
        quantity={quantity}
        product={{ ...product, samplePrice: product.samplePrice.toString() }}
        stripePublishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || ""}
        usdtAddress={process.env.STATIC_USDT_TRC20_ADDRESS || ""}
      />
    </main>
  );
}
