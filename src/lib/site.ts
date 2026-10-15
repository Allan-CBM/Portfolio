import type { SiteSettings } from "@/sanity/types";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const site = {
  name: "Allan Martins",
  shortName: "AM",
  location: { city: "Florianópolis", region: "SC", country: "BR", countryName: "Brazil" },
  timeZone: "America/Sao_Paulo",
  links: {
    behance: "https://www.behance.net/AllanCarlosBM",
    linkedin: "https://www.linkedin.com/in/allancarlosbm/",
  },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  tools: ["Figma", "Illustrator", "Photoshop", "After Effects", "Premiere", "Canva", "CapCut", "ZBrush"],
  aiTools: ["ChatGPT", "Firefly", "Midjourney", "Leonardo AI", "Sora"],
  education: [
    { name: "UNISUL", course: "Graphic Design" },
    { name: "Universidade Anhembi Morumbi", course: "Product Design" },
  ],
  /** Timeline fallback until experiences are added in Sanity. */
  companies: ["Otus Engenharia", "ADVB/SC", "TDBusiness", "Glamour Beauty Show", "Pregão de Guerra"],
  jobTitles: [
    "Graphic Designer",
    "Product Designer",
    "Creative Technologist",
    "Visual Storyteller",
    "Motion Designer",
    "Brand Designer",
  ],
} as const;

export type ContactLinks = { email: string; linkedin: string; behance: string; instagram?: string | null };

export function contactLinks(settings?: SiteSettings | null): ContactLinks {
  return {
    email: settings?.email || site.email,
    linkedin: settings?.linkedin || site.links.linkedin,
    behance: settings?.behance || site.links.behance,
    instagram: settings?.instagram,
  };
}
