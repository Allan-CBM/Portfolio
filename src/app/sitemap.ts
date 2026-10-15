import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import { fetchStatic } from "@/sanity/lib/fetch";
import { postSlugsQuery, projectSlugsQuery } from "@/sanity/lib/queries";

type SlugRow = { slug: string; _updatedAt: string };

export const revalidate = 3600;

function entry(path: string, lastModified: Date, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) {
  return {
    url: `${siteUrl}/en${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])) },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    fetchStatic<SlugRow[]>({ query: projectSlugsQuery }),
    fetchStatic<SlugRow[]>({ query: postSlugsQuery }),
  ]);
  const now = new Date();

  return [
    entry("", now, 1, "weekly"),
    entry("/projects", now, 0.9, "weekly"),
    entry("/journal", now, 0.7, "weekly"),
    ...(projects ?? []).map((p) => entry(`/projects/${p.slug}`, new Date(p._updatedAt), 0.8, "monthly")),
    ...(posts ?? []).map((p) => entry(`/journal/${p.slug}`, new Date(p._updatedAt), 0.6, "monthly")),
  ];
}
