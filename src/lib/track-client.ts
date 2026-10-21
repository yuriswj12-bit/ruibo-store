import { trackStoreEvent } from "@/lib/commerce.functions";

const IDLE = 30 * 60 * 1000;

function visitId(kind: "session" | "anon"): string {
  const key = kind === "session" ? "fc_visit_session" : "fc_visit_anon";
  const store = kind === "session" ? sessionStorage : localStorage;
  const raw = store.getItem(key);
  const parsed = raw ? (JSON.parse(raw) as { id?: string; seen?: number }) : null;
  const fresh = !parsed?.id || (kind === "session" && Date.now() - Number(parsed.seen || 0) > IDLE);
  const id = fresh ? crypto.randomUUID().replace(/-/g, "") : parsed.id!;
  store.setItem(key, JSON.stringify({ id, seen: Date.now() }));
  return id;
}

export function trackStore(eventName: "page_view" | "product_view" | "inquiry_button_click" | "inquiry_form_start" | "contact_whatsapp_click" | "contact_email_click", extra?: { sku?: string }) {
  const pagePath = window.location.pathname || "/";
  const sku = extra?.sku ?? pagePath.match(/^\/products\/([^/]+)/)?.[1];
  void trackStoreEvent({
    data: {
      eventName: sku && eventName === "page_view" ? "product_view" : eventName,
      eventId: crypto.randomUUID().replace(/-/g, ""),
      pagePath,
      sessionId: visitId("session"),
      anonymousId: visitId("anon"),
      sku,
      referrer: document.referrer || undefined,
    },
  }).catch(() => undefined);
}
