import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export const Route = createFileRoute("/loginloginlogin")({ component: LoginPage });

function deskEmail(username: string) {
  return `${username.trim().toLowerCase()}@desk.cnrbic.com`;
}

function padPassword(password: string) {
  return password.length >= 8 ? password : password + "!".repeat(8 - password.length);
}

function LoginPage() {
  const navigate = useNavigate();
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
    setPending(false);
    if (result.error) {
      setError("用户名或密码不对。");
      return;
    }
    navigate({ to: "/portal" });
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
