"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import type { Project } from "@/sanity/types";
import { TextReveal } from "@/components/motion/text-reveal";
import { SanityImage } from "@/components/media/sanity-image";
import { MediaVideo } from "@/components/media/media-video";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ease = [0.16, 1, 0.3, 1] as const;

type ProjectHeroProps = { project: Project; dict: Dictionary; locale: Locale };

export function ProjectHero({ project, dict, locale }: ProjectHeroProps) {
  const root = useRef<HTMLElement>(null);
  const cover = project.coverImage?.asset ? project.coverImage : project.featuredImage;
  const category = project.category ? dict.categories[project.category] ?? project.category : null;
  const videoSrc = project.video?.asset?.url;

  // Image scaling: the cover expands from an inset frame to full-bleed while scrolling.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-cover-frame]",
          { clipPath: "inset(8% 6% 0% 6% round 16px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: "[data-cover-frame]", start: "top 85%", end: "top 10%", scrub: true },
          },
        );
        gsap.fromTo(
          "[data-cover-media]",
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-cover-frame]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const meta = [
    { label: dict.project.client, value: project.client },
    { label: dict.project.year, value: project.year?.toString() },
    { label: dict.project.category, value: category },
    { label: dict.project.services, value: project.services?.filter(Boolean).join(", ") },
  ].filter((item) => item.value);

  return (
    <header ref={root} className="relative pt-[calc(var(--header-height)+3rem)]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="mb-10 flex items-center justify-between"
        >
          <Link
            href={`/${locale}/projects`}
            className="group inline-flex items-center gap-2 font-display text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-1" aria-hidden />
            {dict.project.back}
          </Link>
          {category && (
            <span className="label flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: "var(--project-color)" }} aria-hidden />
              {category}
            </span>
          )}
        </motion.div>

        <TextReveal as="h1" text={project.title} delay={0.3} className="font-display text-display-2xl font-semibold" />

        <div className="mt-12 grid gap-10 border-t border-border pt-8 md:grid-cols-12">
          {project.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.6 }}
              className="text-xl leading-snug text-foreground/80 md:col-span-6 md:text-2xl"
            >
              {project.excerpt}
            </motion.p>
          )}
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.75 }}
            className="grid grid-cols-2 gap-6 md:col-span-5 md:col-start-8"
          >
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="label mb-2">{item.label}</dt>
                <dd className="text-sm text-foreground/85">{item.value}</dd>
              </div>
            ))}
            {(project.behanceUrl || project.projectUrl) && (
              <div className="col-span-2 flex flex-wrap gap-3 pt-2">
                {project.behanceUrl && (
                  <a
                    href={project.behanceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-display text-xs transition-colors hover:border-accent hover:text-accent"
                  >
                    {dict.project.viewBehance}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                )}
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-display text-xs transition-colors hover:border-accent hover:text-accent"
                  >
                    {dict.project.visitSite}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                )}
              </div>
            )}
          </motion.dl>
        </div>
      </div>

      {(cover?.asset || videoSrc || project.videoUrl) && (
        <div data-cover-frame className="relative mt-16 aspect-[4/5] overflow-hidden bg-card sm:aspect-[16/10] lg:aspect-[16/8]">
          <div data-cover-media className="absolute inset-0">
            {videoSrc || project.videoUrl ? (
              <MediaVideo src={videoSrc} url={project.videoUrl} title={project.title} />
            ) : (
              <SanityImage image={cover} alt={cover?.alt || project.title} priority sizes="100vw" />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
