import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

import { requireDefaultLocale } from "../objects/locale";
import { imageField } from "../objects/media";

export const postTypes = [
  { title: "Article", value: "article" },
  { title: "Case Study", value: "caseStudy" },
  { title: "Design Note", value: "designNote" },
  { title: "AI Experiment", value: "aiExperiment" },
] as const;

export const post = defineType({
  name: "post",
  title: "Journal post",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Meta" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      group: "content",
      validation: requireDefaultLocale,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title.en", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "postType",
      title: "Type",
      type: "string",
      group: "content",
      initialValue: "article",
      options: { list: [...postTypes], layout: "radio", direction: "horizontal" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "localeText", group: "content" }),
    imageField({ name: "coverImage", title: "Cover image", group: "content" }),
    defineField({ name: "body", title: "Body", type: "localeBlockContent", group: "content" }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "relatedProject",
      title: "Related project",
      type: "reference",
      group: "meta",
      to: [{ type: "project" }],
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "localeString", group: "seo" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "localeText", group: "seo" }),
  ],
  orderings: [
    { title: "Published, newest", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title.en", postType: "postType", date: "publishedAt", media: "coverImage" },
    prepare({ title, postType, date, media }) {
      const type = postTypes.find((t) => t.value === postType)?.title ?? "Post";
      return {
        title: title || "Untitled",
        subtitle: [type, date ? new Date(date).toLocaleDateString() : null].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
