"use client";

import React, { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  hoverable?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, interactive = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          hoverable || interactive
            ? { y: -3, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
            : undefined
        }
        whileTap={interactive ? { scale: 0.99 } : undefined}
        className={cn(
          "rounded-[20px] bg-surface border border-border shadow-soft-sm p-6 relative overflow-hidden transition-colors",
          (hoverable || interactive) && "hover:shadow-soft-md hover:border-primary/30 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-bold text-text tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-text-muted leading-relaxed", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center pt-4 border-t border-border/60", className)}
      {...props}
    />
  );
}
