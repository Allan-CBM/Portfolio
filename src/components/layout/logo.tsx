import { cn } from "@/lib/utils";

/** "AM" monogram — geometric A and M sharing a stem. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" fill="none" className={cn("h-7 w-auto", className)} aria-hidden>
      <path d="M2 30 L14 2 L26 30" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" />
      <path d="M7.2 19 H20.8" stroke="currentColor" strokeWidth="3" />
      <path d="M32 30 V2 L46 22 L60 2 V30" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" />
      <circle cx="29" cy="28.5" r="1.8" fill="rgb(var(--accent))" />
    </svg>
  );
}
