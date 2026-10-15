import type {
  FullWidthMediaBlock as FullWidthMediaBlockType,
  GalleryBlock as GalleryBlockType,
  ImageBlock as ImageBlockType,
  SanityImage as SanityImageType,
  VideoBlock as VideoBlockType,
} from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/media/sanity-image";
import { MediaVideo } from "@/components/media/media-video";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const sizeClass = {
  contained: "container max-w-5xl",
  wide: "container",
  full: "w-full",
};

function ratioOf(image: SanityImageType | null | undefined, aspect?: string) {
  if (aspect && aspect !== "auto") return aspect.replace("/", " / ");
  const r = image?.asset?.metadata?.dimensions?.aspectRatio;
  return r ? String(r) : "16 / 9";
}

function Caption({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null;
  return <figcaption className={cn("mt-4 text-sm text-muted-foreground", className)}>{text}</figcaption>;
}

export function ImageBlock({ block }: { block: ImageBlockType }) {
  if (!block.image?.asset) return null;
  const size = block.size ?? "wide";
  const sizes = size === "contained" ? "(min-width: 1024px) 64rem, 100vw" : "100vw";
  return (
    <figure className={cn("py-6 md:py-10", sizeClass[size])}>
      <Reveal>
        <div
          className={cn("relative overflow-hidden bg-card", size !== "full" && "rounded-xl")}
          style={{ aspectRatio: ratioOf(block.image, block.aspect) }}
        >
          {block.parallax ? (
            <Parallax className="h-full" offset={8}>
              <SanityImage image={block.image} sizes={sizes} />
            </Parallax>
          ) : (
            <SanityImage image={block.image} sizes={sizes} />
          )}
        </div>
      </Reveal>
      <Caption text={block.image.caption} className={size === "full" ? "container" : undefined} />
    </figure>
  );
}

export function GalleryGrid({ images, layout = "grid-2" }: { images: SanityImageType[]; layout?: GalleryBlockType["layout"] }) {
  const valid = images.filter((image) => image?.asset);
  if (!valid.length) return null;

  if (layout === "carousel") {
    return (
      <div className="overflow-x-auto pb-6 [scrollbar-width:thin]" data-lenis-prevent-wheel="false">
        <ul className="flex w-max snap-x snap-mandatory gap-4 px-5 md:gap-6 md:px-[max(2rem,calc((100vw-1600px)/2+3rem))]">
          {valid.map((image, i) => (
            <li key={image._key ?? i} className="snap-start">
              <figure>
                <div
                  className="relative h-[60vh] overflow-hidden rounded-xl bg-card"
                  style={{ aspectRatio: ratioOf(image) }}
                >
                  <SanityImage image={image} sizes="(min-width: 768px) 60vw, 90vw" />
                </div>
                <Caption text={image.caption} />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (layout === "masonry") {
    return (
      <div className="container columns-1 gap-4 sm:columns-2 md:gap-6 lg:columns-3">
        {valid.map((image, i) => (
          <Reveal key={image._key ?? i} delay={(i % 3) * 0.08} className="mb-4 break-inside-avoid md:mb-6">
            <figure>
              <div className="relative overflow-hidden rounded-xl bg-card" style={{ aspectRatio: ratioOf(image) }}>
                <SanityImage image={image} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
              </div>
              <Caption text={image.caption} />
            </figure>
          </Reveal>
        ))}
      </div>
    );
  }

  const cols = layout === "grid-3" ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <div className={cn("container grid gap-4 md:gap-6", cols)}>
      {valid.map((image, i) => (
        <Reveal key={image._key ?? i} delay={(i % 3) * 0.08}>
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-card">
              <SanityImage image={image} sizes={layout === "grid-3" ? "(min-width: 768px) 33vw, 100vw" : "(min-width: 768px) 50vw, 100vw"} />
            </div>
            <Caption text={image.caption} />
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

export function GalleryBlock({ block }: { block: GalleryBlockType }) {
  if (!block.images?.length) return null;
  return (
    <section className="py-10 md:py-16">
      {block.heading && (
        <div className="container mb-10">
          <h2 className="font-display text-display-sm font-medium">{block.heading}</h2>
        </div>
      )}
      <GalleryGrid images={block.images} layout={block.layout} />
    </section>
  );
}

export function VideoBlock({ block }: { block: VideoBlockType }) {
  const src = block.file?.asset?.url;
  if (!src && !block.url) return null;
  const size = block.size ?? "wide";
  const poster = block.poster?.asset ? urlFor(block.poster).width(1600).url() : undefined;
  return (
    <figure className={cn("py-6 md:py-10", sizeClass[size])}>
      <Reveal>
        <div
          className={cn("relative overflow-hidden bg-card", size !== "full" && "rounded-xl")}
          style={{ aspectRatio: (block.aspect ?? "16/9").replace("/", " / ") }}
        >
          <MediaVideo src={src} url={block.url} poster={poster} autoplay={block.autoplay !== false} title={block.caption ?? "Video"} />
        </div>
      </Reveal>
      <Caption text={block.caption} className={size === "full" ? "container" : undefined} />
    </figure>
  );
}

const heightClass = { auto: "aspect-[16/9]", tall: "h-[80vh]", screen: "h-[100svh]" };

export function FullWidthMediaBlock({ block }: { block: FullWidthMediaBlockType }) {
  const videoSrc = block.video?.asset?.url;
  if (!videoSrc && !block.image?.asset) return null;
  const height = block.height ?? "screen";
  const media = videoSrc ? (
    <MediaVideo src={videoSrc} poster={block.image?.asset ? urlFor(block.image).width(1920).url() : undefined} title={block.caption ?? "Video"} />
  ) : (
    <SanityImage image={block.image} sizes="100vw" />
  );

  return (
    <figure className="py-6 md:py-10">
      <div className={cn("relative w-full overflow-hidden bg-card", heightClass[height])}>
        {block.parallax && !videoSrc ? (
          <Parallax className="h-full" offset={10} scale>
            {media}
          </Parallax>
        ) : (
          media
        )}
      </div>
      <Caption text={block.caption} className="container" />
    </figure>
  );
}
