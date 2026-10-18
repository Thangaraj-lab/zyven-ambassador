"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  useSession,
  useMissions,
  useMySubmissions,
  useMyPoints,
  useMyRank,
  useMyTier,
  useLeaderboard,
  useAnnouncements,
} from "@/lib/data/hooks";
import { TierBadge } from "@/components/ui/TierBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { MissionCard } from "@/components/ui/MissionCard";
import { LeaderboardRow } from "@/components/ui/LeaderboardRow";
import { Button } from "@/components/ui/Button";
import {
  Trophy,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Gift,
  Bell,
  Building,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useMotionOK } from "@/lib/motion";
import type { MissionState } from "@/components/ui/StatusBadge";
import type { LeaderboardEntry, CollegeLeaderboardEntry } from "@/lib/data/types";

export default function DashboardPage() {
  const motionOK = useMotionOK();
  const { data: session } = useSession();
  const { data: missions = [] } = useMissions();
  const { data: submissions = [] } = useMySubmissions();
  const { data: pointsData } = useMyPoints();
  const { data: rankData } = useMyRank();
  const { data: tierData } = useMyTier();
  const { data: announcements = [] } = useAnnouncements();
  const { data: leaderboard = [] } = useLeaderboard("individual");
  const { data: collegeLeaderboard = [] } = useLeaderboard("college");

  // Celebration overlay state
  const [celebration, setCelebration] = useState<{
    show: boolean;
    points: number;
    missionTitle: string;
  } | null>(null);

  // Tier unlock modal state
  const [tierUnlock, setTierUnlock] = useState<string | null>(null);

  const user = session?.user;
  const userName = user?.name || "Ambassador";
  const totalPoints = pointsData?.total ?? 0;
  const rank = rankData?.rank ?? 24;

  // Time-aware greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  // Check for recent approval to show celebration overlay (B6-G)
  useEffect(() => {
    if (!pointsData?.transactions) return;
    const lastTx = pointsData.transactions[pointsData.transactions.length - 1];
    if (lastTx) {
      const seenKey = `zyven_seen_tx_${lastTx.id}`;
      if (!localStorage.getItem(seenKey)) {
        localStorage.setItem(seenKey, "true");
        let timer: NodeJS.Timeout;
        const anim = requestAnimationFrame(() => {
          setCelebration({
            show: true,
            points: lastTx.points,
            missionTitle: lastTx.reason,
          });

          if (motionOK) {
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.3 },
              colors: ["#4F46E5", "#7C3AED", "#A78BFA", "#10B981"],
              disableForReducedMotion: true,
            });
          }

          timer = setTimeout(() => {
            setCelebration(null);
          }, 5000);
        });

        return () => {
          cancelAnimationFrame(anim);
          clearTimeout(timer);
        };
      }
    }
  }, [pointsData, motionOK]);

  // Check for tier unlock modal (B6-H)
  useEffect(() => {
    if (!tierData) return;
    const tier = tierData.currentTier;
    if (totalPoints >= 50 && tier !== "bronze") {
      const seenTiers: string[] = JSON.parse(
        localStorage.getItem("zyven_seen_tiers") || "[]"
      );
      if (!seenTiers.includes(tier)) {
        seenTiers.push(tier);
        localStorage.setItem("zyven_seen_tiers", JSON.stringify(seenTiers));
        const anim = requestAnimationFrame(() => {
          setTierUnlock(tier);

          if (motionOK) {
            confetti({
              particleCount: 80,
              spread: 90,
              origin: { y: 0.5 },
              colors: ["#C8864B", "#E5B53A", "#7C3AED"],
              disableForReducedMotion: true,
            });
          }
        });

        return () => cancelAnimationFrame(anim);
      }
    }
  }, [tierData, totalPoints, motionOK]);

  // Derived mission states
  const getMissionState = (missionId: string, status: string): MissionState => {
    if (status === "coming_soon") return "LOCKED";
    const sub = submissions.find((s) => s.missionId === missionId);
    if (!sub) return "AVAILABLE";
    if (sub.state === "APPROVED") return "APPROVED";
    if (sub.state === "REJECTED") return "REJECTED";
    if (sub.state === "SUBMITTED" || sub.state === "UNDER_REVIEW")
      return "UNDER_REVIEW";
    if (sub.state === "STARTED") return "STARTED";
    return "AVAILABLE";
  };

  const activeMissions = missions.filter((m) => {
    const st = getMissionState(m.id, m.status);
    return st !== "APPROVED" && st !== "LOCKED";
  });

  const completedMissions = missions.filter((m) => {
    const st = getMissionState(m.id, m.status);
    return st === "APPROVED";
  });

  // Leaderboard snapshot: 5 rows around current user
  const leaderboardSnapshot = useMemo(() => {
    const entries = leaderboard as LeaderboardEntry[];
    const myIndex = entries.findIndex((e) => e.isYou);
    if (myIndex === -1) return entries.slice(0, 5);

    const start = Math.max(0, myIndex - 2);
    const end = Math.min(entries.length, myIndex + 3);
    return entries.slice(start, end);
  }, [leaderboard]);

  const collegesSnapshot = (collegeLeaderboard as CollegeLeaderboardEntry[]).slice(
    0,
    3
  );

  return (
    <div className="space-y-8">
      {/* Celebration Toast/Card Overlay (B6-G) */}
      <AnimatePresence>
        {celebration && celebration.show && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="rounded-2xl p-4 sm:p-5 glass-card border border-success/40 shadow-soft-lg flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl brand-gradient-bg text-white flex items-center justify-center font-black text-sm shadow-soft-sm shrink-0">
                +{celebration.points}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-text flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Mission Approved!</span>
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  {celebration.missionTitle}. Points added to your ledger!
                </p>
              </div>
            </div>

            <button
              onClick={() => setCelebration(null)}
              className="text-text-muted hover:text-text p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO COMMAND CARD (Dominant element with gradient wash) */}
      <div className="rounded-[28px] p-6 sm:p-8 bg-surface border border-border shadow-soft-md relative overflow-hidden bg-radial-wash">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary tracking-wide uppercase">
              Welcome back
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-text tracking-tight flex items-center gap-2">
              <span>
                Good {getTimeOfDay()},{" "}
                <span className="brand-gradient-text">{userName}</span>
              </span>
              <span>👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Zyven Student Ambassador • Founding Cohort
            </p>
          </div>

          <div className="flex items-center gap-3">
            <TierBadge
              tier={tierData?.currentTier ?? "bronze"}
              size="lg"
            />
          </div>
        </div>

        {/* Milestone Progress Bar (Dominant Element) */}
        <div className="space-y-2 pt-2 pb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
            <span className="text-text">
              {tierData?.pointsToNext && tierData.pointsToNext > 0
                ? `${tierData.pointsToNext} points to ${
                    tierData.nextTier
                      ? tierData.nextTier.toUpperCase()
                      : "NEXT TIER"
                  }`
                : "Top Tier Milestone Reached!"}
            </span>
            <span className="text-primary font-bold tabular-nums">
              {tierData?.progressPercentage ?? 0}%
            </span>
          </div>
          <ProgressBar
            value={tierData?.progressPercentage ?? 0}
            height={12}
            showGlow
          />
        </div>

        {/* Big Numbers Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/80">
          <div>
            <span className="text-[10px] sm:text-xs text-text-muted uppercase font-bold block mb-1">
              Total Points
            </span>
            <span className="text-2xl sm:text-3xl font-black text-text tabular-nums flex items-center gap-1.5">
              <Zap className="h-5 w-5 text-primary" />
              <AnimatedNumber value={totalPoints} />
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-xs text-text-muted uppercase font-bold block mb-1">
              Your Rank
            </span>
            <span className="text-2xl sm:text-3xl font-black text-text tabular-nums flex items-center gap-1.5">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>#{rank}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-xs text-text-muted uppercase font-bold block mb-1">
              Tasks Done
            </span>
            <span className="text-2xl sm:text-3xl font-black text-text tabular-nums flex items-center gap-1.5">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>{completedMissions.length} / 2</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-xs text-text-muted uppercase font-bold block mb-1">
              Current Tier
            </span>
            <span className="text-xl sm:text-2xl font-black capitalize text-text block pt-1">
              {tierData?.currentTier ?? "Bronze"}
            </span>
          </div>
        </div>
      </div>

      {/* 0-Points First-Run Encouraging CTA */}
      {totalPoints === 0 && (
        <div className="p-6 rounded-[24px] brand-gradient-bg text-white shadow-soft-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span>Start Your First Mission!</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              You are currently at 0 points. Complete your LinkedIn mission now
              to earn 50 points and jump to Bronze tier immediately!
            </p>
          </div>
          <Link href="/missions/linkedin-follow-post">
            <Button
              variant="secondary"
              size="md"
              className="bg-white text-text font-bold hover:bg-white/90 shrink-0"
            >
              Begin First Mission
            </Button>
          </Link>
        </div>
      )}

      {/* 2. NEXT MISSIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Active Missions</span>
            </h2>
            <p className="text-xs text-text-muted">
              Live tasks available for your college cohort.
            </p>
          </div>
          <Link
            href="/missions"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All ({missions.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {activeMissions.length === 0 ? (
          <div className="p-6 rounded-2xl bg-surface border border-border text-center text-xs text-text-muted">
            All available live missions completed! New missions drop next week.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMissions.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                state={getMissionState(m.id, m.status)}
              />
            ))}
          </div>
        )}

        {/* Collapsed Completed Missions Row */}
        {completedMissions.length > 0 && (
          <div className="p-4 rounded-2xl bg-surface border border-border/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="font-bold text-text">
                {completedMissions.length} Mission(s) Completed
              </span>
              <span className="text-text-muted">
                ({completedMissions.map((m) => m.title).join(", ")})
              </span>
            </div>
            <Link
              href="/submissions"
              className="font-bold text-primary hover:underline text-[11px]"
            >
              View Proof History
            </Link>
          </div>
        )}
      </div>

      {/* Grid: 3. Leaderboard Snapshot & 4. Rewards Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leaderboard Snapshot (5 rows around user) */}
        <div className="lg:col-span-7 rounded-[24px] bg-surface p-6 border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>Leaderboard Snapshot</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Top student ambassadors near your position.
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Full Standings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {leaderboardSnapshot.map((entry) => (
              <LeaderboardRow
                key={entry.ambassadorId}
                user={{
                  id: entry.ambassadorId,
                  rank: entry.rank,
                  name: entry.name,
                  college: entry.college,
                  points: entry.points,
                  avatarUrl: entry.avatarUrl,
                  isYou: entry.isYou,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right side: Next Reward & College Battle Strip */}
        <div className="lg:col-span-5 space-y-6">
          {/* Next Reward Card */}
          <div className="rounded-[24px] bg-surface p-6 border border-border shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <span>Next Milestone Reward</span>
              </h3>
              <Link
                href="/rewards"
                className="text-xs font-bold text-primary hover:underline"
              >
                All Tiers
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-surface-2 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-text">
                  {tierData?.nextTier
                    ? `${tierData.nextTier.toUpperCase()} Ambassador`
                    : "Champion Tier"}
                </span>
                <TierBadge
                  tier={tierData?.nextTier ?? "silver"}
                  size="sm"
                />
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                Unlock official Zyven merchandise, physical welcome kit, and priority access to high-impact campus missions.
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-text-muted">
                <span>
                  {tierData?.pointsToNext ?? 70} more points needed
                </span>
                <span className="text-primary">
                  {tierData?.progressPercentage ?? 0}% completed
                </span>
              </div>
            </div>
          </div>

          {/* College Battle Strip */}
          <div className="rounded-[24px] bg-surface p-6 border border-border shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <span>College Battle</span>
              </h3>
              <Link
                href="/leaderboard?tab=college"
                className="text-xs font-bold text-primary hover:underline"
              >
                View Battle
              </Link>
            </div>

            <div className="space-y-3">
              {collegesSnapshot.map((col) => (
                <div key={col.collegeId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text truncate max-w-[200px]">
                      {col.shortName} • {col.name}
                    </span>
                    <span className="font-extrabold text-text tabular-nums">
                      {col.totalPoints.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-2 overflow-hidden border border-border/60">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(10, (col.totalPoints / 1200) * 100)
                        )}%`,
                        backgroundColor: col.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements mini */}
          {announcements.length > 0 && (
            <div className="rounded-[24px] bg-surface p-5 border border-border shadow-soft-sm space-y-3">
              <h4 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-primary" />
                <span>Notice Board</span>
              </h4>
              <p className="text-xs font-bold text-text">
                {announcements[0].title}
              </p>
              <p className="text-[11px] text-text-muted line-clamp-2">
                {announcements[0].body}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tier Unlock Full-screen Modal (B6-H) */}
      <AnimatePresence>
        {tierUnlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md rounded-[28px] bg-surface p-7 border border-border shadow-soft-lg text-center space-y-6"
            >
              {/* Medal SVG & rotating conic glow */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-spin-slow blur-xl" />
                <div className="h-20 w-20 rounded-full brand-gradient-bg text-white flex items-center justify-center font-black text-2xl shadow-soft-lg relative z-10">
                  <Trophy className="h-10 w-10 text-amber-300" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Achievement Unlocked
                </span>
                <h3 className="text-2xl font-black capitalize text-text">
                  {tierUnlock} Ambassador Unlocked!
                </h3>
                <p className="text-xs text-text-muted max-w-xs mx-auto">
                  Congratulations! You have crossed the milestone threshold. New privileges have been added to your profile.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-2 border border-border text-left text-xs space-y-2">
                <span className="font-bold text-text block">Unlocked Perks:</span>
                <ul className="space-y-1.5 text-text-muted text-[11px]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-success stroke-[3]" />
                    <span>Official Zyven Digital Certificate of Recognition</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-success stroke-[3]" />
                    <span>Founding Ambassador Profile Badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-success stroke-[3]" />
                    <span>Access to Private Community AMAs</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full font-bold"
                  onClick={() => setTierUnlock(null)}
                >
                  Keep Going
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
