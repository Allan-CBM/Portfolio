"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollTarget = string | number | HTMLElement;

type AppContextValue = {
  /** True once the intro preloader has finished (or was skipped). */
  ready: boolean;
  setReady: (value: boolean) => void;
  scrollTo: (target: ScrollTarget, options?: { immediate?: boolean; offset?: number }) => void;
  stopScroll: () => void;
  startScroll: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll and refresh triggers on route change (hash links scroll natively).
  useEffect(() => {
    if (!window.location.hash) lenisRef.current?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, [pathname]);

  const scrollTo = useCallback<AppContextValue["scrollTo"]>((target, options) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: options?.offset ?? 0, immediate: options?.immediate });
      return;
    }
    const element =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target instanceof HTMLElement ? target : null;
    if (element) element.scrollIntoView({ behavior: options?.immediate ? "auto" : "smooth" });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      setReady,
      scrollTo,
      stopScroll: () => lenisRef.current?.stop(),
      startScroll: () => lenisRef.current?.start(),
    }),
    [ready, scrollTo],
  );

  return (
    <AppContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside <AppProvider>");
  return context;
}
