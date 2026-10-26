import { siteSettings } from "@/content/siteSettings";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const site = {
  name: siteSettings.name,
  shortName: siteSettings.shortName,
  location: { city: "Florianópolis", region: "SC", country: "BR", countryName: "Brazil" },
  timeZone: "America/Sao_Paulo",
  links: siteSettings.links,
  email: siteSettings.email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  tools: ["Figma", "Illustrator", "Photoshop", "After Effects", "Premiere", "Canva", "CapCut", "ZBrush"],
  aiTools: ["ChatGPT", "Firefly", "Midjourney", "Leonardo AI", "Sora"],
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
