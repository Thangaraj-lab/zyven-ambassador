"use client";

import React from "react";
import { motion } from "motion/react";
import { useMotionOK, dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 20,
}: RevealProps) {
  const motionOK = useMotionOK();

  if (!motionOK) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: dur.base, delay, ease: ease.out }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
