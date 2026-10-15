import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { contactLinks, site, siteUrl } from "@/lib/site";
import { fetchSanity } from "@/sanity/lib/fetch";
import { ogImageUrl } from "@/sanity/lib/image";
import { homeQuery } from "@/sanity/lib/queries";
import type { Experience as ExperienceType, HomeData, Service } from "@/sanity/types";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
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
  const data = await fetchSanity<HomeData>({ query: homeQuery, locale });
  const settings = data?.settings ?? null;
  const links = contactLinks(settings);

  const experiences: ExperienceType[] = data?.experiences?.length
    ? data.experiences
    : site.companies.map((company) => ({ _id: company, company }));

  const services: Service[] = data?.services?.length
    ? data.services
    : dict.services.items.map((item) => ({ _id: item.title, title: item.title, description: item.description }));

  const personLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: site.name,
        url: siteUrl,
        image: ogImageUrl(settings?.portrait?.asset ? settings.portrait : null),
        jobTitle: site.jobTitles.slice(0, 3).join(", "),
        description: dict.meta.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.location.city,
          addressRegion: site.location.region,
          addressCountry: site.location.country,
        },
        alumniOf: site.education.map((school) => ({ "@type": "CollegeOrUniversity", name: school.name })),
        knowsAbout: [...dict.skills.groups.map((g) => g.title), ...site.tools, ...site.aiTools],
        sameAs: [links.behance, links.linkedin, links.instagram].filter(Boolean),
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
      <Hero dict={dict.hero} headline={settings?.heroHeadline} subline={settings?.heroSubline} availability={settings?.availability} />
      <About dict={dict.about} settings={settings} />
      <FeaturedWork
        locale={locale}
        dict={dict}
        projects={data?.featured ?? []}
        total={data?.projectCount ?? 0}
        behanceUrl={links.behance}
      />
      <Skills dict={dict.skills} groups={settings?.skillGroups} />
      <Experience locale={locale} dict={dict.experience} items={experiences} />
      <Services dict={dict.services} items={services} />
      <Process dict={dict.process} />
      {data?.testimonials?.length ? <Testimonials dict={dict.testimonials} items={data.testimonials} /> : null}
      <Contact dict={dict.contact} links={links} />
    </>
  );
}
