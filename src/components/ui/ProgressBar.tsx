"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMotionOK, ease } from "@/lib/motion";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  height?: number | string;
  className?: string;
  indicatorClassName?: string;
  showGlow?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  height = "8px",
  className = "",
  indicatorClassName = "",
  showGlow = true,
}: ProgressBarProps) {
  const motionOK = useMotionOK();
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-surface-2 border border-border/60",
        className
      )}
      style={{ height }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <motion.div
        className={cn(
          "relative h-full brand-gradient-bg rounded-full",
          indicatorClassName
        )}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={
          motionOK
            ? { duration: 0.8, ease: ease.out }
            : { duration: 0 }
        }
      >
        {showGlow && percentage > 0 && (
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/40 blur-[2px] rounded-full" />
        )}
      </motion.div>
    </div>
  );
}
