import type { Locale } from "@/i18n/config";

/** A value written once per language. Every locale is required, so a missing translation fails typecheck. */
export type Localized<T = string> = Record<Locale, T>;
