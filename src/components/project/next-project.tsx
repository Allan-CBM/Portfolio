"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type { ProjectCard } from "@/sanity/types";
import { SanityImage } from "@/components/media/sanity-image";

const ease = [0.16, 1, 0.3, 1] as const;

export function NextProject({ project, href, label }: { project: ProjectCard; href: string; label: string }) {
  return (
    <section aria-label={label} className="border-t border-border">
      <Link href={href} className="group relative block overflow-hidden" data-cursor={label}>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-1000 ease-expo group-hover:opacity-100 group-focus-visible:opacity-100">
          {project.cover?.asset && <SanityImage image={project.cover} sizes="100vw" className="scale-105 transition-transform [transition-duration:2000ms] ease-expo group-hover:scale-100" />}
          <div aria-hidden className="absolute inset-0 bg-background/70" />
        </div>
        <div className="container relative py-24 md:py-40">
          <p className="label mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-accent" />
            {label}
          </p>
          <div className="flex items-end justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease }}
              className="font-display text-display-xl font-semibold transition-transform duration-700 ease-expo group-hover:translate-x-4"
            >
              {project.title}
            </motion.h2>
            <span className="mb-4 hidden size-20 shrink-0 items-center justify-center rounded-full border border-foreground/20 transition-all duration-700 ease-expo group-hover:border-accent group-hover:bg-accent group-hover:text-background md:flex">
              <ArrowRight className="size-6" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
