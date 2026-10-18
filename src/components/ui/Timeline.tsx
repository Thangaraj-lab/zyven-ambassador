import React from "react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  status: "completed" | "current" | "upcoming" | "failed";
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className = "" }: TimelineProps) {
  return (
    <div className={cn("relative pl-6 space-y-6", className)}>
      {/* Connecting continuous vertical line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />

      {events.map((event) => {
        const isCompleted = event.status === "completed";
        const isCurrent = event.status === "current";
        const isFailed = event.status === "failed";

        return (
          <div key={event.id} className="relative group">
            {/* Node indicator */}
            <div
              className={cn(
                "absolute -left-6 top-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-bg transition-colors",
                isCompleted
                  ? "bg-success text-white"
                  : isCurrent
                  ? "brand-gradient-bg text-white animate-pulse"
                  : isFailed
                  ? "bg-danger text-white"
                  : "bg-surface-2 border border-border text-text-muted"
              )}
            >
              {isCompleted ? (
                <Check className="h-3 w-3 stroke-[3]" />
              ) : isFailed ? (
                <AlertCircle className="h-3 w-3 stroke-[2.5]" />
              ) : isCurrent ? (
                <Clock className="h-3 w-3" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-border" />
              )}
            </div>

            {/* Content card */}
            <div className="bg-surface rounded-xl p-3 border border-border shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-bold text-text">{event.title}</h5>
                {event.timestamp && (
                  <span className="text-[10px] text-text-muted font-medium tabular-nums">
                    {event.timestamp}
                  </span>
                )}
              </div>
              {event.description && (
                <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
