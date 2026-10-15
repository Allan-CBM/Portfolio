import { Fragment } from "react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { SkillGroup } from "@/sanity/types";
import { Marquee } from "@/components/motion/marquee";

type SkillsProps = { dict: Dictionary["skills"]; groups?: SkillGroup[] | null };

export function Skills({ dict, groups }: SkillsProps) {
  const data = groups?.length
    ? groups.map((group) => ({ title: group.title, items: group.items ?? [] }))
    : dict.groups;

  return (
    <section aria-label={dict.eyebrow} className="relative overflow-hidden border-y border-border py-16 md:py-24">
      <p className="label container mb-10">{dict.eyebrow}</p>
      <ul className="sr-only">
        {data.map((group) => (
          <li key={group.title}>
            {group.title}: {group.items.join(", ")}
          </li>
        ))}
      </ul>
      <div aria-hidden className="flex flex-col gap-4 md:gap-6">
        {data.map((group, row) => (
          <Marquee key={group.title} reverse={row % 2 === 1} duration={38 + row * 6}>
            <span className="flex items-center gap-8 pr-8 md:gap-12 md:pr-12">
              <span
                className={
                  row % 2 === 0
                    ? "font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold uppercase leading-none tracking-tighter"
                    : "text-outline font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold uppercase leading-none tracking-tighter"
                }
              >
                {group.title}
              </span>
              {group.items.map((item) => (
                <Fragment key={item}>
                  <span className="size-2 shrink-0 rounded-full bg-accent md:size-3" />
                  <span className="whitespace-nowrap font-display text-xl text-foreground/60 md:text-3xl">{item}</span>
                </Fragment>
              ))}
              <span className="size-2 shrink-0 rotate-45 bg-secondary md:size-3" />
            </span>
          </Marquee>
        ))}
      </div>
    </section>
  );
}
