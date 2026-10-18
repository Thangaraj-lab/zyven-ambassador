"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useMotionOK, ease } from "@/lib/motion";

interface WorldTransitionProps {
  children: React.ReactNode;
}

export function WorldTransition({ children }: WorldTransitionProps) {
  const pathname = usePathname();
  const motionOK = useMotionOK();

  // Route-specific spatial personality (Archetype 5)
  const getSpatialVariants = () => {
    if (!motionOK) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.1 },
      };
    }

    if (pathname.startsWith("/leaderboard")) {
      // Objects rise vertically
      return {
        initial: { opacity: 0, y: 14, scale: 0.995 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.32, ease: ease.out },
      };
    }

    if (pathname.startsWith("/rewards")) {
      // Objects converge toward center
      return {
        initial: { opacity: 0, scale: 0.985, filter: "blur(2px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 1.01 },
        transition: { duration: 0.3, ease: ease.out },
      };
    }

    if (pathname.startsWith("/profile")) {
      // Orbit / identity reveal
      return {
        initial: { opacity: 0, scale: 1.01, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.99 },
        transition: { duration: 0.3, ease: ease.out },
      };
    }

    if (pathname.startsWith("/missions")) {
      // Structured card matrix organize
      return {
        initial: { opacity: 0, y: 8, scale: 0.995 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.28, ease: ease.out },
      };
    }

    // Default Home / Dashboard floating spatial environment
    return {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -6 },
      transition: { duration: 0.26, ease: ease.out },
    };
  };

  const variants = getSpatialVariants();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={variants.transition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
