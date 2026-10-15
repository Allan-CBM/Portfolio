"use client";

import Image, { type ImageLoaderProps } from "next/image";

import { urlFor } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/sanity/types";
import { cn } from "@/lib/utils";

type SanityImageProps = {
  image: SanityImageType | null | undefined;
  alt?: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Fill the parent (parent must be positioned). Defaults to true. */
  fill?: boolean;
  quality?: number;
};

export function SanityImage({ image, alt, sizes = "100vw", priority, className, fill = true, quality = 82 }: SanityImageProps) {
  if (!image?.asset?._id) return null;

  const dimensions = image.asset.metadata?.dimensions;
  const lqip = image.asset.metadata?.lqip;
  const loader = ({ width, quality: q }: ImageLoaderProps) =>
    urlFor(image).width(width).quality(q ?? quality).fit("max").url();

  const altText = alt ?? image.alt ?? "";
  const common = {
    loader,
    src: image.asset.url,
    sizes,
    priority,
    quality,
    placeholder: lqip ? ("blur" as const) : ("empty" as const),
    blurDataURL: lqip,
  };

  if (fill || !dimensions) {
    return <Image {...common} alt={altText} fill className={cn("object-cover", className)} />;
  }

  return <Image {...common} alt={altText} width={dimensions.width} height={dimensions.height} className={cn("h-auto w-full", className)} />;
}
