import React from "react";
import Link from "next/link";
import { ZyvenMark } from "./ZyvenMark";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  showTagline?: boolean;
}

export function Logo({
  size = "md",
  href = "/",
  className = "",
  showTagline = false,
}: LogoProps) {
  const markSizes = { sm: 24, md: 32, lg: 40 };
  const textSizes = {
    sm: "text-lg font-bold tracking-tight",
    md: "text-2xl font-extrabold tracking-tight",
    lg: "text-3xl font-extrabold tracking-tight",
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <ZyvenMark size={markSizes[size]} />
      <div className="flex flex-col">
        <span
          className={`font-display text-text leading-none ${textSizes[size]} flex items-center tracking-tight`}
        >
          Zyven
        </span>
        {showTagline && (
          <span className="text-[10px] text-text-muted font-medium tracking-wide uppercase mt-0.5">
            Ambassador
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
