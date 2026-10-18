import React from "react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface PointsPillProps {
  points: number;
  prefix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PointsPill({
  points,
  prefix = "+",
  size = "md",
  className = "",
}: PointsPillProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-semibold gap-1",
    md: "px-2.5 py-1 text-xs font-bold gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-bold gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/25 tabular-nums select-none shadow-xs",
        sizeStyles[size],
        className
      )}
    >
      <Zap className="h-3 w-3 fill-primary/30 text-primary" />
      <span>
        {prefix}
        {points} Points
      </span>
    </span>
  );
}
