"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useApp } from "@/components/providers/app-provider";
import { pad } from "@/lib/utils";

const STORAGE_KEY = "am-preloaded";
const DURATION = 1600;
const ease = [0.76, 0, 0.24, 1] as const;

const letters = (word: string) => word.split("");

export function Preloader({ label }: { label: string }) {
  const { setReady } = useApp();
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduceMotion) {
      setVisible(false);
      setReady(true);
      return;
    }

    root.classList.add("is-loading");
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setVisible(false);
          root.classList.remove("is-loading");
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {}
        }, 250);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("is-loading");
    };
  }, [setReady]);

  return (
    <AnimatePresence onExitComplete={() => setReady(true)}>
      {visible && (
        <motion.div
          data-preloader
          role="status"
          aria-live="polite"
          aria-label={label}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-background px-5 py-6 md:px-10 md:py-10"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1, ease }}
        >
          <div className="flex items-center justify-between">
            <span className="label">Portfolio — {new Date().getFullYear()}</span>
            <span className="label hidden sm:inline">Florianópolis, BR</span>
          </div>

          <div aria-hidden className="font-display text-display-2xl font-semibold uppercase">
            {["ALLAN", "MARTINS"].map((word, row) => (
              <span key={word} className="block overflow-hidden">
                <span className="flex">
                  {letters(word).map((char, i) => (
                    <motion.span
                      key={`${char}-${i}`}
                      className={row === 1 ? "text-outline" : undefined}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-110%" }}
                      transition={{ duration: 0.9, ease, delay: 0.1 + row * 0.12 + i * 0.045 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="h-px flex-1 bg-border">
              <div className="h-px origin-left bg-accent" style={{ transform: `scaleX(${count / 100})` }} />
            </div>
            <span className="font-display text-5xl font-light tabular-nums md:text-7xl">{pad(count, 3)}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
