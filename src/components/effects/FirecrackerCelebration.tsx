"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Sparkles, Trophy } from "lucide-react";
import { soundEffects } from "@/lib/audioEffects";

interface FirecrackerEventDetail {
  title?: string;
  points?: number;
}

export function triggerFirecrackers(title?: string, points?: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("zyven-firecrackers", {
      detail: { title, points },
    })
  );
}

export function FirecrackerCelebration() {
  const [celebration, setCelebration] = useState<{
    show: boolean;
    title: string;
    points: number;
  } | null>(null);

  const launchFirecrackers = () => {
    soundEffects.playFirecrackerPop();

    // Stage 1: Central Rocket launch
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.75, x: 0.5 },
      colors: ["#ff0055", "#ffaa00", "#ffff00", "#00ff88", "#00d4ff", "#9900ff"],
      startVelocity: 55,
      gravity: 0.9,
      scalar: 1.2,
      ticks: 200,
    });

    // Stage 2 (250ms): Left Flanking 3D Cannon
    setTimeout(() => {
      soundEffects.playFirecrackerPop();
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 65,
        origin: { x: 0.15, y: 0.8 },
        colors: ["#ffd700", "#ff3366", "#33ccff", "#33ff99"],
        startVelocity: 60,
        shapes: ["circle", "star"],
        scalar: 1.3,
      });
    }, 250);

    // Stage 3 (450ms): Right Flanking 3D Cannon
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 65,
        origin: { x: 0.85, y: 0.8 },
        colors: ["#ff007f", "#00ffff", "#ffff00", "#ff6600"],
        startVelocity: 60,
        shapes: ["circle", "star"],
        scalar: 1.3,
      });
    }, 450);

    // Stage 4 (700ms): Grand Finale Barrage
    setTimeout(() => {
      soundEffects.playFirecrackerPop();
      confetti({
        particleCount: 110,
        spread: 120,
        origin: { y: 0.45, x: 0.5 },
        colors: ["#ffffff", "#ffd700", "#ff0055", "#8a2be2", "#00ffcc"],
        startVelocity: 45,
        gravity: 0.8,
        scalar: 1.4,
      });
    }, 700);
  };

  useEffect(() => {
    const handleFirecracker = (e: Event) => {
      const custom = e as CustomEvent<FirecrackerEventDetail>;
      launchFirecrackers();

      setCelebration({
        show: true,
        title: custom.detail?.title || "TASK COMPLETED",
        points: custom.detail?.points ?? 50,
      });

      const timer = setTimeout(() => {
        setCelebration(null);
      }, 5000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("zyven-firecrackers", handleFirecracker);
    return () => window.removeEventListener("zyven-firecrackers", handleFirecracker);
  }, []);

  return (
    <AnimatePresence>
      {celebration && celebration.show && (
        <div className="pointer-events-none fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50, rotateX: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -40 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto max-w-md w-full rounded-[28px] p-6 sm:p-8 bg-surface/95 border-2 border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.65)] backdrop-blur-2xl text-center space-y-4 relative overflow-hidden"
          >
            {/* Shimmer light bar across banner */}
            <div className="absolute -inset-x-full top-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-shimmer" />

            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 text-white shadow-lg animate-bounce">
              <Trophy className="h-8 w-8 text-white" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-500 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5 fill-current" />
                <span>3D Firecracker Burst Unlocked</span>
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-2xl font-black text-text tracking-tight mt-2">
                {celebration.title}
              </h3>
              <p className="text-sm font-semibold text-text-muted mt-1">
                Verified! You earned <span className="text-primary font-black">+{celebration.points} Points</span> atomically recorded on your ledger.
              </p>
            </div>

            <button
              onClick={() => setCelebration(null)}
              className="w-full py-3 rounded-xl brand-gradient-bg text-white font-bold text-sm shadow-soft-sm hover:brightness-105 transition-all cursor-pointer"
            >
              Continue Missions
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
