/**
 * Types for *localized* query results — every `{ en, pt }` field has already been
 * resolved to a single value by `localize()`.
 */
import type { PortableTextBlock } from "next-sanity";

export type RichText = PortableTextBlock[];

export type SanityImageAsset = {
  _id: string;
  url: string;
  mimeType?: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio: number };
  };
};

export type SanityImage = {
  _type?: "image";
  _key?: string;
  asset?: SanityImageAsset | null;
  alt?: string | null;
  caption?: string | null;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type SanityFile = {
  _type?: "file";
  asset?: { _id: string; url: string; mimeType?: string; originalFilename?: string } | null;
};

export type Metric = { _key: string; value: string; label?: string | null; description?: string | null };

export type Testimonial = {
  _id: string;
  quote: string;
  author: string;
  role?: string | null;
  company?: string | null;
  avatar?: SanityImage | null;
};

export type Experience = {
  _id: string;
  company: string;
  role?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean | null;
  description?: string | null;
  highlights?: string[] | null;
  url?: string | null;
};

export type Service = {
  _id: string;
  title: string;
  description?: string | null;
  deliverables?: string[] | null;
};

export type Stat = { _key: string; value: number; prefix?: string | null; suffix?: string | null; label?: string | null };

export type SkillGroup = { _key: string; title: string; items?: string[] | null };

export type SiteSettings = {
  title?: string | null;
  availability?: string | null;
  heroHeadline?: string | null;
  heroSubline?: string | null;
  aboutHeading?: string | null;
  aboutBody?: RichText | null;
  portrait?: SanityImage | null;
  stats?: Stat[] | null;
  skillGroups?: SkillGroup[] | null;
  email?: string | null;
  linkedin?: string | null;
  behance?: string | null;
  instagram?: string | null;
  seoDescription?: string | null;
  ogImage?: SanityImage | null;
};

export type ProjectCard = {
  _id: string;
  title: string;
  slug: string;
  client?: string | null;
  year?: number | null;
  category?: string | null;
  excerpt?: string | null;
  projectColor?: string | null;
  featured?: boolean | null;
  publishedAt?: string | null;
  image?: SanityImage | null;
  cover?: SanityImage | null;
};

/* ── Page builder blocks ─────────────────────────────────────── */

type BlockBase<T extends string> = { _type: T; _key: string };

export type HeroBlock = BlockBase<"heroBlock"> & {
  eyebrow?: string | null;
  heading?: string | null;
  subheading?: string | null;
  image?: SanityImage | null;
  video?: SanityFile | null;
  align?: "left" | "center";
};

export type TextBlock = BlockBase<"textBlock"> & {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  size?: "default" | "large" | "display";
  align?: "left" | "center" | "split";
  theme?: "default" | "card" | "project";
};

export type RichTextBlock = BlockBase<"richTextBlock"> & {
  eyebrow?: string | null;
  content?: RichText | null;
  width?: "narrow" | "wide";
};

export type ImageBlock = BlockBase<"imageBlock"> & {
  image?: SanityImage | null;
  size?: "contained" | "wide" | "full";
  aspect?: string;
  parallax?: boolean;
};

export type GalleryBlock = BlockBase<"galleryBlock"> & {
  heading?: string | null;
  images?: SanityImage[] | null;
  layout?: "grid-2" | "grid-3" | "masonry" | "carousel";
};

export type VideoBlock = BlockBase<"videoBlock"> & {
  file?: SanityFile | null;
  url?: string | null;
  poster?: SanityImage | null;
  caption?: string | null;
  autoplay?: boolean;
  aspect?: string;
  size?: "contained" | "wide" | "full";
};

export type TwoColumnBlock = BlockBase<"twoColumnBlock"> & {
  eyebrow?: string | null;
  heading?: string | null;
  body?: RichText | null;
  image?: SanityImage | null;
  imagePosition?: "left" | "right";
  sticky?: boolean;
};

export type QuoteBlock = BlockBase<"quoteBlock"> & {
  quote?: string | null;
  author?: string | null;
  role?: string | null;
  avatar?: SanityImage | null;
};

export type MetricsBlock = BlockBase<"metricsBlock"> & { heading?: string | null; items?: Metric[] | null };

export type ProcessBlock = BlockBase<"processBlock"> & {
  eyebrow?: string | null;
  heading?: string | null;
  steps?: { _key: string; title?: string | null; description?: string | null; image?: SanityImage | null }[] | null;
};

export type ResultsBlock = BlockBase<"resultsBlock"> & {
  heading?: string | null;
  summary?: string | null;
  items?: string[] | null;
  metrics?: Metric[] | null;
};

export type CtaBlock = BlockBase<"ctaBlock"> & {
  heading?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
};

export type DividerBlock = BlockBase<"dividerBlock"> & {
  style?: "line" | "space" | "marquee";
  label?: string | null;
  size?: "sm" | "md" | "lg";
};

export type FullWidthMediaBlock = BlockBase<"fullWidthMediaBlock"> & {
  image?: SanityImage | null;
  video?: SanityFile | null;
  caption?: string | null;
  height?: "auto" | "tall" | "screen";
  parallax?: boolean;
};

export type PageBlock =
  | HeroBlock
  | TextBlock
  | RichTextBlock
  | ImageBlock
  | GalleryBlock
  | VideoBlock
  | TwoColumnBlock
  | QuoteBlock
  | MetricsBlock
  | ProcessBlock
  | ResultsBlock
  | CtaBlock
  | DividerBlock
  | FullWidthMediaBlock;

export type Project = Omit<ProjectCard, "image" | "cover"> & {
  _type: "project";
  _updatedAt: string;
  services?: string[] | null;
  challenge?: string | null;
  research?: string | null;
  solution?: string | null;
  results?: string | null;
  metrics?: Metric[] | null;
  featuredImage?: SanityImage | null;
  coverImage?: SanityImage | null;
  thumbnail?: SanityImage | null;
  gallery?: SanityImage[] | null;
  video?: SanityFile | null;
  videoUrl?: string | null;
  behanceUrl?: string | null;
  projectUrl?: string | null;
  testimonial?: Testimonial | null;
  pageBuilder?: PageBlock[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  next?: ProjectCard | null;
};

export type PostType = "article" | "caseStudy" | "designNote" | "aiExperiment";

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  postType: PostType;
  excerpt?: string | null;
  publishedAt?: string | null;
  tags?: string[] | null;
  coverImage?: SanityImage | null;
};

export type Post = PostCard & {
  body?: RichText | null;
  _updatedAt: string;
  relatedProject?: ProjectCard | null;
  next?: PostCard | null;
};

export type SeoDoc = {
  title?: string | null;
  excerpt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  client?: string | null;
  category?: string | null;
  year?: number | null;
  publishedAt?: string | null;
  _updatedAt?: string;
  image?: SanityImage | null;
};

export type HomeData = {
  settings: SiteSettings | null;
  featured: ProjectCard[];
  projectCount: number;
  testimonials: Testimonial[];
  experiences: Experience[];
  services: Service[];
};
