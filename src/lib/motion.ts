"use client";

import { useReducedMotion, type Variants } from "motion/react";

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: "spring" as const, stiffness: 380, damping: 30 },
  gentleSpring: { type: "spring" as const, stiffness: 260, damping: 24 },
  bouncySpring: { type: "spring" as const, stiffness: 450, damping: 25 },
};

export const dur = {
  instant: 0.12,
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  cinematic: 0.9,
};

export const stagger = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
};

export const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur.base, ease: ease.out },
    },
    exit: {
      opacity: 0,
      y: -12,
      transition: { duration: dur.fast, ease: ease.out },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: dur.base, ease: ease.out },
    },
    exit: {
      opacity: 0,
      transition: { duration: dur.fast },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { ...ease.spring },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: { duration: dur.fast },
    },
  },
  popIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { ...ease.bouncySpring },
    },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: dur.base, ease: ease.out },
    },
    exit: {
      opacity: 0,
      x: -16,
      transition: { duration: dur.fast },
    },
  },
  listContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger.base,
        delayChildren: 0.05,
      },
    },
  },
  listItem: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur.base, ease: ease.out },
    },
  },
};

export const useMotionOK = () => {
  const reduced = useReducedMotion();
  return !reduced;
};
