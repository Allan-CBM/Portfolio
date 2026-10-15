"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALE_COOKIE, localeLabels, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  const pathname = usePathname() || `/${locale}`;

  const hrefFor = (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  };

  const remember = (target: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1 font-display text-xs", className)}>
      {locales.map((target, i) => (
        <span key={target} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className="text-foreground/30">
              /
            </span>
          )}
          <Link
            href={hrefFor(target)}
            hrefLang={target}
            onClick={() => remember(target)}
            aria-current={target === locale ? "true" : undefined}
            className={cn(
              "rounded px-1 py-0.5 tracking-[0.14em] transition-colors",
              target === locale ? "text-foreground" : "text-foreground/45 hover:text-foreground",
            )}
            scroll={false}
          >
            {localeLabels[target]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
