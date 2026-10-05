import { InquiryStatusForm } from "@/components/portal/inquiry-status-form";
import { getStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

export default async function InquiriesPage() {
  const store = await getStoreContext();
  if (!store) return <p>没有工厂上下文。</p>;
  const inquiries = await prisma.inquiry.findMany({
    where: { tenantId: store.tenantId },
    include: { product: { select: { sku: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section>
      <h1>询盘</h1>
      <table>
        <thead>
          <tr><th>时间</th><th>客户</th><th>产品</th><th>数量</th><th>状态</th></tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id}>
              <td>{inquiry.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
              <td>
                {inquiry.customerName}<br />
                <span className="sku">{inquiry.customerEmail} · {inquiry.country || "—"}</span>
              </td>
              <td>{inquiry.product?.sku || "General"}</td>
              <td>{inquiry.quantity || "—"}</td>
              <td><InquiryStatusForm id={inquiry.id} status={inquiry.status} tenantId={store.tenantId} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
