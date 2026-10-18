"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "pills" | "line";
  className?: string;
  layoutId?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "pills",
  className,
  layoutId = "active-tab-indicator",
}: TabsProps) {
  if (variant === "line") {
    return (
      <div
        role="tablist"
        className={cn("flex items-center gap-6 border-b border-border", className)}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative pb-3 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer outline-none",
                isActive ? "text-primary" : "text-text-muted hover:text-text"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-surface-2 text-text-muted"
                  )}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-full bg-surface-2 border border-border/80",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer outline-none select-none",
              isActive ? "text-white" : "text-text-muted hover:text-text"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-full brand-gradient-bg shadow-soft-sm"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-extrabold tabular-nums",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-surface text-text-muted border border-border/60"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
