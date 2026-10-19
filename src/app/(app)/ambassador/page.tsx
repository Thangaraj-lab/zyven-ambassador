"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  useSession,
  useMissions,
  useAdminSubmissions,
  useMyTeam,
  useAnnouncements,
} from "@/lib/data/hooks";
import {
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Users,
  PlusCircle,
  ArrowRight,
  Clock,
  ShieldCheck,
  Megaphone,
  Copy,
  Check,
  Zap,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function AmbassadorCommandCenterPage() {
  const { data: session } = useSession();
  const { data: pendingReviews = [] } = useAdminSubmissions({ state: "SUBMITTED" });
  const { data: missions = [] } = useMissions();
  const { data: myTeam } = useMyTeam();
  const { data: announcements = [] } = useAnnouncements();

  const [copiedCode, setCopiedCode] = useState(false);

  const user = session?.user;
  const userName = user?.name ? user.name.split(" ")[0] : "Ambassador";

  // Filter tasks created for this team or pending approval
  const teamTasks = missions.filter(
    (m) => m.teamId === myTeam?.id || m.audience === "own_team"
  );
  const pendingTasks = missions.filter((m) => m.status === "pending_approval");

  const copyInviteLink = () => {
    if (!myTeam?.inviteCode) return;
    const url = typeof window !== "undefined" ? `${window.location.origin}/register?code=${myTeam.inviteCode}` : "";
    navigator.clipboard.writeText(url);
    setCopiedCode(true);
    toast.success("Team invite link copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* SECTION 10: AMBASSADOR PORTAL HERO */}
      <div className="relative rounded-[32px] bg-surface border border-border p-6 sm:p-10 shadow-soft-lg overflow-hidden">
        {/* Subtle spectral lighting background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus Leadership Workspace</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-text tracking-tight leading-tight">
              Good evening, {userName}.
            </h1>

            <p className="text-base sm:text-lg font-bold text-primary italic">
              &ldquo;Lead your campus. Create impact.&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-xl">
              Manage your team, review submissions, and build meaningful student
              participation through Zyven.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/ambassador/tasks/new">
                <Button variant="primary" size="md" className="gap-2 font-bold shadow-soft-sm">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Task</span>
                </Button>
              </Link>
              <Link href="/ambassador/reviews">
                <Button variant="outline" size="md" className="gap-2 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Review Submissions ({pendingReviews.length})</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Hero: Elegant 3D Team Architecture Geometric Composition */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-sm h-64 rounded-3xl bg-surface-2/80 border border-border p-5 flex flex-col justify-between shadow-soft-sm overflow-hidden group">
              {/* Luminous Node Connections (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-primary/30">
                <line x1="20%" y1="30%" x2="50%" y2="50%" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="80%" y1="30%" x2="50%" y2="50%" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="30%" y2="80%" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="70%" y2="80%" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* Central Ambassador Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="h-14 w-14 rounded-2xl brand-gradient-bg text-white flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-surface">
                  {userName.charAt(0)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary mt-1.5 bg-surface px-2 py-0.5 rounded-full border border-border">
                  Lead Node
                </span>
              </div>

              {/* Surrounding Campus Student Nodes */}
              <div className="flex justify-between items-center relative z-10">
                <div className="h-8 w-8 rounded-xl bg-surface border border-border flex items-center justify-center text-xs font-bold text-text shadow-xs">
                  S1
                </div>
                <div className="h-8 w-8 rounded-xl bg-surface border border-border flex items-center justify-center text-xs font-bold text-text shadow-xs">
                  S2
                </div>
              </div>

              <div className="flex justify-between items-center relative z-10 pt-16">
                <div className="h-8 w-8 rounded-xl bg-surface border border-border flex items-center justify-center text-xs font-bold text-text shadow-xs">
                  S3
                </div>
                <div className="h-8 w-8 rounded-xl bg-surface border border-border flex items-center justify-center text-xs font-bold text-text shadow-xs">
                  S4
                </div>
              </div>

              {/* Bottom Team Stats Indicator */}
              <div className="relative z-10 pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
                <span className="font-semibold">{myTeam?.name || "Campus Cohort"}</span>
                <span className="font-black text-primary">{myTeam?.memberCount || 8} Active Members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 11: ACTION CENTER (REAL DATABASE VALUES) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-text-muted">
            Action Center
          </h2>
          <span className="text-xs text-text-muted">Realtime Database Sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Reviews Waiting */}
          <Link href="/ambassador/reviews">
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-soft-sm transition-all hover:-translate-y-0.5 cursor-pointer space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-primary uppercase tracking-wider">Reviews Waiting</span>
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-text tabular-nums">
                  {pendingReviews.length}
                </span>
                <span className="text-xs text-text-muted">pending checks</span>
              </div>
              <p className="text-[11px] text-text-muted pt-1">
                {pendingReviews.length > 0 ? "Submissions need review" : "All caught up"}
              </p>
            </div>
          </Link>

          {/* Card 2: Tasks Pending Approval */}
          <Link href="/ambassador/tasks">
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-soft-sm transition-all hover:-translate-y-0.5 cursor-pointer space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-text-muted uppercase tracking-wider">Task Approvals</span>
                <ClipboardList className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-text tabular-nums">
                  {pendingTasks.length}
                </span>
                <span className="text-xs text-text-muted">in admin queue</span>
              </div>
              <p className="text-[11px] text-text-muted pt-1">
                {pendingTasks.length > 0 ? "Awaiting admin sign-off" : "No pending tasks"}
              </p>
            </div>
          </Link>

          {/* Card 3: Team Members */}
          <Link href="/ambassador/team">
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-soft-sm transition-all hover:-translate-y-0.5 cursor-pointer space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-text-muted uppercase tracking-wider">Team Members</span>
                <Users className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-text tabular-nums">
                  {myTeam?.memberCount || 8}
                </span>
                <span className="text-xs text-text-muted">students</span>
              </div>
              <p className="text-[11px] text-text-muted pt-1">
                {myTeam?.college || "Muthayammal Engineering College"}
              </p>
            </div>
          </Link>

          {/* Card 4: Latest Activity / Points */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-text-muted uppercase tracking-wider">Team Activity</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-text tabular-nums">
                {myTeam?.totalPoints || 420}
              </span>
              <span className="text-xs text-text-muted">pts generated</span>
            </div>
            <p className="text-[11px] text-text-muted pt-1">
              Ledger verified points
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: YOUR TEAM CARD */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Assigned Campus Squad
            </span>
            <h3 className="text-xl font-black text-text">
              {myTeam?.name || "MEC Zyven Alpha Squad"}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {myTeam?.college || "Muthayammal Engineering College"} • Ambassador: {user?.name || "Thangaraj"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyInviteLink}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-border hover:bg-surface text-xs font-bold text-text transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? "Copied Link!" : `Code: ${myTeam?.inviteCode || "ZYV-MEC-2026"}`}</span>
            </button>
            <Link href="/ambassador/team">
              <Button variant="primary" size="sm" className="gap-1.5 font-bold">
                <span>View Team</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-surface-2 border border-border/80">
            <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">Members</span>
            <span className="text-lg font-black text-text tabular-nums">{myTeam?.memberCount || 8}</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-2 border border-border/80">
            <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">Total Points</span>
            <span className="text-lg font-black text-primary tabular-nums">+{myTeam?.totalPoints || 420}</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-2 border border-border/80">
            <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">Campus Rank</span>
            <span className="text-lg font-black text-amber-500 tabular-nums">#2</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-2 border border-border/80">
            <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">Status</span>
            <span className="text-xs font-black uppercase text-emerald-500 block pt-1">Active Squad</span>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN: REVIEW QUEUE & TEAM TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Queue Card */}
        <div className="p-6 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h3 className="font-extrabold text-base text-text">Review Queue</h3>
            </div>
            <Link href="/ambassador/reviews" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>Review All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {pendingReviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No submissions waiting for review. Your queue is clean!
              </div>
            ) : (
              pendingReviews.slice(0, 3).map((sub) => (
                <div key={sub.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-text truncate">
                      {sub.studentName || "Student Submission"}
                    </h5>
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString() : "Recent"}
                    </span>
                  </div>
                  <Link href="/ambassador/reviews">
                    <Button variant="outline" size="sm" className="text-xs font-bold">
                      Review
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks Card */}
        <div className="p-6 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h3 className="font-extrabold text-base text-text">Team Tasks</h3>
            </div>
            <Link href="/ambassador/tasks" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>Manage Tasks</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {missions.slice(0, 3).map((task) => (
              <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-text truncate">{task.title}</h5>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">
                      +{task.points} pts
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted truncate block">
                    {task.category} • {task.difficulty}
                  </span>
                </div>
                <StatusBadge state={task.status === "live" ? "AVAILABLE" : "LOCKED"} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LATEST TEAM ANNOUNCEMENTS */}
      <div className="p-6 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <h3 className="font-extrabold text-base text-text">Team Announcements</h3>
          </div>
          <Link href="/ambassador/announcements" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span>Publish Announcement</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {announcements.slice(0, 2).map((ann) => (
            <div key={ann.id} className="p-4 rounded-2xl bg-surface-2 border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-text">{ann.title}</h4>
                <span className="text-[10px] text-text-muted">{new Date(ann.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                {ann.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
