export const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = { en: "EN", pt: "PT" };
export const htmlLang: Record<Locale, string> = { en: "en", pt: "pt-BR" };
export const ogLocale: Record<Locale, string> = { en: "en_US", pt: "pt_BR" };
export const intlLocale: Record<Locale, string> = { en: "en-US", pt: "pt-BR" };

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
