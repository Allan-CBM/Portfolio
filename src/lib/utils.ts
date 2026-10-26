import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { intlLocale, type Locale } from "@/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pad(value: number, length = 2) {
  return String(value).padStart(length, "0");
}

export function formatMonthYear(date: string | null | undefined, locale: Locale) {
  if (!date) return "";
  return new Intl.DateTimeFormat(intlLocale[locale], { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(date),
  );
}
