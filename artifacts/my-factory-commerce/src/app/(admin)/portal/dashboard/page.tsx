import { AnalyticsCards } from "@/components/portal/analytics-cards";
import { getAdminStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const store = await getAdminStoreContext();
  if (!store) return <p>当前没有工厂上下文。本地开发会回退到最早的 active 租户。</p>;

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [pv, visitors, inquiries, paid] = await Promise.all([
    prisma.analyticsEvent.count({ where: { tenantId: store.tenantId, eventType: "pv", createdAt: { gte: since } } }),
    prisma.analyticsEvent.findMany({
      where: { tenantId: store.tenantId, eventType: "pv", createdAt: { gte: since }, ip: { not: null } },
      distinct: ["ip"],
      select: { ip: true },
    }),
    prisma.inquiry.count({ where: { tenantId: store.tenantId, createdAt: { gte: since } } }),
    prisma.sampleOrder.count({ where: { tenantId: store.tenantId, paymentStatus: "paid", createdAt: { gte: since } } }),
  ]);

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="kicker">Overview</p>
          <h1>{store.name}</h1>
        </div>
        <span className="badge">{store.slug}</span>
      </div>
      <AnalyticsCards pv={pv} uv={visitors.length} inquiries={inquiries} paidSamples={paid} />
      <div className="grid-3">
        <article className="card">
          <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>快速操作</h3>
          <p className="sku">导入产品、处理询盘、调整站点信息</p>
        </article>
        <article className="card">
          <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>内容窗口</h3>
          <p className="sku">娱乐性出镜 + 氧传感器科普双线</p>
        </article>
        <article className="card">
          <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>支付与样品</h3>
          <p className="sku">Stripe / PayPal / Binance Pay / TRC20</p>
        </article>
      </div>
    </section>
  );
}
