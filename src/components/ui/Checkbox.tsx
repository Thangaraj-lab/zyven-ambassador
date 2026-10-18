"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
  id,
}: CheckboxProps) {
  const checkboxId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "flex items-start gap-3 select-none cursor-pointer group",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative mt-0.5">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="sr-only"
        />
        <motion.div
          whileTap={disabled ? undefined : { scale: 0.9 }}
          className={cn(
            "h-5 w-5 rounded-[6px] border flex items-center justify-center transition-all",
            checked
              ? "bg-primary border-primary text-white shadow-soft-sm"
              : "bg-surface border-border group-hover:border-primary/50",
            "focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-1"
          )}
        >
          <AnimatePresence initial={false}>
            {checked && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs sm:text-sm font-semibold text-text leading-tight group-hover:text-primary transition-colors">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
