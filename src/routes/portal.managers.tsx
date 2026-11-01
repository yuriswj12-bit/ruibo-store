import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { addDeskManager, listDeskManagers } from "@/lib/commerce.functions";

export const Route = createFileRoute("/portal/managers")({
  loader: () => listDeskManagers(),
  component: ManagersPage,
});

function ManagersPage() {
  const rows = Route.useLoaderData();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");
    const result = await addDeskManager({ data: { username, password } });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.invalidate();
  }

  return (
    <section>
      <h1 className="text-4xl">管理人</h1>
      <p className="mt-2 text-sm text-muted">登录页不能自己注册。新账号只在这里添加。</p>
      <ul className="mt-4 grid gap-2">
        {rows.map((row) => (
          <li key={row.email} className="rounded-card border border-line bg-card px-4 py-3 text-sm">
            <span className="font-medium">{row.name}</span>
          </li>
        ))}
      </ul>
      <form action={submit} className="mt-6 grid max-w-md gap-2">
        <input name="username" required placeholder="用户名" autoComplete="off" className="h-11 rounded-lg border border-line px-3" />
        <input name="password" type="password" required placeholder="密码" autoComplete="new-password" className="h-11 rounded-lg border border-line px-3" />
        {error ? <p className="text-sm text-copper">{error}</p> : null}
        <button type="submit" disabled={pending} className="h-11 rounded-lg bg-copper text-copper-ink disabled:opacity-60">
          {pending ? "添加中…" : "添加管理人"}
        </button>
      </form>
    </section>
  );
}
