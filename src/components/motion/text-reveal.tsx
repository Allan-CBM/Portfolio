"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "div" | "span";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Wait for the preloader before animating (hero). */
  waitForIntro?: boolean;
  /** Split by "words" (default) or animate each line as one piece. */
  by?: "words" | "lines";
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Masked text reveal. Lines are split on "\n"; each word slides up from behind a mask.
 * Screen readers receive the full sentence via aria-label.
 */
export function TextReveal({
  text,
  as = "p",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.06,
  waitForIntro = false,
  by = "words",
}: TextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  // All supported tags share the same props; narrow to one for JSX typing.
  const Tag = as as "p";
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const { ready } = useApp();
  const play = inView && (!waitForIntro || ready);
  const lines = text.split("\n");
  let index = 0;

  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} aria-hidden className={cn("block", lineClassName)}>
          {(by === "words" ? line.split(" ") : [line]).map((word, wordIndex, arr) => {
            const i = index++;
            return (
              <span key={wordIndex} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
                <motion.span
                  className="inline-block will-change-transform"
                  initial={{ y: "115%", rotate: 4 }}
                  animate={play ? { y: "0%", rotate: 0 } : undefined}
                  transition={{ duration: 1.1, ease, delay: delay + i * stagger }}
                >
                  {word}
                  {wordIndex < arr.length - 1 ? " " : ""}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
