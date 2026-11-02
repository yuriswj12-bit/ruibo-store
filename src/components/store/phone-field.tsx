import { useEffect, useId, useMemo, useRef, useState, type ClipboardEvent } from "react";
import { createPortal } from "react-dom";
import { CALLING_COUNTRIES, type CallingCountry } from "@/lib/calling-codes";
import { useI18n, type Lang } from "@/lib/i18n";

const PINNED = ["CN", "HK", "MO", "TW"];

const COPY: Record<Lang, { search: string; empty: string; list: string; current: string }> = {
  zh: { search: "搜索国家、地区或区号", empty: "没有匹配的国家或地区", list: "国家或地区", current: "国家或地区" },
  en: { search: "Search country or code", empty: "No matching country", list: "Country or region", current: "Country or region" },
  es: { search: "Buscar país o código", empty: "Sin resultados", list: "País o región", current: "País o región" },
  pt: { search: "Pesquisar país ou código", empty: "Sem resultados", list: "País ou região", current: "País ou região" },
  ru: { search: "Страна или код", empty: "Ничего не найдено", list: "Страна или регион", current: "Страна или регион" },
  mn: { search: "Улс эсвэл код хайх", empty: "Олдсонгүй", list: "Улс, бүс", current: "Улс, бүс" },
  ar: { search: "ابحث عن الدولة أو الرمز", empty: "لا توجد نتائج", list: "الدولة أو المنطقة", current: "الدولة أو المنطقة" },
};

function labelOf(country: CallingCountry, lang: Lang, names: Intl.DisplayNames | null) {
  if (lang === "zh") return country.zh;
  if (!names) return country.en;
  try {
    return names.of(country.iso) || country.en;
  } catch {
    return country.en;
  }
}

