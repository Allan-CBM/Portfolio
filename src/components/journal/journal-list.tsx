"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import type { PostCard } from "@/sanity/types";
import { SanityImage } from "@/components/media/sanity-image";
import { cn, formatDate } from "@/lib/utils";

const TYPES = ["article", "caseStudy", "designNote", "aiExperiment"] as const;

export function JournalList({ locale, dict, posts }: { locale: Locale; dict: Dictionary["journal"]; posts: PostCard[] }) {
  const [filter, setFilter] = useState<string>("all");
  const available = TYPES.filter((type) => posts.some((post) => post.postType === type));
  const visible = filter === "all" ? posts : posts.filter((post) => post.postType === filter);

  if (!posts.length) {
    return <p className="rounded-2xl border border-dashed border-border p-10 font-display text-xl text-foreground/70">{dict.empty}</p>;
  }

  return (
    <>
      {available.length > 1 && (
        <div role="group" aria-label={dict.eyebrow} className="mb-14 flex flex-wrap gap-2">
          {["all", ...available].map((type) => {
            const active = filter === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(type)}
                className={cn(
                  "rounded-full border px-4 py-2 font-display text-sm transition-colors duration-500",
                  active ? "border-foreground bg-foreground text-background" : "border-border text-foreground/70 hover:text-foreground",
                )}
              >
                {type === "all" ? dict.all : dict.typesPlural[type]}
              </button>
            );
          })}
        </div>
      )}

      <ul className="border-t border-border">
        <AnimatePresence initial={false}>
          {visible.map((post) => (
            <motion.li
              key={post._id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-b border-border"
            >
              <Link
                href={`/${locale}/journal/${post.slug}`}
                className="group grid grid-cols-12 items-center gap-4 py-8 md:py-10"
                data-cursor={dict.read}
              >
                <span className="label col-span-12 md:col-span-2">{dict.types[post.postType] ?? post.postType}</span>
                <span className="col-span-12 md:col-span-6">
                  <span className="block font-display text-[clamp(1.5rem,3vw,2.75rem)] font-medium leading-tight tracking-tight transition-transform duration-700 ease-expo group-hover:translate-x-2">
                    {post.title}
                  </span>
                  {post.excerpt && <span className="mt-2 line-clamp-2 block max-w-xl text-sm text-muted-foreground">{post.excerpt}</span>}
                </span>
                <span className="col-span-8 text-sm text-muted-foreground md:col-span-2">
                  {formatDate(post.publishedAt, locale, { month: "short", year: "numeric", day: "numeric" })}
                </span>
                <span className="col-span-4 flex justify-end md:col-span-2">
                  <span className="relative hidden h-20 w-28 overflow-hidden rounded-md bg-card opacity-0 transition-all duration-700 ease-expo group-hover:opacity-100 md:block">
                    {post.coverImage?.asset && <SanityImage image={post.coverImage} sizes="112px" />}
                  </span>
                  <ArrowUpRight className="ml-4 size-6 self-center text-foreground/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent" aria-hidden />
                </span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
