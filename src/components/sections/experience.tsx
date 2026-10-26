"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Plus } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import type { ExperienceEntry } from "@/content/experience";
import { SectionHeading } from "@/components/section-heading";
import { cn, formatMonthYear, pad } from "@/lib/utils";

type ExperienceProps = {
  locale: Locale;
  dict: Dictionary["experience"];
  items: ExperienceEntry[];
};

const ease = [0.16, 1, 0.3, 1] as const;

export function Experience({ locale, dict, items }: ExperienceProps) {
  const list = useRef<HTMLOListElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  const period = (item: ExperienceEntry) => {
    const start = formatMonthYear(item.start, locale);
    const end = formatMonthYear(item.end, locale);
    return [start, end].filter(Boolean).join(" — ");
  };

  return (
    <section id="experience" aria-label={dict.eyebrow} className="section">
      <div className="container">
        <SectionHeading index="03" eyebrow={dict.eyebrow} title={dict.heading} />

        <ol ref={list} className="relative mt-20 md:ml-[8.333%]">
          {/* Timeline rail */}
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-border" />
          <motion.span
            aria-hidden
            className="absolute left-[7px] top-0 h-full w-px origin-top bg-gradient-to-b from-accent to-secondary"
            style={{ scaleY: progress }}
          />

          {items.map((item, i) => {
            const open = openId === item.id;
            const intro = item.intro?.[locale];
            const bullets = item.bullets[locale];
            const hasDetails = Boolean(intro || bullets.length || item.tools?.length);
            const panelId = `exp-panel-${item.id}`;
            return (
              <li key={item.id} className="relative pl-12 md:pl-20">
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-9 size-[15px] rounded-full border-2 bg-background transition-colors duration-500",
                    open ? "border-accent bg-accent" : "border-border",
                  )}
                />
                <div className="border-b border-border py-7">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    aria-expanded={hasDetails ? open : undefined}
                    aria-controls={hasDetails ? panelId : undefined}
                    disabled={!hasDetails}
                    className="group grid w-full grid-cols-12 items-baseline gap-4 text-left disabled:cursor-default"
                  >
                    <span className="col-span-12 font-display text-xs text-muted-foreground md:col-span-1">{pad(i + 1)}</span>
                    <span className="col-span-12 md:col-span-6">
                      <span
                        className={cn(
                          "block font-display text-[clamp(1.75rem,4vw,3.5rem)] font-medium leading-none tracking-tight transition-colors duration-500",
                          open ? "text-foreground" : "text-foreground/60 group-hover:text-foreground",
                        )}
                      >
                        {item.company}
                      </span>
                    </span>
                    <span className="col-span-8 text-sm text-muted-foreground md:col-span-3">
                      {item.role[locale]}
                      <span className="block text-foreground/40">{item.location[locale]}</span>
                    </span>
                    <span className="col-span-4 flex items-center justify-end gap-4 text-right font-display text-sm text-muted-foreground md:col-span-2">
                      <span>{period(item)}</span>
                      {hasDetails && (
                        <Plus
                          aria-hidden
                          className={cn("size-4 shrink-0 transition-transform duration-500 ease-expo", open && "rotate-45 text-accent")}
                        />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && hasDetails && (
                      <motion.div
                        id={panelId}
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.7, ease }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-12 gap-4 pt-6">
                          <div className="col-span-12 space-y-5 md:col-span-8 md:col-start-2">
                            {intro && <p className="max-w-2xl text-foreground/85">{intro}</p>}
                            {bullets.length ? (
                              <ul className="max-w-2xl space-y-3">
                                {bullets.map((bullet) => (
                                  <li key={bullet} className="relative pl-5 text-foreground/70">
                                    <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-2.5 bg-accent" />
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                            {item.tools?.length ? (
                              <div>
                                <p className="label mb-3">{dict.tools}</p>
                                <ul className="flex flex-wrap gap-2">
                                  {item.tools.map((tool) => (
                                    <li key={tool} className="rounded-full border border-border px-3 py-1 text-xs text-foreground/70">
                                      {tool}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
