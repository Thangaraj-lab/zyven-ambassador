"use client";

import React, { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium select-none transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-[12px] cursor-pointer";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs min-h-[36px]",
      md: "h-11 px-5 text-sm min-h-[44px]",
      lg: "h-13 px-7 text-base font-semibold min-h-[52px]",
      icon: "h-10 w-10 p-0 min-h-[40px] min-w-[40px] rounded-full",
    };

    const variantStyles = {
      primary:
        "brand-gradient-bg text-white shadow-soft-sm hover:shadow-soft-md hover:brightness-105 active:brightness-95 border-0",
      secondary:
        "bg-surface-2 text-text hover:bg-surface border border-border shadow-soft-sm hover:border-border/80",
      outline:
        "bg-transparent text-text border border-border hover:bg-surface-2 hover:border-primary/50",
      ghost:
        "bg-transparent text-text hover:bg-surface-2 hover:text-primary",
      danger:
        "bg-danger text-white hover:bg-danger/90 shadow-soft-sm",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-1.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" />
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
