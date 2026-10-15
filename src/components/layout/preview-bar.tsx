"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** Shown in Draft Mode outside the Sanity Presentation iframe. */
export function PreviewBar({ label, exitLabel }: { label: string; exitLabel: string }) {
  const router = useRouter();
  const [inIframe, setInIframe] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setInIframe(window.self !== window.top);
  }, []);

  if (inIframe) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-4 rounded-full border border-accent/30 bg-background/90 py-2 pl-5 pr-2 text-sm backdrop-blur">
      <span className="flex items-center gap-2">
        <span className="size-2 animate-pulse rounded-full bg-accent" aria-hidden />
        {label}
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          await fetch("/api/draft-mode/disable");
          router.refresh();
        }}
        className="rounded-full bg-foreground px-4 py-1.5 font-display text-xs text-background transition hover:bg-accent disabled:opacity-50"
      >
        {exitLabel}
      </button>
    </div>
  );
}
