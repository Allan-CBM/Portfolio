import { ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

type FeaturedWorkProps = {
  dict: Dictionary["work"];
  behanceUrl: string;
};

export function FeaturedWork({ dict, behanceUrl }: FeaturedWorkProps) {
  return (
    <section id="work" aria-label={dict.eyebrow} className="section">
      <div className="container">
        <SectionHeading index="02" eyebrow={dict.eyebrow} title={dict.heading} />

        <Reveal className="mt-20 flex flex-col items-start gap-6 rounded-2xl border border-dashed border-border p-10 md:p-16">
          <p className="max-w-xl font-display text-2xl leading-snug text-foreground/80">{dict.empty}</p>
          <Button asChild variant="outline">
            <a href={behanceUrl} target="_blank" rel="noopener noreferrer">
              {dict.emptyCta}
              <ArrowUpRight aria-hidden />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
