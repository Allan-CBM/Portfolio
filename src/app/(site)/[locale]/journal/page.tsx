import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { site, siteUrl } from "@/lib/site";
import { fetchSanity } from "@/sanity/lib/fetch";
import { postsQuery } from "@/sanity/lib/queries";
import type { PostCard } from "@/sanity/types";
import { JournalList } from "@/components/journal/journal-list";
import { SectionHeading } from "@/components/section-heading";
import { JsonLd } from "@/components/seo/json-ld";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/journal",
    title: dict.journal.eyebrow,
    description: dict.journal.description,
  });
}

export default async function JournalPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  const posts = (await fetchSanity<PostCard[]>({ query: postsQuery, locale })) ?? [];

  return (
    <div className="pb-24 pt-[calc(var(--header-height)+4rem)] md:pb-36">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${site.name} — ${dict.journal.eyebrow}`,
          url: `${siteUrl}/${locale}/journal`,
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: `${siteUrl}/${locale}/journal/${post.slug}`,
            datePublished: post.publishedAt,
          })),
        }}
      />
      <div className="container">
        <SectionHeading
          as="h1"
          eyebrow={dict.journal.eyebrow}
          title={dict.journal.heading}
          aside={<p className="max-w-xs text-muted-foreground">{dict.journal.description}</p>}
          className="mb-20"
        />
        <JournalList locale={locale} dict={dict.journal} posts={posts} />
      </div>
    </div>
  );
}
