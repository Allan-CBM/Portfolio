"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroObject = dynamic(() => import("./hero-object"), { ssr: false, loading: () => null });

function Orb() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <div className="relative aspect-square w-[70%] animate-float">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgb(var(--accent)/0.55),transparent_55%),radial-gradient(circle_at_70%_70%,rgb(var(--secondary)/0.55),transparent_55%)] blur-2xl" />
        <div className="absolute inset-[18%] rounded-full border border-foreground/10 bg-[radial-gradient(circle_at_35%_30%,#1b1b22,#050505_70%)]" />
        <div className="absolute inset-[6%] animate-spin-slow rounded-full border border-dashed border-accent/20" />
      </div>
    </div>
  );
}

/**
 * Loads the WebGL scene only on capable devices (fine pointer, wide viewport, motion allowed)
 * and after the browser is idle — keeps LCP/TBT low. Falls back to a CSS orb.
 */
export function HeroVisual({ label }: { label: string }) {
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    const capable =
      window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches &&
      !!document.createElement("canvas").getContext("webgl2");
    if (!capable) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setEnable3D(true));
    return () => cancel(id as number);
  }, []);

  return (
    <div role="img" aria-label={label} className="relative h-full w-full">
      <Orb />
      {enable3D && <HeroObject />}
    </div>
  );
}
