import { createFileRoute, Link } from "@tanstack/react-router";
import { portalSnapshot } from "@/lib/commerce.functions";

export const Route = createFileRoute("/portal/")({
  loader: () => portalSnapshot(),
  component: Dashboard,
});

function Dashboard() {
  const data = Route.useLoaderData();
  const cards = [
    ["近 7 日访问", data.counts.views, `${data.counts.visitors} 个访客`],
    ["近 7 日点击", data.counts.clicks, "询盘、WhatsApp、邮箱"],
    ["近 7 日询盘", data.counts.inquiries, "客户从表单发出"],
    ["WhatsApp 已发送", data.counts.sent, data.counts.waiting ? `${data.counts.waiting} 条还没发出` : "同步到老板号码"],
  ] as const;
  const peak = Math.max(1, ...data.days.flatMap((day) => [day.views, day.clicks, day.inquiries, day.sent]));
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">近 7 日</p>
      <h1 className="text-4xl">{data.factory.name}</h1>
      <p className="mt-2 text-sm text-muted">看板只看访问、点击和询盘。不接支付。询盘会进下面列表，并同步到 WhatsApp {data.factory.whatsapp}。</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, note]) => (
          <article key={label} className="rounded-card border border-line bg-card p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 text-4xl">{value}</p>
            <p className="mt-1 text-xs text-muted">{note}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-card border border-line bg-card p-4">
        <p className="text-sm text-muted">7 日循环 · 访问 / 点击 / 询盘 / 发送</p>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {data.days.map((day) => (
            <div key={day.day} className="grid justify-items-center gap-1">
              <div className="flex h-24 items-end gap-0.5">
                <Bar n={day.views} peak={peak} className="bg-ink" />
                <Bar n={day.clicks} peak={peak} className="bg-copper" />
                <Bar n={day.inquiries} peak={peak} className="bg-[#1f6b4a]" />
                <Bar n={day.sent} peak={peak} className="bg-[#2457c5]" />
              </div>
              <p className="text-[10px] text-muted">{day.day}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">最新询盘</h2>
          <Link to="/portal/inquiries" className="text-sm text-copper">全部</Link>
        </div>
        <div className="mt-3 grid gap-2">
          {data.recent.length === 0 && <p className="text-sm text-muted">还没有询盘。前台提交后会出现在这里。</p>}
          {data.recent.map((row) => (
            <article key={row.id} className="rounded-card border border-line bg-card p-4">
              <p className="font-medium">{row.customer_name} · {row.customer_email}</p>
              <p className="mt-1 text-sm">{row.message}</p>
            </article>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">在架产品 {data.counts.products}</p>
    </section>
  );
}

function Bar({ n, peak, className }: { n: number; peak: number; className: string }) {
  const height = Math.max(n > 0 ? 8 : 2, Math.round((n / peak) * 96));
  return <span className={`w-1.5 rounded-sm ${className}`} style={{ height }} />;
}
