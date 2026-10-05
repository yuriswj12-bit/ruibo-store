"use client";

import { useState } from "react";

export function SettingsForm({
  tenantId,
  settings,
  customDomain,
}: {
  tenantId: string;
  settings: Record<string, string>;
  customDomain: string;
}) {
  const [message, setMessage] = useState("");

  async function save(formData: FormData) {
    const res = await fetch("/api/v1/tenant/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
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
    <form action={save} className="panel" style={{ padding: 16, display: "grid", gap: 8, maxWidth: 560 }}>
      <input name="logoUrl" defaultValue={settings.logoUrl || ""} placeholder="Logo URL" />
      <input name="primaryColor" defaultValue={settings.primaryColor || "#9a3412"} placeholder="#9a3412" />
      <input name="contactEmail" defaultValue={settings.contactEmail || ""} placeholder="sales@factory.com" />
      <input name="whatsappNumber" defaultValue={settings.whatsappNumber || ""} placeholder="WhatsApp" />
      <input name="feishuWebhookUrl" defaultValue={settings.feishuWebhookUrl || ""} placeholder="Feishu webhook" />
      <input name="customDomain" defaultValue={customDomain} placeholder="www.factory.com" />
      <button type="submit">保存</button>
      {message && <p>{message}</p>}
    </form>
  );
}
