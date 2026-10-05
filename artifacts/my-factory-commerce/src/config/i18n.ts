export const SUPPORTED_LOCALES = ["en", "es", "de", "fr", "pt", "ar", "ru"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

const COUNTRY_LOCALE: Record<string, Locale> = {
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  DE: "de",
  AT: "de",
  FR: "fr",
  PT: "pt",
  BR: "pt",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  RU: "ru",
};

export function detectLocale(input: {
  country?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  const country = input.country?.toUpperCase();
  if (country && COUNTRY_LOCALE[country]) return COUNTRY_LOCALE[country];

  const accept = input.acceptLanguage?.toLowerCase() ?? "";
  for (const part of accept.split(",")) {
    const tag = part.split(";")[0]?.trim().slice(0, 2);
    if (tag && isLocale(tag)) return tag;
  }
  return DEFAULT_LOCALE;
}
