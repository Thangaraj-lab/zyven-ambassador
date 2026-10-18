import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  PlayCircle,
  Hourglass,
  Sparkles,
} from "lucide-react";

export type MissionState =
  | "AVAILABLE"
  | "STARTED"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "LOCKED";

interface StatusBadgeProps {
  state: MissionState;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({
  state,
  className = "",
  size = "md",
}: StatusBadgeProps) {
  const configs: Record<
    MissionState,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    AVAILABLE: {
      label: "Available",
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/25",
      icon: <Sparkles className="h-3.5 w-3.5" />,
    },
    STARTED: {
      label: "In Progress",
      bg: "bg-info/10",
      text: "text-info",
      border: "border-info/25",
      icon: <PlayCircle className="h-3.5 w-3.5" />,
    },
    SUBMITTED: {
      label: "Submitted",
      bg: "bg-warning/10",
      text: "text-warning",
      border: "border-warning/25",
      icon: <Clock className="h-3.5 w-3.5" />,
    },
    UNDER_REVIEW: {
      label: "Under Review",
      bg: "bg-warning/15",
      text: "text-warning",
      border: "border-warning/30",
      icon: <Hourglass className="h-3.5 w-3.5 animate-spin-slow" />,
    },
    APPROVED: {
      label: "Approved",
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/25",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
    REJECTED: {
      label: "Needs Fix",
      bg: "bg-danger/10",
      text: "text-danger",
      border: "border-danger/25",
      icon: <AlertCircle className="h-3.5 w-3.5" />,
    },
    LOCKED: {
      label: "Coming Soon",
      bg: "bg-surface-2",
      text: "text-text-muted",
      border: "border-border",
      icon: <Lock className="h-3.5 w-3.5" />,
    },
  };

  const config = configs[state] || configs.AVAILABLE;
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs gap-1" : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border select-none transition-colors",
        config.bg,
        config.text,
        config.border,
        sizeClasses,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
