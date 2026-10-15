import type { SchemaTypeDefinition } from "sanity";

import { blockContent } from "./objects/blockContent";
import { localeBlockContent, localeString, localeText } from "./objects/locale";
import { metric } from "./objects/metric";
import { pageBlocks } from "./blocks";
import { project } from "./documents/project";
import { post } from "./documents/post";
import { testimonial } from "./documents/testimonial";
import { experience } from "./documents/experience";
import { service } from "./documents/service";
import { siteSettings } from "./documents/siteSettings";

export const singletonTypes = new Set(["siteSettings"]);

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  project,
  post,
  testimonial,
  experience,
  service,
  siteSettings,
  // objects
  blockContent,
  localeString,
  localeText,
  localeBlockContent,
  metric,
  // page builder blocks
  ...pageBlocks,
];
