import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminStoreContext } from "@/lib/store-context";
import { PortalNav } from "@/components/portal/portal-nav";

const links: [string, string][] = [
  ["dashboard", "看板"],
  ["products", "产品"],
  ["inquiries", "询盘"],
  ["content", "内容"],
  ["settings", "站点"],
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/portal/dashboard");
  if (session.role !== "tenant_admin" && session.role !== "super_admin") redirect("/login");

  const store = await getAdminStoreContext();
  const displayName = store?.name || session.username;

  return (
    <div className="portal">
      <aside className="portal-aside">
        <div className="aside-brand">
          <div className="brand-mark" />
          <div>
            <p className="kicker">Factory Desk</p>
            <strong>{displayName}</strong>
          </div>
        </div>
        <PortalNav links={links} showSuper={session.role === "super_admin"} />
        <div className="aside-footer">
          <div className="user-chip">
            <span className="avatar">{session.username.slice(0, 1).toUpperCase()}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{session.username}</div>
              <div className="sku" style={{ color: "#a8a29e" }}>{session.role === "super_admin" ? "总站管理员" : "工厂管理员"}</div>
            </div>
          </div>
          <form action="/api/v1/auth/logout" method="post">
            <button type="submit" className="logout-btn">退出登录</button>
          </form>
        </div>
      </aside>
      <div className="portal-content">
        <header className="portal-topbar">
          <div className="topbar-title">工厂运营中台</div>
          <div className="topbar-actions">
            <span className="badge">30 天数据</span>
          </div>
        </header>
        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}
