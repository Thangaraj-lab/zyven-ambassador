"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Clock, ArrowRight, Lock, Sparkles } from "lucide-react";
import { StatusBadge, type MissionState } from "./StatusBadge";
import { PointsPill } from "./PointsPill";
import { cn } from "@/lib/utils";
import type { Mission } from "@/lib/data/types";
import { useMotionOK, ease } from "@/lib/motion";

interface MissionCardProps {
  mission: Mission;
  state?: MissionState;
  className?: string;
}

export function MissionCard({
  mission,
  state = "AVAILABLE",
  className = "",
}: MissionCardProps) {
  const motionOK = useMotionOK();
  const isLocked = mission.status === "coming_soon" || state === "LOCKED";
  const isCompleted = state === "APPROVED";

  const getBrandIcon = (brand: Mission["brand"]) => {
    switch (brand) {
      case "linkedin":
        return (
          <div className="h-10 w-10 rounded-xl bg-[#0077B5]/10 text-[#0077B5] flex items-center justify-center font-bold text-base border border-[#0077B5]/20 shrink-0">
            in
          </div>
        );
      case "whatsapp":
        return (
          <div className="h-10 w-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center font-bold text-sm border border-[#25D366]/20 shrink-0">
            WA
          </div>
        );
      case "instagram":
        return (
          <div className="h-10 w-10 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center font-bold text-sm border border-[#E1306C]/20 shrink-0">
            IG
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
        );
    }
  };

  const cardContent = (
    <motion.div
      whileHover={!isLocked && motionOK ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: ease.out }}
      className={cn(
        "relative rounded-[20px] bg-surface p-5 border transition-all duration-200 flex flex-col justify-between overflow-hidden group select-none",
        isLocked
          ? "border-border/60 opacity-60 bg-surface-2/40 cursor-not-allowed"
          : isCompleted
          ? "border-success/30 bg-surface hover:shadow-soft-md"
          : "border-border hover:border-primary/50 shadow-soft-sm hover:shadow-soft-md cursor-pointer",
        className
      )}
    >
      <div>
        {/* Top bar: Brand icon + Status & Points */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {getBrandIcon(mission.brand)}
          <div className="flex items-center gap-2">
            <PointsPill points={mission.points} size="sm" />
            <StatusBadge state={isLocked ? "LOCKED" : state} size="sm" />
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-text mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {mission.title}
        </h3>
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-4">
          {mission.description}
        </p>
      </div>

      {/* Meta footer: time, difficulty, CTA */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5" />
            {mission.estimatedMinutes} mins
          </span>
          <span className="font-semibold text-text-muted px-2 py-0.5 rounded-full bg-surface-2 text-[10px]">
            {mission.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-1 font-bold text-primary group-hover:translate-x-0.5 transition-transform">
          {isLocked ? (
            <span className="flex items-center gap-1 text-text-muted">
              <Lock className="h-3 w-3" /> Locked
            </span>
          ) : isCompleted ? (
            <span className="text-success font-semibold">Completed</span>
          ) : (
            <>
              <span>{state === "STARTED" ? "Continue" : "Start"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isLocked) {
    return <div title="New missions drop soon">{cardContent}</div>;
  }

  return (
    <Link href={`/missions/${mission.slug}`} className="block">
      {cardContent}
    </Link>
  );
}
