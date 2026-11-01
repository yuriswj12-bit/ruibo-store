import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({ component: Missing });

function Missing() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper p-6 text-center text-ink">
      <div>
        <h1 className="text-3xl">没有这个页面</h1>
        <p className="mt-2 text-sm text-muted">这个地址打不开后台。</p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center text-sm text-copper">回首页</Link>
      </div>
    </main>
  );
}
