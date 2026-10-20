import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PortalNav } from "@/components/portal/portal-nav";

const links: [string, string][] = [
  ["", "大盘"],
  ["tenants", "租户"],
  ["analytics", "分析"],
];

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/super-admin");
  if (session.role !== "super_admin") redirect("/portal/dashboard");

  return (
    <div className="portal">
      <aside className="portal-aside">
        <div className="aside-brand">
          <div className="brand-mark" />
          <div>
            <p className="kicker">Platform</p>
            <strong>总站中台</strong>
          </div>
        </div>
        <nav className="portal-nav">
          <a href="/super-admin">大盘</a>
          <a href="/super-admin/tenants">租户</a>
          <a href="/super-admin/analytics">分析</a>
          <a href="/portal/dashboard">返回工厂</a>
        </nav>
        <div className="aside-footer">
          <div className="user-chip">
            <span className="avatar">{session.username.slice(0, 1).toUpperCase()}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{session.username}</div>
              <div className="sku" style={{ color: "#a8a29e" }}>总站管理员</div>
            </div>
          </div>
          <form action="/api/v1/auth/logout" method="post">
            <button type="submit" className="logout-btn">退出登录</button>
          </form>
        </div>
      </aside>
      <div className="portal-content">
        <header className="portal-topbar">
          <div className="topbar-title">平台总控</div>
        </header>
        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}
