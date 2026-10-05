import { ExcelUploader } from "@/components/portal/excel-uploader";
import { getStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const store = await getStoreContext();
  if (!store) return <p>没有工厂上下文。</p>;
  const products = await prisma.product.findMany({
    where: { tenantId: store.tenantId },
    include: { oeNumbers: true, fitments: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <section>
      <h1>产品与规格</h1>
      <ExcelUploader tenantId={store.tenantId} />
      <table>
        <thead>
          <tr><th>SKU</th><th>Title</th><th>MOQ</th><th>Sample</th><th>OE</th><th>Fitment</th></tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.sku}</td>
              <td>{product.title}</td>
              <td>{product.moq}</td>
              <td>${product.samplePrice.toString()}</td>
              <td>{product.oeNumbers.map((oe) => oe.rawOe).join(", ")}</td>
              <td>{product.fitments.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
