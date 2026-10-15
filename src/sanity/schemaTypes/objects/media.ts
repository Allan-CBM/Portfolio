import { defineArrayMember, defineField } from "sanity";

type FieldOptions = {
  name: string;
  title: string;
  description?: string;
  group?: string | string[];
  required?: boolean;
  hidden?: boolean;
};

const imageFields = [
  defineField({
    name: "alt",
    title: "Alternative text",
    type: "localeString",
    description: "Describe the image for screen readers and SEO.",
  }),
  defineField({ name: "caption", title: "Caption", type: "localeString" }),
];

/** Image field with hotspot, localized alt text and caption. */
export function imageField({ name, title, description, group, required }: FieldOptions) {
  return defineField({
    name,
    title,
    description,
    group,
    type: "image",
    options: { hotspot: true },
    fields: imageFields,
    validation: required ? (rule) => rule.required() : undefined,
  });
}

/** Array member definition for galleries. */
export const galleryImageMember = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  fields: imageFields,
});

/** Uploaded video file (mp4/webm/mov). */
export function videoFileField({ name, title, description, group, hidden }: FieldOptions) {
  return defineField({
    name,
    title,
    description,
    group,
    hidden,
    type: "file",
    options: { accept: "video/mp4,video/webm,video/quicktime" },
  });
}
