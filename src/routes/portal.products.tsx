import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { importProducts, portalProducts } from "@/lib/commerce.functions";

export const Route = createFileRoute("/portal/products")({
  loader: () => portalProducts(),
  component: ProductsDesk,
});

function parseCsv(text: string) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((cell) => cell.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, (cells[index] || "").trim()]));
  });
}

function ProductsDesk() {
  const products = Route.useLoaderData();
  const [message, setMessage] = useState("");

  return (
    <section>
      <h1 className="text-4xl">产品与规格</h1>
      <form className="mt-4 rounded-card border border-line bg-card p-4">
        <p className="text-sm text-muted">CSV 列：SKU, Title, PriceRange, MOQ, SamplePrice, OE_Numbers。其余列先忽略，标准列会入库。</p>
        <input
          type="file"
          accept=".csv,text/csv"
          className="mt-3"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const rows = parseCsv(await file.text())
              .filter((row): row is { SKU: string; Title: string; PriceRange?: string; MOQ?: string; SamplePrice?: string; OE_Numbers?: string } => Boolean(row.SKU && row.Title))
              .map((row) => ({
                SKU: row.SKU,
                Title: row.Title,
                PriceRange: row.PriceRange,
                MOQ: row.MOQ,
                SamplePrice: row.SamplePrice,
                OE_Numbers: row.OE_Numbers,
              }));
            const result = await importProducts({ data: { rows } });
            setMessage(`已导入 ${result.count} 行`);
            window.location.reload();
          }}
        />
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
      <table className="mt-4 w-full text-sm">
        <thead className="text-left text-muted">
          <tr><th className="py-2">货号</th><th>买家看到的 OEM</th><th>MOQ</th><th>样品价</th><th>库存</th></tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.sku} className="border-t border-line">
              <td className="py-2 font-medium">{product.sku}</td>
              <td>{product.oes}</td>
              <td>{product.moq}</td>
              <td>${product.sample_price}</td>
              <td>{product.sample_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
