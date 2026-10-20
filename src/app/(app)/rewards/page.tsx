"use client";

import React from "react";
import { useRewards, useMyPoints, useMyTier } from "@/lib/data/hooks";
import { TierBadge, type TierType } from "@/components/ui/TierBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Gift, Check, Lock, Sparkles } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { Zyven3DMark } from "@/components/brand/Zyven3DMark";
import { motion } from "motion/react";

export default function RewardsLadderPage() {
  const { data: rewards = [] } = useRewards();
  const { data: pointsData } = useMyPoints();
  const { data: tierData } = useMyTier();

  const totalPoints = pointsData?.total ?? 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Universal Back Navigation */}
      <div>
        <BackButton fallbackHref="/dashboard" label="Back to Dashboard" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[28px] border border-primary/30 bg-gradient-to-br from-primary/20 via-surface/80 to-accent/30 p-5 shadow-soft-lg sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-primary-2/20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
              Zyvex progression
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-text sm:text-3xl">
              Your next level is glowing.
            </h2>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-text-muted">
              Every verified mission moves your status forward. Keep building momentum and unlock the next Zyvex tier.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {totalPoints.toLocaleString()} points in your ledger
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -7, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative shrink-0"
          >
            <div className="absolute inset-0 rounded-full bg-primary/35 blur-2xl" />
            <div className="relative rounded-full border border-primary/30 bg-bg/30 p-2 shadow-[0_0_45px_rgba(124,58,237,0.38)]">
              <Zyven3DMark size={118} interactive={false} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Milestone Progression
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight flex items-center gap-2">
          <Gift className="h-6 w-6 text-primary" />
          <span>Rewards & Tiers</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Complete campus missions to unlock higher status, swag boxes, and industry consideration.
        </p>
      </div>

      {/* Current Tier Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative overflow-hidden p-6 rounded-[24px] bg-surface border border-border shadow-soft-sm space-y-4"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-text-muted font-bold block mb-1">
              Current Ambassador Status
            </span>
            <div className="flex items-center gap-3">
              <TierBadge
                tier={tierData?.currentTier ?? "bronze"}
                size="lg"
              />
              <span className="text-xl font-black text-text tabular-nums">
                {totalPoints} Points Total
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-text block">
              {tierData?.nextTier
                ? `${tierData.pointsToNext} points to ${tierData.nextTier.toUpperCase()}`
                : "Top Tier Achieved"}
            </span>
            <span className="text-xs text-text-muted">
              {tierData?.progressPercentage ?? 0}% completed to next perk
            </span>
          </div>
        </div>

        <ProgressBar value={tierData?.progressPercentage ?? 0} height={10} />
      </motion.div>

      {/* Tier Ladder Cards with Vertical Progression Spine */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-6 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-success before:via-primary before:to-border">
        {rewards.map((reward, idx) => {
          const isUnlocked = totalPoints >= reward.threshold;
          const isNext =
            tierData?.nextTier?.toLowerCase() === reward.tier.toLowerCase();

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="relative"
            >
              {/* Spine Node Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-6 -translate-x-1/2 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isUnlocked
                    ? "bg-success border-white ring-4 ring-success/20 text-white"
                    : isNext
                    ? "brand-gradient-bg border-white ring-4 ring-primary/30 text-white animate-pulse"
                    : "bg-surface-2 border-border text-text-muted"
                }`}
              >
                {isUnlocked ? (
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </div>

              {/* Tier Card */}
              <div
                className={`p-6 rounded-[24px] border transition-all ${
                  isUnlocked
                    ? "bg-surface border-success/40 shadow-soft-sm"
                    : isNext
                    ? "bg-surface border-primary shadow-soft-md ring-1 ring-primary/30"
                    : "bg-surface-2/40 border-border opacity-70"
                }`}
              >
                {isNext && <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isUnlocked
                          ? "bg-success text-white"
                          : isNext
                          ? "brand-gradient-bg text-white"
                          : "bg-surface-2 text-text-muted border border-border"
                      }`}
                    >
                      {isUnlocked ? (
                        <Check className="h-5 w-5 stroke-[3]" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">
                          Tier 0{idx + 1}
                        </span>
                        {isNext && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                            Next Milestone
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-extrabold text-text">
                        {reward.title}
                      </h3>
                      <span className="text-xs text-text-muted">
                        Requires {reward.threshold} Points
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TierBadge tier={reward.tier as TierType} size="md" />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isUnlocked
                          ? "bg-success/10 text-success border border-success/30"
                          : isNext
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-surface-2 text-text-muted border border-border"
                      }`}
                    >
                      {isUnlocked ? "Unlocked" : isNext ? "Next Goal" : "Locked"}
                    </span>
                  </div>
                </div>

                {/* Perks List */}
                <div className="space-y-2 pt-2 border-t border-border/80">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    Perks & Privileges (Planned):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text">
                    {reward.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-2">
                        <Sparkles
                          className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                            isUnlocked ? "text-success" : "text-text-muted"
                          }`}
                        />
                        <span className={!isUnlocked ? "text-text-muted" : ""}>
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-surface-2 border border-border text-center text-xs text-text-muted">
        Note: Reward merchandise and physical packages are delivered upon cohort qualification.
      </div>
    </div>
  );
}
