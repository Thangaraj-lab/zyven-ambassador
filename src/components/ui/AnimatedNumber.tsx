"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMotionOK } from "@/lib/motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedNumber({
  value,
  duration = 800,
  className = "",
  prefix = "",
  suffix = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const currentValRef = useRef(value);
  const motionOK = useMotionOK();

  useEffect(() => {
    if (!motionOK) {
      currentValRef.current = value;
      const id = requestAnimationFrame(() => setDisplayValue(value));
      return () => cancelAnimationFrame(id);
    }

    const startValue = currentValRef.current;
    const change = value - startValue;

    if (change === 0) return;

    let startTimestamp: number | null = null;
    let animFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(startValue + change * easeProgress);
      currentValRef.current = nextVal;
      setDisplayValue(nextVal);

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [value, duration, motionOK]);

  return (
    <span className={`tabular-nums font-bold ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
