import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type { RichText as RichTextValue, SanityImage as SanityImageType } from "@/sanity/types";
import { cn, isExternal } from "@/lib/utils";
import { SanityImage } from "./sanity-image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    lead: ({ children }) => <p className="lead">{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    highlight: ({ children }) => <mark>{children}</mark>,
    underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      if (!isExternal(href)) return <Link href={href}>{children}</Link>;
      const blank = value?.blank !== false && href.startsWith("http");
      return (
        <a href={href} {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: SanityImageType & { asset?: { _ref?: string } } }) => {
      // Inline images reference assets by _ref; build a minimal image object for the loader.
      const ref = (value.asset as { _ref?: string; _id?: string } | undefined)?._ref ?? value.asset?._id;
      if (!ref) return null;
      const image: SanityImageType = {
        ...value,
        asset: { _id: ref, url: `https://cdn.sanity.io/${ref}`, metadata: value.asset?.metadata },
      };
      const [, , dims] = ref.split("-");
      const [w, h] = (dims ?? "16x9").split("x").map(Number);
      return (
        <figure className="my-12">
          <div className="relative overflow-hidden rounded-lg bg-card" style={{ aspectRatio: `${w} / ${h}` }}>
            <SanityImage image={image} sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
          {value.caption && <figcaption className="label mt-3 normal-case tracking-normal">{value.caption}</figcaption>}
        </figure>
      );
    },
  },
};

export function RichText({ value, className }: { value?: RichTextValue | null; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={cn("prose-am", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
