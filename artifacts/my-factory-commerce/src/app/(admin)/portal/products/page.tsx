import { ExcelUploader } from "@/components/portal/excel-uploader";
import { ProductRowActions } from "@/components/portal/product-row-actions";
import { getAdminStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const store = await getAdminStoreContext();
  if (!store) return <p>没有工厂上下文。</p>;
  const products = await prisma.product.findMany({
    where: { tenantId: store.tenantId },
    include: { oeNumbers: true, fitments: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="kicker">Catalog</p>
          <h1>产品与规格</h1>
        </div>
        <span className="sku">{products.length} 个 SKU</span>
      </div>
      <ExcelUploader />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>标题</th>
              <th>MOQ</th>
              <th>样品价</th>
              <th>状态</th>
              <th>OE</th>
              <th>适配</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="sku">{product.sku}</td>
                <td>{product.title}</td>
                <td>{product.moq}</td>
                <td className="price">${product.samplePrice.toString()}</td>
                <td>
                  <span className={`status ${product.isPublished ? "status-quoted" : "status-closed"}`}>
                    {product.isPublished ? "上架" : "下架"}
                  </span>
                </td>
                <td className="sku">{product.oeNumbers.map((oe) => oe.rawOe).slice(0, 2).join(", ") || "—"}</td>
                <td>{product.fitments.length}</td>
                <td>
                  <ProductRowActions
                    id={product.id}
                    title={product.title}
                    moq={product.moq}
                    samplePrice={product.samplePrice.toString()}
                    isPublished={product.isPublished}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
