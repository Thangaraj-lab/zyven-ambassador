"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { soundEffects } from "@/lib/audioEffects";

export interface RGBAlertState {
  active: boolean;
  type: "rgb" | "red-alarm";
  message: string;
  subtext?: string;
}

export function triggerRgbAlert(message: string, subtext?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("zyven-rgb-led", {
      detail: { message, subtext, type: "rgb" },
    })
  );
}

export function triggerRedAlarm(message: string, subtext?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("zyven-red-alarm", {
      detail: { message, subtext, type: "red-alarm" },
    })
  );
}

export function RGBAlertSystem() {
  const [alert, setAlert] = useState<RGBAlertState | null>(null);

  useEffect(() => {
    const handleRgb = (e: Event) => {
      const custom = e as CustomEvent<{ message: string; subtext?: string }>;
      // Login chime/beep sound removed per user request for silent, clean login
      setAlert({
        active: true,
        type: "rgb",
        message: custom.detail?.message || "AUTHENTICATION VERIFIED",
        subtext: custom.detail?.subtext || "RGB LED Chroma Protocol Active",
      });

      const timer = setTimeout(() => {
        setAlert(null);
      }, 4200);
      return () => clearTimeout(timer);
    };

    const handleRedAlarm = (e: Event) => {
      const custom = e as CustomEvent<{ message: string; subtext?: string }>;
      soundEffects.playRedAlarm();
      setAlert({
        active: true,
        type: "red-alarm",
        message: custom.detail?.message || "SECURITY BREACH: WRONG PASSWORD",
        subtext: custom.detail?.subtext || "High Red Strobe Alarm Triggered • Access Denied",
      });

      // Vibrate if mobile supported
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }

      const timer = setTimeout(() => {
        setAlert(null);
      }, 3800);
      return () => clearTimeout(timer);
    };

    window.addEventListener("zyven-rgb-led", handleRgb);
    window.addEventListener("zyven-red-alarm", handleRedAlarm);

    return () => {
      window.removeEventListener("zyven-rgb-led", handleRgb);
      window.removeEventListener("zyven-red-alarm", handleRedAlarm);
    };
  }, []);

  return (
    <AnimatePresence>
      {alert && (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
          {alert.type === "rgb" ? (
            /* --- RGB LED CHROMA FLOW SYSTEM (Login & Logout) --- */
            <>
              {/* Top RGB LED Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 via-blue-500 to-fuchsia-500 animate-rgb-flow shadow-[0_0_24px_rgba(56,189,248,0.9)]" />

              {/* Bottom RGB LED Strip */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-fuchsia-500 via-blue-500 via-cyan-400 via-emerald-400 via-amber-400 to-red-500 animate-rgb-flow shadow-[0_0_24px_rgba(236,72,153,0.9)]" />

              {/* Left RGB LED Strip */}
              <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-b from-red-500 via-emerald-400 via-cyan-400 to-fuchsia-500 animate-rgb-flow shadow-[0_0_24px_rgba(34,197,94,0.9)]" />

              {/* Right RGB LED Strip */}
              <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-b from-fuchsia-500 via-cyan-400 via-emerald-400 to-red-500 animate-rgb-flow shadow-[0_0_24px_rgba(168,85,247,0.9)]" />

              {/* Screen Corner RGB Glow Bloom */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-fuchsia-500/10 to-amber-500/10 backdrop-blur-[1px]" />

              {/* Holographic RGB Status Pill */}
              <motion.div
                initial={{ opacity: 0, y: -40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
                className="pointer-events-auto absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3.5 px-6 py-3 rounded-full bg-surface/95 border-2 border-emerald-400/80 shadow-[0_0_35px_rgba(34,197,94,0.6)] backdrop-blur-xl"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-black text-xs shadow-md animate-pulse">
                  <CheckCircle2 className="h-5 w-5 text-black" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-widest text-text uppercase flex items-center gap-1.5">
                    <span>{alert.message}</span>
                    <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400">
                    {alert.subtext}
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            /* --- HIGH RED STROBE LED LIGHT ALARM (Wrong Password) --- */
            <>
              {/* Full-Screen Red Strobe Flash */}
              <div className="absolute inset-0 bg-red-600/25 animate-red-strobe" />

              {/* High Red 4-Edge LED Beams */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-red-600 shadow-[0_0_40px_#ef4444,0_0_80px_#dc2626] animate-pulse" />
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-red-600 shadow-[0_0_40px_#ef4444,0_0_80px_#dc2626] animate-pulse" />
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-red-600 shadow-[0_0_40px_#ef4444,0_0_80px_#dc2626] animate-pulse" />
              <div className="absolute top-0 bottom-0 right-0 w-3 bg-red-600 shadow-[0_0_40px_#ef4444,0_0_80px_#dc2626] animate-pulse" />

              {/* Emergency Security Alert Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: [1, 1.05, 1], y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-auto absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-7 py-3.5 rounded-2xl bg-red-950/95 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.85)] backdrop-blur-xl text-white"
              >
                <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center font-black animate-ping-fast">
                  <ShieldAlert className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-black tracking-wider text-red-300 uppercase flex items-center gap-2">
                    <span>SECURITY ALARM: HIGH RED LED</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {alert.message} • {alert.subtext}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
