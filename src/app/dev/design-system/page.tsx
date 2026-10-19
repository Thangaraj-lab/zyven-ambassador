"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ZyvenMark } from "@/components/brand/ZyvenMark";
import { Zyven3DMark } from "@/components/brand/Zyven3DMark";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Sheet, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/Sheet";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
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
import { Trophy, Users, Zap, ArrowLeft, Mail, Search, Sparkles } from "lucide-react";

export default function DesignSystemPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [demoProgress, setDemoProgress] = useState(65);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [checked, setChecked] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");

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
    <div className="min-h-screen bg-bg text-text py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-14">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-border gap-4">
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
            Visual QA testbed for all tokens, variants, light & dark mode states, and 3D visual mark.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* 01. Brand & Selective 3D Layer */}
      <section className="space-y-6">
        <SectionHeading
          align="left"
          eyebrow="01 Brand Identity & Selective 3D"
          title="Brand Marks & Spatial Depth"
          description="Flat 2D marks alongside the selective Three.js crystal mark with auto-pause and reduced-motion fallback."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <ZyvenMark size={56} />
            <h4 className="font-bold text-sm text-text">2D Zyvex Mark</h4>
            <p className="text-xs text-text-muted">High-contrast SVG vector with brand violet gradient.</p>
          </Card>

          <Card hoverable className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <Logo size="lg" />
            <h4 className="font-bold text-sm text-text">Primary Wordmark</h4>
            <p className="text-xs text-text-muted">Plus Jakarta Sans geometric logotype with badge.</p>
          </Card>

          <Card hoverable className="flex flex-col items-center justify-center p-6 text-center space-y-2 relative overflow-hidden">
            <Zyven3DMark size={140} />
            <h4 className="font-bold text-sm text-text flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Selective 3D Mark</span>
            </h4>
            <p className="text-[11px] text-text-muted">Three.js interactive depth canvas. Pauses offscreen.</p>
          </Card>
        </div>
      </section>

      {/* 02. Primitives: Cards & Modals */}
      <section className="space-y-6">
        <SectionHeading
          align="left"
          eyebrow="02 Surfaces & Overlays"
          title="Cards, Dialogs & Sheets"
          description="Consistent 20px radius cards, soft backdrop modal dialogs, and smooth slide sheets."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card hoverable>
            <CardHeader>
              <CardTitle>Standard Surface Card (20px radius)</CardTitle>
              <CardDescription>Hover micro-interaction lifts -3px with deepened shadow.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-text-muted leading-relaxed">
                Cards form the primary containment structure across the ambassador and student portals.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
                Open Dialog
              </Button>
              <Button size="sm" variant="primary" onClick={() => setSheetOpen(true)}>
                Open Sheet
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-surface-2 border-border/80">
            <CardHeader>
              <CardTitle>Skeleton Loaders</CardTitle>
              <CardDescription>Content-shaped placeholders for zero layout shifts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="h-3 w-1/2" />
                  <Skeleton variant="text" className="h-2.5 w-3/4" />
                </div>
              </div>
              <Skeleton variant="rectangle" className="h-14 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Dialog Instance */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogHeader>
            <DialogTitle>Level 4 Cinematic Dialog</DialogTitle>
            <DialogDescription>
              Accessible dialog with focus trap, backdrop blur, and smooth entrance.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-xs text-text-muted leading-relaxed">
              Used for mission confirmation, evidence zoom, tier unlock announcements, and account actions.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setDialogOpen(false)}>
              Confirm Action
            </Button>
          </DialogFooter>
        </Dialog>

        {/* Sheet Instance */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} position="right">
          <SheetHeader>
            <SheetTitle>Inspection Sheet</SheetTitle>
            <SheetDescription>Slide-over drawer for deep proof inspect or filters.</SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <Input label="Search Ambassador" leftIcon={<Search className="h-4 w-4" />} placeholder="Filter by name..." />
            <Select
              label="Verification Status"
              options={[
                { value: "all", label: "All Submissions" },
                { value: "pending", label: "Under Review" },
                { value: "approved", label: "Approved" },
              ]}
            />
          </div>
        </Sheet>
      </section>

      {/* 03. Form Controls & Inputs */}
      <section className="space-y-6">
        <SectionHeading
          align="left"
          eyebrow="03 Interactive Inputs"
          title="Buttons, Inputs & Controls"
          description="12px radius interactive primitives with Level 1 micro-interactions."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <h4 className="text-sm font-bold text-text">Button Hierarchy</h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" isLoading>Loading</Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h4 className="text-sm font-bold text-text">Form Elements</h4>
            <Input
              label="Email Address"
              type="email"
              placeholder="thangaraj@mec.edu"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              hint="College email preferred"
            />
            <Textarea
              label="Motivation"
              rows={2}
              placeholder="Why do you want to join..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              charCount={textareaValue.length}
              maxChars={100}
            />
            <Checkbox
              checked={checked}
              onCheckedChange={setChecked}
              label="I agree to the Zyvex Ambassador Code"
              description="Micro-interaction animated checkmark"
            />
          </Card>
        </div>
      </section>

      {/* 04. Tabs & Navigation */}
      <section className="space-y-6">
        <SectionHeading
          align="left"
          eyebrow="04 Navigation & Indicators"
          title="Motion Tabs & Status Badges"
        />
        <div className="space-y-4">
          <Tabs
            tabs={[
              { id: "all", label: "All Tasks", count: 6 },
              { id: "active", label: "Live Missions", count: 2 },
              { id: "completed", label: "Completed", count: 1 },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />

          <Tabs
            tabs={[
              { id: "all", label: "Individual Leaderboard" },
              { id: "active", label: "College Battle" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="line"
            layoutId="demo-line-tabs"
          />
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <StatusBadge state="AVAILABLE" />
          <StatusBadge state="STARTED" />
          <StatusBadge state="SUBMITTED" />
          <StatusBadge state="UNDER_REVIEW" />
          <StatusBadge state="APPROVED" />
          <StatusBadge state="REJECTED" />
          <StatusBadge state="LOCKED" />
        </div>

        {/* UI Accessories */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/60">
          <PointsPill points={50} size="md" />
          <PointsPill points={30} size="sm" />
          <Avatar name="Kavitha Rajan" size="md" />
          <Avatar name="Siddharth Verma" size="sm" />
          <CopyButton textToCopy="https://zyven.org/join" label="Copy Link" />
          <NotificationBell
            notifications={[
              {
                id: "n1",
                userId: "u1",
                title: "Mission Approved",
                body: "You earned 50 points!",
                type: "submission_approved",
                createdAt: "2026-10-18T10:00:00Z",
                readAt: null,
              },
            ]}
            unreadCount={1}
          />
        </div>
      </section>

      {/* 05. Points & Tiers */}
      <section className="space-y-6">
        <SectionHeading
          align="left"
          eyebrow="05 Gamification Engine"
          title="Points, Tiers & Animated Numbers"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Total Points" value={80} icon={<Zap className="h-4 w-4" />} />
          <Stat label="Current Rank" value="#12" icon={<Trophy className="h-4 w-4" />} />
          <Stat label="Active Cohort" value={100} icon={<Users className="h-4 w-4" />} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
            <TierBadge tier="bronze" size="lg" />
            <span className="text-xs font-semibold text-text-muted">Bronze (50 pts)</span>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
            <TierBadge tier="silver" size="lg" />
            <span className="text-xs font-semibold text-text-muted">Silver (150 pts)</span>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
            <TierBadge tier="gold" size="lg" />
            <span className="text-xs font-semibold text-text-muted">Gold (300 pts)</span>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
            <TierBadge tier="champion" size="lg" />
            <span className="text-xs font-semibold text-text-muted">Champion (500 pts)</span>
          </Card>
        </div>

        <div className="p-6 rounded-[20px] bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-text">Progress Bar & Live Counter</h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setDemoProgress(30)}>30%</Button>
              <Button size="sm" variant="outline" onClick={() => setDemoProgress(65)}>65%</Button>
              <Button size="sm" variant="outline" onClick={() => setDemoProgress(100)}>100%</Button>
            </div>
          </div>
          <ProgressBar value={demoProgress} />
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Live Count:</span>
            <AnimatedNumber value={demoProgress * 5} className="font-extrabold text-primary text-xl" />
            <span>pts</span>
          </div>
        </div>
      </section>

      {/* 06. Podium & Leaderboard */}
      <section className="space-y-6">
        <SectionHeading
          align="left"
          eyebrow="06 Social Proof & Ranks"
          title="Podium & Row States"
        />
        <PodiumCard topThree={[top3[0], top3[1], top3[2]]} />

        <div className="space-y-2.5">
          <LeaderboardRow user={{ id: "1", rank: 1, name: "Kavitha Rajan", college: "MEC", points: 420, isYou: false }} />
          <LeaderboardRow user={{ id: "12", rank: 12, name: "Thangaraj (You)", college: "MEC", points: 80, isYou: true }} />
        </div>
      </section>

      {/* 07. Missions & Workflow */}
      <section className="space-y-6">
        <SectionHeading
          align="left"
          eyebrow="07 Mission Workflow"
          title="Mission Cards & Steppers"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SEED_MISSIONS.slice(0, 2).map((m) => (
            <MissionCard key={m.id} mission={m} state="AVAILABLE" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <h4 className="text-sm font-bold text-text">Sequential Stepper</h4>
            <Stepper
              currentStep={activeStep}
              onStepClick={setActiveStep}
              steps={[
                {
                  id: "s1",
                  title: "Follow & Copy",
                  description: "Follow Zyvex and copy post copy",
                  content: (
                    <div className="space-y-3">
                      <p className="text-xs text-text-muted">
                        Follow the official Zyvex page on LinkedIn.
                      </p>
                      <Button size="sm" variant="primary" onClick={() => setActiveStep(2)}>
                        Next: Create Post
                      </Button>
                    </div>
                  ),
                },
                {
                  id: "s2",
                  title: "Create LinkedIn Post",
                  description: "Share announcement",
                  content: (
                    <div className="space-y-3">
                      <p className="text-xs text-text-muted">
                        Publish your post on LinkedIn.
                      </p>
                      <Button size="sm" variant="primary" onClick={() => setActiveStep(3)}>
                        Next: Submit Proof
                      </Button>
                    </div>
                  ),
                },
                {
                  id: "s3",
                  title: "Submit URL",
                  description: "Paste live link",
                  content: (
                    <div className="space-y-3">
                      <p className="text-xs text-text-muted">Paste your post URL.</p>
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          <Card className="space-y-4">
            <h4 className="text-sm font-bold text-text">Dropzone & Timeline</h4>
            <FileDropzone onImageSelected={() => {}} />
            <Timeline
              events={[
                { id: "e1", title: "Mission Started", timestamp: "Oct 18, 10:00 AM", status: "completed" },
                { id: "e2", title: "Proof Submitted", timestamp: "Oct 18, 10:05 AM", description: "Post URL submitted for review", status: "completed" },
                { id: "e3", title: "Admin Review", description: "Under verification queue", status: "current" },
              ]}
            />
          </Card>
        </div>
      </section>

      {/* 08. Empty State */}
      <section className="space-y-4">
        <SectionHeading
          align="left"
          eyebrow="08 Empty State Experience"
          title="Actionable First-run Card"
        />
        <EmptyState
          title="No Submissions Yet"
          description="You haven't completed any missions so far. Pick an active task from the list and start earning points today!"
          actionLabel="Explore Live Missions"
          onAction={() => {}}
        />
      </section>
    </div>
  );
}
