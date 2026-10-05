"use client";

import { useState } from "react";

type Row = Record<string, string>;

function parseCsv(text: string): Row[] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map((cell) => cell.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, (cells[index] || "").trim()]));
  });
}

export function ExcelUploader({ tenantId }: { tenantId: string }) {
  const [message, setMessage] = useState("");

  async function onFile(file: File) {
    const text = await file.text();
    const rows = parseCsv(text);
    const res = await fetch("/api/v1/tenant/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
      body: JSON.stringify({ rows }),
    });
    const data = await res.json();
    setMessage(res.ok ? `Imported ${data.count} rows` : data.error || "IMPORT_FAILED");
    if (res.ok) window.location.reload();
  }

  return (
    <form className="panel" style={{ padding: 16, margin: "12px 0 20px" }}>
      <p>CSV 列：SKU, Title, PriceRange, MOQ, SamplePrice, OE_Numbers, Fitment_Year, Fitment_Make, Fitment_Model, Fitment_Engine。其余列写入 specifications。</p>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      {message && <p>{message}</p>}
    </form>
  );
}
