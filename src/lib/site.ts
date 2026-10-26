import { siteSettings } from "@/content/siteSettings";

/**
 * Absolute site URL for canonical links, Open Graph, the sitemap and JSON-LD.
 * Order: NEXT_PUBLIC_SITE_URL, then the Vercel production domain, then the deployment URL, then localhost (dev).
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const deployment = process.env.VERCEL_URL;
  const url = explicit || (production && `https://${production}`) || (deployment && `https://${deployment}`) || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export const siteUrl = resolveSiteUrl();

export const site = {
  name: siteSettings.name,
  shortName: siteSettings.shortName,
  location: { city: "Florianópolis", region: "SC", country: "BR", countryName: "Brazil" },
  timeZone: "America/Sao_Paulo",
  links: siteSettings.links,
  email: siteSettings.email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  tools: ["Figma", "Illustrator", "Photoshop", "After Effects", "Premiere", "Canva", "CapCut", "ZBrush"],
  aiTools: ["ChatGPT", "Gemini", "Google AI Studio", "Midjourney", "Sora", "Firefly"],
  education: [
    { name: "UNISUL", course: "Graphic Design" },
    { name: "Universidade Anhembi Morumbi", course: "Product Design" },
  ],
  jobTitles: [
    "Graphic Designer",
    "Product Designer",
    "Creative Technologist",
    "Visual Storyteller",
    "Motion Designer",
    "Brand Designer",
  ],
} as const;

export type ContactLinks = { email: string; linkedin: string; behance: string };

export const contactLinks: ContactLinks = {
  email: site.email,
  linkedin: site.links.linkedin,
  behance: site.links.behance,
};
