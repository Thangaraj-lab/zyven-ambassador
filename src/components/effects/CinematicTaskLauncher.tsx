"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Sparkles, Terminal, ArrowRight, ShieldCheck, Zap } from "lucide-react";
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

      // Play enhanced cinematic sound
      soundEffects.playCinematicCardOpen();
      setOpeningTask(custom.detail);

      // Fire RGB energy sparklers
      confetti({
        particleCount: 45,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#00ffff", "#ff00ff", "#39ff14", "#ffff00", "#a855f7"],
        startVelocity: 35,
        ticks: 120,
        scalar: 1.1,
      });

      // Transition to target route after cinematic motion graphics sequence
      const timer = setTimeout(() => {
        router.push(`/missions/${custom.detail.slug}`);
        setTimeout(() => {
          setOpeningTask(null);
        }, 500);
      }, 850);

      return () => clearTimeout(timer);
    };

    window.addEventListener("zyven-cinematic-task-open", handleOpen);
    return () => window.removeEventListener("zyven-cinematic-task-open", handleOpen);
  }, [router]);

  return (
    <AnimatePresence>
      {openingTask && (
        <div className="fixed inset-0 z-[10001] pointer-events-auto flex items-center justify-center overflow-hidden">
          {/* --- FULL SCREEN RGB LED LIGHT PIPES --- */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-cyan-400 via-blue-500 to-purple-500 animate-rgb-flow shadow-[0_0_30px_#00ffff] z-50" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-400 via-green-400 via-yellow-400 to-red-500 animate-rgb-flow shadow-[0_0_30px_#ff00ff] z-50" />
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-b from-red-500 via-green-400 via-cyan-400 to-purple-500 animate-rgb-flow shadow-[0_0_30px_#39ff14] z-50" />
          <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-b from-purple-500 via-cyan-400 via-green-400 to-red-500 animate-rgb-flow shadow-[0_0_30px_#a855f7] z-50" />

          {/* Cinematic Top Letterbox Bar */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "11vh" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 right-0 bg-black/95 z-40 border-b border-primary/30 flex items-center justify-between px-8 text-xs font-mono text-cyan-400 backdrop-blur-md"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              ZYVEX HUD // RGB LED MISSION MATRIX ACTIVE
            </span>
            <span className="text-white/60">NODE: 0x9FA • CHROMATIC PROTOCOL</span>
          </motion.div>

          {/* Cinematic Bottom Letterbox Bar */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "11vh" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 bg-black/95 z-40 border-t border-primary/30 flex items-center justify-between px-8 text-xs font-mono text-cyan-400 backdrop-blur-md"
          >
            <span className="text-white/60">STATUS: INITIALIZING AMBASSADOR CONSOLE</span>
            <span className="flex items-center gap-1.5 text-white">
              WARPING TO MISSION <ArrowRight className="h-3 w-3 text-cyan-400 animate-bounce" />
            </span>
          </motion.div>

          {/* Dark Glass Backdrop with Ambient Cyber Grid Mesh */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-20 bg-grid-mesh"
          />

          {/* Expanding RGB Shockwaves */}
          <motion.div
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="absolute h-[380px] w-[380px] rounded-full border-4 border-cyan-400 shadow-[0_0_80px_#00ffff] pointer-events-none z-20"
          />
          <motion.div
            initial={{ scale: 0.1, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
            className="absolute h-[380px] w-[380px] rounded-full border-4 border-fuchsia-500 shadow-[0_0_80px_#ff00ff] pointer-events-none z-20"
          />

          {/* Center 3D Holographic Card Wrapped in Rotating RGB LED Border */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateX: 30, y: 40 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
            exit={{ scale: 1.25, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative z-30 max-w-lg w-full mx-4 p-[3px] rounded-[2.5rem] bg-[conic-gradient(from_0deg,#ff0055,#ffaa00,#33ff00,#00ffff,#0066ff,#ff0055)] animate-rgb-flow shadow-[0_0_90px_rgba(0,255,255,0.7),0_0_120px_rgba(255,0,128,0.5)]"
          >
            <div className="rounded-[2.4rem] bg-surface/95 p-8 text-center space-y-6 backdrop-blur-2xl relative overflow-hidden">
              {/* Laser beam sweep */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer" />

              {/* Brand Icon with Neon Aura */}
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-accent text-accent-fg shadow-[0_0_35px_rgba(139,92,246,0.6)] animate-pulse">
                {openingTask.brand === "linkedin" ? (
                  <span className="text-3xl font-black text-[#0077B5]">in</span>
                ) : openingTask.brand === "whatsapp" ? (
                  <span className="text-2xl font-black text-[#25D366]">WA</span>
                ) : (
                  <Sparkles className="h-10 w-10 text-primary" />
                )}
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-500 dark:text-cyan-300 text-xs font-black uppercase tracking-widest shadow-sm">
                  <Zap className="h-3.5 w-3.5 fill-current animate-bounce" />
                  <span>RGB LED Protocol Engaged</span>
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                  {openingTask.title}
                </h2>
                <p className="text-xs font-mono text-primary font-bold">
                  Target Verification: +{openingTask.points ?? 50} Ledger Points
                </p>
              </div>

              {/* High-Tech Terminal Status */}
              <div className="p-4 rounded-2xl bg-surface-2 border border-border/80 text-left font-mono text-xs space-y-1.5 text-primary">
                <div className="flex items-center justify-between text-text-muted">
                  <span>[1/3] Calibrating 3D Mission Matrix...</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
                <div className="flex items-center justify-between text-text-muted">
                  <span>[2/3] Linking Verified Points Ledger</span>
                  <span className="text-emerald-400"><ShieldCheck className="h-4 w-4 inline" /></span>
                </div>
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5" />
                    Opening Mission Command Room...
                  </span>
                  <span className="animate-spin font-black">/</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
