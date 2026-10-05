import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const rows = await prisma.analyticsEvent.groupBy({
    by: ["tenantId", "eventType"],
    _count: { _all: true },
  });
  const tenants = await prisma.tenant.findMany({ select: { id: true, name: true } });
  const names = Object.fromEntries(tenants.map((tenant) => [tenant.id, tenant.name]));
  return (
    <main className="wrap" style={{ padding: 28 }}>
      <h1>全网大盘</h1>
      <table>
        <thead><tr><th>工厂</th><th>事件</th><th>次数</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.tenantId}-${row.eventType}`}>
              <td>{names[row.tenantId] || row.tenantId}</td>
              <td>{row.eventType}</td>
              <td>{row._count._all}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
