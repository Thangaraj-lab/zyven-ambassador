"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  Star,
  Users,
  GraduationCap,
  Coins,
  Megaphone,
  UserPlus,
  ClipboardList,
  Rocket,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  ChartColumn,
  ChevronDown,
  Building,
} from "lucide-react";
import { MissionCard } from "@/components/ui/MissionCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import {
  SEED_MISSIONS,
  SEED_COLLEGES,
} from "@/lib/data/mock/seed";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the Zyven Student Ambassador Program?",
      a: "An elite campus leadership initiative empowering college students to represent Zyven, host developer events, build campus communities, and earn verified rewards.",
    },
    {
      q: "Who is eligible to apply?",
      a: "Any undergraduate or postgraduate college student enrolled in an accredited institution can register for free.",
    },
    {
      q: "How are points earned and verified?",
      a: "Complete active missions, submit your proof (link or screenshot), and receive verified points on your ledger within 24 hours.",
    },
    {
      q: "What perks do unlocked tiers offer?",
      a: "Earn exclusive merchandise boxes, digital certificates, founder AMA access, and priority internship referrals as you level up your tier.",
    },
    {
      q: "Can multiple ambassadors join from the same college?",
      a: "Yes! Ambassadors from the same campus collaborate to climb the collegiate standings and unlock campus-wide rewards.",
    },
    {
      q: "Is there any cost to join?",
      a: "Participation in the Zyven Student Ambassador Program is 100% free.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text">
      {/* Background glow ambient wash */}
      <div className="pointer-events-none absolute inset-0 bg-glow -z-10" />

      {/* Header Navigation */}
      <header className="relative z-20 mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9">
            <Image
              src="/assets/z3d-crystal.png"
              alt="Zyven 3D Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain drop-shadow transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-text">Zyven</span>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-text-muted lg:flex items-center">
          <Link href="/" className="text-text font-semibold hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#about" className="hover:text-text transition-colors">
            About
          </Link>
          <Link href="#journey" className="hover:text-text transition-colors">
            How It Works
          </Link>
          <Link href="#benefits" className="hover:text-text transition-colors">
            Benefits
          </Link>
          <Link href="/leaderboard" className="hover:text-text transition-colors">
            Leaderboard
          </Link>
          <Link href="#faq" className="hover:text-text transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <LocaleToggle />
          <Link
            href="/login"
            className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-semibold text-text hover:bg-surface-2 transition-all cursor-pointer"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-glow hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-8 px-6 pt-6 lg:grid-cols-2">
        <div className="rise space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-semibold text-accent-fg border border-accent-fg/10 shadow-soft-sm">
            <Star className="h-3 w-3 fill-current text-primary" />
            <span>Student Ambassador Program</span>
          </span>

          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl text-text">
            Become a <br />
            <span className="text-brand">Zyven</span> Student <br />
            Ambassador
          </h1>

          <p className="max-w-md text-base sm:text-lg text-text-muted leading-relaxed">
            Represent Zyven in your campus, take on exciting missions, earn points, unlock rewards, and be part of a growing ambassador community.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:scale-95 cursor-pointer"
            >
              <span>Register as Ambassador</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="#journey"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 font-semibold text-text hover:bg-surface-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current text-primary" />
              <span>Watch Video</span>
            </Link>
          </div>
        </div>

        {/* Right Hero Visual with Attached Real Photo & Floating Pills */}
        <div className="relative flex justify-center items-center py-4">
          <div className="relative w-full max-w-[460px]">
            {/* Ambient Purple Glow Behind Portrait */}
            <div className="glow-pulse pointer-events-none absolute -inset-4 sm:-inset-8 rounded-full bg-gradient-to-tr from-primary/30 via-purple-500/20 to-transparent blur-3xl -z-10" />

            <div className="relative overflow-hidden rounded-[2.5rem] p-2 bg-gradient-to-tr from-primary/15 via-accent/40 to-transparent border border-border/80 shadow-2xl backdrop-blur-sm group">
              <Image
                src="/assets/hero-ambassador.jpg"
                alt="Zyven student ambassador smiling"
                width={1024}
                height={1152}
                className="mx-auto max-h-[580px] w-full rounded-[2rem] object-cover [mask-image:radial-gradient(85%_85%_at_50%_45%,black_70%,transparent)] transition-transform duration-700 group-hover:scale-[1.03]"
                priority
              />

              {/* Floating Badge 1: Complete Tasks */}
              <div className="float-badge-1 absolute right-3 sm:right-6 top-8 flex items-center gap-2.5 rounded-full border border-border/90 bg-surface/90 px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-soft-md backdrop-blur-md z-20 text-text transition-transform hover:scale-105 cursor-default">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary stroke-[2.5]" />
                </div>
                <span>Complete Tasks</span>
              </div>

              {/* Floating Badge 2: Earn Points */}
              <div className="float-badge-2 absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 flex items-center gap-2.5 rounded-full border border-border/90 bg-surface/90 px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-soft-md backdrop-blur-md z-20 text-text transition-transform hover:scale-105 cursor-default">
                <div className="h-5 w-5 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                  <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning" />
                </div>
                <span>Earn Points</span>
              </div>

              {/* Floating Badge 3: Climb Leaderboard */}
              <div className="float-badge-3 absolute bottom-10 left-2 sm:left-4 flex items-center gap-2.5 rounded-full border border-border/90 bg-surface/90 px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-soft-md backdrop-blur-md z-20 text-text transition-transform hover:scale-105 cursor-default">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ChartColumn className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                </div>
                <span>Climb Leaderboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Item Stats Strip */}
      <section className="relative z-10 mx-auto -mt-4 max-w-[1200px] px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 rounded-[1.5rem] border border-border bg-surface/85 p-6 shadow-soft-md backdrop-blur-md md:grid-cols-4">
          <div className="interactive-card flex items-center gap-3.5 p-2 rounded-xl">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-fg shrink-0">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-black text-text tabular-nums">10K+</div>
              <div className="text-xs text-text-muted font-medium">Student Ambassadors</div>
            </div>
          </div>

          <div className="interactive-card flex items-center gap-3.5 p-2 rounded-xl">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-fg shrink-0">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-black text-text tabular-nums">200+</div>
              <div className="text-xs text-text-muted font-medium">Colleges</div>
            </div>
          </div>

          <div className="interactive-card flex items-center gap-3.5 p-2 rounded-xl">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-fg shrink-0">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-black text-text tabular-nums">50+</div>
              <div className="text-xs text-text-muted font-medium">Campaigns</div>
            </div>
          </div>

          <div className="interactive-card flex items-center gap-3.5 p-2 rounded-xl">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-fg shrink-0">
              <Megaphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-black text-text tabular-nums">1M+</div>
              <div className="text-xs text-text-muted font-medium">Community Reach</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: Your Journey as a Zyven Ambassador */}
      <section id="journey" className="relative z-10 mx-auto max-w-[1200px] px-6 py-24">
        <div className="text-center md:text-left space-y-2">
          <span className="inline-block rounded-full bg-accent px-3.5 py-1 text-xs font-semibold text-accent-fg border border-accent-fg/10">
            How It Works
          </span>
          <h2 className="font-display text-4xl font-semibold md:text-5xl text-text tracking-tight">
            Your journey as a <span className="text-brand">Zyven Ambassador</span>
          </h2>
          <p className="text-sm text-text-muted max-w-xl">
            Five simple steps to lead on campus, level up your network, and earn verified rewards.
          </p>
        </div>

        <div className="mt-12 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
          {/* Step 1 */}
          <div className="interactive-card group rounded-[1.25rem] border border-border bg-surface p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-accent transition-colors group-hover:bg-brand">
              <UserPlus className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="mt-5 text-xs font-bold text-primary tracking-wider">STEP 1</div>
            <div className="mt-1 font-bold text-base text-text">Register</div>
            <div className="mt-1 text-xs text-text-muted leading-relaxed">
              Create your ambassador account
            </div>
          </div>

          {/* Step 2 */}
          <div className="interactive-card group rounded-[1.25rem] border border-border bg-surface p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-accent transition-colors group-hover:bg-brand">
              <ClipboardList className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="mt-5 text-xs font-bold text-primary tracking-wider">STEP 2</div>
            <div className="mt-1 font-bold text-base text-text">Complete Profile</div>
            <div className="mt-1 text-xs text-text-muted leading-relaxed">
              Add your academic &amp; social details
            </div>
          </div>

          {/* Step 3 */}
          <div className="interactive-card group rounded-[1.25rem] border border-border bg-surface p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-accent transition-colors group-hover:bg-brand">
              <Rocket className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="mt-5 text-xs font-bold text-primary tracking-wider">STEP 3</div>
            <div className="mt-1 font-bold text-base text-text">Explore Tasks</div>
            <div className="mt-1 text-xs text-text-muted leading-relaxed">
              Take on exciting missions
            </div>
          </div>

          {/* Step 4 */}
          <div className="interactive-card group rounded-[1.25rem] border border-border bg-surface p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-accent transition-colors group-hover:bg-brand">
              <ShieldCheck className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="mt-5 text-xs font-bold text-primary tracking-wider">STEP 4</div>
            <div className="mt-1 font-bold text-base text-text">Submit &amp; Get Verified</div>
            <div className="mt-1 text-xs text-text-muted leading-relaxed">
              Share proof and earn points
            </div>
          </div>

          {/* Step 5 */}
          <div className="interactive-card group rounded-[1.25rem] border border-border bg-surface p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-accent transition-colors group-hover:bg-brand">
              <Trophy className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="mt-5 text-xs font-bold text-primary tracking-wider">STEP 5</div>
            <div className="mt-1 font-bold text-base text-text">Climb the Leaderboard</div>
            <div className="mt-1 text-xs text-text-muted leading-relaxed">
              Compete, grow and unlock rewards
            </div>
          </div>
        </div>
      </section>

      {/* Live Campus Missions Section */}
      <section id="benefits" className="relative z-10 mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              Active Opportunities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text">
              Live Ambassador Missions
            </h2>
          </div>
          <Link
            href="/missions"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>View All Missions</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEED_MISSIONS.slice(0, 2).map((m) => (
            <MissionCard key={m.id} mission={m} state="AVAILABLE" />
          ))}
        </div>
      </section>

      {/* Partner Colleges Strip */}
      <section className="border-y border-border/80 bg-surface/50 py-10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
            Partner Collegiate Chapters
          </span>
        </div>
        <div className="flex items-center gap-6 justify-center flex-wrap px-6">
          {SEED_COLLEGES.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface border border-border shadow-soft-sm text-xs font-bold text-text hover:border-primary/40 transition-colors"
            >
              <Building className="h-3.5 w-3.5 text-primary" />
              <span>{c.name} ({c.shortName})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="relative z-10 mx-auto max-w-4xl px-6 py-24">
        <div className="text-center space-y-2 mb-12">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg">
            FAQ
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-border bg-surface overflow-hidden transition-all shadow-soft-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-text flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-2 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-primary shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-text-muted leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 px-6 text-center text-xs text-text-muted">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/z3d-crystal.png"
              alt="Zyven Logo"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span className="font-bold text-text text-sm">Zyven Student Ambassador Network</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-text">Ambassador Login</Link>
            <Link href="/register" className="hover:text-text">Join Program</Link>
            <Link href="/leaderboard" className="hover:text-text">Standings</Link>
          </div>
          <p>© 2026 Zyven Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
