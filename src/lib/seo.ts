import type { Metadata } from "next";

import { locales, ogLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site, siteUrl } from "./site";

type BuildMetadataInput = {
  locale: Locale;
  /** Path without the locale prefix, e.g. "/projects/foo" or "" */
  path: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  absoluteTitle?: boolean;
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  absoluteTitle,
}: BuildMetadataInput): Metadata {
  const dict = getDictionary(locale);
  const desc = description || dict.meta.description;
  const url = `${siteUrl}/${locale}${path}`;
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`]));

  return {
    title: title ? (absoluteTitle ? { absolute: title } : title) : { absolute: dict.meta.title },
    description: desc,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": `${siteUrl}/en${path}` },
    },
    openGraph: {
      type,
      url,
      siteName: site.name,
      title: title || dict.meta.title,
      description: desc,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
      ...(type === "article" && publishedTime ? { publishedTime, modifiedTime: modifiedTime ?? undefined } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title || dict.meta.title,
      description: desc,
      ...(image ? { images: [image] } : {}),
    },
  };
}
