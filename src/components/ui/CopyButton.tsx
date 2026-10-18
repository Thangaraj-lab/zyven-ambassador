"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export function CopyButton({
  textToCopy,
  label = "Copy Text",
  copiedLabel = "Copied!",
  className = "",
  variant = "secondary",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const variantStyles = {
    primary: "brand-gradient-bg text-white hover:brightness-105",
    secondary: "bg-surface-2 text-text hover:bg-surface border border-border",
    outline: "border border-border text-text hover:bg-surface-2",
    ghost: "text-text-muted hover:text-text hover:bg-surface-2",
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold select-none transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
          variantStyles[variant],
          className
        )}
        aria-label={copied ? copiedLabel : label}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="text-success"
            >
              <Check className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
            >
              <Copy className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
        <span>{copied ? copiedLabel : label}</span>
      </button>

      {/* Floating tooltip badge */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -28, scale: 1 }}
            exit={{ opacity: 0, y: -34, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none px-2 py-0.5 rounded-full bg-text text-bg text-[10px] font-bold shadow-soft-sm whitespace-nowrap"
          >
            ✓ Template Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
