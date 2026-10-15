import type { ReactNode } from "react";

import { TextReveal } from "@/components/motion/text-reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index?: string;
  eyebrow: string;
  title: string;
  aside?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ index, eyebrow, title, aside, className, as = "h2" }: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-8 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-8">
        <p className="label mb-6 flex items-center gap-3">
          {index && <span className="text-accent">{index}</span>}
          <span aria-hidden className="h-px w-8 bg-border" />
          {eyebrow}
        </p>
        <TextReveal as={as} text={title} className="font-display text-display-lg font-medium" />
      </div>
      {aside && <div className="md:col-span-4 md:justify-self-end">{aside}</div>}
    </div>
  );
}