export function PhoneField({
  name = "phone",
  placeholder,
  card = false,
}: {
  name?: string;
  placeholder?: string;
  card?: boolean;
}) {
  const { lang, t } = useI18n();
  const copy = COPY[lang];
  const [iso, setIso] = useState("CN");
  const [local, setLocal] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [box, setBox] = useState<{ fieldTop: number; fieldBottom: number; left: number; width: number; up: boolean } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const names = useMemo(() => {
    if (lang === "zh") return null;
    try {
      return new Intl.DisplayNames([lang, "en"], { type: "region" });
    } catch {
      return null;
    }
  }, [lang]);

  const ordered = useMemo(() => {
    const byIso = new Map(CALLING_COUNTRIES.map((country) => [country.iso, country]));
    const pinned = PINNED.map((code) => byIso.get(code)).filter((country): country is CallingCountry => Boolean(country));
    const rest = CALLING_COUNTRIES.filter((country) => !PINNED.includes(country.iso)).sort((a, b) =>
      labelOf(a, lang, names).localeCompare(labelOf(b, lang, names), lang === "zh" ? "zh" : lang),
    );
    return [...pinned, ...rest];
  }, [lang, names]);

  const country = ordered.find((entry) => entry.iso === iso) ?? ordered[0];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase().replace(/^\+/, "");
    if (!needle) return ordered;
    return ordered.filter((entry) => {
      const name = labelOf(entry, lang, names).toLowerCase();
      return (
        name.includes(needle) ||
        entry.zh.toLowerCase().includes(needle) ||
        entry.en.toLowerCase().includes(needle) ||
        entry.iso.toLowerCase().includes(needle) ||
        entry.dial.startsWith(needle)
      );
    });
  }, [ordered, query, lang, names]);
  const full = local.trim() ? `+${country.dial} ${local.trim()}` : "";

  useEffect(() => {
    if (!open) return;
    function place() {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const spaceBelow = window.innerHeight - rect.bottom;
      setBox({
        fieldTop: rect.top,
        fieldBottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        up: spaceBelow < 280 && rect.top > spaceBelow,
      });
    }
    function onPointer(event: MouseEvent) {
      const node = event.target as Node;
      if (rootRef.current?.contains(node) || popRef.current?.contains(node)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    place();
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  function choose(next: CallingCountry) {
    setIso(next.iso);
    setOpen(false);
    setQuery("");
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text").trim();
    if (!text.startsWith("+") && !text.startsWith("00")) return;
    event.preventDefault();
    const digits = text.replace(/^00/, "").replace(/^\+/, "").replace(/\D/g, "");
    const matches = ordered.filter((entry) => digits.startsWith(entry.dial));
    if (matches.length === 0) {
      setLocal(digits.slice(0, 20));
      return;
    }
    const longest = matches.reduce((max, entry) => Math.max(max, entry.dial.length), 0);
    const tied = matches.filter((entry) => entry.dial.length === longest);
    const match =
      tied.find((entry) => entry.iso === iso) ||
      tied.find((entry) => entry.iso === "US") ||
      tied.find((entry) => entry.iso === "RU") ||
      tied[0];
    setIso(match.iso);
    setLocal(digits.slice(match.dial.length, match.dial.length + 20));
  }

  const shell = card ? "h-12 border-[#e6e8ee] bg-white" : "h-11 border-line bg-white";

  return (
    <div ref={rootRef} className="relative" dir="ltr">
      <div className={`flex w-full items-center rounded-lg border ${shell}`}>
        <button
          type="button"
          className="flex h-full shrink-0 items-center gap-1 px-2.5 text-sm text-[#1a1a2e]"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`${copy.current} ${labelOf(country, lang, names)} +${country.dial}`}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="text-base leading-none" aria-hidden>
            {country.flag}
          </span>
          <span className="tabular-nums">+{country.dial}</span>
          <svg viewBox="0 0 12 12" className="size-3 text-[#8b93a1]" aria-hidden>
            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="h-5 w-px shrink-0 bg-[#e6e8ee]" aria-hidden />
        <input
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#b0b6c0]"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={placeholder}
          aria-label={placeholder || t("fieldPhone")}
          value={local}
          onChange={(event) => setLocal(event.target.value.replace(/[^\d\s()-]/g, "").slice(0, 20))}
          onPaste={onPaste}
        />
      </div>
      <input type="hidden" name={name} value={full} />
      {open && box
        ? createPortal(
            <div
              ref={popRef}
              dir="ltr"
              style={{
                position: "fixed",
                left: box.left,
                width: box.width,
                zIndex: 80,
                top: box.up ? undefined : box.fieldBottom + 4,
                bottom: box.up ? window.innerHeight - box.fieldTop + 4 : undefined,
              }}
              className="overflow-hidden rounded-lg border border-[#e6e8ee] bg-white shadow-xl"
            >
              <div className="border-b border-[#e6e8ee] p-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      if (filtered[0]) choose(filtered[0]);
                    }
                  }}
                  placeholder={copy.search}
                  aria-label={copy.search}
                  className="h-10 w-full rounded-md border border-[#e6e8ee] px-3 text-sm outline-none placeholder:text-[#b0b6c0]"
                />
              </div>
              <ul id={listId} role="listbox" aria-label={copy.list} className="max-h-60 overflow-auto py-1">
                {filtered.length === 0 ? (
                  <li className="px-3 py-3 text-sm text-[#8b93a1]">{copy.empty}</li>
                ) : (
                  filtered.map((entry) => {
                    const selected = entry.iso === country.iso;
                    return (
                      <li key={entry.iso} role="option" aria-selected={selected}>
                        <button
                          type="button"
                          className={
                            selected
                              ? "flex h-10 w-full items-center gap-2 bg-[#fff1f2] px-3 text-left text-sm text-[#1a1a2e]"
                              : "flex h-10 w-full items-center gap-2 px-3 text-left text-sm text-[#1a1a2e] hover:bg-[#f7f8fc]"
                          }
                          onClick={() => choose(entry)}
                        >
                          <span className="text-base leading-none" aria-hidden>
                            {entry.flag}
                          </span>
                          <span className="min-w-0 flex-1 truncate">{labelOf(entry, lang, names)}</span>
                          <span className="shrink-0 tabular-nums text-[#8b93a1]">+{entry.dial}</span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
