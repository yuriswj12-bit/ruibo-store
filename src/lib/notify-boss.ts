const PLACEHOLDER = "8613800000000";
const PUBLIC_DESK = "8613706647066";

export function bossPhone(raw: string | null | undefined) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits || digits === PLACEHOLDER) return PUBLIC_DESK;
  return digits;
}

export function inquiryText(input: {
  customerName: string;
  customerEmail: string;
  whatsapp?: string;
  country?: string;
  sku?: string;
  message: string;
}) {
  return [
    "瑞铂传感 新询盘",
    `客户 ${input.customerName}`,
    input.country ? `公司 ${input.country}` : "",
    `邮箱 ${input.customerEmail}`,
    input.whatsapp ? `电话 ${input.whatsapp}` : "",
    input.sku ? `货号 ${input.sku}` : "",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendBossWhatsapp(phone: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN?.trim();
  const phoneId = process.env.WHATSAPP_PHONE_ID?.trim();
  const callme = process.env.WHATSAPP_NOTIFY_KEY?.trim();
  if (token && phoneId) {
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: text.slice(0, 4000) },
      }),
    });
    if (!response.ok) return { status: "failed" as const, error: `WhatsApp ${response.status}`, channel: "meta" };
    return { status: "sent" as const, error: "", channel: "meta" };
  }
  if (callme) {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text.slice(0, 900))}&apikey=${encodeURIComponent(callme)}`;
    const response = await fetch(url);
    if (!response.ok) return { status: "failed" as const, error: `CallMeBot ${response.status}`, channel: "callmebot" };
    return { status: "sent" as const, error: "", channel: "callmebot" };
  }
  return { status: "waiting" as const, error: "还没有 WhatsApp 发送密钥", channel: "whatsapp" };
}
