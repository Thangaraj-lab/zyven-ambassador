"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  fallbackHref = "/dashboard",
  label = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface/90 text-xs sm:text-sm font-bold text-text hover:text-primary hover:border-primary/50 hover:bg-surface-2 transition-all shadow-soft-sm hover:-translate-x-0.5 cursor-pointer backdrop-blur-md group ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </button>
  );
}
