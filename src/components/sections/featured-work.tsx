import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import type { ProjectCard as ProjectCardType } from "@/sanity/types";
import { ProjectCard } from "@/components/project/project-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeaturedWorkProps = {
  locale: Locale;
  dict: Dictionary;
  projects: ProjectCardType[];
  total: number;
  behanceUrl: string;
};

/** Asymmetric editorial rhythm: wide, portrait+landscape pairs, wide… */
const layout = [
  { col: "md:col-span-12", aspect: "wide" as const, sizes: "100vw" },
  { col: "md:col-span-5", aspect: "portrait" as const, sizes: "(min-width: 768px) 42vw, 100vw" },
  { col: "md:col-span-6 md:col-start-7 md:mt-40", aspect: "landscape" as const, sizes: "(min-width: 768px) 50vw, 100vw" },
  { col: "md:col-span-7", aspect: "landscape" as const, sizes: "(min-width: 768px) 58vw, 100vw" },
  { col: "md:col-span-4 md:col-start-9 md:mt-24", aspect: "portrait" as const, sizes: "(min-width: 768px) 33vw, 100vw" },
];

export function FeaturedWork({ locale, dict, projects, total, behanceUrl }: FeaturedWorkProps) {
  return (
    <section id="work" aria-label={dict.work.eyebrow} className="section">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow={dict.work.eyebrow}
          title={dict.work.heading}
          aside={
            total > 0 ? (
              <p className="font-display text-sm text-muted-foreground">
                <span className="text-display-sm text-foreground">{String(total).padStart(2, "0")}</span> {dict.work.count}
              </p>
            ) : null
          }
        />

        {projects.length > 0 ? (
          <div className="mt-20 grid gap-x-8 gap-y-20 md:grid-cols-12 md:gap-y-28">
            {projects.map((project, i) => {
              const slot = layout[i % layout.length];
              return (
                <div key={project._id} className={cn(slot.col)}>
                  <ProjectCard
                    project={project}
                    index={i}
                    href={`/${locale}/projects/${project.slug}`}
                    categoryLabel={project.category ? dict.categories[project.category] ?? project.category : undefined}
                    viewLabel={dict.work.view}
                    aspect={slot.aspect}
                    sizes={slot.sizes}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <Reveal className="mt-20 flex flex-col items-start gap-6 rounded-2xl border border-dashed border-border p-10 md:p-16">
            <p className="max-w-xl font-display text-2xl leading-snug text-foreground/80">{dict.work.empty}</p>
            <Button asChild variant="outline">
              <a href={behanceUrl} target="_blank" rel="noopener noreferrer">
                {dict.work.emptyCta}
                <ArrowUpRight aria-hidden />
              </a>
            </Button>
          </Reveal>
        )}

        {total > 0 && (
          <Reveal className="mt-24 flex justify-center">
            <Button asChild size="xl" variant="outline">
              <Link href={`/${locale}/projects`}>
                {dict.work.viewAll}
                <ArrowUpRight aria-hidden />
              </Link>
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
