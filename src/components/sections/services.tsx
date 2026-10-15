"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Service } from "@/sanity/types";
import { SectionHeading } from "@/components/section-heading";
import { cn, pad } from "@/lib/utils";

type ServicesProps = { dict: Dictionary["services"]; items: Service[] };

const ease = [0.16, 1, 0.3, 1] as const;

export function Services({ dict, items }: ServicesProps) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" aria-label={dict.eyebrow} className="section bg-card/40">
      <div className="container">
        <SectionHeading index="04" eyebrow={dict.eyebrow} title={dict.heading} />

        <ul className="mt-20 border-t border-border" onMouseLeave={() => setActive(null)}>
          {items.map((service, i) => {
            const isActive = active === i;
            return (
              <li key={service._id} className="relative border-b border-border">
                <motion.span
                  aria-hidden
                  className="absolute inset-0 origin-bottom bg-foreground"
                  initial={false}
                  animate={{ scaleY: isActive ? 1 : 0 }}
                  transition={{ duration: 0.6, ease }}
                />
                <div
                  tabIndex={0}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="relative grid grid-cols-12 items-center gap-4 px-2 py-8 outline-none md:px-6 md:py-10"
                >
                  <span
                    className={cn(
                      "col-span-2 font-display text-sm transition-colors duration-500 md:col-span-1",
                      isActive ? "text-background/50" : "text-muted-foreground",
                    )}
                  >
                    {pad(i + 1)}
                  </span>
                  <h3
                    className={cn(
                      "col-span-10 font-display text-[clamp(1.75rem,4.5vw,4rem)] font-medium leading-none tracking-tight transition-[color,transform] duration-500 ease-expo md:col-span-6",
                      isActive ? "translate-x-2 text-background" : "text-foreground",
                    )}
                  >
                    {service.title}
                  </h3>
                  <div className="col-span-10 col-start-3 md:col-span-4 md:col-start-auto">
                    <p className={cn("text-sm transition-colors duration-500", isActive ? "text-background/70" : "text-muted-foreground")}>
                      {service.description}
                    </p>
                    <AnimatePresence>
                      {isActive && service.deliverables?.length ? (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5, ease }}
                          className="mt-3 flex flex-wrap gap-2 overflow-hidden"
                        >
                          {service.deliverables.map((d) => (
                            <li key={d} className="rounded-full border border-background/20 px-2.5 py-0.5 text-xs text-background/80">
                              {d}
                            </li>
                          ))}
                        </motion.ul>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className={cn(
                      "col-span-1 hidden size-8 justify-self-end transition-all duration-500 ease-expo md:block",
                      isActive ? "rotate-45 text-background" : "text-foreground/30",
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
