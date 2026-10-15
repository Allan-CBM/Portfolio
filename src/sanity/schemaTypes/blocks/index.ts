import { defineArrayMember, defineField, defineType } from "sanity";
import {
  BlockContentIcon,
  BlockquoteIcon,
  BarChartIcon,
  ImageIcon,
  ImagesIcon,
  InlineIcon,
  LaunchIcon,
  MasterDetailIcon,
  PlayIcon,
  RocketIcon,
  SplitHorizontalIcon,
  TextIcon,
  ThListIcon,
  TrendUpwardIcon,
} from "@sanity/icons";

import { galleryImageMember, imageField, videoFileField } from "../objects/media";

const blockSubtitle = (label: string) => (selection: { title?: string; media?: unknown }) => ({
  title: selection.title || label,
  subtitle: label,
  media: selection.media as never,
});

const themeField = defineField({
  name: "theme",
  title: "Background",
  type: "string",
  initialValue: "default",
  options: {
    layout: "radio",
    direction: "horizontal",
    list: [
      { title: "Default", value: "default" },
      { title: "Card", value: "card" },
      { title: "Project color", value: "project" },
    ],
  },
});

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  icon: RocketIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localeString" }),
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "subheading", title: "Subheading", type: "localeText" }),
    imageField({ name: "image", title: "Background image" }),
    videoFileField({ name: "video", title: "Background video", description: "Optional. Plays muted on loop." }),
    defineField({
      name: "align",
      title: "Alignment",
      type: "string",
      initialValue: "left",
      options: { layout: "radio", direction: "horizontal", list: ["left", "center"] },
    }),
  ],
  preview: { select: { title: "heading.en", media: "image" }, prepare: blockSubtitle("Hero") },
});

export const textBlock = defineType({
  name: "textBlock",
  title: "Text",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localeString" }),
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeText" }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      initialValue: "default",
      options: { layout: "radio", direction: "horizontal", list: ["default", "large", "display"] },
    }),
    defineField({
      name: "align",
      title: "Alignment",
      type: "string",
      initialValue: "left",
      options: { layout: "radio", direction: "horizontal", list: ["left", "center", "split"] },
    }),
    themeField,
  ],
  preview: { select: { title: "heading.en" }, prepare: blockSubtitle("Text") },
});

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich Text",
  type: "object",
  icon: BlockContentIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localeString" }),
    defineField({ name: "content", title: "Content", type: "localeBlockContent" }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      initialValue: "narrow",
      options: { layout: "radio", direction: "horizontal", list: ["narrow", "wide"] },
    }),
  ],
  preview: { select: { title: "eyebrow.en" }, prepare: blockSubtitle("Rich Text") },
});

export const imageBlock = defineType({
  name: "imageBlock",
  title: "Image",
  type: "object",
  icon: ImageIcon,
  fields: [
    imageField({ name: "image", title: "Image", required: true }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      initialValue: "wide",
      options: { layout: "radio", direction: "horizontal", list: ["contained", "wide", "full"] },
    }),
    defineField({
      name: "aspect",
      title: "Aspect ratio",
      type: "string",
      initialValue: "auto",
      options: { list: ["auto", "16/9", "4/3", "1/1", "4/5", "21/9"] },
    }),
    defineField({ name: "parallax", title: "Parallax", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "image.caption.en", media: "image" }, prepare: blockSubtitle("Image") },
});

