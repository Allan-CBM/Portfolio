"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

// Skip the curtain on the very first page load (the preloader handles the intro).
let hasNavigated = false;

/**
 * Curtain wipe on every client-side route change (used from template.tsx, which re-mounts per
 * navigation). Content itself is never hidden, so LCP isn't delayed.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  // Decided once per mount: re-renders (router.refresh from live content, Fast Refresh)
  // must never bring the curtain back.
  const [animateIn] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[86] origin-top bg-accent"
        initial={animateIn ? { scaleY: 1 } : false}
        animate={{ scaleY: 0 }}
        style={animateIn ? undefined : { scaleY: 0 }}
        transition={{ duration: 0.7, ease }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[85] origin-top bg-card"
        initial={animateIn ? { scaleY: 1 } : false}
        animate={{ scaleY: 0 }}
        style={animateIn ? undefined : { scaleY: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.05 }}
      />
      {children}
    </>
  );
}
