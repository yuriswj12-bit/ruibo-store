"use client";

import { useState } from "react";

export function TenantCreateForm() {
  const [message, setMessage] = useState("");

  async function create(formData: FormData) {
    const res = await fetch("/api/v1/super-admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-role": "super_admin" },
      body: JSON.stringify({
        name: formData.get("name"),
        slug: formData.get("slug"),
        industryPreset: formData.get("industryPreset"),
        customDomain: formData.get("customDomain"),
      }),
    });
    const data = await res.json();
    setMessage(res.ok ? `Opened ${data.slug}` : data.error || "CREATE_FAILED");
    if (res.ok) window.location.reload();
  }

  return (
    <form action={create} className="panel" style={{ padding: 16, display: "grid", gap: 8, maxWidth: 560, marginBottom: 16 }}>
      <input name="name" required placeholder="工厂名称" />
      <input name="slug" required placeholder="xinda-sensor" />
      <select name="industryPreset" defaultValue="auto_parts">
        <option value="auto_parts">auto_parts</option>
        <option value="lighting">lighting</option>
        <option value="footwear">footwear</option>
      </select>
      <input name="customDomain" placeholder="www.factory.com" />
      <button type="submit">开通</button>
      {message && <p>{message}</p>}
    </form>
  );
}
