import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { SignInGate } from "@/lib/auth/gates";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink p-6 text-ink">
      <div className="w-full max-w-sm rounded-card bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Factory desk</p>
        <h1 className="mt-1 text-3xl">工厂账号</h1>
        <p className="mt-2 text-sm text-muted">买家询盘和样品下单不用注册。后台用邮箱和密码。</p>
        <SignInGate fallback={<AuthForm />}>
          <p className="mt-4 text-sm">已登录。</p>
          <a href="/portal" className="mt-3 inline-flex h-11 items-center rounded-lg bg-copper px-4 text-copper-ink">进入后台</a>
        </SignInGate>
      </div>
    </main>
  );
}

function AuthForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  if (!authEnabled) return <p className="mt-4 text-sm text-muted">Sign-in is disabled.</p>;

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || email.split("@")[0]);
    const result = mode === "up"
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password });
    setPending(false);
    if (result.error) {
      setError(result.error.message || "登录失败");
      return;
    }
    navigate({ to: "/portal" });
  }

  return (
    <div className="mt-4 grid gap-3">
      <form action={submit} className="grid gap-2">
        {mode === "up" && <input name="name" placeholder="工厂联系人" className="h-11 rounded-lg border border-line px-3" />}
        <input name="email" type="email" required placeholder="工作邮箱" autoComplete="username" className="h-11 rounded-lg border border-line px-3" />
        <input name="password" type="password" required minLength={8} placeholder="密码，至少 8 位" autoComplete={mode === "up" ? "new-password" : "current-password"} className="h-11 rounded-lg border border-line px-3" />
        {error && <p className="text-sm text-copper">{error}</p>}
        <button type="submit" disabled={pending} className="h-11 rounded-lg bg-copper text-copper-ink disabled:opacity-60">
          {pending ? "提交中…" : mode === "up" ? "注册并进入" : "登录"}
        </button>
      </form>
      <button type="button" className="text-sm text-muted" onClick={() => setMode(mode === "up" ? "in" : "up")}>
        {mode === "up" ? "已有账号，去登录" : "没有账号，去注册"}
      </button>
      <div className="grid gap-2">
        {GROK_PROVIDERS.map((provider) => (
          <button
            key={provider.providerId}
            type="button"
            className="h-11 rounded-lg border border-line"
            onClick={() => signIn(provider.providerId, { callbackURL: "/portal" })}
          >
            Continue with {provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}
