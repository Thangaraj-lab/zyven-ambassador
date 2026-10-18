import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeMap = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const getInitials = (n: string) => {
    if (!n) return "Z";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  // Generate deterministic subtle gradient based on name
  const getGradient = (n: string) => {
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 55%) 0%, hsl(${(hue + 40) % 360}, 80%, 45%) 100%)`;
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden select-none flex items-center justify-center font-bold text-white shadow-xs shrink-0 border border-white/20",
        sizeMap[size],
        className
      )}
      style={!src ? { background: getGradient(name) } : undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
