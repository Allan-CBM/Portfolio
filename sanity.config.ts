"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId, studioUrl } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { resolve } from "./src/sanity/presentation/resolve";
import { dashboardTool } from "./src/sanity/plugins/dashboard";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "allan-martins",
  title: "Allan Martins — Studio",
  basePath: studioUrl,
  projectId: projectId || "unconfigured",
  dataset,

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },

  plugins: [
    dashboardTool(),
    structureTool({ structure, title: "Content" }),
    presentationTool({
      title: "Live Preview",
      resolve,
      previewUrl: {
        // Embedded studio (/studio) previews same-origin; a hosted studio (sanity deploy) needs the site URL.
        origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN || undefined,
        initial: "/en",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion, title: "GROQ" }),
  ],
});
