import "../../globals.css";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { htmlLang, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { display, sans } from "@/lib/fonts";
import { contactLinks, site, siteUrl } from "@/lib/site";
import { AppProvider } from "@/components/providers/app-provider";
import { LeaveSiteProvider } from "@/components/providers/leave-site-provider";
import { Preloader } from "@/components/layout/preloader";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Cursor } from "@/components/motion/cursor";

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

  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s — ${site.name}` },
    description: dict.meta.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: siteUrl }],
    creator: site.name,
    formatDetection: { telephone: false },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);

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
          <LeaveSiteProvider dict={dict.leaveSite}>
            <Preloader label={dict.preloader.loading} />
            <ScrollProgress />
            <Navbar locale={locale} dict={dict.nav} />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer locale={locale} dict={dict} links={contactLinks} />
            <Cursor />
          </LeaveSiteProvider>
        </AppProvider>
        <div aria-hidden className="grain animate-grain" />
      </body>
    </html>
  );
}
