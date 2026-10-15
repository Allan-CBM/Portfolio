import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "../env";

const builder = imageUrlBuilder({ projectId: projectId || "unconfigured", dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

/** Absolute URL for OpenGraph / JSON-LD usage. */
export function ogImageUrl(source: SanityImageSource | null | undefined) {
  if (!source) return undefined;
  try {
    return urlFor(source).width(1200).height(630).fit("crop").quality(85).url();
  } catch {
    return undefined;
  }
}