export const galleryBlock = defineType({
  name: "galleryBlock",
  title: "Image Gallery",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [galleryImageMember],
      options: { layout: "grid" },
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      initialValue: "grid-2",
      options: {
        list: [
          { title: "Grid — 2 columns", value: "grid-2" },
          { title: "Grid — 3 columns", value: "grid-3" },
          { title: "Masonry", value: "masonry" },
          { title: "Horizontal scroll", value: "carousel" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "heading.en", media: "images.0", count: "images.length" },
    prepare: ({ title, media }) => ({ title: title || "Gallery", subtitle: "Image Gallery", media }),
  },
});

export const videoBlock = defineType({
  name: "videoBlock",
  title: "Video",
  type: "object",
  icon: PlayIcon,
  fields: [
    videoFileField({ name: "file", title: "Upload video" }),
    defineField({
      name: "url",
      title: "…or external URL",
      type: "url",
      description: "YouTube, Vimeo or a direct .mp4 link. Used when no file is uploaded.",
    }),
    imageField({ name: "poster", title: "Poster image" }),
    defineField({ name: "caption", title: "Caption", type: "localeString" }),
    defineField({ name: "autoplay", title: "Autoplay (muted loop)", type: "boolean", initialValue: true }),
    defineField({
      name: "aspect",
      title: "Aspect ratio",
      type: "string",
      initialValue: "16/9",
      options: { list: ["16/9", "4/3", "1/1", "9/16", "21/9"] },
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      initialValue: "wide",
      options: { layout: "radio", direction: "horizontal", list: ["contained", "wide", "full"] },
    }),
  ],
  preview: { select: { title: "caption.en", media: "poster" }, prepare: blockSubtitle("Video") },
});

export const twoColumnBlock = defineType({
  name: "twoColumnBlock",
  title: "Two Columns",
  type: "object",
  icon: SplitHorizontalIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localeString" }),
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeBlockContent" }),
    imageField({ name: "image", title: "Image" }),
    defineField({
      name: "imagePosition",
      title: "Image position",
      type: "string",
      initialValue: "right",
      options: { layout: "radio", direction: "horizontal", list: ["left", "right"] },
    }),
    defineField({
      name: "sticky",
      title: "Sticky text column",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: { select: { title: "heading.en", media: "image" }, prepare: blockSubtitle("Two Columns") },
});

export const quoteBlock = defineType({
  name: "quoteBlock",
  title: "Quote",
  type: "object",
  icon: BlockquoteIcon,
  fields: [
    defineField({ name: "quote", title: "Quote", type: "localeText" }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "role", title: "Role", type: "localeString" }),
    imageField({ name: "avatar", title: "Avatar" }),
  ],
  preview: { select: { title: "quote.en", subtitle: "author", media: "avatar" } },
});

export const metricsBlock = defineType({
  name: "metricsBlock",
  title: "Metrics",
  type: "object",
  icon: BarChartIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({
      name: "items",
      title: "Metrics",
      type: "array",
      of: [defineArrayMember({ type: "metric" })],
      validation: (rule) => rule.min(1).max(6),
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: blockSubtitle("Metrics") },
});

export const processBlock = defineType({
  name: "processBlock",
  title: "Process",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localeString" }),
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "processStep",
          fields: [
            defineField({ name: "title", title: "Title", type: "localeString" }),
            defineField({ name: "description", title: "Description", type: "localeText" }),
            imageField({ name: "image", title: "Image" }),
          ],
          preview: { select: { title: "title.en", subtitle: "description.en", media: "image" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: blockSubtitle("Process") },
});

export const resultsBlock = defineType({
  name: "resultsBlock",
  title: "Results",
  type: "object",
  icon: TrendUpwardIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "summary", title: "Summary", type: "localeText" }),
    defineField({
      name: "items",
      title: "Outcomes",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      of: [defineArrayMember({ type: "metric" })],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: blockSubtitle("Results") },
});

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call To Action",
  type: "object",
  icon: LaunchIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "text", title: "Text", type: "localeText" }),
    defineField({ name: "buttonLabel", title: "Button label", type: "localeString" }),
    defineField({
      name: "buttonUrl",
      title: "Button URL",
      type: "url",
      validation: (rule) =>
        rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: blockSubtitle("Call To Action") },
});

export const dividerBlock = defineType({
  name: "dividerBlock",
  title: "Divider",
  type: "object",
  icon: InlineIcon,
  fields: [
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      initialValue: "line",
      options: { layout: "radio", direction: "horizontal", list: ["line", "space", "marquee"] },
    }),
    defineField({
      name: "label",
      title: "Marquee text",
      type: "localeString",
      hidden: ({ parent }) => parent?.style !== "marquee",
    }),
    defineField({
      name: "size",
      title: "Spacing",
      type: "string",
      initialValue: "md",
      options: { layout: "radio", direction: "horizontal", list: ["sm", "md", "lg"] },
    }),
  ],
  preview: {
    select: { style: "style" },
    prepare: ({ style }) => ({ title: `Divider — ${style ?? "line"}`, subtitle: "Divider" }),
  },
});

export const fullWidthMediaBlock = defineType({
  name: "fullWidthMediaBlock",
  title: "Full Width Media",
  type: "object",
  icon: MasterDetailIcon,
  fields: [
    imageField({ name: "image", title: "Image" }),
    videoFileField({ name: "video", title: "Video", description: "Optional. Overrides the image." }),
    defineField({ name: "caption", title: "Caption", type: "localeString" }),
    defineField({
      name: "height",
      title: "Height",
      type: "string",
      initialValue: "screen",
      options: { layout: "radio", direction: "horizontal", list: ["auto", "tall", "screen"] },
    }),
    defineField({ name: "parallax", title: "Parallax", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "caption.en", media: "image" }, prepare: blockSubtitle("Full Width Media") },
});

export const pageBlocks = [
  heroBlock,
  textBlock,
  richTextBlock,
  imageBlock,
  galleryBlock,
  videoBlock,
  twoColumnBlock,
  quoteBlock,
  metricsBlock,
  processBlock,
  resultsBlock,
  ctaBlock,
  dividerBlock,
  fullWidthMediaBlock,
];

/** Reusable drag-and-drop page builder field. */
export const pageBuilderField = (group?: string) =>
  defineField({
    name: "pageBuilder",
    title: "Page builder",
    description:
      "Compose the case study with blocks. Drag to reorder. When empty, the default case-study template is used.",
    type: "array",
    group,
    of: pageBlocks.map((block) => defineArrayMember({ type: block.name })),
    options: {
      insertMenu: {
        filter: true,
        groups: [
          { name: "intro", title: "Intro", of: ["heroBlock", "textBlock", "richTextBlock"] },
          {
            name: "media",
            title: "Media",
            of: ["imageBlock", "galleryBlock", "videoBlock", "fullWidthMediaBlock"],
          },
          {
            name: "story",
            title: "Storytelling",
            of: ["twoColumnBlock", "quoteBlock", "processBlock", "metricsBlock", "resultsBlock"],
          },
          { name: "layout", title: "Layout", of: ["ctaBlock", "dividerBlock"] },
        ],
        views: [{ name: "list" }],
      },
    },
  });
