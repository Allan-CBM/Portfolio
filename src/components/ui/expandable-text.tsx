"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ExpandableTextProps = {
  paragraphs: string[];
  moreLabel: string;
  lessLabel: string;
  /** Height (px) of the collapsed preview, roughly 7 lines of body text. */
  collapsedHeight?: number;
  className?: string;
};

/**
 * Paragraphs that show a short preview fading into the background.
 * Hovering (or focusing) reveals an arrow button; clicking expands the text.
 * On touch devices the button is always visible.
 */
export function ExpandableText({ paragraphs, moreLabel, lessLabel, collapsedHeight = 210, className }: ExpandableTextProps) {
  const [open, setOpen] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => setFullHeight(el.scrollHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [paragraphs]);

  // Before measuring (SSR / first paint) assume it needs the toggle, so there is no layout jump.
  const canExpand = fullHeight === null || fullHeight > collapsedHeight + 24;
  const collapsed = canExpand && !open;
  const maxHeight = !canExpand ? undefined : open ? (fullHeight ?? undefined) : collapsedHeight;

  return (
    <div className={cn("group/expand", className)}>
      <div
        className={cn(
          "relative overflow-hidden [transition-duration:600ms] [transition-property:max-height] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          collapsed && "cursor-pointer",
        )}
        style={{ maxHeight }}
        onClick={collapsed ? () => setOpen(true) : undefined}
      >
        <div ref={innerRef} className="space-y-6">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        {/* Fade to background: disappears when expanded */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/75 to-transparent transition-opacity duration-500 motion-reduce:transition-none",
            collapsed ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {canExpand ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className={cn(
            "mt-3 inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-4 py-2 text-sm text-foreground/80",
            "transition duration-300 hover:border-accent hover:text-accent focus-visible:opacity-100 motion-reduce:transition-none",
            // Hidden until the text is hovered or the button focused; always visible when open or on touch screens.
            open
              ? "opacity-100"
              : "translate-y-1 opacity-0 group-hover/expand:translate-y-0 group-hover/expand:opacity-100 focus-visible:translate-y-0 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100",
          )}
        >
          <span>{open ? lessLabel : moreLabel}</span>
          <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform duration-500 motion-reduce:transition-none", open && "rotate-180")} />
        </button>
      ) : null}
    </div>
  );
}
