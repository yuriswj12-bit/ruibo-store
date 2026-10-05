import { createFileRoute, useRouter } from "@tanstack/react-router";
import { moveInquiry, portalInquiries } from "@/lib/commerce.functions";
import { canMoveInquiry } from "@/lib/oe";

export const Route = createFileRoute("/portal/inquiries")({
  loader: () => portalInquiries(),
  component: Inquiries,
});

function Inquiries() {
  const rows = Route.useLoaderData();
  const router = useRouter();
  return (
    <section>
      <h1 className="text-4xl">询盘</h1>
      <div className="mt-4 grid gap-3">
        {rows.length === 0 && <p className="text-muted">还没有询盘。前台提交一条就会出现在这里。</p>}
        {rows.map((row) => (
          <article key={row.id} className="rounded-card border border-line bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{row.customer_name} · {row.country || "—"}</p>
                <p className="text-sm text-muted">{row.customer_email} · {row.product_sku || "整站"} · {row.quantity ?? "—"} pcs</p>
                <p className="mt-2 text-sm">{row.message}</p>
              </div>
              <select
                className="h-11 rounded-lg border border-line px-2"
                value={row.status}
                onChange={async (event) => {
                  await moveInquiry({ data: { id: row.id, status: event.target.value } });
                  router.invalidate();
                }}
              >
                <option value={row.status}>{row.status}</option>
                {["contacted", "quoted", "closed"].filter((status) => canMoveInquiry(row.status, status)).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
