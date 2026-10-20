"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useSession,
  useMySubmissions,
  useMyPoints,
  useMyRank,
  useMyTier,
  useMissions,
} from "@/lib/data/hooks";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NotificationBell } from "@/components/ui/NotificationBell";
import {
  Trophy,
  ChartColumn,
  CheckCircle2,
  Shield,
  Search,
  ArrowRight,
  Clock,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { openMissionPortal } from "@/components/motion/MissionPortal";
import { EnergyLine } from "@/components/motion/EnergyLine";
import { Zyven3DMark } from "@/components/brand/Zyven3DMark";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: missions = [] } = useMissions();
  const { data: submissions = [] } = useMySubmissions();
  const { data: pointsData } = useMyPoints();
  const { data: rankData } = useMyRank();
  const { data: tierData } = useMyTier();

  const [searchQuery, setSearchQuery] = useState("");

  const liveMissions = missions.filter((m) => m.status === "live");

  // Approval notification state
  const [approvalAlert, setApprovalAlert] = useState<{
    show: boolean;
    points: number;
    title: string;
  } | null>(null);

  // Cinematic Tier Upgrade state
  const [tierUpgrade, setTierUpgrade] = useState<string | null>(null);

  const user = session?.user;
  const userName = user?.name || "Student";
  const totalPoints = pointsData?.total ?? 0;
  const rank = rankData?.rank ?? 1;
  const completedCount = submissions.filter((s) => s.state === "APPROVED").length;
  // Include completed historical tasks in the denominator so the card never
  // reports an impossible value such as "3 / 1" after older tasks leave live.
  const totalAvailableCount = Math.max(missions.length, completedCount);

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

  // Tier Upgrade Moment
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Approval Notification Banner */}
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

        {tierUpgrade && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden p-5 rounded-[20px] brand-gradient-bg text-white shadow-soft-lg flex items-center justify-between gap-4"
          >
            <div className="pointer-events-none absolute -right-4 -top-12 h-36 w-36 rounded-full bg-white/20 blur-3xl" />
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-black text-sm shrink-0">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
                  Tier Unlocked!
                </span>
                <h4 className="text-sm font-bold text-white">
                  Congratulations! You achieved {tierUpgrade.toUpperCase()} Ambassador Tier
                </h4>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
              className="hidden shrink-0 sm:block"
            >
              <Zyven3DMark size={62} interactive={false} />
            </motion.div>
            <button
              onClick={() => setTierUpgrade(null)}
              className="text-white/80 hover:text-white p-1 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Search Bar & Controls */}
      <div className="relative hidden items-center gap-4 md:flex">
        <div className="flex flex-1 items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-text-muted shadow-soft-sm focus-within:border-primary/50 transition-colors">
          <Search className="h-4 w-4 text-text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, announcements…"
            className="w-full bg-transparent text-xs sm:text-sm text-text focus:outline-none placeholder:text-text-muted"
          />
        </div>
        <ThemeToggle />
        <NotificationBell />
        <Link
          href="/profile"
          className="grid h-10 w-10 place-items-center rounded-full bg-brand font-bold text-white shadow-soft-sm hover:brightness-105 transition-all text-sm cursor-pointer"
        >
          {userName.charAt(0).toUpperCase()}
        </Link>
      </div>

      {/* Welcome Hero Section with 3D Crystal Z mark */}
      <section className="rise relative flex items-center justify-between p-6 sm:p-10 rounded-[28px] bg-surface border border-border shadow-soft-md overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-glow opacity-60" />
        <div className="relative z-10 space-y-1">
          <p className="text-base sm:text-lg text-text-muted font-medium">Welcome back,</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text">
            {userName} 👋
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-primary">
            Zyvex Student Ambassador
          </p>
        </div>

        <div className="relative z-10 hidden sm:block">
          <Image
            src="/assets/z3d-crystal.png"
            alt="Zyvex 3D Crystal Mark"
            width={190}
            height={190}
            className="float-slow h-36 w-36 sm:h-44 sm:w-44 object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </section>

      {/* 4 Stat Cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Card 1: Total Points */}
        <div className="rounded-[1.25rem] border border-border bg-surface p-6 text-center shadow-soft-sm transition-transform hover:-translate-y-1 group">
          <Trophy className="mx-auto h-8 w-8 text-warning group-hover:scale-110 transition-transform" />
          <div className="mt-3 text-3xl font-black text-text tabular-nums">
            <AnimatedNumber value={totalPoints} />
          </div>
          <div className="text-xs text-text-muted font-medium mt-1">Total Points</div>
        </div>

        {/* Card 2: Your Rank */}
        <div className="rounded-[1.25rem] border border-border bg-surface p-6 text-center shadow-soft-sm transition-transform hover:-translate-y-1 group">
          <ChartColumn className="mx-auto h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
          <div className="mt-3 text-3xl font-black text-text tabular-nums">
            #{rank}
          </div>
          <div className="text-xs text-text-muted font-medium mt-1">Your Rank</div>
        </div>

        {/* Card 3: Tasks Completed */}
        <div className="rounded-[1.25rem] border border-border bg-surface p-6 text-center shadow-soft-sm transition-transform hover:-translate-y-1 group">
          <CheckCircle2 className="mx-auto h-8 w-8 text-success group-hover:scale-110 transition-transform" />
          <div className="mt-3 text-3xl font-black text-text tabular-nums">
            {completedCount} / {totalAvailableCount}
          </div>
          <div className="text-xs text-text-muted font-medium mt-1">Tasks Completed</div>
        </div>

        {/* Card 4: Current Tier */}
        <div className="rounded-[1.25rem] border border-border bg-surface p-6 text-center shadow-soft-sm transition-transform hover:-translate-y-1 group">
          <Shield className="mx-auto h-8 w-8 text-warning group-hover:scale-110 transition-transform" />
          <div className="mt-3 text-3xl font-black text-text capitalize">
            {tierData?.currentTier || "Bronze"}
          </div>
          <div className="text-xs text-text-muted font-medium mt-1">Current Tier</div>
        </div>
      </section>

      {/* Active Tasks Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">Active Tasks</h2>
          <Link
            href="/missions"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {liveMissions.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-border bg-surface/50 p-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-primary/60 mb-2" />
            <div className="font-bold text-text">No active tasks yet</div>
            <div className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              New campus challenges and initiatives will appear here once approved by administrators.
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {liveMissions.map((mission) => (
              <div
                key={mission.id}
                onClick={() =>
                  openMissionPortal({
                    slug: mission.slug,
                    title: mission.title,
                    description: mission.description,
                    points: mission.points,
                    brand: mission.brand || "zyven",
                    category: mission.category || "General",
                    estimatedMinutes: mission.estimatedMinutes || 10,
                    steps: mission.instructions?.map((inst, idx) => ({
                      stepNumber: inst.stepNumber || idx + 1,
                      title: inst.title,
                      description: inst.description,
                    })),
                  })
                }
                className="group relative block rounded-[1.25rem] border border-border bg-surface p-6 shadow-soft-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-1 active:scale-[0.985] cursor-pointer overflow-hidden"
              >
                <EnergyLine color="#6366F1" active={true} />
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base text-text group-hover:text-primary transition-colors">
                      {mission.title}
                    </div>
                    <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                      +{mission.points} Points
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>~ {mission.estimatedMinutes || 10} mins</span>
                  </span>
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-soft-sm transition-transform group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Two-column Bottom: Campus Info & Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campus Info */}
        <div className="p-6 rounded-[24px] bg-surface border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Your Campus
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-text">
              {session?.profile?.college || "Muthayammal Engineering College"}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Verified campus representation • Solo Ambassador Network
            </p>
          </div>
          <Link href="/leaderboard" className="inline-block w-full">
            <button className="w-full py-2.5 rounded-xl border border-border bg-surface-2 text-xs font-bold text-text hover:bg-surface transition-colors cursor-pointer">
              View Student Leaderboard
            </button>
          </Link>
        </div>

        {/* Milestone Progression */}
        <div className="p-6 rounded-[24px] bg-surface border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Next Reward Status
            </span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-text">
              {totalPoints >= 150 ? "Gold Status • 300 Points" : "Silver Status • 150 Points"}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Unlock official Zyvex ambassador merchandise box & priority invitations.
            </p>
          </div>
          <Link href="/rewards" className="inline-block w-full">
            <button className="w-full py-2.5 rounded-xl brand-gradient-bg text-xs font-bold text-white hover:brightness-105 transition-all shadow-soft-sm cursor-pointer">
              Explore Milestone Perks
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
