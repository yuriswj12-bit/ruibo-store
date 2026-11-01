import { createFileRoute, useRouter } from "@tanstack/react-router";
import { moveInquiry, portalInquiries } from "@/lib/commerce.functions";
import { canMoveInquiry } from "@/lib/oe";

export const Route = createFileRoute("/portal/inquiries")({
  loader: () => portalInquiries(),
  component: Inquiries,
});

const STATUS_LABEL: Record<string, string> = {
  new: "新询盘",
  contacted: "已联系",
  quoted: "已报价",
  closed: "已关闭",
};

const NOTIFY_LABEL: Record<string, string> = {
  sent: "已发到 WhatsApp",
  waiting: "WhatsApp 待接通",
  failed: "WhatsApp 发送失败",
};

function Inquiries() {
  const rows = Route.useLoaderData();
  const router = useRouter();
  return (
    <section>
      <h1 className="text-4xl">询盘</h1>
      <p className="mt-2 text-sm text-muted">前台客户提交的姓名、联系方式和留言都在这里。</p>
      <div className="mt-4 grid gap-3">
        {rows.length === 0 && <p className="text-muted">还没有询盘。前台提交一条就会出现在这里。</p>}
        {rows.map((row) => (
          <article key={row.id} className="rounded-card border border-line bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{row.customer_name} · {row.country || "未填公司"}</p>
                <p className="text-sm text-muted">{row.customer_email}{row.whatsapp ? ` · ${row.whatsapp}` : ""}</p>
                <p className="text-sm text-muted">货号 {row.product_sku || "未指定"}{row.matched_oe ? ` · 买家号码 ${row.matched_oe}` : ""}{row.quantity ? ` · ${row.quantity} pcs` : ""}</p>
                <p className="mt-2 text-sm">{row.message}</p>
                <p className="mt-2 text-xs text-muted">{row.created_at.slice(0, 16).replace("T", " ")} · {NOTIFY_LABEL[row.notify_status] || "未同步"}</p>
              </div>
              <select
                className="h-11 rounded-lg border border-line px-2"
                value={row.status}
                onChange={async (event) => {
                  await moveInquiry({ data: { id: row.id, status: event.target.value } });
                  router.invalidate();
                }}
              >
                <option value={row.status}>{STATUS_LABEL[row.status] || row.status}</option>
                {["contacted", "quoted", "closed"].filter((status) => canMoveInquiry(row.status, status)).map((status) => (
                  <option key={status} value={status}>{STATUS_LABEL[status]}</option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
