"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import type { ProjectCard as ProjectCardType } from "@/sanity/types";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils";

export function ProjectsIndex({ locale, dict, projects }: { locale: Locale; dict: Dictionary; projects: ProjectCardType[] }) {
  const [filter, setFilter] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category).filter((c): c is string => Boolean(c)))),
    [projects],
  );
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      {categories.length > 1 && (
        <div role="group" aria-label={dict.work.filterLabel} className="mb-16 flex flex-wrap gap-2">
          {["all", ...categories].map((category) => {
            const active = filter === category;
            const count = category === "all" ? projects.length : projects.filter((p) => p.category === category).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-sm transition-colors duration-500",
                  active ? "border-foreground bg-foreground text-background" : "border-border text-foreground/70 hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {category === "all" ? dict.work.all : dict.categories[category] ?? category}
                <sup className={cn("text-[0.6rem]", active ? "text-background/60" : "text-muted-foreground")}>{count}</sup>
              </button>
            );
          })}
        </div>
      )}

      <motion.div layout className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-24">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={cn(i % 2 === 1 && "md:mt-32")}
            >
              <ProjectCard
                project={project}
                index={i}
                href={`/${locale}/projects/${project.slug}`}
                categoryLabel={project.category ? dict.categories[project.category] ?? project.category : undefined}
                viewLabel={dict.work.view}
                aspect={i % 3 === 0 ? "portrait" : "landscape"}
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={i < 2}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
