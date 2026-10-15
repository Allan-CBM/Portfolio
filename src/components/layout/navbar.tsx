"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { useApp } from "@/components/providers/app-provider";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";

const ease = [0.76, 0, 0.24, 1] as const;

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary["nav"] }) {
  const pathname = usePathname();
  const { scrollTo, stopScroll, startScroll } = useApp();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const { scrollY } = useScroll();

  const home = `/${locale}`;
  const links = [
    { href: `${home}#work`, label: dict.work },
    { href: `${home}#about`, label: dict.about },
    { href: `${home}#services`, label: dict.services },
    { href: `${home}/journal`, label: dict.journal },
    { href: `${home}#contact`, label: dict.contact },
  ];

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > previous && y > 240);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) {
      stopScroll();
      document.documentElement.style.overflow = "hidden";
      firstLink.current?.focus();
    } else {
      startScroll();
      document.documentElement.style.overflow = "";
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, startScroll, stopScroll]);

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const [path, hash] = href.split("#");
    if (hash && pathname === path) {
      event.preventDefault();
      setOpen(false);
      scrollTo(`#${hash}`, { offset: -40 });
      history.replaceState(null, "", `#${hash}`);
    }
  };

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled && !open ? "border-b border-foreground/5 bg-background/70 backdrop-blur-xl" : "border-b border-transparent",
        )}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="container flex h-[var(--header-height)] items-center justify-between gap-6">
          <Link href={home} aria-label={dict.home} className="relative z-[2] text-foreground transition-colors hover:text-accent">
            <Logo />
          </Link>

          <nav aria-label={dict.primary} className="hidden md:block">
            <ul className="flex items-center gap-8">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(event) => onNavigate(event, link.href)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "link-underline font-display text-sm transition-colors",
                      isActive(link.href) ? "text-foreground" : "text-foreground/65 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-[2] flex items-center gap-5">
            <LocaleSwitcher locale={locale} label={dict.language} />
            <Magnetic className="hidden md:inline-block">
              <Link
                href={`${home}#contact`}
                onClick={(event) => onNavigate(event, `${home}#contact`)}
                className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-foreground/15 px-5 font-display text-sm transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-background"
              >
                <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                {dict.letsTalk}
              </Link>
            </Magnetic>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-10 items-center gap-3 font-display text-sm md:hidden"
            >
              <span>{open ? dict.close : dict.menu}</span>
              <span aria-hidden className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-expo",
                    open && "translate-y-[5.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-expo",
                    open && "-translate-y-[5.5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={dict.menu}
            className="fixed inset-0 z-[79] flex flex-col justify-end bg-background px-5 pb-10 pt-28 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
          >
            <nav aria-label={dict.primary}>
              <ul className="space-y-1">
                {links.map((link, i) => (
                  <li key={link.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.06 }}
                    >
                      <Link
                        ref={i === 0 ? firstLink : undefined}
                        href={link.href}
                        onClick={(event) => {
                          onNavigate(event, link.href);
                          setOpen(false);
                        }}
                        className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.5rem,12vw,4.5rem)] font-medium leading-none tracking-tight"
                      >
                        <span className="label">{String(i + 1).padStart(2, "0")}</span>
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
