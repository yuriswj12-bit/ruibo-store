import { createFileRoute } from "@tanstack/react-router";
import { portalSnapshot } from "@/lib/commerce.functions";

export const Route = createFileRoute("/portal/")({
  loader: () => portalSnapshot(),
  component: Dashboard,
});

function Dashboard() {
  const data = Route.useLoaderData();
  const cards = [
    ["产品", data.counts.products],
    ["询盘", data.counts.inquiries],
    ["已支付样品", data.counts.paid],
  ] as const;
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">{data.factory.slug}</p>
      <h1 className="text-4xl">{data.factory.name}</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-card border border-line bg-card p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 text-4xl">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
