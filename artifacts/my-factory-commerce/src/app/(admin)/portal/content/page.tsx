import { ContentDesk } from "@/components/portal/content-desk";
import { getAdminStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";
import type { ScriptProduct } from "@/lib/content-desk";

const fallback: ScriptProduct = {
  sku: "OS-B0258006027",
  title: "Downstream Oxygen Sensor for Toyota Corolla 1.8L 2014-2019",
  oe: "0258006027 / 89465-02130",
  fitment: "Toyota Corolla 1.8L 2014-2019 downstream",
  samplePrice: "$28",
  moq: 100,
};

export default async function ContentPage() {
  const store = await getAdminStoreContext();
  if (!store) return <p>没有工厂上下文。</p>;
  const products = await prisma.product.findMany({
    where: { tenantId: store.tenantId },
    include: { oeNumbers: true, fitments: true },
    orderBy: { updatedAt: "desc" },
    take: 24,
  });
  const scriptProducts: ScriptProduct[] = products.length
    ? products.map((product) => ({
        sku: product.sku,
        title: product.title,
        oe: product.oeNumbers.map((oe) => oe.rawOe).slice(0, 2).join(" / ") || product.sku,
        fitment: product.fitments[0]
          ? `${product.fitments[0].make} ${product.fitments[0].model} ${product.fitments[0].engine} ${product.fitments[0].year}`
          : "confirm fitment before filming",
        samplePrice: `$${product.samplePrice.toString()}`,
        moq: product.moq,
      }))
    : [fallback];

  return (
    <section>
      <p className="kicker">Content window</p>
      <h1>内容营销窗口</h1>
      <p>两条线共用一张脸。娱乐性学 Tina / Mia，负责停住滑动。知识性只讲氧传感器：前氧后氧、故障码位置、旧件对号。不单发跟配件无关的颜值。</p>
      <ContentDesk
        factoryName={store.name}
        products={scriptProducts}
        whatsapp={store.settings.whatsappNumber}
        domain={store.slug}
      />
    </section>
  );
}
