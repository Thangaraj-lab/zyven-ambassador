"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";

export function LocaleToggle({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ta" : "en";
    // Set cookie NEXT_LOCALE for 1 year
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 h-9 px-2.5 rounded-full bg-surface-2 border border-border text-xs font-semibold text-text hover:text-primary hover:border-primary/40 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${
        isPending ? "opacity-60" : ""
      } ${className}`}
      aria-label="Toggle language between English and Tamil"
      title="Toggle Language"
    >
      <Languages className="h-3.5 w-3.5 text-primary" />
      <span className="uppercase">{locale === "en" ? "தமிழ்" : "EN"}</span>
    </button>
  );
}
