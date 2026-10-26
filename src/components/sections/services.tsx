"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/section-heading";
import { cn, pad } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Accordion of services: click (or Enter/Space) a row to reveal its description.
 * One row open at a time; the open row gets the white fill.
 */
export function Services({ dict }: { dict: Dictionary["services"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="services" aria-label={dict.eyebrow} className="section bg-card/40">
      <div className="container">
        <SectionHeading index="04" eyebrow={dict.eyebrow} title={dict.heading} />

        <ul className="mt-20 border-t border-border">
          {dict.items.map((service, i) => {
            const open = openIndex === i;
            const buttonId = `${baseId}-service-${i}`;
            const panelId = `${baseId}-service-panel-${i}`;
            return (
              <li key={service.title} className="relative border-b border-border">
                <motion.span
                  aria-hidden
                  className="absolute inset-0 origin-bottom bg-foreground"
                  initial={false}
                  animate={{ scaleY: open ? 1 : 0 }}
                  transition={{ duration: 0.6, ease }}
                />
                <h3 className="relative">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="group grid w-full grid-cols-12 items-center gap-4 px-2 py-8 text-left md:px-6 md:py-10"
                  >
                    <span
                      className={cn(
                        "col-span-2 font-display text-sm transition-colors duration-500 md:col-span-1",
                        open ? "text-background/50" : "text-muted-foreground",
                      )}
                    >
                      {pad(i + 1)}
                    </span>
                    <span
                      className={cn(
                        "col-span-8 font-display text-[clamp(1.75rem,4.5vw,4rem)] font-medium leading-none tracking-tight transition-[color,transform] duration-500 ease-expo md:col-span-10",
                        open
                          ? "translate-x-2 text-background"
                          : "text-foreground motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1",
                      )}
                    >
                      {service.title}
                    </span>
                    <Plus
                      aria-hidden
                      className={cn(
                        "col-span-2 size-6 justify-self-end transition-[color,transform] duration-500 ease-expo md:col-span-1 md:size-8",
                        open
                          ? "rotate-45 text-background"
                          : "text-foreground/30 group-hover:text-foreground/80 group-focus-visible:text-foreground/80",
                      )}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      key="panel"
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease }}
                      className="relative overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-4 px-2 pb-8 md:px-6 md:pb-10">
                        <p className="col-span-10 col-start-3 text-sm text-background/70 md:col-span-4 md:col-start-8 md:text-base">
                          {service.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
