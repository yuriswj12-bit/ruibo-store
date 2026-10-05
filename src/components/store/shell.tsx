import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LANGS, useI18n, vehicleLabel } from "@/lib/i18n";
import { LINES, MAKES, catalogSearch } from "@/components/store/catalog";
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
          <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <span className="inline-block size-7 rounded-sm bg-copper" aria-hidden />
            <span className="max-w-[10rem] truncate sm:max-w-none">{name}</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm lg:flex">
            <Link to="/products" search={catalogSearch()} className="hover:text-copper">{t("catalog")}</Link>
            {LINES.map((line) => (
              <span key={line.id} className="group relative">
                <Link to="/products" search={catalogSearch({ line: line.id })} className="hover:text-copper">
                  {t(line.title)}
                </Link>
                {line.id === "Automotive" && (
                  <div className="absolute left-0 top-full z-40 hidden pt-2 group-hover:block">
                    <div className="grid w-52 gap-1 rounded-card border border-line bg-card p-2 shadow-lg">
                    {MAKES.map((make) => (
                      <Link
                        key={make}
                        to="/products"
                        search={catalogSearch({ make, line: "Automotive" })}
                        className="rounded-md px-2 py-2 hover:bg-paper"
                      >
                        {vehicleLabel(lang, make)}
                      </Link>
                    ))}
                  </div>
                  </div>
                )}
              </span>
            ))}
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
          <Link to="/products" search={catalogSearch()} className="shrink-0 rounded-full border border-line px-3 py-1">{t("catalog")}</Link>
          {LINES.map((line) => (
            <Link key={line.id} to="/products" search={catalogSearch({ line: line.id })} className="shrink-0 rounded-full border border-line px-3 py-1">
              {t(line.title)}
            </Link>
          ))}
        </div>
        {showSearch && (
          <div className="wrap pb-3">
            <OeSearch />
          </div>
        )}
      </header>
      {children}
      <footer className="mt-12 border-t border-line py-8 text-sm text-muted">
        <div className="wrap">
          <p>{t("footerCompany")}</p>
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
