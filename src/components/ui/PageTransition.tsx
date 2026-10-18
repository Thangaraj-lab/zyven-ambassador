"use client";

import React from "react";
import { motion } from "motion/react";
import { useMotionOK, dur, ease } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  const motionOK = useMotionOK();

  return (
    <motion.div
      initial={motionOK ? { opacity: 0, y: 12 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0 }}
      exit={motionOK ? { opacity: 0, y: -10 } : { opacity: 1 }}
      transition={{ duration: dur.base, ease: ease.out }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
