import { defineArrayMember, defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "localeString" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "startDate", title: "Start date", type: "date", options: { dateFormat: "MM/YYYY" } }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "date",
      options: { dateFormat: "MM/YYYY" },
      hidden: ({ parent }) => Boolean(parent?.current),
    }),
    defineField({ name: "current", title: "Current position", type: "boolean", initialValue: false }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({ name: "url", title: "Website", type: "url" }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first in the timeline.",
    }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "company", subtitle: "role.en", current: "current" },
    prepare: ({ title, subtitle, current }) => ({
      title,
      subtitle: [subtitle, current ? "Current" : null].filter(Boolean).join(" · "),
    }),
  },
});
