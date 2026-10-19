"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  useSession,
  useMissions,
  useAdminSubmissions,
  useAnnouncements,
} from "@/lib/data/hooks";
import {
  Sparkles,
  ClipboardList,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Clock,
  Megaphone,
  Check,
  Zap,
  TrendingUp,
  FileCheck,
  Hourglass,
  Layers,
} from "lucide-react";

export default function AmbassadorCommandCenterPage() {
  const { data: session } = useSession();
  const { data: submissions = [] } = useAdminSubmissions();
  const { data: missions = [] } = useMissions();
  const { data: announcements = [] } = useAnnouncements();

  const user = session?.user;
  const userName = user?.name ? user.name.split(" ")[0] : "Ambassador";

  // Real Database Metrics (Solo Ambassador)
  const myTasks = missions.filter(
    (m) => m.createdById === user?.id || !m.createdById
  );
  const liveTasks = missions.filter((m) => m.status === "live");
  const pendingTasks = missions.filter((m) => m.status === "pending_approval");
  const awaitingReview = submissions.filter(
    (s) => s.state === "SUBMITTED" || s.state === "UNDER_REVIEW"
  );
  const approvedSubmissions = submissions.filter((s) => s.state === "APPROVED");

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* AMBASSADOR COMMAND CENTER HERO */}
      <div className="relative rounded-[32px] bg-surface border border-border p-6 sm:p-10 shadow-soft-lg overflow-hidden">
        {/* Subtle luminous background wash */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ambassador Campaign Studio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-text tracking-tight leading-tight">
              Welcome, {userName}.
            </h1>

            <p className="text-base sm:text-lg font-bold text-primary italic">
              &ldquo;Design tasks. Target audiences. Review verified student proof.&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-xl">
              As a Zyven Ambassador, you create impactful campus initiatives, publish tasks for public or college audiences, and verify student participation.
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
                  <span>Review Submissions ({awaitingReview.length})</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Hero: Ambassador Key Performance Highlights */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-surface-2/90 border border-border p-6 shadow-soft-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-black uppercase tracking-wider text-text-muted">
                  Ambassador Profile
                </span>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  Active
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Active Launch Tasks</span>
                  <span className="font-bold text-text tabular-nums">{liveTasks.length} Live</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Pending Admin Review</span>
                  <span className="font-bold text-warning tabular-nums">{pendingTasks.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Submissions Approved</span>
                  <span className="font-bold text-primary tabular-nums">{approvedSubmissions.length}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
                <span>Task points ceiling</span>
                <span className="font-black text-primary">25 pts max</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION CENTER / METRICS (SECTION 36 OVERVIEW) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-text-muted">
            Overview Metrics
          </h2>
          <span className="text-xs text-text-muted">Live Platform Sync</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Tasks Created */}
          <Link href="/ambassador/tasks" className="col-span-1">
            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-soft-sm transition-all hover:-translate-y-0.5 cursor-pointer space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-text-muted uppercase text-[10px] tracking-wider">Tasks Created</span>
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-text tabular-nums">
                  {myTasks.length}
                </span>
              </div>
              <p className="text-[10px] text-text-muted">Total campaigns</p>
            </div>
          </Link>

          {/* Card 2: Pending Approval */}
          <Link href="/ambassador/tasks" className="col-span-1">
            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-soft-sm transition-all hover:-translate-y-0.5 cursor-pointer space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-text-muted uppercase text-[10px] tracking-wider">Pending Approval</span>
                <Hourglass className="h-4 w-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-warning tabular-nums">
                  {pendingTasks.length}
                </span>
              </div>
              <p className="text-[10px] text-text-muted">Awaiting Admin sign-off</p>
            </div>
          </Link>

          {/* Card 3: Live Tasks */}
          <Link href="/ambassador/tasks" className="col-span-1">
            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-soft-sm transition-all hover:-translate-y-0.5 cursor-pointer space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-text-muted uppercase text-[10px] tracking-wider">Live Tasks</span>
                <Zap className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-text tabular-nums">
                  {liveTasks.length}
                </span>
              </div>
              <p className="text-[10px] text-text-muted">Accessible to students</p>
            </div>
          </Link>

          {/* Card 4: Submissions Awaiting Review */}
          <Link href="/ambassador/reviews" className="col-span-1">
            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-soft-sm transition-all hover:-translate-y-0.5 cursor-pointer space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-primary uppercase text-[10px] tracking-wider">Awaiting Review</span>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-primary tabular-nums">
                  {awaitingReview.length}
                </span>
              </div>
              <p className="text-[10px] text-text-muted">Pending student proofs</p>
            </div>
          </Link>

          {/* Card 5: Approved Submissions */}
          <Link href="/ambassador/reviews" className="col-span-2 sm:col-span-1">
            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-soft-sm transition-all hover:-translate-y-0.5 cursor-pointer space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-text-muted uppercase text-[10px] tracking-wider">Approved</span>
                <FileCheck className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-emerald-500 tabular-nums">
                  {approvedSubmissions.length}
                </span>
              </div>
              <p className="text-[10px] text-text-muted">Verified & points awarded</p>
            </div>
          </Link>
        </div>
      </div>

      {/* TWO-COLUMN: SUBMISSION REVIEW QUEUE & LIVE TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Queue Card */}
        <div className="p-6 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h3 className="font-extrabold text-base text-text">Submissions Queue</h3>
            </div>
            <Link href="/ambassador/reviews" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {awaitingReview.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No submissions waiting for review. Queue is clear!
              </div>
            ) : (
              awaitingReview.slice(0, 3).map((sub) => (
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

        {/* Live Tasks Card */}
        <div className="p-6 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h3 className="font-extrabold text-base text-text">Active Launch Tasks</h3>
            </div>
            <Link href="/ambassador/tasks" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>Manage Tasks</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {liveTasks.slice(0, 3).map((task) => (
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
                <StatusBadge state="AVAILABLE" size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="p-6 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <h3 className="font-extrabold text-base text-text">Announcements</h3>
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
