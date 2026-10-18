"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Lock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

export interface StepItem {
  id: string | number;
  title: string;
  description?: string;
  content: React.ReactNode;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className = "",
}: StepperProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        const isLocked = idx > currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              "rounded-2xl border transition-all duration-300 overflow-hidden",
              isActive
                ? "border-primary bg-surface shadow-soft-md"
                : isCompleted
                ? "border-border bg-surface/80"
                : "border-border/60 bg-surface-2/40 opacity-70"
            )}
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => {
                if (!isLocked && onStepClick) {
                  onStepClick(idx);
                }
              }}
              disabled={isLocked}
              className="w-full p-4.5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
            >
              <div className="flex items-center gap-3.5">
                {/* Step indicator circle */}
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs select-none transition-all",
                    isCompleted
                      ? "bg-success text-white"
                      : isActive
                      ? "brand-gradient-bg text-white shadow-soft-sm ring-4 ring-primary/20"
                      : "bg-surface-2 border border-border text-text-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : isLocked ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div>
                  <h4
                    className={cn(
                      "text-sm font-bold transition-colors",
                      isActive
                        ? "text-primary"
                        : isCompleted
                        ? "text-text"
                        : "text-text-muted"
                    )}
                  >
                    {step.title}
                  </h4>
                  {step.description && (
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {!isLocked && (
                <div
                  className={cn(
                    "text-text-muted transition-transform duration-200",
                    isActive ? "rotate-180 text-primary" : ""
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              )}
            </button>

            {/* Expandable Content */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: ease.out }}
                  className="overflow-hidden"
                >
                  <div className="p-4.5 pt-0 border-t border-border/40 mt-1">
                    {step.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
