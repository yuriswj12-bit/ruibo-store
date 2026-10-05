"use client";

import { useState } from "react";

export function AuthCard({ next = "/portal/dashboard" }: { next?: string }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const payload = {
      username: formData.get("username"),
      password: formData.get("password"),
      factoryName: formData.get("factoryName"),
    };
    const res = await fetch(mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error || "登录失败");
      return;
    }
    window.location.href = next;
  }

  return (
    <main className="auth-shell">
      <form action={submit} className="auth-card">
        <p className="kicker">Factory desk</p>
        <h1>{mode === "login" ? "登录后台" : "开通工厂账号"}</h1>
        <p className="sku">用户名和密码即可。买家询盘、样品下单不需要注册。</p>
        <input name="username" required minLength={3} maxLength={32} placeholder="用户名" autoComplete="username" />
        <input name="password" type="password" required minLength={8} placeholder="密码" autoComplete={mode === "login" ? "current-password" : "new-password"} />
        {mode === "register" && <input name="factoryName" placeholder="工厂名称，可后补" />}
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={pending}>{pending ? "提交中…" : mode === "login" ? "登录" : "注册并进入"}</button>
        <button
          type="button"
          className="auth-switch"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "没有账号，去注册" : "已有账号，去登录"}
        </button>
      </form>
    </main>
  );
}
