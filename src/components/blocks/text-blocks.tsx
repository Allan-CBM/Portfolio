import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type {
  CtaBlock as CtaBlockType,
  DividerBlock as DividerBlockType,
  HeroBlock as HeroBlockType,
  QuoteBlock as QuoteBlockType,
  RichTextBlock as RichTextBlockType,
  SanityImage as SanityImageType,
  TextBlock as TextBlockType,
  TwoColumnBlock as TwoColumnBlockType,
} from "@/sanity/types";
import { RichText } from "@/components/media/rich-text";
import { SanityImage } from "@/components/media/sanity-image";
import { MediaVideo } from "@/components/media/media-video";
import { Marquee } from "@/components/motion/marquee";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { Button } from "@/components/ui/button";
import { cn, isExternal } from "@/lib/utils";

function Eyebrow({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <p className="label mb-6 flex items-center gap-3">
      <span aria-hidden className="h-px w-8" style={{ background: "var(--project-color)" }} />
      {text}
    </p>
  );
}

export function HeroBlock({ block }: { block: HeroBlockType }) {
  const videoSrc = block.video?.asset?.url;
  const hasMedia = Boolean(videoSrc || block.image?.asset);
  const center = block.align === "center";
  return (
    <section className={cn("relative overflow-hidden", hasMedia ? "min-h-[90svh]" : "py-24 md:py-36")}>
      {hasMedia && (
        <div className="absolute inset-0">
          {videoSrc ? <MediaVideo src={videoSrc} title={block.heading ?? "Video"} /> : <SanityImage image={block.image} sizes="100vw" />}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}
      <div className={cn("container relative flex flex-col", hasMedia && "min-h-[90svh] justify-end pb-16", center && "items-center text-center")}>
        <Eyebrow text={block.eyebrow} />
        {block.heading && <TextReveal as="h2" text={block.heading} className="max-w-5xl font-display text-display-lg font-medium" />}
        {block.subheading && (
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-xl text-foreground/75">{block.subheading}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

const textSize = {
  default: "text-xl leading-relaxed text-foreground/75",
  large: "font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-light leading-[1.3] tracking-tight text-foreground",
  display: "font-display text-display-md font-medium text-foreground",
};

export function TextBlock({ block }: { block: TextBlockType }) {
  const size = block.size ?? "default";
  const align = block.align ?? "left";
  const themed = block.theme === "card" ? "bg-card" : block.theme === "project" ? "bg-[var(--project-color)] text-background" : "";

  return (
    <section className={cn("py-16 md:py-24", themed)}>
      <div className={cn("container", align === "split" ? "grid gap-8 md:grid-cols-12" : "max-w-5xl", align === "center" && "text-center")}>
        <div className={cn(align === "split" && "md:col-span-4")}>
          <Eyebrow text={block.eyebrow} />
          {block.heading && (
            <TextReveal
              as="h2"
              text={block.heading}
              className={cn("font-display font-medium", align === "split" ? "text-display-sm" : "text-display-md", align === "center" && "mx-auto")}
            />
          )}
        </div>
        {block.body && (
          <Reveal className={cn(align === "split" ? "md:col-span-7 md:col-start-6" : "mt-8", align === "center" && "mx-auto max-w-3xl")}>
            {block.body.split(/\n{2,}/).map((paragraph, i) => (
              <p
                key={i}
                className={cn(textSize[size], i > 0 && "mt-6", block.theme === "project" && "text-background")}
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function RichTextBlock({ block }: { block: RichTextBlockType }) {
  if (!block.content?.length) return null;
  return (
    <section className="py-16 md:py-24">
      <div className={cn("container", block.width === "wide" ? "max-w-5xl" : "max-w-3xl")}>
        <Eyebrow text={block.eyebrow} />
        <Reveal>
          <RichText value={block.content} />
        </Reveal>
      </div>
    </section>
  );
}

export function TwoColumnBlock({ block }: { block: TwoColumnBlockType }) {
  const imageLeft = block.imagePosition === "left";
  return (
    <section className="py-16 md:py-24">
      <div className="container grid items-start gap-12 md:grid-cols-12 md:gap-10">
        <div
          className={cn(
            "md:col-span-5",
            imageLeft ? "md:order-2 md:col-start-8" : "md:order-1",
            block.sticky !== false && "md:sticky md:top-28",
          )}
        >
          <Eyebrow text={block.eyebrow} />
          {block.heading && <TextReveal as="h2" text={block.heading} className="font-display text-display-sm font-medium" />}
          {block.body?.length ? (
            <Reveal className="mt-8">
              <RichText value={block.body} />
            </Reveal>
          ) : null}
        </div>
        {block.image?.asset && (
          <div className={cn("md:col-span-6", imageLeft ? "md:order-1" : "md:order-2 md:col-start-7")}>
            <Reveal>
              <div
                className="relative overflow-hidden rounded-xl bg-card"
                style={{ aspectRatio: String(block.image.asset.metadata?.dimensions?.aspectRatio ?? 4 / 5) }}
              >
                <Parallax className="h-full" offset={6}>
                  <SanityImage image={block.image} sizes="(min-width: 768px) 50vw, 100vw" />
                </Parallax>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

export function QuoteFigure({
  quote,
  author,
  role,
  avatar,
}: {
  quote?: string | null;
  author?: string | null;
  role?: string | null;
  avatar?: SanityImageType | null;
}) {
  if (!quote) return null;
  return (
    <Reveal>
      <figure className="mx-auto max-w-5xl">
        <span aria-hidden className="block font-display text-8xl leading-none" style={{ color: "var(--project-color)" }}>
          “
        </span>
        <blockquote className="-mt-6 font-display text-[clamp(1.75rem,3.6vw,3.5rem)] font-light leading-[1.15] tracking-tight">
          {quote}
        </blockquote>
        {(author || role) && (
          <figcaption className="mt-10 flex items-center gap-4">
            {avatar?.asset && (
              <span className="relative size-14 overflow-hidden rounded-full bg-card">
                <SanityImage image={avatar} alt={author ?? ""} sizes="56px" />
              </span>
            )}
            <span>
              {author && <span className="block font-display text-lg">{author}</span>}
              {role && <span className="block text-sm text-muted-foreground">{role}</span>}
            </span>
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}

export function QuoteBlock({ block }: { block: QuoteBlockType }) {
  return (
    <section className="container py-20 md:py-32">
      <QuoteFigure quote={block.quote} author={block.author} role={block.role} avatar={block.avatar} />
    </section>
  );
}

export function CtaBlock({ block }: { block: CtaBlockType }) {
  const href = block.buttonUrl;
  return (
    <section className="container py-20 md:py-28">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-8 py-16 text-center md:px-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 50% 120%, var(--project-color), transparent 60%)" }}
        />
        <div className="relative">
          {block.heading && <TextReveal as="h2" text={block.heading} className="mx-auto max-w-4xl font-display text-display-md font-medium" />}
          {block.text && <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">{block.text}</p>}
          {href && block.buttonLabel && (
            <Button asChild size="lg" className="mt-10">
              {isExternal(href) ? (
                <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {block.buttonLabel}
                  <ArrowUpRight aria-hidden />
                </a>
              ) : (
                <Link href={href}>
                  {block.buttonLabel}
                  <ArrowUpRight aria-hidden />
                </Link>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

const spacing = { sm: "py-6", md: "py-12", lg: "py-24" };

export function DividerBlock({ block }: { block: DividerBlockType }) {
  const pad = spacing[block.size ?? "md"];
  if (block.style === "space") return <div aria-hidden className={pad} />;
  if (block.style === "marquee" && block.label) {
    return (
      <div className={cn("border-y border-border", pad)}>
        <p className="sr-only">{block.label}</p>
        <Marquee duration={30}>
          <span aria-hidden className="flex items-center gap-10 pr-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="flex items-center gap-10">
                <span className={cn("whitespace-nowrap font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold uppercase tracking-tighter", i % 2 && "text-outline")}>
                  {block.label}
                </span>
                <span className="size-3 rounded-full" style={{ background: "var(--project-color)" }} />
              </span>
            ))}
          </span>
        </Marquee>
      </div>
    );
  }
  return (
    <div className={cn("container", pad)}>
      <hr className="border-border" />
    </div>
  );
}
