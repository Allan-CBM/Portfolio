import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { contactLinks, site, siteUrl } from "@/lib/site";
import { experience } from "@/content/experience";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return buildMetadata({ locale, path: "" });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  const links = contactLinks;

  const personLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: site.name,
        url: siteUrl,
        image: `${siteUrl}/images/allan.jpg`,
        jobTitle: site.jobTitles.slice(0, 3).join(", "),
        description: dict.meta.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.location.city,
          addressRegion: site.location.region,
          addressCountry: site.location.country,
        },
        alumniOf: site.education.map((school) => ({ "@type": "CollegeOrUniversity", name: school.name })),
        knowsAbout: [...new Set([...dict.skills.groups.map((g) => g.title), ...site.tools, ...site.aiTools])],
        sameAs: [links.behance, links.linkedin],
        ...(links.email ? { email: `mailto:${links.email}` } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        inLanguage: locale === "pt" ? "pt-BR" : "en",
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  };

  return (
    <>
      <JsonLd data={personLd} />
      <Hero dict={dict.hero} />
      <About dict={dict.about} />
      <FeaturedWork dict={dict.work} behanceUrl={links.behance} />
      <Skills dict={dict.skills} />
      <Experience locale={locale} dict={dict.experience} items={experience} />
      <Services dict={dict.services} />
      <Process dict={dict.process} />
      <Contact dict={dict.contact} links={links} />
    </>
  );
}
