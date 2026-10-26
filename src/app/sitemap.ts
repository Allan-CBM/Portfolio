import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`]));

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
