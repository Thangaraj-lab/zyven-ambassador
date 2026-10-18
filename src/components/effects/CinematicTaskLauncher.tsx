"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, ArrowRight, ShieldCheck } from "lucide-react";
import { soundEffects } from "@/lib/audioEffects";

interface CinematicTaskPayload {
  slug: string;
  title: string;
  points?: number;
  brand?: string;
}

export function launchCinematicTask(payload: CinematicTaskPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("zyven-cinematic-task-open", {
      detail: payload,
    })
  );
}

export function CinematicTaskLauncher() {
  const router = useRouter();
  const [openingTask, setOpeningTask] = useState<CinematicTaskPayload | null>(null);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const custom = e as CustomEvent<CinematicTaskPayload>;
      if (!custom.detail?.slug) return;

      soundEffects.playCinematicCardOpen();
      setOpeningTask(custom.detail);

      // Transition to the target route after cinematic motion graphics sequence
      const timer = setTimeout(() => {
        router.push(`/missions/${custom.detail.slug}`);
        setTimeout(() => {
          setOpeningTask(null);
        }, 500);
      }, 700);

      return () => clearTimeout(timer);
    };

    window.addEventListener("zyven-cinematic-task-open", handleOpen);
    return () => window.removeEventListener("zyven-cinematic-task-open", handleOpen);
  }, [router]);

  return (
    <AnimatePresence>
      {openingTask && (
        <div className="fixed inset-0 z-[10001] pointer-events-auto flex items-center justify-center overflow-hidden">
          {/* Cinematic Top Letterbox Bar */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "12vh" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 right-0 bg-black z-40 border-b border-primary/40 flex items-center justify-between px-8 text-xs font-mono text-primary"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              ZYVEN HUD // CINEMATIC PROTOCOL
            </span>
            <span className="text-white/60">NODE: 0x9FA • ENCRYPTED</span>
          </motion.div>

          {/* Cinematic Bottom Letterbox Bar */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "12vh" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 bg-black z-40 border-t border-primary/40 flex items-center justify-between px-8 text-xs font-mono text-primary"
          >
            <span className="text-white/60">SYSTEM: ALL SYSTEMS NOMINAL</span>
            <span className="flex items-center gap-1.5 text-white">
              INITIALIZING MISSION <ArrowRight className="h-3 w-3 text-primary animate-bounce" />
            </span>
          </motion.div>

          {/* Dark Glass Backdrop with expanding Radial Energy Shockwave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl z-20"
          />

          {/* Center Expanding Hologram Mission Card */}
          <motion.div
            initial={{ scale: 0.65, opacity: 0, rotateX: 30 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 1.15, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            className="relative z-30 max-w-lg w-full mx-4 p-8 rounded-[2rem] bg-surface/95 border-2 border-primary shadow-[0_0_80px_rgba(139,92,246,0.6)] backdrop-blur-2xl text-center space-y-5"
          >
            {/* Holographic scanner beam */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer" />

            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl brand-gradient-bg text-white shadow-lg animate-pulse">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-black uppercase tracking-widest">
                <Terminal className="h-3.5 w-3.5" />
                <span>Launching Mission Console</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
                {openingTask.title}
              </h2>
              <p className="text-xs font-mono text-text-muted">
                Target Verification: +{openingTask.points ?? 50} Points
              </p>
            </div>

            {/* Futuristic Progress HUD */}
            <div className="p-3.5 rounded-xl bg-surface-2 border border-border/80 text-left font-mono text-[11px] space-y-1 text-primary">
              <div className="flex items-center justify-between text-text-muted">
                <span>[1/3] Fetching requirements...</span>
                <span className="text-emerald-400">100%</span>
              </div>
              <div className="flex items-center justify-between text-text-muted">
                <span>[2/3] Verification ledger linked</span>
                <span className="text-emerald-400"><ShieldCheck className="h-3.5 w-3.5 inline" /></span>
              </div>
              <div className="flex items-center justify-between text-primary font-bold">
                <span>[3/3] Opening Mission Command Room</span>
                <span className="animate-spin">/</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
