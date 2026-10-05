import { TenantCreateForm } from "@/components/portal/tenant-create-form";
import { prisma } from "@/lib/prisma";

export default async function TenantsPage() {
  const tenants = await prisma.tenant.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { products: true, inquiries: true } } } });
  return (
    <main className="wrap" style={{ padding: 28 }}>
      <h1>租户开通</h1>
      <TenantCreateForm />
      <table>
        <thead><tr><th>工厂</th><th>Slug</th><th>域名</th><th>行业</th><th>产品</th><th>询盘</th></tr></thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.name}</td>
              <td>{tenant.slug}</td>
              <td>{tenant.customDomain || "—"}</td>
              <td>{tenant.industryPreset}</td>
              <td>{tenant._count.products}</td>
              <td>{tenant._count.inquiries}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
