import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import type { ContactLinks } from "@/lib/site";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import { BackToTop } from "./back-to-top";

export function Footer({ locale, dict, links }: { locale: Locale; dict: Dictionary; links: ContactLinks }) {
  const home = `/${locale}`;
  const nav = [
    { href: `${home}#work`, label: dict.nav.work },
    { href: `${home}#about`, label: dict.nav.about },
    { href: `${home}#services`, label: dict.nav.services },
  ];
  const social = [
    { href: links.behance, label: "Behance" },
    { href: links.linkedin, label: "LinkedIn" },
    ...(links.email ? [{ href: `mailto:${links.email}`, label: dict.contact.email }] : []),
  ];

  return (
    <footer className="relative border-t border-border">
      <div className="container grid gap-14 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Link href={home} aria-label={dict.nav.home} className="inline-block text-foreground transition-colors hover:text-accent">
            <Logo className="h-10" />
          </Link>
          <p className="mt-6 max-w-xs text-sm text-muted-foreground">{dict.footer.tagline}</p>
        </div>
        <nav aria-label={dict.footer.navigation} className="md:col-span-3">
          <p className="label mb-5">{dict.footer.navigation}</p>
          <ul className="space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline text-sm text-foreground/75 transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={dict.footer.social} className="md:col-span-3">
          <p className="label mb-5">{dict.footer.social}</p>
          <ul className="space-y-2">
            {social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group inline-flex items-center gap-1 text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  {item.label}
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex md:col-span-1 md:justify-end">
          <BackToTop label={dict.footer.backToTop} />
        </div>
      </div>
      <div className="container flex flex-col gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
        </p>
        <p>
          {site.location.city}, {site.location.countryName}
        </p>
      </div>
    </footer>
  );
}
