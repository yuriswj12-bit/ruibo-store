import { InquiryStatusForm } from "@/components/portal/inquiry-status-form";
import { getAdminStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

const statusClass: Record<string, string> = {
  new: "status-new",
  contacted: "status-contacted",
  quoted: "status-quoted",
  closed: "status-closed",
};

export default async function InquiriesPage() {
  const store = await getAdminStoreContext();
  if (!store) return <p>没有工厂上下文。</p>;
  const inquiries = await prisma.inquiry.findMany({
    where: { tenantId: store.tenantId },
    include: { product: { select: { sku: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="kicker">Leads</p>
          <h1>询盘管理</h1>
        </div>
        <span className="sku">{inquiries.length} 条</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>客户</th>
              <th>产品</th>
              <th>数量</th>
              <th>留言</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="sku">{inquiry.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                <td>
                  <div>{inquiry.customerName}</div>
                  <div className="sku">{inquiry.customerEmail} · {inquiry.country || "—"}</div>
                </td>
                <td>{inquiry.product?.sku || "General"}</td>
                <td>{inquiry.quantity || "—"}</td>
                <td style={{ maxWidth: 280, whiteSpace: "pre-wrap" }}>{inquiry.message}</td>
                <td>
                  <span className={`status ${statusClass[inquiry.status] || ""}`} style={{ marginRight: 8 }}>
                    {inquiry.status}
                  </span>
                  <InquiryStatusForm id={inquiry.id} status={inquiry.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
