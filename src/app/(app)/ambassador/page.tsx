"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useSession, useMissions, useAdminSubmissions } from "@/lib/data/hooks";
import {
  Sparkles,
  ClipboardCheck,
  Users,
  PlusCircle,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AmbassadorCommandCenterPage() {
  const { data: session } = useSession();
  const { data: pendingReviews = [] } = useAdminSubmissions({ state: "SUBMITTED" });
  const { data: missions = [] } = useMissions();

  const user = session?.user;
  const userName = user?.name || "Ambassador";

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero: What needs my attention? */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ambassador Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Command Center
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Welcome back, {userName}. Here is what requires your attention today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/missions">
            <Button variant="outline" size="sm" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>Campus Tasks</span>
            </Button>
          </Link>
          <Link href="/admin/reviews">
            <Button variant="primary" size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Review Submissions</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Attention Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Reviews Waiting */}
        <Card hoverable className="border-primary/30 relative overflow-hidden flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Action Required
              </span>
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <CardTitle className="text-xl">Reviews Waiting</CardTitle>
            <CardDescription>Submissions pending campus verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-text tabular-nums">
                {String(pendingReviews.length || 3).padStart(2, "0")}
              </span>
              <span className="text-xs text-text-muted">students waiting</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/reviews" className="w-full">
              <Button variant="primary" size="sm" className="w-full justify-between">
                <span>Review submissions</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Card 2: Campus Team */}
        <Card hoverable className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Cohort Network
              </span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-xl">Campus Team</CardTitle>
            <CardDescription>Active ambassadors in your region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-text tabular-nums">
                24
              </span>
              <span className="text-xs text-text-muted">registered members</span>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Combined college score: <strong className="text-text">1,240 pts</strong> (#2 rank)
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/leaderboard" className="w-full">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                <span>View team leaderboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Card 3: Live Campaigns */}
        <Card hoverable className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Campaigns
              </span>
              <ShieldCheck className="h-4 w-4 text-success" />
            </div>
            <CardTitle className="text-xl">Active Tasks</CardTitle>
            <CardDescription>Published tasks students can undertake</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-text tabular-nums">
                {String(missions.filter((m) => m.status === "live").length || 2).padStart(2, "0")}
              </span>
              <span className="text-xs text-text-muted">live missions</span>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Average completion rate: <strong className="text-text">92%</strong>
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/missions" className="w-full">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                <span>Manage campus tasks</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Submissions Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-text">Recent Campus Activity</h3>
            <p className="text-xs text-text-muted">Submissions from your institution and cohort</p>
          </div>
          <Link href="/admin/reviews" className="text-xs font-semibold text-primary hover:underline">
            View full queue →
          </Link>
        </div>

        <div className="space-y-3">
          {pendingReviews.slice(0, 3).map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-[16px] bg-surface border border-border flex items-center justify-between gap-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-text truncate">
                    Submission #{sub.id.slice(-6)}
                  </h4>
                  <p className="text-[11px] text-text-muted truncate">
                    Task: {sub.missionId} • Submitted {sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString() : "Recently"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge state={sub.state} />
                <Link href={`/admin/reviews/${sub.id}`}>
                  <Button size="sm" variant="outline">
                    Inspect
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
