import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { fetchSanity } from "@/sanity/lib/fetch";
import { projectsQuery } from "@/sanity/lib/queries";
import type { ProjectCard } from "@/sanity/types";
import { ProjectsIndex } from "@/components/project/projects-index";
import { SectionHeading } from "@/components/section-heading";
import { JsonLd } from "@/components/seo/json-ld";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/projects", title: dict.work.indexHeading, description: dict.work.indexDescription });
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  const projects = (await fetchSanity<ProjectCard[]>({ query: projectsQuery, locale })) ?? [];

  return (
    <div className="pb-24 pt-[calc(var(--header-height)+4rem)] md:pb-36">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: dict.work.indexHeading,
          url: `${siteUrl}/${locale}/projects`,
          hasPart: projects.map((p) => ({
            "@type": "CreativeWork",
            name: p.title,
            url: `${siteUrl}/${locale}/projects/${p.slug}`,
          })),
        }}
      />
      <div className="container">
        <SectionHeading
          as="h1"
          eyebrow={dict.work.indexEyebrow}
          title={dict.work.indexHeading}
          aside={<p className="max-w-xs text-muted-foreground">{dict.work.indexDescription}</p>}
          className="mb-20"
        />
        {projects.length ? (
          <ProjectsIndex locale={locale} dict={dict} projects={projects} />
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-10 font-display text-xl text-foreground/70">{dict.work.empty}</p>
        )}
      </div>
    </div>
  );
}
