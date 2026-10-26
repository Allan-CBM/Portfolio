"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { useApp } from "@/components/providers/app-provider";
import { TextReveal } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroVisual } from "@/components/three/hero-visual";
import { Button } from "@/components/ui/button";
import { LocalTime } from "./local-time";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ dict }: { dict: Dictionary["hero"] }) {
  const { ready, scrollTo } = useApp();
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease, delay },
  });

  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[var(--header-height)]">
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[20%] top-[-10%] h-[60vw] w-[60vw] rounded-full bg-secondary/10 blur-[140px]" />
        <div className="absolute -right-[10%] bottom-[-20%] h-[50vw] w-[50vw] rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--border)/0.5)_1px,transparent_1px)] bg-[size:calc(100%/6)_100%] opacity-40 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" />
      </div>

      <div className="container relative grid flex-1 items-center gap-10 py-10 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-8">
          <motion.ul {...show(0.1)} className="mb-10 flex flex-col gap-1.5">
            {dict.roles.map((role, i) => (
              <li key={role} className="label flex items-center gap-3 text-foreground/70">
                <span className="text-accent">0{i + 1}</span>
                {role}
              </li>
            ))}
          </motion.ul>

          <TextReveal
            as="h1"
            text={dict.headline}
            waitForIntro
            delay={0.15}
            stagger={0.05}
            className="font-display text-display-xl font-medium"
            lineClassName="[&:nth-child(2)]:text-foreground/55"
          />
          <span id="hero-title" className="sr-only">
            Allan Martins
          </span>

          <motion.p {...show(0.7)} className="mt-10 max-w-md text-base text-muted-foreground md:text-lg">
            {dict.sub}
          </motion.p>

          <motion.div {...show(0.85)} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button size="lg" onClick={() => scrollTo("#work", { offset: -40 })} data-cursor={dict.viewWork}>
                {dict.viewWork}
                <ArrowDown className="transition-transform duration-500 group-hover/button:translate-y-0.5" aria-hidden />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button size="lg" variant="outline" onClick={() => scrollTo("#contact", { offset: -40 })}>
                {dict.letsTalk}
                <ArrowUpRight className="transition-transform duration-500 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" aria-hidden />
              </Button>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          className="pointer-events-auto absolute inset-0 -z-0 opacity-40 lg:relative lg:col-span-4 lg:h-[min(70vh,640px)] lg:opacity-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.6, ease, delay: 0.3 }}
        >
          <HeroVisual label={dict.objectLabel} />
        </motion.div>
      </div>

      <motion.div {...show(1.1)} className="container relative z-10 grid grid-cols-2 gap-4 border-t border-border py-6 text-xs md:grid-cols-4">
        <p className="flex items-center gap-2 text-foreground/80">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {dict.available}
        </p>
        <p className="text-muted-foreground md:text-center">{dict.basedIn}</p>
        <p className="hidden text-muted-foreground md:block md:text-center">
          {dict.localTime} — <LocalTime />
        </p>
        <button
          type="button"
          onClick={() => scrollTo("#about", { offset: -40 })}
          className="flex items-center justify-end gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          {dict.scroll}
          <ArrowDown className="size-3.5 animate-bounce" aria-hidden />
        </button>
      </motion.div>
    </section>
  );
}
