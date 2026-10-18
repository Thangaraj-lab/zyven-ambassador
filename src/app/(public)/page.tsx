"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Trophy,
  CheckCircle2,
  Gift,
  Users,
  ShieldCheck,
  ChevronDown,
  Building,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MissionCard } from "@/components/ui/MissionCard";
import { LeaderboardRow } from "@/components/ui/LeaderboardRow";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ZyvenMark } from "@/components/brand/ZyvenMark";
import {
  SEED_MISSIONS,
  SEED_DEMO_AMBASSADORS,
  SEED_COLLEGES,
} from "@/lib/data/mock/seed";
import { useMotionOK } from "@/lib/motion";

export default function LandingPage() {
  const motionOK = useMotionOK();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const top5Ambassadors = SEED_DEMO_AMBASSADORS.slice(0, 5).map((d, idx) => ({
    id: d.user.id,
    rank: idx + 1,
    name: d.user.name,
    college: d.profile.college,
    points: d.points,
    avatarUrl: d.user.avatarUrl,
  }));

  const faqs = [
    {
      q: "What is the Zyven Student Ambassador Program?",
      a: "It is an exclusive collegiate leadership program empowering engineering and tech students across Tamil Nadu to represent Zyven, host developer events, build campus communities, and earn transparent rewards.",
    },
    {
      q: "Who is eligible to apply for Cohort 1?",
      a: "Any undergraduate or postgraduate engineering or technology student enrolled in an accredited institution in Tamil Nadu (e.g. MEC, PSG, Kongu, KSR, Sona, SRM, etc.) can join.",
    },
    {
      q: "How are points earned and verified?",
      a: "You complete live missions like sharing news on LinkedIn or expanding student developer groups. Once you submit a post URL or screenshot proof, our operations team verifies it within 24 hours, and points are atomically recorded on your ledger.",
    },
    {
      q: "What perks do unlocked tiers offer?",
      a: "As you progress through Bronze (50 pts), Silver (150 pts), Gold (300 pts), and Champion (500 pts), you unlock digital certificates, exclusive Zyven merchandise boxes, VIP founder AMAs, and direct fast-track consideration for tech internships.",
    },
    {
      q: "Can multiple ambassadors join from the same college?",
      a: "Yes! Ambassadors from the same college work together to accumulate points on the College Leaderboard for annual collegiate awards.",
    },
    {
      q: "Is there any registration fee to become an ambassador?",
      a: "No, participation in the Zyven Student Ambassador Program is 100% free.",
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ambient background blob */}
        <div className="absolute top-10 right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <Sparkles className="h-4 w-4" />
              <span>Student Ambassador Program • Represent. Create. Influence. Grow.</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text tracking-tight leading-[1.1]">
              Become a{" "}
              <span className="brand-gradient-text">Zyven Student</span>{" "}
              Ambassador
            </h1>

            {/* Body */}
            <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
              Represent Zyven on your campus, take on exciting developer missions, earn points on a transparent ledger, unlock rewards, and lead the premier student network.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="font-extrabold gap-2 text-base shadow-soft-md"
                >
                  <span>Register as Ambassador</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="#how-it-works">
                <Button
                  variant="secondary"
                  size="lg"
                  className="font-bold text-base"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Founding Cohort Counter Strip */}
            <div className="pt-6 max-w-md">
              <div className="p-4 rounded-2xl bg-surface border border-border shadow-soft-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Founding Cohort Status</span>
                  </span>
                  <span className="text-primary tabular-nums">
                    37 / 100 ambassadors joined
                  </span>
                </div>
                <ProgressBar value={37} height={8} />
              </div>
            </div>
          </div>

          {/* Right Hero Visual with Real Photo Slot & Floating Chips */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Background glowing frame */}
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/5] rounded-[32px] overflow-hidden border border-border/80 shadow-soft-lg bg-surface-2">
              {/* Replace with real MEC ambassador photo - Graceful dynamic gradient and portrait fallback */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-primary-2/20 to-transparent flex items-center justify-center p-8">
                {/* Visual ambassador illustration & brand mark */}
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-28 w-28 rounded-3xl brand-gradient-bg text-white flex items-center justify-center shadow-soft-lg">
                    <ZyvenMark size={64} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-text">
                      Tamil Nadu Ambassador Network
                    </h4>
                    <p className="text-xs text-text-muted mt-1">
                      MEC • PSG • Kongu • KSR • Sona • SRM
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Floating Glass Chips */}
              <motion.div
                animate={motionOK ? { y: [0, -8, 0] } : undefined}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 -left-4 sm:-left-6 px-4 py-2.5 rounded-2xl glass-card text-xs font-bold text-text flex items-center gap-2 shadow-soft-md"
              >
                <div className="h-6 w-6 rounded-lg brand-gradient-bg text-white flex items-center justify-center text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span>Complete Tasks</span>
              </motion.div>

              <motion.div
                animate={motionOK ? { y: [0, 8, 0] } : undefined}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 px-4 py-2.5 rounded-2xl glass-card text-xs font-bold text-text flex items-center gap-2 shadow-soft-md"
              >
                <div className="h-6 w-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                </div>
                <span>Earn Points</span>
              </motion.div>

              <motion.div
                animate={motionOK ? { y: [0, -6, 0] } : undefined}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-8 -left-2 sm:-left-4 px-4 py-2.5 rounded-2xl glass-card text-xs font-bold text-text flex items-center gap-2 shadow-soft-md"
              >
                <div className="h-6 w-6 rounded-lg bg-success text-white flex items-center justify-center text-xs">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
                <span>Climb Leaderboard</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MARQUEE: PARTNER COLLEGES STRIP */}
      <section className="border-y border-border/80 bg-surface/50 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Partner Collegiate Chapters
          </span>
        </div>
        <div className="flex items-center gap-8 justify-center flex-wrap px-4">
          {SEED_COLLEGES.map((c) => (
            <div
              key={c.id}
              className="px-4 py-2 rounded-xl bg-surface border border-border flex items-center gap-2 text-xs font-bold text-text shadow-xs"
            >
              <Building className="h-3.5 w-3.5 text-primary" />
              <span>{c.name} ({c.shortName})</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (5 Visual Stages) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Progression Loop"
          title="Your Journey as a Zyven Ambassador"
          description="A transparent 5-stage loop designed for high impact, learning, and recognition."
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Register",
              desc: "Create your ambassador profile and choose your institution.",
            },
            {
              step: "02",
              title: "Complete Profile",
              desc: "Detail your social presence, interests, and leadership goals.",
            },
            {
              step: "03",
              title: "Explore Tasks",
              desc: "Take on exciting social and campus missions.",
            },
            {
              step: "04",
              title: "Submit & Verify",
              desc: "Paste live proof. Admin verification takes < 24 hours.",
            },
            {
              step: "05",
              title: "Climb & Unlock",
              desc: "Accumulate ledger points, rank up, and unlock rewards.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-[22px] bg-surface border border-border shadow-soft-sm space-y-3 relative group hover:border-primary/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl brand-gradient-bg text-white flex items-center justify-center font-black text-sm shadow-soft-xs">
                {item.step}
              </div>
              <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED MISSIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Take Action
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mt-1">
              Featured Campus Missions
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Live tasks ready for ambassadors to complete today.
            </p>
          </div>
          <Link href="/missions">
            <Button variant="secondary" size="sm" className="font-bold">
              View All Missions
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <MissionCard mission={SEED_MISSIONS[0]} state="AVAILABLE" />
          <MissionCard mission={SEED_MISSIONS[1]} state="AVAILABLE" />
          <MissionCard mission={SEED_MISSIONS[2]} state="LOCKED" />
          <MissionCard mission={SEED_MISSIONS[3]} state="LOCKED" />
        </div>
      </section>

      {/* 5. WHY BECOME AN AMBASSADOR (6 Benefit Cards) */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ambassador Perks"
          title="Why Represent Zyven?"
          description="Tangible rewards and career-accelerating benefits engineered for campus leaders."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Transparent Points Ledger",
              desc: "Every point you earn is permanently tracked on an immutable transaction ledger.",
              icon: Zap,
            },
            {
              title: "Official Recognition",
              desc: "Stand out as a verified founding student ambassador on LinkedIn and campus portals.",
              icon: Star,
            },
            {
              title: "Exclusive Swag & Rewards",
              desc: "Unlock premium ambassador hoodies, sticker packs, and milestone kit packages.",
              icon: Gift,
            },
            {
              title: "Digital Certificates",
              desc: "Earn credentials signed by Zyven leadership validating your community impact.",
              icon: ShieldCheck,
            },
            {
              title: "Peer Community & Network",
              desc: "Collaborate directly with top student developers across engineering colleges.",
              icon: Users,
            },
            {
              title: "Career Fast-Track",
              desc: "Top ambassadors receive priority consideration for software internships and roles.",
              icon: Sparkles,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-[24px] bg-surface border border-border shadow-soft-sm space-y-3 hover:shadow-soft-md transition-shadow"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <card.icon className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-text">{card.title}</h4>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LIVE LEADERBOARD PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Live Standings"
          title="Top Student Ambassadors"
          description="Real-time leaderboard preview across all participating colleges."
        />

        <div className="p-6 sm:p-8 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-4 max-w-3xl mx-auto">
          <div className="space-y-2">
            {top5Ambassadors.map((u) => (
              <LeaderboardRow key={u.id} user={u} />
            ))}
          </div>

          <div className="pt-4 text-center">
            <Link href="/leaderboard">
              <Button variant="secondary" size="md" className="font-bold">
                View Full Standings & College Battle
              </Button>
            </Link>
          </div>

          <p className="text-[11px] text-text-muted text-center pt-2">
            Demo data — official competitive cohort rankings begin at launch.
          </p>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know about the Zyven Ambassador program."
        />

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-border bg-surface overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4.5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-text cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4.5 pt-0 text-xs text-text-muted leading-relaxed border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL HIGH-IMPACT CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-[32px] brand-gradient-bg p-8 sm:p-14 text-center text-white space-y-6 shadow-soft-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-wash pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              Founding Cohort 1
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready to represent Zyven on your campus?
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Join student leaders across Tamil Nadu, complete your first mission in 5 minutes, and claim your Bronze badge today.
            </p>

            <div className="pt-2 flex justify-center">
              <Link href="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-text font-black text-base shadow-soft-lg hover:bg-white/95"
                >
                  <span>Register as Ambassador</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-border bg-surface py-12 px-4 sm:px-6 lg:px-8 text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ZyvenMark size={24} />
            <span className="font-extrabold text-sm text-text">Zyven</span>
            <span className="text-text-muted">
              • Student Ambassador Network
            </span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/how-it-works" className="hover:text-text">
              How It Works
            </Link>
            <Link href="/leaderboard" className="hover:text-text">
              Leaderboard
            </Link>
            <Link href="/login" className="hover:text-text">
              Ambassador Login
            </Link>
            <Link href="/admin" className="hover:text-text">
              Admin
            </Link>
          </div>

          <div>
            © {new Date().getFullYear()} Zyven Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
