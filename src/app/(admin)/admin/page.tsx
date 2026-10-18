"use client";

import React from "react";
import Link from "next/link";
import { useAdminStats, useAdminSubmissions, useMissions } from "@/lib/data/hooks";
import { Stat } from "@/components/ui/Stat";
import { StatusBadge, type MissionState } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Clock,
  Zap,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats } = useAdminStats();
  const { data: submissions = [] } = useAdminSubmissions();
  const { data: missions = [] } = useMissions();

  const pendingQueue = submissions
    .filter((s) => s.state === "SUBMITTED" || s.state === "UNDER_REVIEW")
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Operational Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Admin Console
          </h1>
        </div>

        <Link href="/admin/reviews">
          <Button variant="primary" size="md" className="gap-2 font-bold">
            <span>Open Review Queue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* 4 Metrics with Count-up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Total Ambassadors"
          value={stats?.totalAmbassadors ?? 0}
          isNumber
          icon={<Users className="h-5 w-5" />}
          subtext="Active in Cohort 1"
        />
        <Stat
          label="Pending Reviews"
          value={stats?.pendingReviews ?? 0}
          isNumber
          icon={<Clock className="h-5 w-5 text-warning" />}
          subtext="Submissions waiting"
        />
        <Stat
          label="Points Awarded"
          value={stats?.pointsAwarded ?? 0}
          isNumber
          icon={<Zap className="h-5 w-5 text-primary" />}
          subtext="Transparent ledger sum"
        />
        <Stat
          label="Approval Rate"
          value={`${stats?.approvalRate ?? 94}%`}
          icon={<CheckCircle className="h-5 w-5 text-success" />}
          subtext="Quality standard"
        />
      </div>

      {/* Pending Queue Preview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-[24px] bg-surface p-6 border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span>Pending Verification Queue</span>
            </h3>
            <Link
              href="/admin/reviews"
              className="text-xs font-bold text-primary hover:underline"
            >
              View Full Queue ({submissions.filter((s) => s.state === "SUBMITTED" || s.state === "UNDER_REVIEW").length})
            </Link>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="py-12 text-center text-text-muted text-xs">
              🎉 Review queue is empty! All submissions have been processed.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {pendingQueue.map((sub) => {
                const mission = missions.find((m) => m.id === sub.missionId);
                return (
                  <div
                    key={sub.id}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text truncate">
                        {mission?.title || "Task"}
                      </p>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">
                        {sub.proofUrl ? `URL: ${sub.proofUrl}` : "Screenshot attached"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge state={sub.state as MissionState} size="sm" />
                      <Link href={`/admin/reviews/${sub.id}`}>
                        <Button variant="secondary" size="sm">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links / Operations */}
        <div className="lg:col-span-4 rounded-[24px] bg-surface p-6 border border-border shadow-soft-sm space-y-4">
          <h3 className="text-base font-bold text-text flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Management Tools</span>
          </h3>

          <div className="space-y-2">
            <Link
              href="/admin/ambassadors"
              className="p-3 rounded-xl bg-surface-2 hover:bg-surface border border-border flex items-center justify-between text-xs font-bold text-text transition-colors"
            >
              <span>Manage Ambassadors</span>
              <ArrowRight className="h-4 w-4 text-text-muted" />
            </Link>
            <Link
              href="/admin/missions"
              className="p-3 rounded-xl bg-surface-2 hover:bg-surface border border-border flex items-center justify-between text-xs font-bold text-text transition-colors"
            >
              <span>Manage Campus Missions</span>
              <ArrowRight className="h-4 w-4 text-text-muted" />
            </Link>
            <Link
              href="/dashboard"
              className="p-3 rounded-xl bg-surface-2 hover:bg-surface border border-border flex items-center justify-between text-xs font-bold text-text transition-colors"
            >
              <span>Switch to Ambassador View</span>
              <ExternalLink className="h-4 w-4 text-text-muted" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
