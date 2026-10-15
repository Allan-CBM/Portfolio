"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";

import type { ProjectCard as ProjectCardType } from "@/sanity/types";
import { Parallax } from "@/components/motion/parallax";
import { SanityImage } from "@/components/media/sanity-image";
import { cn, pad } from "@/lib/utils";

type ProjectCardProps = {
  project: ProjectCardType;
  href: string;
  index: number;
  categoryLabel?: string;
  viewLabel: string;
  aspect?: "landscape" | "portrait" | "wide";
  sizes?: string;
  priority?: boolean;
};

const aspectClass = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
};

const ease = [0.16, 1, 0.3, 1] as const;

export function ProjectCard({
  project,
  href,
  index,
  categoryLabel,
  viewLabel,
  aspect = "landscape",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
}: ProjectCardProps) {
  const color = project.projectColor || "rgb(var(--accent))";

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease }}
      className="group"
      style={{ "--card-color": color } as CSSProperties}
    >
      <Link href={href} className="block focus-visible:outline-none" data-cursor={viewLabel} aria-label={`${project.title} — ${viewLabel}`}>
        <motion.div
          className={cn(
            "relative overflow-hidden rounded-xl bg-card ring-1 ring-border transition-[box-shadow] duration-700 group-focus-visible:ring-2 group-focus-visible:ring-accent",
            aspectClass[aspect],
          )}
          initial={{ clipPath: "inset(12% 6% 12% 6% round 12px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 12px)" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.4, ease }}
        >
          <Parallax className="h-full" offset={6} innerClassName="transition-transform [transition-duration:1400ms] ease-expo group-hover:scale-[1.06]">
            {project.image?.asset ? (
              <SanityImage image={project.image} alt={project.image.alt || project.title} sizes={sizes} priority={priority} />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 30% 30%, ${color}55, transparent 60%), rgb(15 15 15)` }}
              />
            )}
          </Parallax>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-60"
            style={{ background: `linear-gradient(160deg, transparent 40%, ${color})` }}
          />
          <span className="absolute right-4 top-4 flex size-11 translate-y-2 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </motion.div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="label mb-2 flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: color }} aria-hidden />
              {categoryLabel}
            </p>
            <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-expo group-hover:bg-[length:100%_1px]">
                {project.title}
              </span>
            </h3>
            {project.client && <p className="mt-1 text-sm text-muted-foreground">{project.client}</p>}
          </div>
          <div className="shrink-0 text-right font-display text-sm text-muted-foreground">
            <p>{project.year}</p>
            <p className="text-foreground/30">{pad(index + 1)}</p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
