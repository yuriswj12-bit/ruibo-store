import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/portal")({ component: PortalLayout });

function PortalLayout() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <main className="min-h-screen bg-paper" />;
  if (!user) return <RedirectToSignIn />;
  return (
    <div className="grid min-h-screen bg-paper text-ink md:grid-cols-[220px_1fr]">
      <aside className="bg-ink p-5 text-copper-ink">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">Factory desk</p>
        <p className="mt-2 font-medium">{user.displayName || user.primaryEmail}</p>
        <nav className="mt-6 grid gap-1 text-sm">
          <Link to="/portal" activeOptions={{ exact: true }} className="rounded-lg px-3 py-2 hover:bg-white/10">看板</Link>
          <Link to="/portal/products" className="rounded-lg px-3 py-2 hover:bg-white/10">产品</Link>
          <Link to="/portal/inquiries" className="rounded-lg px-3 py-2 hover:bg-white/10">询盘</Link>
          <Link to="/portal/settings" className="rounded-lg px-3 py-2 hover:bg-white/10">站点</Link>
          <Link to="/" className="rounded-lg px-3 py-2 hover:bg-white/10">看前台</Link>
        </nav>
        <div className="mt-8"><UserButton /></div>
      </aside>
      <main className="p-6"><Outlet /></main>
    </div>
  );
}
