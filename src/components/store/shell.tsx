import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LANGS, useI18n } from "@/lib/i18n";
import { LINES, catalogSearch } from "@/components/store/catalog";
import { OeSearch } from "@/components/store/oe-search";

export function StoreShell({
  name,
  email,
  showSearch = true,
  children,
}: {
  name: string;
  email?: string;
  showSearch?: boolean;
  children: React.ReactNode;
}) {
  const { t, lang, setLang } = useI18n();
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-ink text-copper-ink">
        <div className="wrap flex min-h-10 items-center justify-between gap-3 text-sm">
          <span className="truncate">{t("banner")}</span>
          <span className="hidden sm:inline">{email}</span>
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b border-line bg-card">
        <div className="wrap flex min-h-14 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center">
            <img src="/rbtc-logo.png" alt={name} className="h-11 w-auto sm:h-12" />
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
            <label className="sr-only" htmlFor="lang">{t("language")}</label>
            <select
              id="lang"
              value={lang}
              aria-label={t("language")}
              onChange={(event) => setLang(event.target.value as typeof lang)}
              className="h-9 rounded-lg border border-line bg-card px-2"
            >
              {LANGS.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
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
      <footer className="mt-12 border-t border-line bg-ink py-10 text-sm text-white/80">
        <div className="wrap grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-base text-white">{name}</p>
            <p className="mt-2 max-w-md">{t("footerCompany")}</p>
            {email ? <p className="mt-3">{email}</p> : null}
          </div>
          <div>
            <p className="text-white">{t("navProducts")}</p>
            <ul className="mt-2 grid gap-1">
              {LINES.map((line) => (
                <li key={line.id}>
                  <Link to="/products" search={catalogSearch({ line: line.id })} className="hover:text-white">{t(line.title)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white">{t("navAbout")}</p>
            <ul className="mt-2 grid gap-1">
              <li><Link to="/about" className="hover:text-white">{t("navAbout")}</Link></li>
              <li><Link to="/manufacturing" className="hover:text-white">{t("navMfg")}</Link></li>
              <li><Link to="/downloads" className="hover:text-white">{t("navDownloads")}</Link></li>
              <li><Link to="/contact" className="hover:text-white">{t("navContact")}</Link></li>
              <li><Link to="/faq" className="hover:text-white">{t("navFaq")}</Link></li>
              <li><Link to="/privacy" className="hover:text-white">{t("navPrivacy")}</Link></li>
              <li><Link to="/terms" className="hover:text-white">{t("navTerms")}</Link></li>
            </ul>
          </div>
        </div>
      </footer>
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
