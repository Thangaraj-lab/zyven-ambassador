"use client";

import React from "react";
import { motion } from "motion/react";

interface EnergyLineProps {
  active?: boolean;
  color?: string; // hex or tailwind-compatible color
  className?: string;
  duration?: number;
}

export function EnergyLine({
  active = true,
  color = "#8b5cf6",
  className = "",
  duration = 1.4,
}: EnergyLineProps) {
  if (!active) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="18"
          stroke="url(#energyGradient)"
          strokeWidth="2"
          strokeDasharray="80 320"
          className="animate-energy-dash"
        />
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Soft Gaussian Glow Copy */}
      <svg
        className="absolute inset-0 h-full w-full blur-[3px] opacity-75"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="18"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray="60 340"
          className="animate-energy-dash"
        />
      </svg>
    </div>
  );
}
