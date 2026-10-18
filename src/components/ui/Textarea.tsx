"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
  charCount?: number;
  maxChars?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      label,
      hint,
      charCount,
      maxChars,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-xs font-bold text-text uppercase tracking-wider"
            >
              {label}
            </label>
          )}
          {typeof charCount === "number" && (
            <span className="text-[11px] text-text-muted tabular-nums">
              {charCount}
              {maxChars ? ` / ${maxChars}` : ""} chars
            </span>
          )}
        </div>
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-[12px] border bg-surface p-3.5 text-text text-sm transition-all outline-none resize-none",
            "border-border placeholder:text-text-muted/60",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          {...props}
        />
        {error ? (
          <p className="text-[11px] font-semibold text-danger">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-text-muted">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
