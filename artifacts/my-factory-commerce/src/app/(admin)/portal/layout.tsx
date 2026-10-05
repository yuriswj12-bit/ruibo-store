import Link from "next/link";
import { getStoreContext } from "@/lib/store-context";

const links = [
  ["dashboard", "看板"],
  ["products", "产品"],
  ["inquiries", "询盘"],
  ["settings", "站点"],
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const store = await getStoreContext();
  return (
    <div className="portal">
      <aside>
        <p className="kicker">Factory desk</p>
        <strong>{store?.name || "未绑定域名"}</strong>
        <nav style={{ display: "grid", marginTop: 18 }}>
          {links.map(([href, label]) => (
            <Link key={href} href={`/portal/${href}`}>{label}</Link>
          ))}
          <Link href="/super-admin">总站</Link>
          <form action="/api/v1/auth/logout" method="post"><button type="submit" style={{ marginTop: 18, background: "transparent", color: "#f5f0e8", border: 0 }}>退出</button></form>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
