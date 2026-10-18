import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "text";
}

export function Skeleton({
  className,
  variant = "rectangle",
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rectangle: "rounded-[12px]",
    circle: "rounded-full",
    text: "rounded-[6px] h-4 w-full",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-surface-2 border border-border/50",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
