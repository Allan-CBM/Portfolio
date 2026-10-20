import "../../globals.css";

import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { VisualEditing } from "next-sanity";

import { htmlLang, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { display, sans } from "@/lib/fonts";
import { contactLinks, site, siteUrl } from "@/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { fetchSanity } from "@/sanity/lib/fetch";
import { SanityLive } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/types";
import { ogImageUrl } from "@/sanity/lib/image";
import { AppProvider } from "@/components/providers/app-provider";
import { Preloader } from "@/components/layout/preloader";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PreviewBar } from "@/components/layout/preview-bar";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Cursor } from "@/components/motion/cursor";
import { Analytics } from "@vercel/analytics/next";

type LayoutProps = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  const settings = await fetchSanity<SiteSettings>({ query: settingsQuery, locale });
  const ogImage = ogImageUrl(settings?.ogImage?.asset ? settings.ogImage : null);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s — ${site.name}` },
    description: settings?.seoDescription || dict.meta.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: siteUrl }],
    creator: site.name,
    keywords: [...site.jobTitles, "Portfolio", "Florianópolis", "Brand Identity", "UI Design", "AI-assisted design"],
    formatDetection: { telephone: false },
    ...(ogImage ? { openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] } } : {}),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);
  const { isEnabled: isDraftMode } = await draftMode();
  const settings = await fetchSanity<SiteSettings>({ query: settingsQuery, locale });
  const links = contactLinks(settings);

  return (
    <html lang={htmlLang[locale]} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Skip the intro preloader for the rest of the session — runs before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('am-preloaded')==='1')document.documentElement.setAttribute('data-preloaded','')}catch(e){}`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-accent px-5 py-3 font-display text-sm text-background transition-transform focus:translate-y-0"
        >
          {dict.nav.skip}
        </a>
        <AppProvider>
          <Preloader label={dict.preloader.loading} />
          <ScrollProgress />
          <Navbar locale={locale} dict={dict.nav} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer locale={locale} dict={dict} links={links} />
          <Cursor />
        </AppProvider>
        <div aria-hidden className="grain animate-grain" />
        {isSanityConfigured && <SanityLive />}
        {isDraftMode && (
          <>
            <VisualEditing />
            <PreviewBar label={dict.preview.active} exitLabel={dict.preview.exit} />
          </>
        )}
        <Analytics />
      </body>
    </html>
  );
}
