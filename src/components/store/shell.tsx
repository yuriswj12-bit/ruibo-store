import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LANGS, useI18n } from "@/lib/i18n";
import { LINES, catalogSearch } from "@/components/store/catalog";
import { OeSearch } from "@/components/store/oe-search";

export function StoreShell({
  name,
  email,
  whatsapp,
  showSearch = true,
  children,
}: {
  name: string;
  email?: string;
  whatsapp?: string;
  showSearch?: boolean;
  children: React.ReactNode;
}) {
  const { t, lang, setLang } = useI18n();
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-card">
        <div className="wrap flex min-h-14 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center">
            <img src="/rbtc-logo-navy.png" alt={name} className="h-14 w-auto sm:h-16" />
          </Link>
          <nav className="hidden items-center gap-4 text-sm lg:flex">
            <Link to="/" className="hover:text-copper">{t("navHome")}</Link>
            <span className="group relative">
              <Link to="/products" search={catalogSearch()} className="hover:text-copper">{t("navProducts")}</Link>
              <div className="absolute left-0 top-full z-40 hidden pt-2 group-hover:block">
                <div className="grid w-52 gap-1 rounded-card border border-line bg-card p-2 text-ink shadow-lg">
                  {LINES.map((line) => (
                    <Link key={line.id} to="/products" search={catalogSearch({ line: line.id })} className="rounded-md px-2 py-2 hover:bg-paper">
                      {t(line.title)}
                    </Link>
                  ))}
                </div>
              </div>
            </span>
            <Link to="/manufacturing" className="hover:text-copper">{t("navMfg")}</Link>
            <Link to="/downloads" className="hover:text-copper">{t("navDownloads")}</Link>
            <Link to="/about" className="hover:text-copper">{t("navAbout")}</Link>
            <Link to="/contact" className="hover:text-copper">{t("navContact")}</Link>
          </nav>
          <div className="flex items-center gap-2 text-sm sm:gap-3">
            <div className="flex items-center rounded-full border border-line p-0.5" role="group" aria-label={t("language")}>
              {LANGS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={lang === item.id}
                  onClick={() => setLang(item.id)}
                  className={lang === item.id
                    ? "rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white"
                    : "rounded-full px-2.5 py-1 text-xs text-muted"}
                >
                  {item.id === "zh" ? "中文" : item.id === "en" ? "EN" : item.id === "es" ? "ES" : "PT"}
                </button>
              ))}
            </div>
            <AuthSlot />
          </div>
        </div>
        <div className="wrap flex gap-2 overflow-x-auto pb-2 text-sm lg:hidden">
          <Link to="/" className="shrink-0 rounded-full border border-line px-3 py-1">{t("navHome")}</Link>
          <Link to="/products" search={catalogSearch()} className="shrink-0 rounded-full border border-line px-3 py-1">{t("navProducts")}</Link>
          <Link to="/manufacturing" className="shrink-0 rounded-full border border-line px-3 py-1">{t("navMfg")}</Link>
          <Link to="/downloads" className="shrink-0 rounded-full border border-line px-3 py-1">{t("navDownloads")}</Link>
          <Link to="/about" className="shrink-0 rounded-full border border-line px-3 py-1">{t("navAbout")}</Link>
          <Link to="/contact" className="shrink-0 rounded-full border border-line px-3 py-1">{t("navContact")}</Link>
        </div>
        {showSearch && (
          <div className="wrap pb-3">
            <OeSearch />
          </div>
        )}
      </header>
      {children}
      <footer className="bg-[#17182b] text-sm text-white/70">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <img src="/rbtc-logo-navy.png" alt={name} className="h-14 w-auto rounded-md bg-white px-2" />
            <p className="mt-4 max-w-sm leading-6">{t("footerBlurb")}</p>
            <ul className="mt-5 grid gap-2">
              <li>{email || "info@cnrbic.com"}</li>
              <li>{t("footerPhone")}</li>
              <li className="max-w-xs">{t("footerAddress")}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">{t("footerProducts")}</p>
            <ul className="mt-3 grid gap-2">
              {LINES.map((line) => (
                <li key={line.id}>
                  <Link to="/products" search={catalogSearch({ line: line.id })} className="hover:text-white">{t(line.title)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">{t("footerCol")}</p>
            <ul className="mt-3 grid gap-2">
              <li><Link to="/about" className="hover:text-white">{t("navAbout")}</Link></li>
              <li><Link to="/manufacturing" className="hover:text-white">{t("navMfg")}</Link></li>
              <li><Link to="/downloads" className="hover:text-white">{t("navDownloads")}</Link></li>
              <li><Link to="/contact" className="hover:text-white">{t("navContact")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="wrap flex flex-wrap items-center justify-between gap-3 py-4 text-xs">
            <p>{t("footerCopy")}</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-white">{t("navPrivacy")}</Link>
              <Link to="/terms" className="hover:text-white">{t("navTerms")}</Link>
              <Link to="/faq" className="hover:text-white">{t("navFaq")}</Link>
            </div>
          </div>
        </div>
      </footer>
      <SideDock email={email} whatsapp={whatsapp} />
    </div>
  );
}

function SideDock({ email, whatsapp }: { email?: string; whatsapp?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  const mail = email || "info@cnrbic.com";
  const wa = (whatsapp || "8613706647066").replace(/\D/g, "");
  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${wa}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10.1 10.1 0 0 0 4.65 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.78 13.9c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.64-.61-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.36c.24-.28.64-.41 1.02-.41.12 0 .23 0 .33.01.3.01.45.03.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.16-.3.37-.42.49-.14.14-.28.29-.12.56.16.28.72 1.18 1.54 1.91 1.06.95 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.38-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
        </svg>
      </a>
      <a
        href={`mailto:${mail}`}
        aria-label="Email"
        className="grid size-12 place-items-center rounded-full bg-[#6d5ce7] text-white shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </a>
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="grid size-12 place-items-center rounded-full bg-[#2b2b2b] text-white shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function AuthSlot() {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <span className="inline-block h-8 w-16 animate-pulse rounded-full bg-line" />;
  if (user) {
    return (
      <SignedIn>
        <UserButton />
      </SignedIn>
    );
  }
  return (
    <SignedOut>
      <Link to="/login" className="rounded-full bg-ink px-3 py-2 text-copper-ink">{t("signIn")}</Link>
    </SignedOut>
  );
}
