import type { Dictionary } from "@/i18n/get-dictionary";
import type { Project } from "@/sanity/types";
import { Reveal } from "@/components/motion/reveal";
import { MetricsGrid } from "@/components/blocks/data-blocks";
import { GalleryGrid } from "@/components/blocks/media-blocks";
import { QuoteFigure } from "@/components/blocks/text-blocks";
import { pad } from "@/lib/utils";

type ChapterProps = { index: number; title: string; body: string };

function Chapter({ index, title, body }: ChapterProps) {
  return (
    <section className="container grid gap-8 py-20 md:grid-cols-12 md:py-28">
      <div className="md:col-span-4">
        <h2 className="label sticky top-28 flex items-center gap-3">
          <span style={{ color: "var(--project-color)" }}>{pad(index)}</span>
          <span aria-hidden className="h-px w-8 bg-border" />
          {title}
        </h2>
      </div>
      <div className="md:col-span-8">
        <Reveal>
          {body.split(/\n{2,}/).map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "font-display text-[clamp(1.5rem,2.8vw,2.5rem)] font-light leading-[1.25] tracking-tight text-foreground"
                  : "mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70"
              }
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** Default case-study template — used when the page builder is empty. */
export function CaseStudy({ project, dict }: { project: Project; dict: Dictionary }) {
  const chapters = [
    { title: dict.project.challenge, body: project.challenge },
    { title: dict.project.research, body: project.research },
    { title: dict.project.process, body: project.solution },
    { title: dict.project.results, body: project.results },
  ].filter((chapter): chapter is { title: string; body: string } => Boolean(chapter.body));

  return (
    <div>
      {chapters.map((chapter, i) => (
        <div key={chapter.title}>
          <Chapter index={i + 1} title={chapter.title} body={chapter.body} />
          {chapter.title === dict.project.results && project.metrics?.length ? (
            <div className="container pb-20">
              <MetricsGrid items={project.metrics} />
            </div>
          ) : null}
        </div>
      ))}

      {project.metrics?.length && !project.results ? (
        <div className="container py-20">
          <MetricsGrid items={project.metrics} />
        </div>
      ) : null}

      {project.gallery?.length ? (
        <section className="py-20 md:py-28" aria-label={dict.project.gallery}>
          <div className="container">
            <p className="label mb-12 flex items-center gap-3">
              <span style={{ color: "var(--project-color)" }}>{pad(chapters.length + 1)}</span>
              <span aria-hidden className="h-px w-8 bg-border" />
              {dict.project.gallery}
            </p>
          </div>
          <GalleryGrid images={project.gallery} layout="masonry" />
        </section>
      ) : null}
    </div>
  );
}

export function ProjectTestimonial({ project, dict }: { project: Project; dict: Dictionary }) {
  if (!project.testimonial) return null;
  const t = project.testimonial;
  return (
    <section className="container py-20 md:py-28" aria-label={dict.project.testimonial}>
      <p className="label mb-12">{dict.project.testimonial}</p>
      <QuoteFigure quote={t.quote} author={t.author} role={[t.role, t.company].filter(Boolean).join(" — ")} avatar={t.avatar} />
    </section>
  );
}
