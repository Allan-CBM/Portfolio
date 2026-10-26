"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/section-heading";
import { cn, pad } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function Services({ dict }: { dict: Dictionary["services"] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" aria-label={dict.eyebrow} className="section bg-card/40">
      <div className="container">
        <SectionHeading index="04" eyebrow={dict.eyebrow} title={dict.heading} />

        <ul className="mt-20 border-t border-border" onMouseLeave={() => setActive(null)}>
          {dict.items.map((service, i) => {
            const isActive = active === i;
            return (
              <li key={service.title} className="relative border-b border-border">
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
