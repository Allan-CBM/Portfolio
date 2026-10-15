import type { PageBlock } from "@/sanity/types";
import { CtaBlock, DividerBlock, HeroBlock, QuoteBlock, RichTextBlock, TextBlock, TwoColumnBlock } from "./text-blocks";
import { FullWidthMediaBlock, GalleryBlock, ImageBlock, VideoBlock } from "./media-blocks";
import { MetricsBlock, ProcessBlock, ResultsBlock } from "./data-blocks";

/** Renders the drag-and-drop page builder array from Sanity, in order. */
export function BlockRenderer({ blocks }: { blocks?: PageBlock[] | null }) {
  if (!blocks?.length) return null;

  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case "heroBlock":
            return <HeroBlock key={block._key} block={block} />;
          case "textBlock":
            return <TextBlock key={block._key} block={block} />;
          case "richTextBlock":
            return <RichTextBlock key={block._key} block={block} />;
          case "imageBlock":
            return <ImageBlock key={block._key} block={block} />;
          case "galleryBlock":
            return <GalleryBlock key={block._key} block={block} />;
          case "videoBlock":
            return <VideoBlock key={block._key} block={block} />;
          case "twoColumnBlock":
            return <TwoColumnBlock key={block._key} block={block} />;
          case "quoteBlock":
            return <QuoteBlock key={block._key} block={block} />;
          case "metricsBlock":
            return <MetricsBlock key={block._key} block={block} />;
          case "processBlock":
            return <ProcessBlock key={block._key} block={block} />;
          case "resultsBlock":
            return <ResultsBlock key={block._key} block={block} />;
          case "ctaBlock":
            return <CtaBlock key={block._key} block={block} />;
          case "dividerBlock":
            return <DividerBlock key={block._key} block={block} />;
          case "fullWidthMediaBlock":
            return <FullWidthMediaBlock key={block._key} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
