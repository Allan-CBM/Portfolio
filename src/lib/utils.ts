import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { intlLocale, type Locale } from "@/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pad(value: number, length = 2) {
  return String(value).padStart(length, "0");
}

export function formatDate(date: string | null | undefined, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  if (!date) return "";
  return new Intl.DateTimeFormat(intlLocale[locale], options ?? { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(date),
  );
}

export function formatMonthYear(date: string | null | undefined, locale: Locale) {
  if (!date) return "";
  return new Intl.DateTimeFormat(intlLocale[locale], { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(date),
  );
}

/** Rough reading-time estimate for Portable Text. */
export function readingTime(blocks: unknown): number {
  if (!Array.isArray(blocks)) return 1;
  const words = blocks
    .flatMap((block) => (block && typeof block === "object" && "children" in block ? (block.children as unknown[]) : []))
    .map((child) => (child && typeof child === "object" && "text" in child ? String(child.text) : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Returns black or white depending on the luminance of a hex color. */
export function readableOn(hex: string | null | undefined) {
  if (!hex) return "#050505";
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#050505" : "#ffffff";
}

export function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}
