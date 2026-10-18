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

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: submissions = [] } = useMySubmissions();
  const { data: pointsData } = useMyPoints();
  const { data: rankData } = useMyRank();
  const { data: tierData } = useMyTier();

  const [searchQuery, setSearchQuery] = useState("");

  // Approval notification state
  const [approvalAlert, setApprovalAlert] = useState<{
    show: boolean;
    points: number;
    title: string;
  } | null>(null);

  // Cinematic Tier Upgrade state
  const [tierUpgrade, setTierUpgrade] = useState<string | null>(null);

  const user = session?.user;
  const userName = user?.name || "Thangaraj";
  const totalPoints = pointsData?.total ?? 80;
  const rank = rankData?.rank ?? 24;
  const completedCount = submissions.filter((s) => s.state === "APPROVED").length || 2;
  const totalAvailableCount = 2;

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
            className="p-5 rounded-[20px] brand-gradient-bg text-white shadow-soft-lg flex items-center justify-between gap-4"
          >
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
      <div className="relative flex items-center gap-4">
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
            Zyven Student Ambassador
          </p>
        </div>

        <div className="relative z-10 hidden sm:block">
          <Image
            src="/assets/z3d-crystal.png"
            alt="Zyven 3D Crystal Mark"
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

        <div className="grid gap-4 md:grid-cols-2">
          {/* Task 1: LinkedIn Follow & Post */}
          <div
            onClick={() =>
              openMissionPortal({
                slug: "linkedin-follow-post",
                title: "Follow & Post on LinkedIn",
                description:
                  "Follow the official Zyven page and publish our student ambassador launch announcement to your network.",
                points: 50,
                brand: "linkedin",
                category: "Social Media",
                estimatedMinutes: 5,
                steps: [
                  {
                    stepNumber: 1,
                    title: "Follow Zyven Profile",
                    description: "Open the official LinkedIn page and hit Follow to connect to our network.",
                  },
                  {
                    stepNumber: 2,
                    title: "Publish Launch Post",
                    description: "Copy our pre-written announcement template and share it on your LinkedIn feed.",
                  },
                  {
                    stepNumber: 3,
                    title: "Submit URL for Verification",
                    description: "Paste your live LinkedIn post URL to receive 50 points upon approval.",
                  },
                ],
              })
            }
            className="group relative block rounded-[1.25rem] border border-border bg-surface p-6 shadow-soft-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-1 active:scale-[0.985] cursor-pointer overflow-hidden"
          >
            <EnergyLine color="#0077B5" active={true} />
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#0077B5]/10 text-[#0077B5] shrink-0 border border-[#0077B5]/20 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(0,119,181,0.35)] transition-all">
                <span className="font-black text-lg">in</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-base text-text group-hover:text-primary transition-colors">
                  Follow &amp; Post on LinkedIn
                </div>
                <span className="mt-2 inline-block rounded-full bg-[#0077B5]/10 px-3 py-1 text-xs font-bold text-[#0077B5] border border-[#0077B5]/20">
                  +50 Points
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-3 border-t border-border/60">
              <span className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>~ 5 mins</span>
              </span>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-soft-sm transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Task 2: Join WhatsApp Community */}
          <div
            onClick={() =>
              openMissionPortal({
                slug: "join-whatsapp-community",
                title: "Join Zyven WhatsApp Community",
                description:
                  "Join the official Zyven Tamil Nadu student ambassador community on WhatsApp to receive real-time task alerts.",
                points: 30,
                brand: "whatsapp",
                category: "Community",
                estimatedMinutes: 2,
                steps: [
                  {
                    stepNumber: 1,
                    title: "Open Community Channel",
                    description: "Access the private Tamil Nadu student ambassador WhatsApp group.",
                  },
                  {
                    stepNumber: 2,
                    title: "Introduce Yourself",
                    description: "Share your college, department, and connect with fellow campus ambassadors.",
                  },
                  {
                    stepNumber: 3,
                    title: "Upload Membership Screenshot",
                    description: "Capture your membership screen and submit it for verified point rewards.",
                  },
                ],
              })
            }
            className="group relative block rounded-[1.25rem] border border-border bg-surface p-6 shadow-soft-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-1 active:scale-[0.985] cursor-pointer overflow-hidden"
          >
            <EnergyLine color="#25D366" active={true} />
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366]/10 text-[#25D366] shrink-0 border border-[#25D366]/20 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(37,211,102,0.35)] transition-all">
                <span className="font-black text-sm">WA</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-base text-text group-hover:text-primary transition-colors">
                  Join Zyven WhatsApp Community
                </div>
                <span className="mt-2 inline-block rounded-full bg-[#25D366]/10 px-3 py-1 text-xs font-bold text-[#25D366] border border-[#25D366]/20">
                  +30 Points
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-3 border-t border-border/60">
              <span className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>~ 2 mins</span>
              </span>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-soft-sm transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two-column Bottom: Campus Team & Points Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campus Team */}
        <div className="p-6 rounded-[24px] bg-surface border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Your Campus Team
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-text">
              {session?.profile?.college || "Muthayammal Engineering College"}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Ranked #2 with 1,240 pts • 24 active ambassadors
            </p>
          </div>
          <Link href="/leaderboard?tab=college" className="inline-block w-full">
            <button className="w-full py-2.5 rounded-xl border border-border bg-surface-2 text-xs font-bold text-text hover:bg-surface transition-colors cursor-pointer">
              View College Standings
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
              Silver Status • 150 Points
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Unlock official Zyven ambassador merchandise box & priority invitations.
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
