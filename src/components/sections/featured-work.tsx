import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ExternalLink } from "@/components/ui/external-link";

type FeaturedWorkProps = {
  dict: Dictionary["work"];
  behanceUrl: string;
};

/** Blur layers from weakest/widest to strongest/narrowest (percent of the card from the text edge). */
const blurLayers = [
  { blur: "2px", from: "38%", to: "72%" },
  { blur: "6px", from: "28%", to: "60%" },
  { blur: "12px", from: "16%", to: "48%" },
  { blur: "24px", from: "6%", to: "36%" },
];

/**
 * Featured Projects: one large card linking to the Behance profile, where the projects live.
 * The project mosaic stays visible on the right and blurs progressively towards the
 * "liquid glass" text panel (left on desktop, bottom on mobile).
 */
export function FeaturedWork({ dict, behanceUrl }: FeaturedWorkProps) {
  return (
    <section id="work" aria-label={dict.eyebrow} className="section">
      <div className="container">
        <SectionHeading index="02" eyebrow={dict.eyebrow} title={dict.heading} />

        <Reveal className="mt-20">
          <ExternalLink
            href={behanceUrl}
            data-cursor="Behance"
            className="group relative block aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-[radial-gradient(ellipse_at_80%_30%,rgb(var(--secondary)/0.35),transparent_60%),radial-gradient(ellipse_at_20%_90%,rgb(var(--accent)/0.2),transparent_55%)] bg-card sm:aspect-[4/3] md:aspect-video xl:aspect-[21/10]"
          >
            <Image
              src="/images/behance-profile.jpg"
              alt={dict.behanceAlt}
              fill
              sizes="(min-width: 1400px) 1320px, 100vw"
              className="object-cover object-right transition-transform ease-expo [transition-duration:1600ms] motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-visible:scale-[1.04]"
            />

            {/* Progressive blur towards the text side */}
            <div aria-hidden className="progressive-blur pointer-events-none absolute inset-0">
              {blurLayers.map((layer) => (
                <span key={layer.blur} style={{ "--blur": layer.blur, "--from": layer.from, "--to": layer.to } as CSSProperties} />
              ))}
            </div>
            {/* Dark tint so the panel and text always read well */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-transparent md:bg-gradient-to-r md:from-background/75 md:via-background/20"
            />

            <div className="liquid-glass absolute inset-x-3 bottom-3 rounded-2xl p-5 sm:inset-x-5 sm:bottom-5 sm:p-8 md:inset-x-auto md:bottom-auto md:left-8 md:top-1/2 md:w-[min(26rem,42%)] md:-translate-y-1/2 lg:left-12 lg:p-10">
              <h3 className="font-display text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-tight">
                {dict.behanceTitle}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/75 md:text-base">{dict.behanceText}</p>
              <span className="mt-6 inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-foreground px-6 font-display text-sm font-medium text-background transition-colors duration-500 group-hover:bg-accent md:mt-8 group-focus-visible:bg-accent">
                {dict.behanceCta}
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-500 ease-expo motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5"
                />
              </span>
            </div>
          </ExternalLink>
        </Reveal>
      </div>
    </section>
  );
}
