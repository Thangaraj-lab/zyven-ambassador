import React from "react";
import Link from "next/link";
import Image from "next/image";

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
  const markSizes = { sm: 26, md: 34, lg: 42 };
  const textSizes = {
    sm: "text-lg font-bold tracking-tight",
    md: "text-2xl font-bold tracking-tight",
    lg: "text-3xl font-extrabold tracking-tight",
  };

  const content = (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <Image
        src="/assets/z3d-crystal.png"
        alt="Zyvex"
        width={markSizes[size]}
        height={markSizes[size]}
        className="object-contain drop-shadow"
      />
      <div className="flex flex-col">
        <span
          className={`text-text font-bold leading-none ${textSizes[size]} flex items-center tracking-tight`}
        >
          Zyvex
        </span>
        {showTagline && (
          <span className="text-[10px] text-text-muted font-semibold tracking-wide uppercase mt-0.5">
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
