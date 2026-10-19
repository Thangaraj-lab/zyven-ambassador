"use client";

import React, { useState } from "react";
import { useRewards } from "@/lib/data/hooks";
import { Gift, Award, Sparkles, CheckCircle2, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminRewardsPage() {
  const { data: rewards = [] } = useRewards();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Gift className="w-3.5 h-3.5" />
              Incentives & Swag
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 28</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Tier Rewards Catalog
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Configure unlockable swag boxes, event VIP passes, and merchandise
            unlocked at point thresholds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="p-6 rounded-2xl bg-surface/90 border border-border/60 space-y-4 shadow-soft-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {reward.tier} Tier
                </span>
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {reward.threshold} Points Required
                </span>
              </div>

              <h2 className="text-lg font-bold text-text">{reward.title}</h2>
              <p className="text-xs text-text-muted mt-0.5">{reward.titleTa}</p>

              <div className="mt-4 space-y-2 pt-3 border-t border-border/40">
                <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Included Perks & Merchandise:
                </div>
                <div className="space-y-1.5">
                  {reward.perks.map((perk, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-text"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
