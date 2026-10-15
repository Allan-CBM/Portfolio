"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

type MediaVideoProps = {
  src?: string | null;
  url?: string | null;
  poster?: string;
  autoplay?: boolean;
  className?: string;
  title?: string;
};

function embedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`;
  return null;
}

/**
 * Plays uploaded/direct videos only while on screen (saves CPU + bandwidth),
 * or embeds YouTube/Vimeo lazily.
 */
export function MediaVideo({ src, url, poster, autoplay = true, className, title = "Video" }: MediaVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const embed = !src && url ? embedUrl(url) : null;
  const source = src || (!embed ? url : null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoplay) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoplay, source]);

  if (embed) {
    return (
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        className={cn("absolute inset-0 h-full w-full border-0", className)}
      />
    );
  }

  if (!source) return null;

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <>
      <video
        ref={ref}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        src={source}
        poster={poster}
        muted={autoplay}
        loop={autoplay}
        playsInline
        preload="metadata"
        controls={!autoplay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={title}
      />
      {autoplay && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-4 right-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-black/70"
          aria-label={playing ? "Pause video" : "Play video"}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
      )}
    </>
  );
}
