import React, { useState } from "react";
import { motion } from "motion/react";
import { Clock, ArrowRight, Lock, Sparkles } from "lucide-react";
import { StatusBadge, type MissionState } from "./StatusBadge";
import { PointsPill } from "./PointsPill";
import { cn } from "@/lib/utils";
import type { Mission } from "@/lib/data/types";
import { useMotionOK, ease } from "@/lib/motion";
import { openMissionPortal } from "@/components/motion/MissionPortal";
import { EnergyLine } from "@/components/motion/EnergyLine";

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
  const [isHovered, setIsHovered] = useState(false);
  const isLocked = mission.status === "coming_soon" || state === "LOCKED";
  const isCompleted = state === "APPROVED";

  const getBrandDetails = (brand: Mission["brand"]) => {
    switch (brand) {
      case "linkedin":
        return {
          color: "#0077B5",
          icon: (
            <div className="h-10 w-10 rounded-xl bg-[#0077B5]/10 text-[#0077B5] flex items-center justify-center font-bold text-base border border-[#0077B5]/20 shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(0,119,181,0.35)] transition-all duration-300">
              in
            </div>
          ),
        };
      case "whatsapp":
        return {
          color: "#25D366",
          icon: (
            <div className="h-10 w-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center font-bold text-sm border border-[#25D366]/20 shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(37,211,102,0.35)] transition-all duration-300">
              WA
            </div>
          ),
        };
      case "instagram":
        return {
          color: "#E1306C",
          icon: (
            <div className="h-10 w-10 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center font-bold text-sm border border-[#E1306C]/20 shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(225,48,108,0.35)] transition-all duration-300">
              IG
            </div>
          ),
        };
      default:
        return {
          color: "#8b5cf6",
          icon: (
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all duration-300">
              <Sparkles className="h-5 w-5" />
            </div>
          ),
        };
    }
  };

  const brandInfo = getBrandDetails(mission.brand);

  const cardContent = (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!isLocked && motionOK ? { y: -3, scale: 1.01 } : undefined}
      whileTap={!isLocked && motionOK ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.22, ease: ease.out }}
      className={cn(
        "relative rounded-[22px] bg-surface p-5 border transition-all duration-200 flex flex-col justify-between overflow-hidden group select-none",
        isLocked
          ? "border-border/60 opacity-60 bg-surface-2/40 cursor-not-allowed"
          : isCompleted
          ? "border-success/30 bg-surface hover:shadow-soft-md"
          : "border-border hover:border-primary/50 shadow-soft-sm hover:shadow-soft-md cursor-pointer",
        className
      )}
    >
      {/* Perimeter Energy Line on Hover */}
      {!isLocked && isHovered && (
        <EnergyLine active={true} color={brandInfo.color} />
      )}

      <div>
        {/* Top bar: Brand icon + Status & Points */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {brandInfo.icon}
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

        <div className="flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openMissionPortal({
      slug: mission.slug,
      title: mission.title,
      points: mission.points,
      brand: mission.brand,
    });
  };

  return (
    <div onClick={handleClick} className="block cursor-pointer">
      {cardContent}
    </div>
  );
}
