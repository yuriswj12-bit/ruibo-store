import { SettingsForm } from "@/components/portal/settings-form";
import { getStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const store = await getStoreContext();
  if (!store) return <p>没有工厂上下文。</p>;
  const tenant = await prisma.tenant.findUnique({ where: { id: store.tenantId } });
  if (!tenant) return null;
  return (
    <section>
      <h1>站点设置</h1>
      <p className="sku">子域 {tenant.slug} · 独立域 {tenant.customDomain || "未绑定"} · {tenant.status}</p>
      <SettingsForm
        tenantId={tenant.id}
        settings={tenant.settings as Record<string, string>}
        customDomain={tenant.customDomain || ""}
      />
    </section>
  );
}
