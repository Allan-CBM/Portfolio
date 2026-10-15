import { defineField, defineType, type Rule } from "sanity";

export const languages = [
  { id: "en", title: "English", isDefault: true },
  { id: "pt", title: "Português" },
] as const;

const fieldsetOptions = { collapsible: true, collapsed: false, columns: 1 };

export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  options: fieldsetOptions,
  fields: languages.map((lang) =>
    defineField({ name: lang.id, title: lang.title, type: "string" }),
  ),
});

export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  options: fieldsetOptions,
  fields: languages.map((lang) =>
    defineField({ name: lang.id, title: lang.title, type: "text", rows: 4 }),
  ),
});

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Localized rich text",
  type: "object",
  options: fieldsetOptions,
  fields: languages.map((lang) =>
    defineField({ name: lang.id, title: lang.title, type: "blockContent" }),
  ),
});

/** Validation helper: the English (default) translation is required. */
export const requireDefaultLocale = (rule: Rule) =>
  rule.custom((value: Record<string, unknown> | undefined) => {
    const en = value?.en;
    if (!en || (Array.isArray(en) && en.length === 0)) return "The English version is required";
    return true;
  });
