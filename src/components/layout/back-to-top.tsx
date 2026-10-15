"use client";

import { ArrowUp } from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import { Magnetic } from "@/components/motion/magnetic";

export function BackToTop({ label }: { label: string }) {
  const { scrollTo } = useApp();
  return (
    <Magnetic>
      <button
        type="button"
        onClick={() => scrollTo(0)}
        aria-label={label}
        className="flex size-14 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-background"
      >
        <ArrowUp className="size-4" aria-hidden />
      </button>
    </Magnetic>
  );
}
