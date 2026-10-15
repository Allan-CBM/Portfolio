export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || "";

export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/studio";

export const isSanityConfigured = projectId.length > 0 && projectId !== "your-project-id";
