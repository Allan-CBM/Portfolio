import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

import { imageField } from "../objects/media";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "hero", title: "Hero" },
    { name: "about", title: "About" },
    { name: "contact", title: "Contact & Social" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      group: "general",
      initialValue: "Allan Martins",
    }),
    defineField({
      name: "availability",
      title: "Availability badge",
      type: "localeString",
      group: "general",
      description: 'e.g. "Available for new projects — 2026"',
    }),

    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "localeText",
      group: "hero",
      description: "Use line breaks to control the typographic rhythm.",
    }),
    defineField({ name: "heroSubline", title: "Hero supporting text", type: "localeText", group: "hero" }),

    defineField({ name: "aboutHeading", title: "About heading", type: "localeText", group: "about" }),
    defineField({ name: "aboutBody", title: "About story", type: "localeBlockContent", group: "about" }),
    imageField({ name: "portrait", title: "Portrait", group: "about" }),
    defineField({
      name: "stats",
      title: "Counters",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Value", type: "number", validation: (r) => r.required() }),
            defineField({ name: "prefix", title: "Prefix", type: "string" }),
            defineField({ name: "suffix", title: "Suffix", type: "string" }),
            defineField({ name: "label", title: "Label", type: "localeString" }),
          ],
          preview: {
            select: { value: "value", prefix: "prefix", suffix: "suffix", label: "label.en" },
            prepare: ({ value, prefix, suffix, label }) => ({
              title: `${prefix ?? ""}${value}${suffix ?? ""}`,
              subtitle: label,
            }),
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "skillGroups",
      title: "Skill groups (marquee)",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "skillGroup",
          fields: [
            defineField({ name: "title", title: "Group", type: "localeString" }),
            defineField({
              name: "items",
              title: "Skills",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: { layout: "tags" },
            }),
          ],
          preview: { select: { title: "title.en" } },
        }),
      ],
    }),

    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url", group: "contact" }),
    defineField({ name: "behance", title: "Behance", type: "url", group: "contact" }),
    defineField({ name: "instagram", title: "Instagram", type: "url", group: "contact" }),

    defineField({ name: "seoDescription", title: "Default meta description", type: "localeText", group: "seo" }),
    imageField({ name: "ogImage", title: "Default social image", group: "seo", description: "1200×630" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
