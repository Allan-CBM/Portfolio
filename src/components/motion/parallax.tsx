"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  /** Distance in % of the element height travelled across the viewport. */
  offset?: number;
  className?: string;
  innerClassName?: string;
  /** Adds a subtle zoom-out while scrolling (image scaling). */
  scale?: boolean;
};

export function Parallax({ children, offset = 12, className, innerClassName, scale = false }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${offset}%`, `${offset}%`]);
  const s = useTransform(scrollYProgress, [0, 1], [1.18, 1.02]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className={cn("absolute inset-x-0 -inset-y-[14%]", innerClassName)}
        style={reduce ? undefined : { y, scale: scale ? s : 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
