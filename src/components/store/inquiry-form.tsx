import { useEffect, useState } from "react";
import { submitInquiry } from "@/lib/commerce.functions";
import { useI18n } from "@/lib/i18n";

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export function InquiryForm({
  sku,
  matchedOe,
  compact = false,
  hero = false,
}: {
  sku?: string;
  matchedOe?: string;
  compact?: boolean;
  hero?: boolean;
}) {
  const { t } = useI18n();
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (hero) setCode(makeCode());
  }, [hero]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (hero && String(form.get("code") || "").trim().toUpperCase() !== code) {
      setError(t("verifyWrong"));
      setCode(makeCode());
      return;
    }
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

  const field = hero
    ? "h-12 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none placeholder:text-muted/80"
    : "h-11 rounded-lg border border-line px-3";

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      {hero ? (
        <>
          <input name="name" required placeholder={t("phName")} className={field} />
          <input name="email" type="email" required placeholder={t("phEmail")} className={field} />
          <input name="company" placeholder={t("phCompany")} className={field} />
          <input name="phone" placeholder={t("phPhone")} className={field} />
          <textarea name="message" required rows={4} placeholder={t("phMessage")} className="w-full rounded-lg border border-line px-3 py-3 text-sm outline-none placeholder:text-muted/80" />
          <div className="flex gap-2">
            <input name="code" required placeholder={t("phCode")} autoComplete="off" className={field} />
            <span className="inline-flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-[#eceff3] text-lg font-semibold tracking-widest text-ink">{code}</span>
          </div>
        </>
      ) : (
        <>
          <label className="grid gap-1 text-sm">
            {t("fieldName")}
            <input name="name" required className={field} />
          </label>
          <label className="grid gap-1 text-sm">
            {t("fieldEmail")}
            <input name="email" type="email" required className={field} />
          </label>
          {!compact && (
            <label className="grid gap-1 text-sm">
              {t("fieldCompany")}
              <input name="company" className={field} />
            </label>
          )}
          <label className="grid gap-1 text-sm">
            {t("fieldPhone")}
            <input name="phone" className={field} />
          </label>
          <label className="grid gap-1 text-sm">
            {t("fieldMessage")}
            <textarea name="message" required rows={compact ? 3 : 4} className="rounded-lg border border-line px-3 py-2" />
          </label>
        </>
      )}
      {error && <p className="text-sm text-copper">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className={hero
          ? "inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#5b2dff] text-sm font-semibold text-white disabled:opacity-60"
          : "h-11 rounded-lg bg-ink px-4 text-copper-ink disabled:opacity-60"}
      >
        {hero && (
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
            <path d="M3 11.5 21 3l-7.5 18-2.2-7.3L3 11.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          </svg>
        )}
        {pending ? t("inquirySending") : t("inquirySubmit")}
      </button>
      {hero && <p className="text-center text-xs text-muted">{t("quoteSecure")}</p>}
    </form>
  );
}