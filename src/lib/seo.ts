import type { Metadata } from "next";

import { locales, ogLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site, siteUrl } from "./site";

type BuildMetadataInput = {
  locale: Locale;
  /** Path without the locale prefix ("" for the home page). */
  path: string;
};

/** Title, description, canonical, hreflang, Open Graph and Twitter tags for a page. */
export function buildMetadata({ locale, path }: BuildMetadataInput): Metadata {
  const dict = getDictionary(locale);
  const { title, description } = dict.meta;
  const url = `${siteUrl}/${locale}${path}`;
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`]));

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": `${siteUrl}/en${path}` },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
