"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  useSession,
  useMissions,
  useMySubmissions,
  useMyPoints,
  useMyRank,
  useMyTier,
} from "@/lib/data/hooks";
import { TierBadge } from "@/components/ui/TierBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { MissionState } from "@/components/ui/StatusBadge";
import {
  Trophy,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: missions = [] } = useMissions();
  const { data: submissions = [] } = useMySubmissions();
  const { data: pointsData } = useMyPoints();
  const { data: rankData } = useMyRank();
  const { data: tierData } = useMyTier();

  // Approval notification state
  const [approvalAlert, setApprovalAlert] = useState<{
    show: boolean;
    points: number;
    title: string;
  } | null>(null);

  // Cinematic Tier Upgrade state
  const [tierUpgrade, setTierUpgrade] = useState<string | null>(null);

  const user = session?.user;
  const userName = user?.name || "Ambassador";
  const totalPoints = pointsData?.total ?? 0;
  const rank = rankData?.rank ?? 12;

  // Time-aware greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "MORNING";
    if (hour < 17) return "AFTERNOON";
    return "EVENING";
  };

  // Recent approval detection
  useEffect(() => {
    if (!pointsData?.transactions || pointsData.transactions.length === 0) return;
    const lastTx = pointsData.transactions[pointsData.transactions.length - 1];
    if (lastTx) {
      const seenKey = `zyven_seen_tx_${lastTx.id}`;
      if (!localStorage.getItem(seenKey)) {
        localStorage.setItem(seenKey, "true");
        let timer: NodeJS.Timeout;
        const anim = requestAnimationFrame(() => {
          setApprovalAlert({
            show: true,
            points: lastTx.points,
            title: lastTx.reason,
          });

          timer = setTimeout(() => {
            setApprovalAlert(null);
          }, 6000);
        });

        return () => {
          cancelAnimationFrame(anim);
          clearTimeout(timer);
        };
      }
    }
  }, [pointsData]);

  // Tier Upgrade Moment (Section 11)
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
          setTierUpgrade(tier);
        });
        return () => cancelAnimationFrame(anim);
      }
    }
  }, [tierData, totalPoints]);

  // Mission States
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

  // Actionable Tasks
  const actionableTasks = missions
    .filter((m) => {
      const st = getMissionState(m.id, m.status);
      return st !== "APPROVED" && st !== "LOCKED";
    })
    .slice(0, 3);

  const completedCount = submissions.filter((s) => s.state === "APPROVED").length;

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Approval Notification Banner (Section 15) */}
      <AnimatePresence>
        {approvalAlert && approvalAlert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="p-5 rounded-[20px] bg-surface border border-success/30 shadow-soft-md flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full bg-success/10 text-success flex items-center justify-center font-black text-sm shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-success uppercase tracking-wider">
                  Approved • +{approvalAlert.points} Points Awarded
                </span>
                <h4 className="text-sm font-bold text-text">
                  {approvalAlert.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setApprovalAlert(null)}
              className="text-text-muted hover:text-text p-1 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Tier Upgrade Overlay (Section 11) */}
      <AnimatePresence>
        {tierUpgrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-[28px] bg-surface border border-primary/40 p-8 text-center space-y-5 shadow-soft-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-radial-wash pointer-events-none opacity-80" />
              <div className="relative z-10 flex flex-col items-center space-y-3">
                <div className="h-20 w-20 rounded-full brand-gradient-bg p-1 shadow-soft-md flex items-center justify-center text-white">
                  <Sparkles className="h-10 w-10" />
                </div>
                <span className="text-xs font-bold text-primary tracking-widest uppercase">
                  Milestone Unlocked
                </span>
                <h2 className="text-3xl font-black text-text tracking-tight capitalize">
                  {tierUpgrade} Tier
                </h2>
                <p className="text-xs text-text-muted max-w-xs">
                  Your campus influence has elevated. You now hold priority status for Zyven tech events and merch drops.
                </p>
                <div className="pt-2">
                  <TierBadge tier={tierUpgrade as "bronze" | "silver" | "gold" | "champion"} size="lg" />
                </div>
              </div>
              <div className="relative z-10 pt-4">
                <Button
                  variant="primary"
                  className="w-full font-bold"
                  onClick={() => setTierUpgrade(null)}
                >
                  Continue to Command Center
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 10: PERSONAL COMMAND CENTER HERO */}
      <div className="rounded-[28px] p-7 sm:p-10 bg-surface border border-border shadow-soft-md relative overflow-hidden">
        {/* Subtle radial ambient expansion behind the points counter */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Greeting & Active Dot */}
        <div className="flex items-center justify-between pb-6 border-b border-border/70 relative z-10">
          <div>
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">
              Good {getTimeOfDay()}, {userName}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>Active</span>
          </div>
        </div>

        {/* Hero Points Centerpiece */}
        <div className="py-8 sm:py-10 flex flex-col items-center justify-center text-center relative z-10 space-y-2">
          <div className="flex items-baseline justify-center gap-2">
            <AnimatedNumber
              value={totalPoints}
              className="text-5xl sm:text-7xl font-black text-text tracking-tight tabular-nums"
            />
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-primary tracking-widest uppercase">
            Points
          </span>

          {/* Divider with Next Tier & Leaderboard Rank */}
          <div className="w-full max-w-md pt-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-text-muted">
              <span>
                {tierData?.pointsToNext && tierData.pointsToNext > 0
                  ? `${tierData.pointsToNext} points to next tier`
                  : "Maximum Tier Reached"}
              </span>
              <span className="flex items-center gap-1 text-text">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                <span>#{rank} on leaderboard</span>
              </span>
            </div>
            <ProgressBar value={tierData?.progressPercentage ?? 0} height="8px" />
          </div>
        </div>
      </div>

      {/* WHAT TO DO NEXT (First Viewport Priority - Section 10) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-text uppercase tracking-wider">
              What To Do Next
            </h2>
            <p className="text-xs text-text-muted">High-priority tasks ready for submission</p>
          </div>
          <Link href="/missions" className="text-xs font-semibold text-primary hover:underline">
            View all tasks →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {actionableTasks.map((task) => (
            <Link key={task.id} href={`/missions/${task.slug}`} className="block group">
              <Card
                hoverable
                className="h-full flex flex-col justify-between p-5 border-border group-hover:border-primary/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider">
                      {task.brand.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-success">
                      +{task.points} PTS
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors line-clamp-1">
                    {task.title}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" />
                    {task.estimatedMinutes} min
                  </span>
                  <span className="flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Start task</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* YOUR PROGRESS (Tier Progression Ladder - Section 10) */}
      <section className="space-y-4">
        <h2 className="text-sm font-extrabold text-text uppercase tracking-wider">
          Your Progress
        </h2>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
            <div className="flex items-center gap-3">
              <TierBadge tier={tierData?.currentTier ?? "bronze"} size="lg" />
              <div>
                <h3 className="text-base font-bold text-text capitalize">
                  {tierData?.currentTier ?? "bronze"} Tier
                </h3>
                <p className="text-xs text-text-muted">
                  {completedCount} task{completedCount === 1 ? "" : "s"} verified
                </p>
              </div>
            </div>

            <Link href="/rewards">
              <Button size="sm" variant="outline" className="gap-1.5">
                <span>View Rewards Ladder</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-surface-2/60 border border-border/60">
              <span className="block text-[10px] font-bold text-text-muted uppercase">Bronze</span>
              <span className="text-xs font-extrabold text-text">50 Pts</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/60 border border-border/60">
              <span className="block text-[10px] font-bold text-text-muted uppercase">Silver</span>
              <span className="text-xs font-extrabold text-text">150 Pts</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/60 border border-border/60">
              <span className="block text-[10px] font-bold text-text-muted uppercase">Gold</span>
              <span className="text-xs font-extrabold text-text">300 Pts</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/60 border border-border/60">
              <span className="block text-[10px] font-bold text-text-muted uppercase">Champion</span>
              <span className="text-xs font-extrabold text-text">500 Pts</span>
            </div>
          </div>
        </Card>
      </section>

      {/* TWO COLUMN BOTTOM SECTION: YOUR TEAM & RECENT ACTIVITY (Section 10) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Your Team */}
        <Card className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <span className="text-xs font-extrabold text-text uppercase tracking-wider">
                Your Team
              </span>
              <Users className="h-4 w-4 text-primary" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-text">
                Kongu Engineering College
              </h3>
              <p className="text-xs text-text-muted">Campus Ambassador Cohort</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-surface-2 border border-border/60">
                <span className="block text-[10px] text-text-muted font-bold uppercase">Team Rank</span>
                <span className="text-lg font-black text-text">#2 in State</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-2 border border-border/60">
                <span className="block text-[10px] text-text-muted font-bold uppercase">Active Members</span>
                <span className="text-lg font-black text-text">24 Leaders</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/70 mt-4">
            <Link href="/leaderboard" className="w-full">
              <Button size="sm" variant="secondary" className="w-full justify-between">
                <span>View College Battle</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Right: Recent Activity */}
        <Card className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <span className="text-xs font-extrabold text-text uppercase tracking-wider">
                Recent Activity
              </span>
              <Zap className="h-4 w-4 text-warning" />
            </div>

            <div className="space-y-3">
              {pointsData?.transactions && pointsData.transactions.length > 0 ? (
                pointsData.transactions.slice(-3).reverse().map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-2/60 border border-border/50 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="font-bold text-text truncate">{tx.reason}</h4>
                      <span className="text-[10px] text-text-muted">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-extrabold text-success shrink-0">
                      +{tx.points} PTS
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-text-muted">
                  No verified points yet. Complete your first task to start your ledger!
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border/70 mt-4">
            <Link href="/profile" className="w-full">
              <Button size="sm" variant="secondary" className="w-full justify-between">
                <span>View Full Points Ledger</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
