import { AnalyticsCards } from "@/components/portal/analytics-cards";
import { getStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const store = await getStoreContext();
  if (!store) return <p>当前 Host 没有工厂。本地开发会回退到最早的 active 租户。</p>;
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
      <p className="kicker">30 days</p>
      <h1>{store.name}</h1>
      <AnalyticsCards pv={pv} uv={visitors.length} inquiries={inquiries} paidSamples={paid} />
    </section>
  );
}
