import Image from "next/image";

import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/lib/site";
import { pad } from "@/lib/utils";
import { Counter } from "@/components/motion/counter";
import { Parallax } from "@/components/motion/parallax";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { ExpandableText } from "@/components/ui/expandable-text";

export function About({ dict }: { dict: Dictionary["about"] }) {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container">
        <p className="label mb-16 flex items-center gap-3">
          <span className="text-accent">01</span>
          <span aria-hidden className="h-px w-8 bg-border" />
          {dict.eyebrow}
        </p>

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card">
                  {/* Small travel and no zoom: the photo has little headroom, so a larger parallax crops the hair. */}
                  <Parallax className="h-full" offset={3} innerClassName="-inset-y-[4%]">
                    <Image
                      src="/images/allan.jpg"
                      alt={dict.portraitAlt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover object-top"
                    />
                  </Parallax>
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-foreground/10 bg-background/60 px-3 py-1.5 font-display text-[0.65rem] uppercase tracking-[0.2em] backdrop-blur">
                    {site.location.city} — {site.location.region}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Story */}
          <div className="lg:col-span-7 lg:pl-10">
            <TextReveal
              as="h2"
              text={dict.heading}
              className="font-display text-display-md font-medium"
              stagger={0.03}
            />
            <span id="about-title" className="sr-only">
              {dict.eyebrow}
            </span>

            <Reveal className="mt-10 max-w-2xl text-lg leading-relaxed text-foreground/70">
              <ExpandableText paragraphs={dict.body} moreLabel={dict.readMore} lessLabel={dict.readLess} />
            </Reveal>

            {/* Counters */}
            <dl className="mt-16 grid grid-cols-3 gap-4 border-y border-border py-10">
              {dict.stats.map((stat, i) => (
                <div key={`${stat.label}-${i}`} className="flex flex-col gap-2">
                  <dt className="order-2 text-xs text-muted-foreground md:text-sm">{stat.label}</dt>
                  <dd className="order-1 font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-none tracking-tight">
                    <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>

            {/* Pillars */}
            <div className="mt-16">
              <p className="label mb-6">{dict.pillarsTitle}</p>
              <Stagger className="divide-y divide-border border-y border-border">
                {dict.pillars.map((pillar, i) => (
                  <StaggerItem key={pillar.title} className="group grid grid-cols-12 items-baseline gap-4 py-5">
                    <span className="col-span-2 font-display text-xs text-muted-foreground md:col-span-1">{pad(i + 1)}</span>
                    <h3 className="col-span-10 font-display text-2xl font-medium tracking-tight transition-colors duration-500 group-hover:text-accent md:col-span-5 md:text-3xl">
                      {pillar.title}
                    </h3>
                    <p className="col-span-10 col-start-3 text-sm text-muted-foreground md:col-span-6 md:col-start-auto">
                      {pillar.text}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* Education + tools */}
            <div className="mt-16 grid gap-10 sm:grid-cols-3">
              <Reveal>
                <p className="label mb-4">{dict.education}</p>
                <ul className="space-y-3">
                  {dict.educationItems.map((item) => (
                    <li key={item.title}>
                      <p className="font-display text-lg leading-tight">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.school}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="label mb-4">{dict.tools}</p>
                <ul className="flex flex-wrap gap-2">
                  {site.tools.map((tool) => (
                    <li key={tool} className="rounded-full border border-border px-3 py-1 text-xs text-foreground/75">
                      {tool}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="label mb-4">{dict.ai}</p>
                <ul className="flex flex-wrap gap-2">
                  {site.aiTools.map((tool) => (
                    <li key={tool} className="rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-xs text-accent">
                      {tool}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
