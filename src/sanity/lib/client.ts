import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "../env";

/**
 * Fields used as logic/enum values (class lookups, colors, keys). Stega (invisible
 * source-map characters added in Draft Mode) must never be embedded in them.
 */
const NON_VISUAL_KEYS = new Set([
  "category",
  "postType",
  "projectColor",
  "size",
  "aspect",
  "layout",
  "align",
  "theme",
  "style",
  "imagePosition",
  "width",
  "height",
  "email",
  "prefix",
  "suffix",
]);

export const client = createClient({
  projectId: projectId || "unconfigured",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl,
    filter: (props) => {
      const key = props.sourcePath.at(-1);
      if (typeof key === "string" && NON_VISUAL_KEYS.has(key)) return false;
      return props.filterDefault(props);
    },
  },
});
