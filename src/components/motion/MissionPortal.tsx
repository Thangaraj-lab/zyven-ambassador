"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useMotionOK } from "@/lib/motion";
import { Sparkles, ArrowRight } from "lucide-react";

export interface MissionPortalPayload {
  slug: string;
  title: string;
  points?: number;
  brand?: "linkedin" | "whatsapp" | "instagram" | "generic" | string;
}

export function openMissionPortal(payload: MissionPortalPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("zyven-open-mission-portal", {
      detail: payload,
    })
  );
}

export function MissionPortal() {
  const router = useRouter();
  const motionOK = useMotionOK();
  const [activeMission, setActiveMission] = useState<MissionPortalPayload | null>(null);
  const [phase, setPhase] = useState<"idle" | "activation" | "portal" | "dive">("idle");

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const custom = e as CustomEvent<MissionPortalPayload>;
      if (!custom.detail?.slug) return;

      const payload = custom.detail;
      setActiveMission(payload);
      setPhase("activation");

      // Reduced motion bypass
      if (!motionOK) {
        router.push(`/missions/${payload.slug}`);
        setTimeout(() => setActiveMission(null), 300);
        return;
      }

      // Phase 1 -> 2: Light Activation -> Portal Formation (200ms)
      const t1 = setTimeout(() => {
        setPhase("portal");
      }, 180);

      // Phase 2 -> 3: Camera Dive (400ms)
      const t2 = setTimeout(() => {
        setPhase("dive");
      }, 420);

      // Phase 3 -> Navigation (650ms total)
      const t3 = setTimeout(() => {
        router.push(`/missions/${payload.slug}`);
        setTimeout(() => {
          setActiveMission(null);
          setPhase("idle");
        }, 350);
      }, 680);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };

    window.addEventListener("zyven-open-mission-portal", handleTrigger);
    return () => window.removeEventListener("zyven-open-mission-portal", handleTrigger);
  }, [router, motionOK]);

  if (!activeMission) return null;

  // Task-Specific Visual Identity
  const getBrandPalette = () => {
    switch (activeMission.brand) {
      case "linkedin":
        return {
          glow: "rgba(0, 119, 181, 0.45)",
          border: "#0077b5",
          accent: "#38bdf8",
          iconLabel: "in",
          label: "LinkedIn Professional Mission",
        };
      case "whatsapp":
        return {
          glow: "rgba(37, 211, 102, 0.45)",
          border: "#25d366",
          accent: "#4ade80",
          iconLabel: "WA",
          label: "Community Network Mission",
        };
      case "instagram":
        return {
          glow: "rgba(225, 48, 108, 0.45)",
          border: "#e1306c",
          accent: "#f472b6",
          iconLabel: "IG",
          label: "Creative Social Mission",
        };
      default:
        return {
          glow: "rgba(139, 92, 246, 0.45)",
          border: "#8b5cf6",
          accent: "#c084fc",
          iconLabel: "Z",
          label: "Campus Ambassador Mission",
        };
    }
  };

  const palette = getBrandPalette();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden">
        {/* Background Depth Veil */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "dive" ? 1 : 0.85 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-bg/95 backdrop-blur-xl -z-20"
        />

        {/* Task-Specific Digital Space Nodes (LinkedIn network, WA waves) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "portal" || phase === "dive" ? 0.7 : 0 }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          {/* Concentric Portal Waves */}
          <motion.div
            animate={{
              scale: [0.6, 2.2],
              opacity: [0.8, 0],
            }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeOut" }}
            style={{ borderColor: palette.border }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full border border-dashed"
          />
          <motion.div
            animate={{
              scale: [0.3, 1.7],
              opacity: [0.9, 0],
            }}
            transition={{ duration: 0.6, delay: 0.15, repeat: Infinity, ease: "easeOut" }}
            style={{ borderColor: palette.accent }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full border-2"
          />

          {/* Converging particles towards center */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full blur-3xl opacity-50"
            style={{ background: `radial-gradient(circle, ${palette.glow} 0%, transparent 70%)` }}
          />
        </motion.div>

        {/* Center Portal Card with Camera Dive */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0.6, y: 12 }}
          animate={
            phase === "dive"
              ? { scale: 1.45, opacity: 0, z: 200 }
              : phase === "portal"
              ? { scale: 1.02, opacity: 1, y: 0 }
              : { scale: 1, opacity: 1, y: 0 }
          }
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md w-full mx-4 rounded-[28px] bg-surface p-8 border shadow-2xl text-center space-y-5"
          style={{
            borderColor: palette.border,
            boxShadow: `0 0 45px ${palette.glow}`,
          }}
        >
          {/* Perimeter Light Activation Stroke */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit] overflow-hidden">
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="26"
              fill="none"
              stroke={palette.accent}
              strokeWidth="2.5"
              strokeDasharray="90 280"
              className="animate-energy-dash"
            />
          </svg>

          {/* Brand Icon Core */}
          <div
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white font-black text-2xl shadow-lg transition-transform duration-300"
            style={{ backgroundColor: palette.border }}
          >
            {palette.iconLabel}
          </div>

          <div className="space-y-1.5">
            <span
              className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-surface-2 border border-border"
              style={{ color: palette.border }}
            >
              {palette.label}
            </span>
            <h2 className="text-2xl font-extrabold text-text tracking-tight">
              {activeMission.title}
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                +{activeMission.points ?? 50} Points
              </span>
              <span className="text-xs font-semibold text-text-muted">
                Entering Mission Room...
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
