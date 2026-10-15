import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

const bothLocales = (path: string, title: string) => [
  { title: `${title} (EN)`, href: `/en${path}` },
  { title: `${title} (PT)`, href: `/pt${path}` },
];

const homeLocations = defineLocations({
  message: "This document is used on the homepage",
  tone: "positive",
  locations: bothLocales("", "Home"),
});

export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    { route: "/:locale/projects/:slug", filter: `_type == "project" && slug.current == $slug` },
    { route: "/:locale/journal/:slug", filter: `_type == "post" && slug.current == $slug` },
    { route: "/:locale", filter: `_type == "siteSettings" && _id == "siteSettings"` },
  ]),
  locations: {
    project: defineLocations({
      select: { title: "title.en", slug: "slug.current", featured: "featured" },
      resolve: (doc) => ({
        locations: [
          ...bothLocales(`/projects/${doc?.slug}`, doc?.title || "Untitled"),
          ...(doc?.featured ? bothLocales("", "Home") : []),
          { title: "Projects index", href: "/en/projects" },
        ],
      }),
    }),
    post: defineLocations({
      select: { title: "title.en", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          ...bothLocales(`/journal/${doc?.slug}`, doc?.title || "Untitled"),
          { title: "Journal", href: "/en/journal" },
        ],
      }),
    }),
    siteSettings: homeLocations,
    testimonial: homeLocations,
    experience: homeLocations,
    service: homeLocations,
  },
};
