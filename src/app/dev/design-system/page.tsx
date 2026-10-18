"use client";

import React, { useState } from "react";
import { ZyvenMark } from "@/components/brand/ZyvenMark";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PointsPill } from "@/components/ui/PointsPill";
import { TierBadge } from "@/components/ui/TierBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Stat } from "@/components/ui/Stat";
import { MissionCard } from "@/components/ui/MissionCard";
import { LeaderboardRow } from "@/components/ui/LeaderboardRow";
import { PodiumCard } from "@/components/ui/PodiumCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CopyButton } from "@/components/ui/CopyButton";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Stepper } from "@/components/ui/Stepper";
import { Timeline } from "@/components/ui/Timeline";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SEED_MISSIONS } from "@/lib/data/mock/seed";
import { Trophy, Users, Zap, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DesignSystemPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [demoProgress, setDemoProgress] = useState(65);

  const top3 = [
    {
      id: "demo-1",
      rank: 1,
      name: "Kavitha Rajan",
      college: "MEC",
      points: 420,
      avatarUrl: null,
    },
    {
      id: "demo-2",
      rank: 2,
      name: "Siddharth Verma",
      college: "PSG",
      points: 390,
      avatarUrl: null,
    },
    {
      id: "demo-3",
      rank: 3,
      name: "Deepika Sundaram",
      college: "Kongu",
      points: 340,
      avatarUrl: null,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-bg text-text py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-border gap-4 mb-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Portal
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Design System & Component Showcase
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Visual QA testbed for all tokens, variants, light & dark mode states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell unreadCount={2} />
          <LocaleToggle />
          <ThemeToggle />
          <Avatar name="Thangaraj MEC" size="sm" />
        </div>
      </div>

      <div className="space-y-16">
        {/* 1. Brand & Marks */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Brand Identity"
            title="Zyven Ribbon Mark & Logo"
            description="2D flat geometric ribbon mark with dual-gradient styling."
          />
          <div className="p-6 rounded-2xl bg-surface border border-border flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4">
              <ZyvenMark size={24} />
              <ZyvenMark size={36} />
              <ZyvenMark size={52} />
              <ZyvenMark size={72} />
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-6">
              <Logo size="sm" href="" />
              <Logo size="md" href="" showTagline />
              <Logo size="lg" href="" />
            </div>
          </div>
        </section>

        {/* 2. Buttons */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Actions"
            title="Buttons & States"
            description="Primary gradient with hover sheen, secondary, outline, ghost, danger, and animated loading states."
          />
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg">
                Primary Large
              </Button>
              <Button variant="primary" size="md">
                Primary Gradient
              </Button>
              <Button variant="primary" size="sm">
                Primary Small
              </Button>
              <Button variant="primary" size="md" isLoading>
                Loading State
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary" size="md">
                Secondary
              </Button>
              <Button variant="outline" size="md">
                Outline
              </Button>
              <Button variant="ghost" size="md">
                Ghost
              </Button>
              <Button variant="danger" size="md">
                Danger Action
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </section>

        {/* 3. Status Badges (All 7 States) */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Mission States"
            title="Status Badges (7 Designed States)"
            description="Every state has a distinct color, border, and flat 2D icon."
          />
          <div className="p-6 rounded-2xl bg-surface border border-border flex flex-wrap items-center gap-3">
            <StatusBadge state="AVAILABLE" />
            <StatusBadge state="STARTED" />
            <StatusBadge state="SUBMITTED" />
            <StatusBadge state="UNDER_REVIEW" />
            <StatusBadge state="APPROVED" />
            <StatusBadge state="REJECTED" />
            <StatusBadge state="LOCKED" />
          </div>
        </section>

        {/* 4. Points & Tiers */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Rewards"
            title="Points Pills & Tier Badges"
            description="Badges for Bronze, Silver, Gold, Champion and point counters."
          />
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <PointsPill points={50} size="sm" />
              <PointsPill points={100} size="md" />
              <PointsPill points={500} size="lg" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <TierBadge tier="bronze" size="sm" />
              <TierBadge tier="silver" size="md" />
              <TierBadge tier="gold" size="md" />
              <TierBadge tier="champion" size="lg" />
            </div>
          </div>
        </section>

        {/* 5. Progress Bars & Animated Numbers */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Feedback"
            title="Animated Progress & Numbers"
            description="Spring-interpolated progress bar with glowing leading edge."
          />
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Milestone Progress</span>
                <span className="text-primary font-bold">
                  <AnimatedNumber value={demoProgress} suffix="%" />
                </span>
              </div>
              <ProgressBar value={demoProgress} height={10} />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDemoProgress(30)}
              >
                Set 30%
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDemoProgress(75)}
              >
                Set 75%
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDemoProgress(100)}
              >
                Set 100%
              </Button>
            </div>
          </div>
        </section>

        {/* 6. Stats Cards */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Analytics"
            title="Stat Cards"
            description="Displaying key metrics on ambassador dashboard and admin console."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat
              label="Total Points"
              value={80}
              isNumber
              icon={<Zap className="h-5 w-5" />}
              subtext="Bronze tier unlocked"
            />
            <Stat
              label="Campus Rank"
              value="#24"
              icon={<Trophy className="h-5 w-5" />}
              subtext="Top 15% of cohort"
            />
            <Stat
              label="Tasks Completed"
              value="2 / 2"
              icon={<CheckCircle className="h-5 w-5" />}
              subtext="100% completion rate"
            />
            <Stat
              label="Founding Cohort"
              value={37}
              isNumber
              icon={<Users className="h-5 w-5" />}
              subtext="Out of 100 ambassadors"
            />
          </div>
        </section>

        {/* 7. Mission Cards */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Missions"
            title="Mission Cards"
            description="Live cards with time estimates, points, and state-aware CTAs."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MissionCard
              mission={SEED_MISSIONS[0]}
              state="AVAILABLE"
            />
            <MissionCard
              mission={SEED_MISSIONS[1]}
              state="STARTED"
            />
            <MissionCard
              mission={SEED_MISSIONS[2]}
              state="LOCKED"
            />
            <MissionCard
              mission={SEED_MISSIONS[3]}
              state="LOCKED"
            />
          </div>
        </section>

        {/* 8. Leaderboard & Podium */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Competition"
            title="Podium & Leaderboard Rows"
            description="Top 3 podium elevation and ranked list with sticky 'You' highlight."
          />
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-8">
            <PodiumCard topThree={[top3[0], top3[1], top3[2]]} />

            <div className="space-y-2 max-w-xl mx-auto">
              <LeaderboardRow
                user={{
                  id: "1",
                  rank: 1,
                  name: "Kavitha Rajan",
                  college: "MEC",
                  points: 420,
                }}
              />
              <LeaderboardRow
                user={{
                  id: "2",
                  rank: 2,
                  name: "Siddharth Verma",
                  college: "PSG",
                  points: 390,
                }}
              />
              <LeaderboardRow
                user={{
                  id: "24",
                  rank: 24,
                  name: "Thangaraj (You)",
                  college: "Muthayammal Engineering College",
                  points: 80,
                  isYou: true,
                }}
              />
            </div>
          </div>
        </section>

        {/* 9. Interactive Utilities: Stepper, Dropzone, CopyButton */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Interactive Flow"
            title="Guided Stepper & Verification Tools"
            description="Step unlocking, clipboard copier, and screenshot dropzone with compression."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
              <h4 className="text-sm font-bold text-text">Mission Guided Stepper</h4>
              <Stepper
                currentStep={activeStep}
                onStepClick={setActiveStep}
                steps={[
                  {
                    id: "s1",
                    title: "Follow Zyven on LinkedIn",
                    description: "Open profile and follow",
                    content: (
                      <div className="space-y-3">
                        <p className="text-xs text-text-muted">
                          Visit LinkedIn and follow our page.
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setActiveStep(1)}
                        >
                          Confirm Followed
                        </Button>
                      </div>
                    ),
                  },
                  {
                    id: "s2",
                    title: "Copy Post Template",
                    description: "Share announcement on feed",
                    content: (
                      <div className="space-y-3">
                        <CopyButton
                          textToCopy="🚀 Excited to join Zyven Ambassador program! #Zyven"
                          label="Copy Post Template"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveStep(2)}
                        >
                          Next: Submit Proof
                        </Button>
                      </div>
                    ),
                  },
                  {
                    id: "s3",
                    title: "Submit Verification URL",
                    description: "Paste live link",
                    content: (
                      <div className="space-y-3">
                        <p className="text-xs text-text-muted">
                          Paste your post URL to finish verification.
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
              <h4 className="text-sm font-bold text-text">Screenshot Dropzone</h4>
              <FileDropzone onImageSelected={() => {}} />

              <h4 className="text-sm font-bold text-text pt-4">Timeline Component</h4>
              <Timeline
                events={[
                  {
                    id: "e1",
                    title: "Mission Started",
                    timestamp: "Oct 18, 10:00 AM",
                    status: "completed",
                  },
                  {
                    id: "e2",
                    title: "Proof Submitted",
                    timestamp: "Oct 18, 10:05 AM",
                    description: "Post URL submitted for review",
                    status: "completed",
                  },
                  {
                    id: "e3",
                    title: "Admin Review",
                    description: "Under verification queue",
                    status: "current",
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* 10. Empty State */}
        <section className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Empty States"
            title="First-run & Empty State Cards"
          />
          <EmptyState
            title="No Submissions Yet"
            description="You haven't completed any missions so far. Pick an active task from the list and start earning points today!"
            actionLabel="Explore Live Missions"
            onAction={() => {}}
          />
        </section>
      </div>
    </div>
  );
}
