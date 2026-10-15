import { locales, type Locale } from "@/i18n/config";

const LOCALE_KEYS = new Set<string>(locales);
const LOCALE_TYPES = new Set(["localeString", "localeText", "localeBlockContent"]);

function isEmpty(value: unknown) {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function isLocaleObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (typeof record._type === "string" && LOCALE_TYPES.has(record._type)) return true;
  const keys = Object.keys(record).filter((key) => key !== "_type");
  return keys.length > 0 && keys.every((key) => LOCALE_KEYS.has(key));
}

/**
 * Recursively resolves every `{ en, pt }` field in a Sanity result to the requested
 * locale, falling back to English (then any available translation).
 */
export function localize<T>(value: unknown, locale: Locale): T {
  if (Array.isArray(value)) {
    return value.map((item) => localize(item, locale)) as T;
  }
  if (isLocaleObject(value)) {
    const preferred = value[locale];
    if (!isEmpty(preferred)) return preferred as T;
    for (const fallback of locales) {
      if (!isEmpty(value[fallback])) return value[fallback] as T;
    }
    return null as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      out[key] = localize(child, locale);
    }
    return out as T;
  }
  return value as T;
}
