export type FeishuPayload = {
  tenantName: string;
  type: "NEW_RFQ" | "SAMPLE_PAID";
  customerName: string;
  contact: string;
  productTitle: string;
  sku: string;
  quantity: number;
  message?: string;
  country?: string;
  amount?: string;
};

type CardElement = {
  tag: "div";
  fields?: Array<{ is_short: boolean; text: { tag: "lark_md"; content: string } }>;
  text?: { tag: "lark_md"; content: string };
};

export async function sendFeishuNotification(
  webhookUrl: string,
  payload: FeishuPayload,
): Promise<{ ok: boolean; status?: number }> {
  if (!webhookUrl) return { ok: false };

  const isRfq = payload.type === "NEW_RFQ";
  const title = isRfq ? "🔔 收到新的海外采购大宗询盘 (RFQ)" : "💰 收到新的样品在线购买订单";
  const color = isRfq ? "blue" : "green";

  const elements: Array<CardElement | null> = [
    {
      tag: "div",
      fields: [
        { is_short: true, text: { tag: "lark_md", content: `**来源工厂:**\n${payload.tenantName}` } },
        { is_short: true, text: { tag: "lark_md", content: `**客户国家:**\n${payload.country || "Unknown"}` } },
        { is_short: true, text: { tag: "lark_md", content: `**买家姓名:**\n${payload.customerName}` } },
        { is_short: true, text: { tag: "lark_md", content: `**联系方式:**\n${payload.contact}` } },
        {
          is_short: true,
          text: { tag: "lark_md", content: `**目标产品:**\n${payload.productTitle} (${payload.sku})` },
        },
        { is_short: true, text: { tag: "lark_md", content: `**采购数量:**\n${payload.quantity} pcs` } },
      ],
    },
    payload.message
      ? { tag: "div", text: { tag: "lark_md", content: `**买家留言:**\n${payload.message}` } }
      : null,
    payload.amount
      ? { tag: "div", text: { tag: "lark_md", content: `**支付金额:**\nUSD $${payload.amount}` } }
      : null,
  ];

  const cardContent = {
    msg_type: "interactive",
    card: {
      header: {
        title: { tag: "plain_text", content: title },
        template: color,
      },
      elements: elements.filter(Boolean),
    },
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cardContent),
  });
  return { ok: res.ok, status: res.status };
}
