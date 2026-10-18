"use client";

import React from "react";
import { Avatar } from "./Avatar";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { LeaderboardUser } from "./LeaderboardRow";
import { useMotionOK, ease } from "@/lib/motion";

interface PodiumProps {
  topThree: [LeaderboardUser?, LeaderboardUser?, LeaderboardUser?];
  className?: string;
}

export function PodiumCard({ topThree, className = "" }: PodiumProps) {
  const motionOK = useMotionOK();
  const [first, second, third] = topThree;

  // Order visually: 2nd (left), 1st (center, tallest), 3rd (right)
  const podiumOrder = [
    { user: second, rank: 2, height: "h-36 sm:h-44", delay: 0.1, color: "border-slate-300 dark:border-slate-700 bg-surface" },
    { user: first, rank: 1, height: "h-48 sm:h-56", delay: 0.2, color: "border-amber-400/80 bg-surface shadow-soft-md" },
    { user: third, rank: 3, height: "h-28 sm:h-36", delay: 0.05, color: "border-amber-700/60 dark:border-amber-900 bg-surface" },
  ];

  return (
    <div className={cn("flex items-end justify-center gap-2 sm:gap-4 pt-8 pb-4", className)}>
      {podiumOrder.map(({ user, rank, height, delay, color }) => {
        if (!user) return null;

        return (
          <motion.div
            key={rank}
            initial={motionOK ? { opacity: 0, y: 30 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: ease.out }}
            className="flex-1 max-w-[140px] sm:max-w-[170px] flex flex-col items-center text-center"
          >
            {/* Avatar & Rank badge */}
            <div className="relative mb-2">
              {rank === 1 && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                  <Crown className="h-6 w-6 fill-amber-400" />
                </div>
              )}
              <Avatar
                name={user.name}
                src={user.avatarUrl}
                size={rank === 1 ? "lg" : "md"}
                className={rank === 1 ? "ring-4 ring-amber-400" : "ring-2 ring-border"}
              />
              <span
                className={cn(
                  "absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full text-[11px] font-extrabold flex items-center justify-center text-white",
                  rank === 1
                    ? "bg-amber-500"
                    : rank === 2
                    ? "bg-slate-400"
                    : "bg-amber-700"
                )}
              >
                {rank}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-text truncate max-w-full px-1">
              {user.name}
            </p>
            <p className="text-[10px] sm:text-xs text-text-muted truncate max-w-full px-1">
              {user.college}
            </p>

            {/* Podium block */}
            <div
              className={cn(
                "w-full mt-2 rounded-t-2xl border-t-2 border-x border-border flex flex-col items-center justify-start pt-3",
                height,
                color
              )}
            >
              <span className="text-sm sm:text-base font-extrabold text-text tabular-nums">
                {user.points.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs text-text-muted">pts</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
