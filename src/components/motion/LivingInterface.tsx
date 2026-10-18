"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useMotionValue, useSpring, motion, type MotionValue } from "motion/react";
import { useMotionOK } from "@/lib/motion";

interface LivingInterfaceContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const LivingInterfaceContext = createContext<LivingInterfaceContextType | null>(null);

export function useLivingInterface() {
  return useContext(LivingInterfaceContext);
}

export function LivingInterfaceProvider({ children }: { children: React.ReactNode }) {
  const motionOK = useMotionOK();
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.4 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!motionOK) return;
    if (typeof window === "undefined") return;

    // Only active on desktop (pointer device)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        rawX.set(x);
        rawY.set(y);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [motionOK, rawX, rawY]);

  return (
    <LivingInterfaceContext.Provider value={{ mouseX: smoothX, mouseY: smoothY }}>
      <div className="relative min-h-screen">
        {/* Living Ambient Light Field (Subtle cursor-following aura) */}
        {motionOK && (
          <motion.div
            style={{
              left: smoothX,
              top: smoothY,
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 65%)",
            }}
            className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full -z-10 hidden md:block"
          />
        )}
        {children}
      </div>
    </LivingInterfaceContext.Provider>
  );
}

// Wrapper for interactive living cards
export function LivingCard({
  children,
  className = "",
  depth = 1,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) {
  const motionOK = useMotionOK();

  return (
    <motion.div
      whileHover={
        motionOK
          ? {
              y: -3 * depth,
              scale: 1.01,
              transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      whileTap={
        motionOK
          ? {
              scale: 0.985,
              transition: { duration: 0.1 },
            }
          : undefined
      }
      className={`relative group ${className}`}
    >
      {children}
    </motion.div>
  );
}
