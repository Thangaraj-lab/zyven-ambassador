"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useMotionOK, ease } from "@/lib/motion";
import { soundEffects } from "@/lib/audioEffects";
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Zap,
} from "lucide-react";

export interface MissionPortalStep {
  stepNumber: number;
  title: string;
  description?: string;
}

export interface MissionPortalPayload {
  slug: string;
  title: string;
  description?: string;
  points?: number;
  brand?: "linkedin" | "whatsapp" | "instagram" | "generic" | string;
  estimatedMinutes?: number;
  category?: string;
  steps?: MissionPortalStep[];
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
  const [phase, setPhase] = useState<"idle" | "opening_portal" | "briefing" | "launching">("idle");
  const [countdownMs, setCountdownMs] = useState(8000);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const TOTAL_DURATION_MS = 8000;

  // Handle immediate or timer-based task launch
  const handleProceed = useCallback(() => {
    if (!activeMission) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setPhase("launching");
    soundEffects.playCinematicCardOpen();

    setTimeout(() => {
      router.push(`/missions/${activeMission.slug}`);
      setTimeout(() => {
        setActiveMission(null);
        setPhase("idle");
      }, 350);
    }, motionOK ? 450 : 50);
  }, [activeMission, router, motionOK]);

  // Handle close / cancel
  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveMission(null);
    setPhase("idle");
  };

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const custom = e as CustomEvent<MissionPortalPayload>;
      if (!custom.detail?.slug) return;

      const payload = custom.detail;
      setActiveMission(payload);
      setCountdownMs(TOTAL_DURATION_MS);
      setPhase("opening_portal");

      soundEffects.playCinematicCardOpen();

      // Entrance animation: 450ms portal warp -> 8s interactive briefing modal
      const tPortal = setTimeout(() => {
        setPhase("briefing");
      }, motionOK ? 450 : 50);

      return () => clearTimeout(tPortal);
    };

    window.addEventListener("zyven-open-mission-portal", handleTrigger);
    return () => window.removeEventListener("zyven-open-mission-portal", handleTrigger);
  }, [motionOK]);

  // 8-Second Countdown Timer during Briefing Phase
  useEffect(() => {
    if (phase !== "briefing" || !activeMission) return;

    const intervalTime = 50; // 50ms tick for fluid progress bar
    timerRef.current = setInterval(() => {
      setCountdownMs((prev) => {
        if (prev <= intervalTime) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleProceed();
          return 0;
        }
        return prev - intervalTime;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, activeMission, handleProceed]);

  if (!activeMission || phase === "idle") return null;

  // Task-Specific Visual Identity
  const getBrandPalette = () => {
    switch (activeMission.brand) {
      case "linkedin":
        return {
          glow: "rgba(0, 119, 181, 0.55)",
          border: "#0077B5",
          accent: "#38BDF8",
          bgGradient: "linear-gradient(135deg, #0077B5 0%, #004182 100%)",
          iconLabel: "in",
          label: "LinkedIn Professional Task",
        };
      case "whatsapp":
        return {
          glow: "rgba(37, 211, 102, 0.55)",
          border: "#25D366",
          accent: "#4ADE80",
          bgGradient: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
          iconLabel: "WA",
          label: "Community Network Task",
        };
      case "instagram":
        return {
          glow: "rgba(225, 48, 108, 0.55)",
          border: "#E1306C",
          accent: "#F472B6",
          bgGradient: "linear-gradient(135deg, #E1306C 0%, #833AB4 100%)",
          iconLabel: "IG",
          label: "Creative Social Task",
        };
      default:
        return {
          glow: "rgba(139, 92, 246, 0.55)",
          border: "#8B5CF6",
          accent: "#C084FC",
          bgGradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          iconLabel: "Z",
          label: "Campus Ambassador Task",
        };
    }
  };

  const palette = getBrandPalette();
  const secondsLeft = Math.ceil(countdownMs / 1000);
  const progressRatio = Math.max(0, countdownMs / TOTAL_DURATION_MS);

  // Default step guidance if mission steps are not provided
  const defaultSteps: MissionPortalStep[] =
    activeMission.brand === "linkedin"
      ? [
          {
            stepNumber: 1,
            title: "Follow Zyven LinkedIn Profile",
            description: "Open official page and hit Follow to connect to student tech network.",
          },
          {
            stepNumber: 2,
            title: "Publish Launch Announcement",
            description: "Copy the pre-written template, tag your college, and post to your feed.",
          },
          {
            stepNumber: 3,
            title: "Submit URL for Verification",
            description: "Paste your live LinkedIn post URL to receive instant points upon review.",
          },
        ]
      : activeMission.brand === "whatsapp"
      ? [
          {
            stepNumber: 1,
            title: "Open Community Channel",
            description: "Access the private Tamil Nadu student ambassador WhatsApp group.",
          },
          {
            stepNumber: 2,
            title: "Join & Introduce Yourself",
            description: "Introduce your college department and connect with campus peers.",
          },
          {
            stepNumber: 3,
            title: "Upload Membership Screenshot",
            description: "Provide group info or chat screenshot for ambassador badge credit.",
          },
        ]
      : [
          {
            stepNumber: 1,
            title: "Review Mission Objectives",
            description: "Understand the task criteria, eligibility, and submission requirements.",
          },
          {
            stepNumber: 2,
            title: "Execute Campus Initiative",
            description: "Perform the action or participate in the official ambassador event.",
          },
          {
            stepNumber: 3,
            title: "Submit Verification Evidence",
            description: "Submit proof URL or screenshots for verified points addition to ledger.",
          },
        ];

  const stepsToDisplay =
    activeMission.steps && activeMission.steps.length > 0
      ? activeMission.steps
      : defaultSteps;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
        {/* Spatial Atmospheric Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === "launching" ? 1 : 0.88,
            backdropFilter: phase === "launching" ? "blur(28px)" : "blur(18px)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#060814]/90 dark:bg-[#03050c]/95"
        />

        {/* Dynamic Spatial Light Horizon & Concentric Energy Waves */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.65, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed inset-0 flex items-center justify-center -z-10 overflow-hidden"
        >
          <div
            className="h-[600px] w-[600px] rounded-full blur-[140px] opacity-40 transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${palette.border} 0%, ${palette.glow} 40%, transparent 75%)`,
            }}
          />
          <div
            className="absolute h-[520px] w-[520px] rounded-full border border-dashed opacity-25 animate-spin"
            style={{ borderColor: palette.accent, animationDuration: "35s" }}
          />
          <div
            className="absolute h-[680px] w-[680px] rounded-full border opacity-15"
            style={{ borderColor: palette.border }}
          />
        </motion.div>

        {/* Main Mission Briefing Window (Slide 1, Step 5 from reference) */}
        <motion.div
          initial={
            motionOK
              ? { scale: 0.92, opacity: 0, y: 24, rotateX: 6 }
              : { opacity: 0 }
          }
          animate={
            phase === "launching"
              ? { scale: 1.2, opacity: 0, z: 250, filter: "blur(6px)" }
              : { scale: 1, opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }
          }
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.38, ease: ease.out }}
          className="relative max-w-xl w-full my-auto rounded-[32px] bg-surface/95 dark:bg-[#0b0f24]/95 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl p-6 sm:p-8 z-10 space-y-6 overflow-hidden"
          style={{
            boxShadow: `0 24px 60px -12px ${palette.glow}`,
          }}
        >
          {/* Animated SVG Traveling Energy Border */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit] overflow-hidden">
            <rect
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              rx="30"
              fill="none"
              stroke={palette.accent}
              strokeWidth="2.5"
              strokeDasharray="100 320"
              className={motionOK ? "animate-energy-dash" : ""}
            />
          </svg>

          {/* Top Bar: Mission Type & 8-Second Countdown Indicator */}
          <div className="flex items-center justify-between gap-3 relative z-10 border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: palette.border }}
              />
              <span className="text-xs font-black uppercase tracking-wider text-text-muted">
                {activeMission.category || palette.label}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Circular 8-Second Countdown Badge */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border/80 text-text shadow-xs"
                title={`Auto-proceeding in ${secondsLeft}s`}
              >
                <div className="relative h-5 w-5 flex items-center justify-center">
                  <svg className="h-5 w-5 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      className="text-border"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke={palette.border}
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="56.5"
                      strokeDashoffset={56.5 * (1 - progressRatio)}
                      strokeLinecap="round"
                      className="transition-all duration-75"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-black tabular-nums">
                    {secondsLeft}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-text-muted hidden sm:inline">
                  Auto-launching in <span className="text-text font-black">{secondsLeft}s</span>
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
                aria-label="Close Task Briefing"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Hero Identity: 3D Crystal Icon & Mission Title */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
            {/* 3D Crystal Brand Icon */}
            <div
              className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl text-white font-black text-3xl shadow-xl border border-white/25 transform transition-transform hover:scale-105"
              style={{
                background: palette.bgGradient,
                boxShadow: `0 12px 30px -4px ${palette.glow}`,
              }}
            >
              {palette.iconLabel}
            </div>

            <div className="space-y-2 flex-1">
              <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight leading-tight">
                {activeMission.title}
              </h2>
              {activeMission.description && (
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-lg">
                  {activeMission.description}
                </p>
              )}

              {/* Meta Chips */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-black">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>+{activeMission.points ?? 50} Points</span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-2 border border-border text-xs font-bold text-text-muted">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>~ {activeMission.estimatedMinutes ?? 5} Mins</span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified Task</span>
                </span>
              </div>
            </div>
          </div>

          {/* How to Complete: Step-by-Step Guidance Box */}
          <div className="space-y-3 relative z-10 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-text flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>How to Complete &amp; Earn Rewards</span>
              </span>
              <span className="text-[11px] text-text-muted font-semibold">
                3 Simple Steps
              </span>
            </div>

            <div className="space-y-2.5">
              {stepsToDisplay.map((step, idx) => (
                <motion.div
                  key={step.stepNumber}
                  initial={motionOK ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + idx * 0.08, duration: 0.25 }}
                  className="flex items-start gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-surface-2/90 border border-border/80 hover:border-primary/40 transition-colors"
                >
                  <div
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-xl font-black text-xs text-white shadow-xs"
                    style={{ backgroundColor: palette.border }}
                  >
                    {step.stepNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-text leading-tight">
                      {step.title}
                    </h4>
                    {step.description && (
                      <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Bar: OK Button & Progress Track */}
          <div className="pt-2 space-y-3 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Primary OK Button */}
              <button
                onClick={handleProceed}
                className="w-full sm:flex-1 relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.985] cursor-pointer overflow-hidden group"
                style={{
                  background: palette.bgGradient,
                  boxShadow: `0 8px 24px -2px ${palette.glow}`,
                }}
              >
                {/* Directional light sweep effect on button */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <span>OK, START TASK</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Secondary Close */}
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-4 rounded-2xl border border-border text-text-muted hover:text-text hover:bg-surface-2 text-xs font-bold transition-colors cursor-pointer"
              >
                Review Later
              </button>
            </div>

            {/* Bottom 8-Second Visual Progress Line */}
            <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden border border-border/40">
              <div
                className="h-full rounded-full transition-all duration-75"
                style={{
                  width: `${progressRatio * 100}%`,
                  background: palette.bgGradient,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
