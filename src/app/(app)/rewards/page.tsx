"use client";

import React from "react";
import { useRewards, useMyPoints, useMyTier } from "@/lib/data/hooks";
import { TierBadge, type TierType } from "@/components/ui/TierBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Gift, Check, Lock, Sparkles } from "lucide-react";

export default function RewardsLadderPage() {
  const { data: rewards = [] } = useRewards();
  const { data: pointsData } = useMyPoints();
  const { data: tierData } = useMyTier();

  const totalPoints = pointsData?.total ?? 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
      <div className="p-6 rounded-[24px] bg-surface border border-border shadow-soft-sm space-y-4">
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
      </div>

      {/* Tier Ladder Cards with Vertical Progression Spine */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-6 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-success before:via-primary before:to-border">
        {rewards.map((reward, idx) => {
          const isUnlocked = totalPoints >= reward.threshold;
          const isNext =
            tierData?.nextTier?.toLowerCase() === reward.tier.toLowerCase();

          return (
            <div key={reward.id} className="relative">
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
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-surface-2 border border-border text-center text-xs text-text-muted">
        Note: Reward merchandise and physical packages are delivered upon cohort qualification.
      </div>
    </div>
  );
}
