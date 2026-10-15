import "server-only";

import type { QueryParams } from "next-sanity";

import type { Locale } from "@/i18n/config";
import { isSanityConfigured } from "../env";
import { client } from "./client";
import { sanityFetch } from "./live";
import { localize } from "./localize";

type FetchOptions = {
  query: string;
  params?: QueryParams;
  locale?: Locale;
};

/**
 * Request-time fetch used by pages. Live-updating, draft-aware (Presentation / Draft Mode)
 * and locale-resolved. Returns `null` when Sanity isn't configured or the request fails,
 * so the site still renders its non-CMS sections.
 */
export async function fetchSanity<T>({ query, params = {}, locale }: FetchOptions): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    const { data } = await sanityFetch({ query, params });
    return locale ? localize<T>(data, locale) : (data as T);
  } catch (error) {
    console.error("[sanity] fetch failed:", error);
    return null;
  }
}

/**
 * Build-time fetch (generateStaticParams, sitemap, metadata). Published content only, no stega.
 */
export async function fetchStatic<T>({ query, params = {}, locale }: FetchOptions): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    const data = await client.fetch<T>(query, params, {
      perspective: "published",
      stega: false,
      next: { revalidate: 60 },
    });
    return locale ? localize<T>(data, locale) : data;
  } catch (error) {
    console.error("[sanity] static fetch failed:", error);
    return null;
  }
}
