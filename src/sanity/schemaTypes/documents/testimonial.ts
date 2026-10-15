import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons";

import { requireDefaultLocale } from "../objects/locale";
import { imageField } from "../objects/media";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "localeText",
      validation: requireDefaultLocale,
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "localeString" }),
    defineField({ name: "company", title: "Company", type: "string" }),
    imageField({ name: "avatar", title: "Avatar" }),
    defineField({
      name: "project",
      title: "Related project",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "author", company: "company", quote: "quote.en", media: "avatar" },
    prepare: ({ title, company, quote, media }) => ({
      title: title || "Anonymous",
      subtitle: [company, quote ? `“${String(quote).slice(0, 60)}…”` : null].filter(Boolean).join(" — "),
      media,
    }),
  },
});
