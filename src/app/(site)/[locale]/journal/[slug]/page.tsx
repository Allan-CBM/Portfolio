import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { site, siteUrl } from "@/lib/site";
import { formatDate, readingTime } from "@/lib/utils";
import { fetchSanity, fetchStatic } from "@/sanity/lib/fetch";
import { ogImageUrl } from "@/sanity/lib/image";
import { postQuery, postSeoQuery, postSlugsQuery } from "@/sanity/lib/queries";
import type { Post, SeoDoc } from "@/sanity/types";
import { RichText } from "@/components/media/rich-text";
import { SanityImage } from "@/components/media/sanity-image";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { ProjectCard } from "@/components/project/project-card";
import { JsonLd } from "@/components/seo/json-ld";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = (await fetchStatic<{ slug: string }[]>({ query: postSlugsQuery })) ?? [];
  return locales.flatMap((locale) => slugs.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const doc = await fetchStatic<SeoDoc>({ query: postSeoQuery, params: { slug }, locale });
  if (!doc) return {};
  return buildMetadata({
    locale,
    path: `/journal/${slug}`,
    title: doc.seoTitle || doc.title,
    description: doc.seoDescription || doc.excerpt,
    image: ogImageUrl(doc.image?.asset ? doc.image : null),
    type: "article",
    publishedTime: doc.publishedAt,
    modifiedTime: doc._updatedAt,
  });
}

export default async function PostPage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  const post = await fetchSanity<Post>({ query: postQuery, params: { slug }, locale });
  if (!post) notFound();

  const url = `${siteUrl}/${locale}/journal/${post.slug}`;
  const minutes = readingTime(post.body);

  return (
    <article className="pb-24 pt-[calc(var(--header-height)+4rem)] md:pb-36">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          url,
          mainEntityOfPage: url,
          datePublished: post.publishedAt,
          dateModified: post._updatedAt,
          image: ogImageUrl(post.coverImage?.asset ? post.coverImage : null),
          inLanguage: locale === "pt" ? "pt-BR" : "en",
          articleSection: dict.journal.types[post.postType],
          keywords: post.tags?.join(", "),
          author: { "@type": "Person", name: site.name, url: siteUrl },
          publisher: { "@type": "Person", name: site.name, url: siteUrl },
        }}
      />

      <header className="container max-w-5xl">
        <Link
          href={`/${locale}/journal`}
          className="group mb-12 inline-flex items-center gap-2 font-display text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-1" aria-hidden />
          {dict.journal.back}
        </Link>
        <p className="label mb-6 flex flex-wrap items-center gap-3">
          <span className="text-accent">{dict.journal.types[post.postType]}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt, locale)}</time>
          <span aria-hidden>·</span>
          <span>
            {minutes} {dict.journal.minRead}
          </span>
        </p>
        <TextReveal as="h1" text={post.title} className="font-display text-display-lg font-medium" stagger={0.04} />
        {post.excerpt && (
          <Reveal delay={0.3}>
            <p className="mt-10 max-w-3xl text-xl leading-relaxed text-foreground/75 md:text-2xl">{post.excerpt}</p>
          </Reveal>
        )}
      </header>

      {post.coverImage?.asset && (
        <Reveal className="container mt-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-card">
            <SanityImage image={post.coverImage} priority sizes="(min-width: 1600px) 1600px, 100vw" />
          </div>
        </Reveal>
      )}

      <div className="container mt-16 max-w-3xl md:mt-24">
        <RichText value={post.body} />
        {post.tags?.length ? (
          <ul className="mt-16 flex flex-wrap gap-2 border-t border-border pt-8">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                #{tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {post.relatedProject && (
        <section className="container mt-24 max-w-5xl" aria-label={dict.journal.related}>
          <p className="label mb-8">{dict.journal.related}</p>
          <ProjectCard
            project={post.relatedProject}
            index={0}
            href={`/${locale}/projects/${post.relatedProject.slug}`}
            categoryLabel={post.relatedProject.category ? dict.categories[post.relatedProject.category] : undefined}
            viewLabel={dict.work.view}
            aspect="wide"
          />
        </section>
      )}

      {post.next && (
        <nav className="container mt-24 max-w-5xl border-t border-border pt-10" aria-label={dict.journal.next}>
          <Link href={`/${locale}/journal/${post.next.slug}`} className="group flex items-end justify-between gap-6">
            <span>
              <span className="label mb-3 block">{dict.journal.next}</span>
              <span className="font-display text-display-sm font-medium transition-colors group-hover:text-accent">{post.next.title}</span>
            </span>
            <ArrowRight className="mb-2 size-8 shrink-0 transition-transform duration-500 group-hover:translate-x-2" aria-hidden />
          </Link>
        </nav>
      )}
    </article>
  );
}
