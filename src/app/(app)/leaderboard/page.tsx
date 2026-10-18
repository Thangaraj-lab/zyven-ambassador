"use client";

import React, { useState } from "react";
import { useLeaderboard } from "@/lib/data/hooks";
import { PodiumCard } from "@/components/ui/PodiumCard";
import { LeaderboardRow, type LeaderboardUser } from "@/components/ui/LeaderboardRow";
import { Trophy, AlertCircle } from "lucide-react";
import type { LeaderboardEntry, CollegeLeaderboardEntry } from "@/lib/data/types";
import { useSearchParams } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";

export default function LeaderboardPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "college" ? "college" : "individual";
  const [activeTab, setActiveTab] = useState<"individual" | "college">(defaultTab);

  const { data: individualEntries = [] } = useLeaderboard("individual");
  const { data: collegeEntries = [] } = useLeaderboard("college");

  const ambassadors = individualEntries as LeaderboardEntry[];
  const colleges = collegeEntries as CollegeLeaderboardEntry[];

  const top3 = [
    ambassadors[0]
      ? {
          id: ambassadors[0].ambassadorId,
          rank: ambassadors[0].rank,
          name: ambassadors[0].name,
          college: ambassadors[0].college,
          points: ambassadors[0].points,
          avatarUrl: ambassadors[0].avatarUrl,
        }
      : undefined,
    ambassadors[1]
      ? {
          id: ambassadors[1].ambassadorId,
          rank: ambassadors[1].rank,
          name: ambassadors[1].name,
          college: ambassadors[1].college,
          points: ambassadors[1].points,
          avatarUrl: ambassadors[1].avatarUrl,
        }
      : undefined,
    ambassadors[2]
      ? {
          id: ambassadors[2].ambassadorId,
          rank: ambassadors[2].rank,
          name: ambassadors[2].name,
          college: ambassadors[2].college,
          points: ambassadors[2].points,
          avatarUrl: ambassadors[2].avatarUrl,
        }
      : undefined,
  ] as [LeaderboardUser?, LeaderboardUser?, LeaderboardUser?];

  const youEntry = ambassadors.find((a) => a.isYou);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Universal Back Navigation */}
      <div>
        <BackButton fallbackHref="/dashboard" label="Back to Dashboard" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Standings & Cohort Rankings
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            <span>Leaderboard</span>
          </h1>
        </div>

        {/* Individual / College Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-border">
          <button
            onClick={() => setActiveTab("individual")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "individual"
                ? "brand-gradient-bg text-white shadow-soft-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            Ambassadors
          </button>
          <button
            onClick={() => setActiveTab("college")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "college"
                ? "brand-gradient-bg text-white shadow-soft-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            Colleges
          </button>
        </div>
      </div>

      {/* Period Chips */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold brand-gradient-bg text-white">
          All-Time Active
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-2 text-text-muted border border-border opacity-60 cursor-not-allowed">
          Weekly (Soon)
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-2 text-text-muted border border-border opacity-60 cursor-not-allowed">
          Monthly (Soon)
        </span>
      </div>

      {activeTab === "individual" ? (
        <div className="space-y-6">
          {/* Top 3 Podium */}
          {top3[0] && <PodiumCard topThree={top3} />}

          {/* Ranked List */}
          <div className="space-y-2">
            {ambassadors.map((a) => (
              <LeaderboardRow
                key={a.ambassadorId}
                user={{
                  id: a.ambassadorId,
                  rank: a.rank,
                  name: a.name,
                  college: a.college,
                  points: a.points,
                  avatarUrl: a.avatarUrl,
                  isYou: a.isYou,
                }}
              />
            ))}
          </div>

          {/* Sticky-pinned "You" row at viewport bottom */}
          {youEntry && (
            <div className="sticky bottom-16 md:bottom-4 z-30 pt-2">
              <div className="p-1 rounded-2xl bg-surface/90 backdrop-blur-md border-2 border-primary shadow-soft-lg">
                <LeaderboardRow
                  user={{
                    id: youEntry.ambassadorId,
                    rank: youEntry.rank,
                    name: `${youEntry.name} (Your Current Standings)`,
                    college: youEntry.college,
                    points: youEntry.points,
                    avatarUrl: youEntry.avatarUrl,
                    isYou: true,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* College Battle Rankings */
        <div className="space-y-4">
          {colleges.map((col) => (
            <div
              key={col.collegeId}
              className="p-5 rounded-[20px] bg-surface border border-border shadow-soft-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-surface-2 border border-border flex items-center justify-center font-black text-xs text-text tabular-nums">
                    #{col.rank}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-text">
                      {col.name} ({col.shortName})
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Top Ambassador:{" "}
                      <span className="font-semibold text-text">
                        {col.topAmbassadorName}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-lg font-black text-text tabular-nums block">
                    {col.totalPoints.toLocaleString()} pts
                  </span>
                  <span className="text-xs text-text-muted">
                    {col.memberCount} ambassadors • {col.averagePoints} avg
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 rounded-full bg-surface-2 overflow-hidden border border-border/60">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(12, (col.totalPoints / 1500) * 100)
                    )}%`,
                    backgroundColor: col.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Demo Data Notice */}
      <div className="p-4 rounded-2xl bg-surface-2 border border-border text-center text-xs text-text-muted flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4 text-primary shrink-0" />
        <span>Demo data — real rankings start at official cohort launch</span>
      </div>
    </div>
  );
}
