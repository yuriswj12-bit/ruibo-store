"use client";

import { useState } from "react";

export function ProductRowActions({
  id,
  title,
  moq,
  samplePrice,
  isPublished,
}: {
  id: string;
  title: string;
  moq: number;
  samplePrice: string;
  isPublished: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  async function save(formData: FormData) {
    const res = await fetch("/api/v1/tenant/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title: formData.get("title"),
        moq: formData.get("moq"),
        samplePrice: formData.get("samplePrice"),
        isPublished: formData.get("isPublished") === "on",
      }),
    });
    setMsg(res.ok ? "已保存" : "保存失败");
    if (res.ok) {
      setOpen(false);
      window.location.reload();
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 13 }}>
        编辑
      </button>
    );
  }

  return (
    <form action={save} style={{ display: "grid", gap: 6, minWidth: 220 }}>
      <input name="title" defaultValue={title} required />
      <input name="moq" type="number" defaultValue={moq} required />
      <input name="samplePrice" defaultValue={samplePrice} required />
      <label style={{ fontSize: 13 }}>
        <input name="isPublished" type="checkbox" defaultChecked={isPublished} /> 上架
      </label>
      <div style={{ display: "flex", gap: 6 }}>
        <button type="submit">保存</button>
        <button type="button" onClick={() => setOpen(false)}>取消</button>
      </div>
      {msg && <span className="sku">{msg}</span>}
    </form>
  );
}
