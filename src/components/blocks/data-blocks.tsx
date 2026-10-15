import type {
  Metric,
  MetricsBlock as MetricsBlockType,
  ProcessBlock as ProcessBlockType,
  ResultsBlock as ResultsBlockType,
} from "@/sanity/types";
import { SanityImage } from "@/components/media/sanity-image";
import { Counter } from "@/components/motion/counter";
import { Reveal, Stagger, StaggerItem, StaggerList, StaggerListItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { cn, pad } from "@/lib/utils";

/** Animates numeric metrics (e.g. "+240%") while keeping prefixes/suffixes intact. */
function MetricValue({ value }: { value: string }) {
  const match = value.match(/^([^\d-]*)(-?\d+(?:[.,]\d+)?)(.*)$/);
  if (!match || /[.,]/.test(match[2])) return <span>{value}</span>;
  return <Counter value={Number(match[2])} prefix={match[1]} suffix={match[3]} />;
}

export function MetricsGrid({ items }: { items: Metric[] }) {
  return (
    <Stagger className={cn("grid gap-px overflow-hidden rounded-2xl border border-border bg-border", items.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
      {items.map((metric) => (
        <StaggerItem key={metric._key} className="flex flex-col justify-between gap-10 bg-background p-8 md:p-10">
          <p className="font-display text-[clamp(3rem,6vw,5.5rem)] font-medium leading-none tracking-tighter" style={{ color: "var(--project-color)" }}>
            <MetricValue value={metric.value} />
          </p>
          <div>
            {metric.label && <p className="font-display text-lg">{metric.label}</p>}
            {metric.description && <p className="mt-2 text-sm text-muted-foreground">{metric.description}</p>}
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function MetricsBlock({ block }: { block: MetricsBlockType }) {
  if (!block.items?.length) return null;
  return (
    <section className="container py-16 md:py-24">
      {block.heading && <TextReveal as="h2" text={block.heading} className="mb-12 font-display text-display-sm font-medium" />}
      <MetricsGrid items={block.items} />
    </section>
  );
}

export function ProcessBlock({ block }: { block: ProcessBlockType }) {
  if (!block.steps?.length) return null;
  return (
    <section className="container py-16 md:py-24">
      {block.eyebrow && <p className="label mb-6">{block.eyebrow}</p>}
      {block.heading && <TextReveal as="h2" text={block.heading} className="mb-16 font-display text-display-md font-medium" />}
      <StaggerList ordered className="relative grid gap-12 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
        {block.steps.map((step, i) => (
          <StaggerListItem key={step._key} className="relative border-t border-border pt-6">
            <span aria-hidden className="absolute -top-px left-0 h-px w-12" style={{ background: "var(--project-color)" }} />
            <p className="font-display text-sm" style={{ color: "var(--project-color)" }}>
              {pad(i + 1)}
            </p>
            {step.title && <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">{step.title}</h3>}
            {step.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>}
            {step.image?.asset && (
              <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-lg bg-card">
                <SanityImage image={step.image} sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
            )}
          </StaggerListItem>
        ))}
      </StaggerList>
    </section>
  );
}

export function ResultsBlock({ block }: { block: ResultsBlockType }) {
  return (
    <section className="container py-16 md:py-24">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          {block.heading && <TextReveal as="h2" text={block.heading} className="font-display text-display-md font-medium" />}
          {block.summary && (
            <Reveal>
              <p className="mt-8 text-lg leading-relaxed text-foreground/70">{block.summary}</p>
            </Reveal>
          )}
        </div>
        {block.items?.length ? (
          <StaggerList className="divide-y divide-border border-y border-border md:col-span-6 md:col-start-7">
            {block.items.filter(Boolean).map((item, i) => (
              <StaggerListItem key={`${item}-${i}`} className="flex items-baseline gap-6 py-5">
                <span className="font-display text-xs" style={{ color: "var(--project-color)" }}>
                  {pad(i + 1)}
                </span>
                <span className="font-display text-xl">{item}</span>
              </StaggerListItem>
            ))}
          </StaggerList>
        ) : null}
      </div>
      {block.metrics?.length ? (
        <div className="mt-16">
          <MetricsGrid items={block.metrics} />
        </div>
      ) : null}
    </section>
  );
}
