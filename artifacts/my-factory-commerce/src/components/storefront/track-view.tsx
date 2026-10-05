"use client";

import { useEffect } from "react";

export function TrackView({ tenantId, path }: { tenantId: string; path: string }) {
  useEffect(() => {
    fetch("/api/v1/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
      body: JSON.stringify({ tenantId, eventType: "pv", path }),
    }).catch(() => undefined);
  }, [tenantId, path]);
  return null;
}
