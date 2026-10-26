"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

import { useLeaveSite } from "@/components/providers/leave-site-provider";

type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> & {
  href: string;
  "data-cursor"?: string;
};

/**
 * Link that opens in a new tab after the "you're about to leave this site" warning.
 * Use it only for Behance links; LinkedIn, mailto and internal links stay plain anchors.
 * Modified clicks (Ctrl/Cmd/Shift) keep the browser's native behaviour.
 */
export function ExternalLink({ href, onClick, children, ...props }: ExternalLinkProps) {
  const { shouldWarn, requestLeave } = useLeaveSite();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!shouldWarn()) return;
    event.preventDefault();
    requestLeave(href, event.currentTarget);
  };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
