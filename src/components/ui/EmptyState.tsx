import React from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-surface p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto",
        className
      )}
    >
      {icon && (
        <div className="h-14 w-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-text mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-text-muted mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
