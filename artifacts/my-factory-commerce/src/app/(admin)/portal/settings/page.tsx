import { SettingsForm } from "@/components/portal/settings-form";
import { getAdminStoreContext } from "@/lib/store-context";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const store = await getAdminStoreContext();
  if (!store) return <p>没有工厂上下文。</p>;
  const tenant = await prisma.tenant.findUnique({ where: { id: store.tenantId } });
  if (!tenant) return null;
  return (
    <section>
      <div className="page-header">
        <div>
          <p className="kicker">Settings</p>
          <h1>站点设置</h1>
        </div>
      </div>
      <p className="sku" style={{ marginBottom: 16 }}>
        子域 {tenant.slug} · 独立域 {tenant.customDomain || "未绑定"} · {tenant.status}
      </p>
      <SettingsForm
        settings={tenant.settings as Record<string, string>}
        customDomain={tenant.customDomain || ""}
      />
    </section>
  );
}
