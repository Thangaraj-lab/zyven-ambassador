"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Sparkles, Zap } from "lucide-react";
import { useMotionOK } from "@/lib/motion";

export interface GravityFieldEventDetail {
  points: number;
  title?: string;
  sourceX?: number;
  sourceY?: number;
}

export function triggerGravityPoints(points: number, title?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("zyven-gravity-points", {
      detail: { points, title },
    })
  );
}

export function GravityField() {
  const motionOK = useMotionOK();
  const [activeTransfer, setActiveTransfer] = useState<GravityFieldEventDetail | null>(null);
  const [stage, setStage] = useState<"extraction" | "flow" | "impact" | "done">("done");

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const custom = e as CustomEvent<GravityFieldEventDetail>;
      const detail = custom.detail;
      setActiveTransfer(detail);
      setStage("extraction");

      if (!motionOK) {
        setStage("done");
        setTimeout(() => setActiveTransfer(null), 1000);
        return;
      }

      // Stage 1 -> 2: Extraction -> Energy Flow (250ms)
      const t1 = setTimeout(() => {
        setStage("flow");
      }, 250);

      // Stage 2 -> 3: Flow -> Point Core Impact (650ms)
      const t2 = setTimeout(() => {
        setStage("impact");
      }, 650);

      // Stage 3 -> Completion Confirmation (1200ms)
      const t3 = setTimeout(() => {
        setStage("done");
        setTimeout(() => setActiveTransfer(null), 1800);
      }, 1200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };

    window.addEventListener("zyven-gravity-points", handleTrigger);
    return () => window.removeEventListener("zyven-gravity-points", handleTrigger);
  }, [motionOK]);

  if (!activeTransfer || stage === "done") return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
        {/* Stage 2 & 3: Flowing Energy Ribbon toward Top Right (Points Balance Core) */}
        {stage === "flow" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* SVG Dynamic Flow Stream */}
            <svg className="h-full w-full">
              <motion.path
                d="M 50% 60% C 55% 45%, 70% 30%, 85% 5%"
                fill="none"
                stroke="url(#gravityStreamGradient)"
                strokeWidth="4"
                strokeDasharray="20 180"
                className="animate-energy-dash"
              />
              <defs>
                <linearGradient id="gravityStreamGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Traveling Point Orb */}
            <motion.div
              initial={{ left: "50%", top: "60%", scale: 1 }}
              animate={{ left: "85%", top: "4%", scale: [1, 1.4, 0.8] }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-cyan-400 shadow-[0_0_30px_#8b5cf6]"
            />
          </motion.div>
        )}

        {/* Stage 3: Point Core Impact Flash (Top-Right Points Pill) */}
        {stage === "impact" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.8, 1, 0] }}
            transition={{ duration: 0.45 }}
            className="absolute top-4 right-16 sm:right-28 h-16 w-16 rounded-full bg-cyan-400/40 blur-xl"
          />
        )}

        {/* Stage 1 & Confirmation: Centered Completion Card */}
        {stage === "extraction" && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto p-6 rounded-3xl bg-surface/95 border border-primary/40 shadow-2xl backdrop-blur-xl text-center space-y-3 max-w-sm w-full mx-4"
          >
            <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Task Verified & Confirmed
              </span>
              <h3 className="text-xl font-extrabold text-text mt-0.5">
                {activeTransfer.title || "Mission Complete"}
              </h3>
              <p className="text-sm font-black text-emerald-500 mt-1">
                +{activeTransfer.points} Points Transferred
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
