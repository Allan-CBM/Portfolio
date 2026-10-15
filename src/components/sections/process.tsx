"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/section-heading";
import { pad } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Desktop: the section pins while the timeline draws and each step lights up (GSAP scrub).
 * Mobile / reduced motion: a simple stacked list with fade-ins.
 */
export function Process({ dict }: { dict: Dictionary["process"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-process-pin]",
            start: "top top",
            end: () => `+=${window.innerHeight * 1.6}`,
            scrub: 0.8,
            pin: "[data-process-pin]",
            anticipatePin: 1,
          },
        });
        tl.fromTo("[data-process-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: steps.length });
        steps.forEach((step, i) => {
          tl.fromTo(
            step,
            { opacity: 0.18, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            i * 0.9,
          );
          tl.fromTo(
            step.querySelector("[data-step-dot]"),
            { scale: 0.4, backgroundColor: "rgb(32,32,32)" },
            { scale: 1, backgroundColor: "rgb(110,231,255)", duration: 0.4 },
            i * 0.9,
          );
        });
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          gsap.from(step, {
            opacity: 0,
            y: 30,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 85%" },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={dict.eyebrow} className="relative">
      <div data-process-pin className="section flex min-h-screen flex-col justify-center">
        <div className="container">
          <SectionHeading index="05" eyebrow={dict.eyebrow} title={dict.heading} />

          <div data-process-track className="relative mt-20">
            <div aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-border lg:block" />
            <div
              aria-hidden
              data-process-line
              className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-gradient-to-r from-accent to-secondary lg:block"
            />
            <ol className="grid gap-12 lg:grid-cols-5 lg:gap-8">
              {dict.steps.map((step, i) => (
                <li key={step.title} data-step className="relative">
                  <span data-step-dot aria-hidden className="mb-8 hidden size-[15px] rounded-full bg-accent lg:block" />
                  <p className="font-display text-sm text-accent">{pad(i + 1)}</p>
                  <h3 className="mt-3 font-display text-3xl font-medium tracking-tight xl:text-4xl">{step.title}</h3>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
