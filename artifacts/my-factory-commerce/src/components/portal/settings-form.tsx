"use client";

import { useState } from "react";

export function SettingsForm({
  settings,
  customDomain,
}: {
  settings: Record<string, string>;
  customDomain: string;
}) {
  const [message, setMessage] = useState("");

  async function save(formData: FormData) {
    const res = await fetch("/api/v1/tenant/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        logoUrl: formData.get("logoUrl"),
        primaryColor: formData.get("primaryColor"),
        contactEmail: formData.get("contactEmail"),
        whatsappNumber: formData.get("whatsappNumber"),
        feishuWebhookUrl: formData.get("feishuWebhookUrl"),
        customDomain: formData.get("customDomain"),
      }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Saved" : data.error || "SAVE_FAILED");
  }

  return (
    <form action={save} className="panel form-grid" style={{ padding: 20 }}>
      <label>Logo URL<input name="logoUrl" defaultValue={settings.logoUrl || ""} placeholder="https://..." /></label>
      <label>主色<input name="primaryColor" defaultValue={settings.primaryColor || "#9a3412"} placeholder="#9a3412" /></label>
      <label>联系邮箱<input name="contactEmail" defaultValue={settings.contactEmail || ""} placeholder="sales@factory.com" /></label>
      <label>WhatsApp<input name="whatsappNumber" defaultValue={settings.whatsappNumber || ""} placeholder="+86..." /></label>
      <label>飞书 Webhook<input name="feishuWebhookUrl" defaultValue={settings.feishuWebhookUrl || ""} placeholder="https://open.feishu.cn/..." /></label>
      <label>独立域名<input name="customDomain" defaultValue={customDomain} placeholder="www.factory.com" /></label>
      <button type="submit" className="btn btn-primary">保存设置</button>
      {message && <p className="sku">{message}</p>}
    </form>
  );
}
