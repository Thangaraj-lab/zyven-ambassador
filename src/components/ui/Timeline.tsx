"use client";

import React from "react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useMotionOK } from "@/lib/motion";

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
  const motionOK = useMotionOK();

  return (
    <div className={cn("relative pl-7 space-y-5", className)}>
      {/* Background Track Line */}
      <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-border/60" />

      {/* Dynamic Traveling SVG Energy Beam */}
      <svg
        className="absolute left-[12px] top-3 bottom-3 w-[4px] h-[calc(100%-24px)] pointer-events-none overflow-visible"
        aria-hidden="true"
      >
        <line
          x1="2"
          y1="0"
          x2="2"
          y2="100%"
          stroke="url(#timelineEnergyGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="40 160"
          className={motionOK ? "animate-energy-dash" : ""}
        />
        <defs>
          <linearGradient id="timelineEnergyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {events.map((event, index) => {
        const isCompleted = event.status === "completed";
        const isCurrent = event.status === "current";
        const isFailed = event.status === "failed";

        return (
          <motion.div
            key={event.id}
            initial={motionOK ? { opacity: 0, x: -8 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.28,
              delay: motionOK ? index * 0.08 : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative group"
          >
            {/* Sequential Node Indicator with CSS 3D ring */}
            <div
              className={cn(
                "absolute -left-7 top-1 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-bg transition-all duration-300",
                isCompleted
                  ? "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  : isCurrent
                  ? "brand-gradient-bg text-white shadow-[0_0_16px_rgba(99,102,241,0.5)] animate-pulse"
                  : isFailed
                  ? "bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                  : "bg-surface-2 border border-border text-text-muted"
              )}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              ) : isFailed ? (
                <AlertCircle className="h-3.5 w-3.5 stroke-[2.5]" />
              ) : isCurrent ? (
                <Clock className="h-3.5 w-3.5" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-border" />
              )}
            </div>

            {/* Evidence & Status Card */}
            <div
              className={cn(
                "rounded-2xl p-4 border transition-all duration-200",
                isCurrent
                  ? "bg-surface-2 border-primary/40 shadow-soft-sm"
                  : "bg-surface border-border shadow-xs hover:border-border/80"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-extrabold text-text tracking-tight">
                    {event.title}
                  </h5>
                  {isCurrent && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Processing
                    </span>
                  )}
                </div>
                {event.timestamp && (
                  <span className="text-[10px] text-text-muted font-semibold tabular-nums">
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
          </motion.div>
        );
      })}
    </div>
  );
}

