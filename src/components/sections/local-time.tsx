"use client";

import { useEffect, useState } from "react";

import { site } from "@/lib/site";

export function LocalTime() {
  const [time, setTime] = useState<string>("--:--");

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone });
    const update = () => setTime(format.format(new Date()));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className="tabular-nums text-foreground/80" suppressHydrationWarning>
      {time} BRT
    </time>
  );
}
