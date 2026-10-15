import { defineArrayMember, defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";

import { requireDefaultLocale } from "../objects/locale";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: requireDefaultLocale,
    }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title.en", subtitle: "description.en" } },
});
