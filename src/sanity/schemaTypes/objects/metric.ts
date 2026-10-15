import { defineField, defineType } from "sanity";
import { BarChartIcon } from "@sanity/icons";

export const metric = defineType({
  name: "metric",
  title: "Metric",
  type: "object",
  icon: BarChartIcon,
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: 'e.g. "+240%", "3.2M", "12"',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "label", title: "Label", type: "localeString" }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
  ],
  preview: {
    select: { title: "value", subtitle: "label.en" },
  },
});
