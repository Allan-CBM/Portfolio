import { defineArrayMember, defineField, defineType } from "sanity";
import { CaseIcon, StarFilledIcon } from "@sanity/icons";

import { requireDefaultLocale } from "../objects/locale";
import { galleryImageMember, imageField, videoFileField } from "../objects/media";
import { pageBuilderField } from "../blocks";

export const projectCategories = [
  { title: "Brand Identity", value: "brand-identity" },
  { title: "Product Design", value: "product-design" },
  { title: "Graphic Design", value: "graphic-design" },
  { title: "Motion Design", value: "motion-design" },
  { title: "Social Media", value: "social-media" },
  { title: "Presentation Design", value: "presentation-design" },
  { title: "Creative Direction", value: "creative-direction" },
  { title: "AI Experiment", value: "ai-experiment" },
];

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "story", title: "Case Study" },
    { name: "builder", title: "Page Builder" },
    { name: "media", title: "Media" },
    { name: "links", title: "Links & Proof" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── Overview
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      group: "overview",
      validation: requireDefaultLocale,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "overview",
      options: { source: "title.en", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "client", title: "Client", type: "string", group: "overview" }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "overview",
      validation: (rule) => rule.integer().min(2000).max(2100),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "overview",
      options: { list: projectCategories },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "overview",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "excerpt",
      title: "Short description",
      type: "localeText",
      group: "overview",
      description: "One or two lines used in the project hero and cards.",
    }),
    defineField({
      name: "projectColor",
      title: "Project color",
      type: "string",
      group: "overview",
      description: "Hex color used as the accent on the case study (e.g. #6EE7FF).",
      validation: (rule) =>
        rule.regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, { name: "hex color" }).warning(),
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      group: "overview",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "overview",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    // ── Case study (default template)
    defineField({ name: "challenge", title: "Challenge", type: "localeText", group: "story" }),
    defineField({ name: "research", title: "Research", type: "localeText", group: "story" }),
    defineField({
      name: "solution",
      title: "Solution / Creative process",
      type: "localeText",
      group: "story",
    }),
    defineField({ name: "results", title: "Results", type: "localeText", group: "story" }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      group: "story",
      of: [defineArrayMember({ type: "metric" })],
    }),

    // ── Page builder
    pageBuilderField("builder"),

    // ── Media
    imageField({
      name: "featuredImage",
      title: "Featured image",
      group: "media",
      description: "Main image used in listings and social sharing.",
      required: true,
    }),
    imageField({
      name: "coverImage",
      title: "Cover image",
      group: "media",
      description: "Full-bleed hero image on the case study. Falls back to the featured image.",
    }),
    imageField({
      name: "thumbnail",
      title: "Thumbnail",
      group: "media",
      description: "Optional card image (portrait works best). Falls back to the featured image.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [galleryImageMember],
      options: { layout: "grid" },
    }),
    videoFileField({ name: "video", title: "Video", group: "media" }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "media",
      description: "YouTube/Vimeo link — used when no video file is uploaded.",
    }),

    // ── Links & proof
    defineField({ name: "behanceUrl", title: "Behance URL", type: "url", group: "links" }),
    defineField({ name: "projectUrl", title: "Live project URL", type: "url", group: "links" }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "reference",
      group: "links",
      to: [{ type: "testimonial" }],
    }),

    // ── SEO
    defineField({ name: "seoTitle", title: "SEO title", type: "localeString", group: "seo" }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "localeText",
      group: "seo",
    }),
  ],
  orderings: [
    { title: "Published, newest", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "Year, newest", name: "yearDesc", by: [{ field: "year", direction: "desc" }] },
  ],
  preview: {
    select: {
      title: "title.en",
      client: "client",
      year: "year",
      featured: "featured",
      media: "thumbnail",
      fallbackMedia: "featuredImage",
    },
    prepare({ title, client, year, featured, media, fallbackMedia }) {
      return {
        title: title || "Untitled project",
        subtitle: [featured ? "★ Featured" : null, client, year].filter(Boolean).join(" · "),
        media: media || fallbackMedia || (featured ? StarFilledIcon : CaseIcon),
      };
    },
  },
});
