import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./AnimatedNumber";

interface StatProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  subtext?: string;
  badge?: React.ReactNode;
  className?: string;
  isNumber?: boolean;
}

export function Stat({
  label,
  value,
  icon,
  subtext,
  badge,
  className = "",
  isNumber = false,
}: StatProps) {
  return (
    <div
      className={cn(
        "rounded-[20px] bg-surface p-5 border border-border shadow-soft-sm hover:shadow-soft-md transition-shadow relative overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        {icon && (
          <div className="h-9 w-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        {isNumber && typeof value === "number" ? (
          <span className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            <AnimatedNumber value={value} />
          </span>
        ) : (
          <span className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            {value}
          </span>
        )}
        {badge}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-text-muted line-clamp-1">{subtext}</p>
      )}
    </div>
  );
}
