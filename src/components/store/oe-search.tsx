import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { searchCatalog, type ProductCard } from "@/lib/commerce.functions";
import { sensorTitle, useI18n, vehicleLabel } from "@/lib/i18n";
import { catalogSearch, lineImage } from "@/components/store/catalog";
import { shownOem } from "@/lib/oe";

export function OeSearch({ large = false }: { large?: boolean }) {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ProductCard[]>([]);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setItems([]);
      return;
    }
    const timer = setTimeout(() => {
      searchCatalog({ data: { q: query } })
        .then((rows) => setItems(rows.slice(0, 6)))
        .catch(() => setItems([]));
    }, 180);
    return () => clearTimeout(timer);
  }, [q]);

  function go(event: React.FormEvent) {
    event.preventDefault();
    setOpen(false);
    navigate({ to: "/products", search: catalogSearch({ q: q.trim() }) });
  }

  return (
    <form onSubmit={go} className="relative">
      <div className={`flex gap-2 ${large ? "" : ""}`}>
        <input
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("oemPlaceholder")}
          aria-label={t("findOem")}
          className={`w-full rounded-lg border border-line bg-card px-3 ${large ? "h-14 text-base" : "h-11"}`}
        />
        <button type="submit" className={`shrink-0 rounded-lg bg-ink px-4 text-copper-ink ${large ? "h-14" : "h-11"}`}>
          {t("findOem")}
        </button>
      </div>
      {open && q.trim().length >= 2 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-card border border-line bg-card shadow-lg">
          {items.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">{t("suggestEmpty")}</p>
          ) : (
            items.map((product) => {
              const oem = shownOem(product.oes, q);
              return (
              <Link
                key={product.sku}
                to="/products/$sku"
                params={{ sku: product.sku }}
                search={{ oe: oem }}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-t border-line px-3 py-2 first:border-t-0 hover:bg-paper"
              >
                <img src={lineImage("Automotive")} alt="" className="size-14 rounded-md object-cover" />
                <span className="min-w-0">
                  <span className="block font-medium">{oem}</span>
                  <span className="block truncate text-sm text-muted">
                    {vehicleLabel(lang, product.vehicle)}
                  </span>
                  <span className="sr-only">{sensorTitle(lang, product.vehicle, oem)}</span>
                </span>
              </Link>
              );
            })
          )}
          <button type="submit" className="block w-full border-t border-line px-4 py-2 text-left text-sm font-medium text-brass">
            {t("viewMatches")}
          </button>
        </div>
      )}
    </form>
  );
}
