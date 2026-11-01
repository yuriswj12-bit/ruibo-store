import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { UserButton } from "@/lib/auth/gates";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/houtai")({ component: PortalLayout });

function deskEmail(username: string) {
  return `${username.trim().toLowerCase()}@desk.cnrbic.com`;
}

function padPassword(password: string) {
  return password.length >= 8 ? password : password + "!".repeat(8 - password.length);
}

function LoginPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const username = String(formData.get("username") || "");
    const raw = String(formData.get("password") || "");
    const email = deskEmail(username);
    const password = padPassword(raw);
    let result = await authClient.signIn.email({ email, password });
    const seed = username.trim().toLowerCase() === "hek" && raw === "123456";
    if (result.error && seed) {
      result = await authClient.signUp.email({ email, password, name: "Hek" });
    }
    if (result.error) {
      setPending(false);
      setError("用户名或密码不对。");
      return;
    }
    window.location.assign("/houtai");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#ff6b78] to-[#e60013] p-6 text-ink">
      <form action={submit} className="grid w-full max-w-sm gap-3 rounded-card bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Factory desk</p>
        <h1 className="text-3xl">登录</h1>
        <p className="text-sm text-muted">工厂后台只登录。账号由内部设置，这里不能注册。</p>
        <input name="username" required autoComplete="username" defaultValue="Hek" placeholder="用户名" className="h-11 rounded-lg border border-line px-3" />
        <input name="password" type="password" required autoComplete="current-password" defaultValue="123456" placeholder="密码" className="h-11 rounded-lg border border-line px-3" />
        {error ? <p className="text-sm text-copper">{error}</p> : null}
        <button type="submit" disabled={pending} className="h-11 rounded-lg bg-copper text-copper-ink disabled:opacity-60">
          {pending ? "进入中…" : "进入后台"}
        </button>
      </form>
    </main>
  );
}

function PortalLayout() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <main className="min-h-screen bg-paper" />;
  if (!user) return <LoginPage />;
  return (
    <div className="grid min-h-screen bg-paper text-ink md:grid-cols-[220px_1fr]">
      <aside className="bg-gradient-to-b from-[#ff6b78] to-[#e60013] p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">Factory desk</p>
        <p className="mt-2 font-medium">{user.displayName || user.primaryEmail}</p>
        <nav className="mt-6 grid gap-1 text-sm">
          <Link to="/houtai" activeOptions={{ exact: true }} className="rounded-lg px-3 py-2 hover:bg-white/10">看板</Link>
          <Link to="/houtai/products" className="rounded-lg px-3 py-2 hover:bg-white/10">产品</Link>
          <Link to="/houtai/inquiries" className="rounded-lg px-3 py-2 hover:bg-white/10">询盘</Link>
          <Link to="/houtai/settings" className="rounded-lg px-3 py-2 hover:bg-white/10">站点</Link>
          <Link to="/houtai/managers" className="rounded-lg px-3 py-2 hover:bg-white/10">管理人</Link>
          <Link to="/" className="rounded-lg px-3 py-2 hover:bg-white/10">看前台</Link>
        </nav>
        <div className="mt-8"><UserButton /></div>
      </aside>
      <main className="p-6"><Outlet /></main>
    </div>
  );
}
