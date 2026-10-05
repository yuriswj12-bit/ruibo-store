import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SuperAdminHome() {
  const [tenants, inquiries, paid] = await Promise.all([
    prisma.tenant.count(),
    prisma.inquiry.count(),
    prisma.sampleOrder.count({ where: { paymentStatus: "paid" } }),
  ]);
  return (
    <main className="wrap" style={{ padding: 28 }}>
      <p className="kicker">Platform</p>
      <h1>总站中台</h1>
      <div className="metrics">
        <article className="card metric"><span>Tenants</span><strong>{tenants}</strong></article>
        <article className="card metric"><span>RFQ</span><strong>{inquiries}</strong></article>
        <article className="card metric"><span>Paid samples</span><strong>{paid}</strong></article>
      </div>
      <p style={{ marginTop: 18 }}><Link href="/super-admin/tenants">租户与域名</Link> · <Link href="/super-admin/analytics">全网大盘</Link></p>
    </main>
  );
}
