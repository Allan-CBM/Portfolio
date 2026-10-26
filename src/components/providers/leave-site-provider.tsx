"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import { useApp } from "@/components/providers/app-provider";

const STORAGE_KEY = "am-skip-leave-warning";
const ease = [0.16, 1, 0.3, 1] as const;

type LeaveSiteContextValue = {
  /** True when the visitor opted out of the warning ("Don't ask me again"). */
  shouldWarn: () => boolean;
  /** Opens the warning for an external URL; `returnFocus` gets focus back when it closes. */
  requestLeave: (href: string, returnFocus?: HTMLElement | null) => void;
};

const LeaveSiteContext = createContext<LeaveSiteContextValue | null>(null);

function readSkipFlag() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSkipFlag() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {}
}

/**
 * Full-screen "you're about to leave this site" warning, used only for Behance links (see <ExternalLink>).
 * Blurs the page, traps focus, closes on Esc or a click on the backdrop, and pauses Lenis while open.
 */
export function LeaveSiteProvider({ dict, children }: { dict: Dictionary["leaveSite"]; children: ReactNode }) {
  const { stopScroll, startScroll } = useApp();
  const [href, setHref] = useState<string | null>(null);
  const [dontAsk, setDontAsk] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stayRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const textId = useId();
  const open = href !== null;

  const close = useCallback(() => setHref(null), []);

  const requestLeave = useCallback<LeaveSiteContextValue["requestLeave"]>((url, returnFocus) => {
    returnFocusRef.current = returnFocus ?? (document.activeElement as HTMLElement | null);
    setDontAsk(false);
    setHref(url);
  }, []);

  const value = useMemo<LeaveSiteContextValue>(() => ({ shouldWarn: () => !readSkipFlag(), requestLeave }), [requestLeave]);

  const proceed = () => {
    if (!href) return;
    if (dontAsk) writeSkipFlag();
    window.open(href, "_blank", "noopener,noreferrer");
    close();
  };

  // Lock scrolling (Lenis + native fallback for reduced motion), focus the safe action, restore focus on close.
  useEffect(() => {
    if (!open) return;
    stopScroll();
    document.documentElement.style.overflow = "hidden";
    stayRef.current?.focus();
    return () => {
      startScroll();
      document.documentElement.style.overflow = "";
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open, startScroll, stopScroll]);

  // Esc closes; Tab cycles inside the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button, input, [href], [tabindex]:not([tabindex='-1'])"),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <LeaveSiteContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            key="leave-site"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-background/60 p-5 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            onClick={close}
          >
            <motion.div
              ref={dialogRef}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={textId}
              className="liquid-glass w-full max-w-md rounded-2xl p-7 md:p-9"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.5, ease }}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id={titleId} className="font-display text-2xl font-medium leading-tight tracking-tight md:text-3xl">
                {dict.title}
              </h2>
              <p id={textId} className="mt-4 text-foreground/75">
                {dict.text}
              </p>

              <label className="mt-6 flex w-fit cursor-pointer items-center gap-3 text-sm text-foreground/75">
                <input
                  type="checkbox"
                  checked={dontAsk}
                  onChange={(event) => setDontAsk(event.target.checked)}
                  className="size-4 cursor-pointer accent-[rgb(var(--accent))]"
                />
                {dict.dontAsk}
              </label>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  ref={stayRef}
                  type="button"
                  onClick={close}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/20 px-6 font-display text-sm transition-colors duration-300 hover:border-foreground/50"
                >
                  {dict.stay}
                </button>
                <button
                  type="button"
                  onClick={proceed}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 font-display text-sm font-medium text-background transition-colors duration-300 hover:bg-foreground"
                >
                  {dict.continue}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LeaveSiteContext.Provider>
  );
}

export function useLeaveSite() {
  const context = useContext(LeaveSiteContext);
  if (!context) throw new Error("useLeaveSite must be used inside <LeaveSiteProvider>");
  return context;
}
