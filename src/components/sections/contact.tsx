"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { ContactLinks } from "@/lib/site";
import { TextReveal } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { ExternalLink } from "@/components/ui/external-link";

export function Contact({ dict, links }: { dict: Dictionary["contact"]; links: ContactLinks }) {
  const [copied, setCopied] = useState(false);
  const ctaHref = links.email ? `mailto:${links.email}` : links.linkedin;

  const copy = async () => {
    if (!links.email) return;
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const channels = [
    ...(links.email ? [{ label: dict.email, value: links.email, href: `mailto:${links.email}` }] : []),
    { label: "LinkedIn", value: "/in/allancarlosbm", href: links.linkedin },
    // Behance is the only channel that shows the leaving-site warning.
    { label: "Behance", value: "/AllanCarlosBM", href: links.behance, warn: true },
  ];

  const channelClass = "group inline-flex items-center gap-2 font-display text-lg transition-colors hover:text-accent md:text-2xl";
  const channelArrow = (
    <ArrowUpRight className="size-5 transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
  );

  return (
    <section id="contact" aria-labelledby="contact-title" className="section relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_bottom,rgb(var(--secondary)/0.18),transparent_65%)]" />
      <div className="container relative">
        <p className="label mb-10 flex items-center gap-3">
          <span className="text-accent">07</span>
          <span aria-hidden className="h-px w-8 bg-border" />
          {dict.eyebrow}
        </p>

        <div className="grid items-end gap-16 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <TextReveal
              as="h2"
              text={dict.heading}
              className="font-display text-display-2xl font-semibold"
              lineClassName="[&:last-child]:text-gradient"
            />
            <span id="contact-title" className="sr-only">
              {dict.heading.replace(/\n/g, " ")}
            </span>
          </div>

          <div className="flex lg:col-span-3 lg:justify-end">
            <Magnetic strength={0.5}>
              <motion.a
                href={ctaHref}
                {...(ctaHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group relative flex size-44 items-center justify-center overflow-hidden rounded-full bg-accent text-background md:size-52"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span aria-hidden className="absolute inset-0 translate-y-full rounded-full bg-foreground transition-transform duration-700 ease-expo group-hover:translate-y-0" />
                <span className="relative flex flex-col items-center gap-2 font-display text-base font-medium">
                  <ArrowUpRight className="size-6 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                  {dict.cta}
                </span>
                <svg aria-hidden data-nosnippet viewBox="0 0 200 200" className="absolute inset-2 animate-spin-slow opacity-40">
                  <defs>
                    <path id="cta-circle" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
                  </defs>
                  <text className="fill-current font-display text-[11px] uppercase tracking-[0.3em]">
                    <textPath href="#cta-circle">{`${dict.cta} • ${dict.cta} • ${dict.cta} • `}</textPath>
                  </text>
                </svg>
              </motion.a>
            </Magnetic>
          </div>
        </div>

        <Reveal className="mt-20 grid gap-10 border-t border-border pt-10 md:grid-cols-12">
          <p className="max-w-md text-lg text-muted-foreground md:col-span-5">{dict.text}</p>
          <ul className="md:col-span-7">
            {channels.map((channel) => (
              <li key={channel.label} className="flex items-center justify-between gap-4 border-b border-border py-5">
                <span className="label">{channel.label}</span>
                <span className="flex items-center gap-3">
                  {"warn" in channel ? (
                    <ExternalLink href={channel.href} className={channelClass}>
                      {channel.value}
                      {channelArrow}
                    </ExternalLink>
                  ) : (
                    <a
                      href={channel.href}
                      {...(channel.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={channelClass}
                    >
                      {channel.value}
                      {channelArrow}
                    </a>
                  )}
                  {channel.href.startsWith("mailto:") && (
                    <button
                      type="button"
                      onClick={copy}
                      aria-label={copied ? dict.copied : dict.copy}
                      className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <p className="sr-only" aria-live="polite">
          {copied ? dict.copied : ""}
        </p>
      </div>
    </section>
  );
}
