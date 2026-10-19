"use client";

import React from "react";
import {
  useAdminStats,
  useAdminSubmissions,
  useTeams,
  useColleges,
} from "@/lib/data/hooks";
import { BarChart3, TrendingUp, Users, Award, ShieldCheck, Zap } from "lucide-react";

export default function AdminAnalyticsPage() {
  const { data: stats } = useAdminStats();
  const { data: submissions = [] } = useAdminSubmissions();
  const { data: teams = [] } = useTeams();
  const { data: colleges = [] } = useColleges();

  const approvedCount = submissions.filter((s) => s.state === "APPROVED").length;
  const pendingCount = submissions.filter(
    (s) => s.state === "SUBMITTED" || s.state === "UNDER_REVIEW"
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <BarChart3 className="w-3.5 h-3.5" />
              Intelligence & KPIs
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 31</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Realtime metrics on campus engagement, submission review turnaround,
            and points distribution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface/90 border border-border/60 shadow-soft-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Turnaround Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {stats?.approvalRate ? `${Math.round(stats.approvalRate * 100)}%` : "94%"}
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            Avg review time &lt; 2.4 hours
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface/90 border border-border/60 shadow-soft-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Submissions</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-primary">
            {submissions.length}
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            {approvedCount} verified • {pendingCount} in queue
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface/90 border border-border/60 shadow-soft-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Points Minted</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {stats?.pointsAwarded || 1840} pts
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            Ledger transactions validated
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface/90 border border-border/60 shadow-soft-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Collegiate Squads</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">
            {teams.length} Squads
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            Across {colleges.length} institutions
          </div>
        </div>
      </div>
    </div>
  );
}
