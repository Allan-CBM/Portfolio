import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { site, siteUrl } from "@/lib/site";
import { fetchSanity, fetchStatic } from "@/sanity/lib/fetch";
import { ogImageUrl } from "@/sanity/lib/image";
import { projectQuery, projectSeoQuery, projectSlugsQuery } from "@/sanity/lib/queries";
import type { Project, SeoDoc } from "@/sanity/types";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { CaseStudy, ProjectTestimonial } from "@/components/project/case-study";
import { NextProject } from "@/components/project/next-project";
import { ProjectHero } from "@/components/project/project-hero";
import { JsonLd } from "@/components/seo/json-ld";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = (await fetchStatic<{ slug: string }[]>({ query: projectSlugsQuery })) ?? [];
  return locales.flatMap((locale) => slugs.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const doc = await fetchStatic<SeoDoc>({ query: projectSeoQuery, params: { slug }, locale });
  if (!doc) return {};
  return buildMetadata({
    locale,
    path: `/projects/${slug}`,
    title: doc.seoTitle || doc.title,
    description: doc.seoDescription || doc.excerpt,
    image: ogImageUrl(doc.image?.asset ? doc.image : null),
    type: "article",
    publishedTime: doc.publishedAt,
    modifiedTime: doc._updatedAt,
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  const project = await fetchSanity<Project>({ query: projectQuery, params: { slug }, locale });
  if (!project) notFound();

  const url = `${siteUrl}/${locale}/projects/${project.slug}`;
  const image = ogImageUrl(project.featuredImage?.asset ? project.featuredImage : null);

  return (
    <article style={{ "--project-color": project.projectColor || "rgb(var(--accent))" } as CSSProperties}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              "@id": `${url}#work`,
              name: project.title,
              headline: project.seoTitle || project.title,
              description: project.seoDescription || project.excerpt,
              url,
              image,
              datePublished: project.publishedAt,
              dateModified: project._updatedAt,
              inLanguage: locale === "pt" ? "pt-BR" : "en",
              genre: project.category ? dict.categories[project.category] : undefined,
              creator: { "@type": "Person", name: site.name, url: siteUrl },
              ...(project.client ? { sourceOrganization: { "@type": "Organization", name: project.client } } : {}),
              ...(project.behanceUrl ? { sameAs: project.behanceUrl } : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: site.name, item: `${siteUrl}/${locale}` },
                { "@type": "ListItem", position: 2, name: dict.work.indexHeading, item: `${siteUrl}/${locale}/projects` },
                { "@type": "ListItem", position: 3, name: project.title, item: url },
              ],
            },
          ],
        }}
      />

      <ProjectHero project={project} dict={dict} locale={locale} />

      {project.pageBuilder?.length ? (
        <div className="py-10 md:py-16">
          <BlockRenderer blocks={project.pageBuilder} />
        </div>
      ) : (
        <CaseStudy project={project} dict={dict} />
      )}

      <ProjectTestimonial project={project} dict={dict} />

      {project.next && (
        <NextProject project={project.next} href={`/${locale}/projects/${project.next.slug}`} label={dict.project.next} />
      )}
    </article>
  );
}
