import { useState } from "react";
import { submitInquiry } from "@/lib/commerce.functions";
import { useI18n } from "@/lib/i18n";

export function InquiryForm({
  sku,
  matchedOe,
  compact = false,
}: {
  sku?: string;
  matchedOe?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const result = await submitInquiry({
        data: {
          sku,
          matchedOe,
          customerName: String(form.get("name") || ""),
          customerEmail: String(form.get("email") || ""),
          country: String(form.get("company") || ""),
          whatsapp: String(form.get("phone") || ""),
          message: String(form.get("message") || ""),
        },
      });
      setDone(result.id.slice(0, 8));
      event.currentTarget.reset();
    } catch {
      setError(t("inquiryFail"));
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return <p className="rounded-lg bg-paper px-3 py-3 text-sm">{t("inquirySent", { id: done })}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label className="grid gap-1 text-sm">
        {t("fieldName")}
        <input name="name" required className="h-11 rounded-lg border border-line px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        {t("fieldEmail")}
        <input name="email" type="email" required className="h-11 rounded-lg border border-line px-3" />
      </label>
      {!compact && (
        <label className="grid gap-1 text-sm">
          {t("fieldCompany")}
          <input name="company" className="h-11 rounded-lg border border-line px-3" />
        </label>
      )}
      <label className="grid gap-1 text-sm">
        {t("fieldPhone")}
        <input name="phone" className="h-11 rounded-lg border border-line px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        {t("fieldMessage")}
        <textarea name="message" required rows={compact ? 3 : 4} className="rounded-lg border border-line px-3 py-2" />
      </label>
      {error && <p className="text-sm text-copper">{error}</p>}
      <button type="submit" disabled={pending} className="h-11 rounded-lg bg-ink px-4 text-copper-ink disabled:opacity-60">
        {pending ? t("inquirySending") : t("inquirySubmit")}
      </button>
    </form>
  );
}
