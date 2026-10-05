"use client";

import { canTransitionInquiry } from "@/lib/inquiry-status";

const nextStatus = ["contacted", "quoted", "closed"];

export function InquiryStatusForm({ id, status, tenantId }: { id: string; status: string; tenantId: string }) {
  async function update(value: string) {
    await fetch("/api/v1/tenant/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
      body: JSON.stringify({ id, status: value }),
    });
    window.location.reload();
  }

  return (
    <select defaultValue={status} onChange={(event) => update(event.target.value)}>
      <option value={status}>{status}</option>
      {nextStatus.filter((item) => canTransitionInquiry(status, item)).map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
  );
}
