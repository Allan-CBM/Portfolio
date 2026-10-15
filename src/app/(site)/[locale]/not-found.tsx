"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale) ? params.locale : "en";
  const dict = getDictionary(locale);

  return (
    <section className="container flex min-h-[85svh] flex-col justify-center pt-[var(--header-height)]">
      <p className="label mb-6 text-accent">404</p>
      <h1 className="font-display text-display-xl font-semibold">
        {dict.notFound.title.split("\n").map((line) => (
          <span key={line} className="block last:text-outline">
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-8 max-w-md text-lg text-muted-foreground">{dict.notFound.text}</p>
      <Button asChild size="lg" className="mt-10 w-fit">
        <Link href={`/${locale}`}>
          <ArrowLeft aria-hidden />
          {dict.notFound.back}
        </Link>
      </Button>
    </section>
  );
}
