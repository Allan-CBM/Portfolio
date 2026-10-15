"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Testimonial } from "@/sanity/types";
import { SanityImage } from "@/components/media/sanity-image";
import { SectionHeading } from "@/components/section-heading";
import { cn, pad } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 8000;

export function Testimonials({ dict, items }: { dict: Dictionary["testimonials"]; items: Testimonial[] }) {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<number | undefined>(undefined);
  const total = items.length;
  const current = items[index];

  const go = useCallback(
    (delta: number) => setState(([i]) => [(i + delta + total) % total, delta]),
    [total],
  );

  useEffect(() => {
    if (paused || reduce || total < 2) return;
    timer.current = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer.current);
  }, [index, paused, reduce, total, go]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  if (!current) return null;

  return (
    <section aria-label={dict.eyebrow} className="section overflow-hidden">
      <div className="container">
        <SectionHeading
          index="06"
          eyebrow={dict.eyebrow}
          title={dict.heading}
          aside={
            total > 1 ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={dict.previous}
                  className="flex size-14 items-center justify-center rounded-full border border-border transition-colors duration-500 hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={dict.next}
                  className="flex size-14 items-center justify-center rounded-full border border-border transition-colors duration-500 hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            ) : null
          }
        />

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={dict.heading}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative mt-16 grid gap-10 rounded-2xl border border-border bg-card p-8 md:mt-20 md:grid-cols-12 md:p-14"
        >
          <Quote aria-hidden className="size-10 text-accent md:col-span-1" />
          <div className="relative min-h-[18rem] md:col-span-11" aria-live={paused ? "polite" : "off"}>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.figure
                key={current._id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${pad(index + 1)} ${dict.of} ${pad(total)}`}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.7, ease }}
                className="flex h-full flex-col justify-between gap-10"
              >
                <blockquote className="font-display text-[clamp(1.5rem,3vw,2.75rem)] font-light leading-[1.2] tracking-tight text-foreground">
                  “{current.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  {current.avatar?.asset && (
                    <span className="relative size-14 overflow-hidden rounded-full bg-background">
                      <SanityImage image={current.avatar} alt={current.author} sizes="56px" />
                    </span>
                  )}
                  <span>
                    <span className="block font-display text-lg">{current.author}</span>
                    <span className="block text-sm text-muted-foreground">
                      {[current.role, current.company].filter(Boolean).join(" — ")}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {total > 1 && (
            <div className="flex items-center gap-4 md:col-span-11 md:col-start-2">
              <span className="font-display text-sm tabular-nums text-muted-foreground">
                {pad(index + 1)} / {pad(total)}
              </span>
              <div className="flex flex-1 gap-2">
                {items.map((item, i) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setState([i, i > index ? 1 : -1])}
                    aria-label={`${dict.goTo} ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className="group relative h-6 flex-1"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-px bg-accent",
                        i === index && !paused && !reduce ? "w-full transition-[width] ease-linear" : i === index ? "w-full" : "w-0",
                      )}
                      style={i === index && !paused && !reduce ? { transitionDuration: `${AUTOPLAY_MS}ms` } : undefined}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
