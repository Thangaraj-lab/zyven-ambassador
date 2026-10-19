"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScroll, useTransform, motion } from "motion/react";
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
  Sparkles,
} from "lucide-react";
import { MissionCard } from "@/components/ui/MissionCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { TiltCard } from "@/components/ui/TiltCard";
import { useMissions } from "@/lib/data/hooks";
import {
  SEED_MISSIONS,
  SEED_COLLEGES,
} from "@/lib/data/mock/seed";

export default function LandingPage() {
  const { data: missions = [] } = useMissions();
  const liveMissions = missions.filter((m) => m.status === "live");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { scrollYProgress } = useScroll();

  // Dynamic Scroll Parallax Values for Multi-stage Background
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 450]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -380]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.9]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 1, 0.8]);

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
    <div className="relative min-h-screen overflow-hidden bg-bg text-text selection:bg-primary/20">
      {/* Top Scroll Progress Line */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-purple-400 to-cyan-400 z-50 pointer-events-none shadow-glow"
      />

      {/* Dynamic Multi-Stage Scrolling Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Shifting Aurora Glow 1 (Top-Right) */}
        <motion.div
          style={{ y: orb1Y, scale: orbScale, opacity: bgOpacity }}
          className="absolute -top-[20%] -right-[15%] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-primary/25 via-purple-600/15 to-transparent blur-[120px]"
        />

        {/* Shifting Aurora Glow 2 (Bottom-Left) */}
        <motion.div
          style={{ y: orb2Y, opacity: bgOpacity }}
          className="absolute top-[35%] -left-[15%] h-[650px] w-[650px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-primary/20 to-transparent blur-[110px]"
        />

        {/* Ambient Nebula Center */}
        <div className="absolute top-[65%] left-[25%] h-[550px] w-[550px] rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent blur-[130px]" />

        {/* Subtle Cybernetic Grid Mesh Overlay */}
        <div className="absolute inset-0 bg-grid-mesh opacity-70" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-30 mx-auto flex max-w-[1360px] items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10">
            <Image
              src="/assets/z3d-crystal.png"
              alt="Zyven 3D Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain drop-shadow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              priority
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-text">Zyven</span>
        </Link>

        <nav className="hidden gap-8 text-sm font-semibold text-text-muted lg:flex items-center">
          <Link href="/" className="text-text font-bold hover:text-primary transition-colors">
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

        <div className="flex items-center gap-3">
          <LocaleToggle />
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-bold text-text hover:bg-surface-2 transition-all cursor-pointer"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-glow hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section - Ultra Grand & 3D */}
      <section className="relative z-10 mx-auto grid max-w-[1360px] items-center gap-12 px-6 pt-8 pb-16 lg:grid-cols-12 min-h-[82vh]">
        <div className="space-y-8 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs sm:text-sm font-bold text-accent-fg border border-accent-fg/15 shadow-soft-sm backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-current text-primary animate-spin-slow" />
              <span>Student Ambassador Program</span>
              <Sparkles className="h-3 w-3 text-warning" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] font-semibold leading-[1.0] tracking-tight text-text"
          >
            Become a <br />
            <span className="text-brand">Zyven</span> Student <br />
            Ambassador
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xl text-lg sm:text-xl text-text-muted leading-relaxed"
          >
            Represent Zyven in your campus, take on exciting missions, earn points, unlock rewards, and be part of a growing ambassador community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-brand px-8 py-4 text-base font-bold text-white shadow-glow transition-all duration-200 hover:-translate-y-1 hover:brightness-105 active:scale-95 cursor-pointer"
            >
              <span>Register as Ambassador</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="#journey"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-7 py-4 text-base font-bold text-text hover:bg-surface-2 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
            >
              <div className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
              </div>
              <span>Watch Video</span>
            </Link>
          </motion.div>
        </div>

        {/* Right Hero Visual with Interactive 3D Depth Card & Specular Glare */}
        <div className="relative flex justify-center items-center py-4 lg:col-span-5">
          <TiltCard
            maxTilt={12}
            scale={1.03}
            glare={true}
            className="w-full max-w-[500px]"
          >
            <div className="relative preserve-3d">
              {/* Backglow Nebula Halo */}
              <div className="glow-pulse pointer-events-none absolute -inset-6 sm:-inset-10 rounded-full bg-gradient-to-tr from-primary/40 via-purple-500/25 to-cyan-400/20 blur-3xl -z-10" />

              {/* Holographic Frame Card */}
              <div className="relative overflow-hidden rounded-[2.5rem] p-3 bg-gradient-to-tr from-primary/20 via-accent/50 to-white/10 dark:to-transparent border border-white/40 dark:border-border shadow-2xl backdrop-blur-md">
                <Image
                  src="/assets/hero-ambassador.jpg"
                  alt="Zyven student ambassador"
                  width={1024}
                  height={1152}
                  className="mx-auto max-h-[620px] w-full rounded-[2rem] object-cover [mask-image:radial-gradient(85%_85%_at_50%_45%,black_72%,transparent)] transition-transform duration-700 hover:scale-[1.02]"
                  priority
                />

                {/* 3D Floating Badge 1: Complete Tasks (Top Right) */}
                <div className="float-badge-1 translate-z-50 absolute right-4 sm:right-6 top-8 flex items-center gap-2.5 rounded-full border border-border/80 bg-surface/90 px-4 py-2.5 text-xs sm:text-sm font-bold shadow-soft-lg backdrop-blur-md z-30 text-text">
                  <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                    <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <span>Complete Tasks</span>
                </div>

                {/* 3D Floating Badge 2: Earn Points (Center Right) */}
                <div className="float-badge-2 translate-z-50 absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 flex items-center gap-2.5 rounded-full border border-border/80 bg-surface/90 px-4 py-2.5 text-xs sm:text-sm font-bold shadow-soft-lg backdrop-blur-md z-30 text-text">
                  <div className="h-6 w-6 rounded-full bg-warning/15 flex items-center justify-center text-warning">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <span>Earn Points</span>
                </div>

                {/* 3D Floating Badge 3: Climb Leaderboard (Bottom Center/Left) */}
                <div className="float-badge-3 translate-z-50 absolute bottom-12 left-4 sm:left-6 flex items-center gap-2.5 rounded-full border border-border/80 bg-surface/90 px-4 py-2.5 text-xs sm:text-sm font-bold shadow-soft-lg backdrop-blur-md z-30 text-text">
                  <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                    <ChartColumn className="h-4 w-4" />
                  </div>
                  <span>Climb Leaderboard</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* 4-Item Stats Strip in Ultra 3D Cards */}
      <section className="relative z-10 mx-auto max-w-[1360px] px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
        >
          {/* Stat 1 */}
          <TiltCard maxTilt={8} scale={1.04} className="rounded-2xl">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface/90 p-6 shadow-soft-md backdrop-blur-md">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-fg shrink-0 shadow-soft-sm">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-black text-text tabular-nums">10K+</div>
                <div className="text-xs text-text-muted font-bold mt-0.5">Student Ambassadors</div>
              </div>
            </div>
          </TiltCard>

          {/* Stat 2 */}
          <TiltCard maxTilt={8} scale={1.04} className="rounded-2xl">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface/90 p-6 shadow-soft-md backdrop-blur-md">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-fg shrink-0 shadow-soft-sm">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-black text-text tabular-nums">200+</div>
                <div className="text-xs text-text-muted font-bold mt-0.5">Colleges</div>
              </div>
            </div>
          </TiltCard>

          {/* Stat 3 */}
          <TiltCard maxTilt={8} scale={1.04} className="rounded-2xl">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface/90 p-6 shadow-soft-md backdrop-blur-md">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-fg shrink-0 shadow-soft-sm">
                <Coins className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-black text-text tabular-nums">50+</div>
                <div className="text-xs text-text-muted font-bold mt-0.5">Campaigns</div>
              </div>
            </div>
          </TiltCard>

          {/* Stat 4 */}
          <TiltCard maxTilt={8} scale={1.04} className="rounded-2xl">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface/90 p-6 shadow-soft-md backdrop-blur-md">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-fg shrink-0 shadow-soft-sm">
                <Megaphone className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-black text-text tabular-nums">1M+</div>
                <div className="text-xs text-text-muted font-bold mt-0.5">Community Reach</div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </section>

      {/* How It Works: Your Journey as a Zyven Ambassador (3D Staggered Cards) */}
      <section id="journey" className="relative z-10 mx-auto max-w-[1360px] px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left space-y-3"
        >
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-fg border border-accent-fg/15">
            How It Works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-text tracking-tight">
            Your journey as a <span className="text-brand">Zyven Ambassador</span>
          </h2>
          <p className="text-base text-text-muted max-w-xl">
            Five simple steps to lead on campus, level up your network, and earn verified rewards.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <TiltCard maxTilt={10} scale={1.03} className="h-full">
              <div className="h-full rounded-[1.5rem] border border-border bg-surface/95 p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default transition-colors">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent transition-colors group-hover:bg-brand">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-6 text-xs font-black text-primary tracking-widest uppercase">STEP 1</div>
                <div className="mt-1.5 font-bold text-lg text-text">Register</div>
                <div className="mt-1.5 text-xs text-text-muted leading-relaxed">
                  Create your ambassador account
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <TiltCard maxTilt={10} scale={1.03} className="h-full">
              <div className="h-full rounded-[1.5rem] border border-border bg-surface/95 p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default transition-colors">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent transition-colors group-hover:bg-brand">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-6 text-xs font-black text-primary tracking-widest uppercase">STEP 2</div>
                <div className="mt-1.5 font-bold text-lg text-text">Complete Profile</div>
                <div className="mt-1.5 text-xs text-text-muted leading-relaxed">
                  Add your academic &amp; social details
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <TiltCard maxTilt={10} scale={1.03} className="h-full">
              <div className="h-full rounded-[1.5rem] border border-border bg-surface/95 p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default transition-colors">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent transition-colors group-hover:bg-brand">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-6 text-xs font-black text-primary tracking-widest uppercase">STEP 3</div>
                <div className="mt-1.5 font-bold text-lg text-text">Explore Tasks</div>
                <div className="mt-1.5 text-xs text-text-muted leading-relaxed">
                  Take on exciting missions
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <TiltCard maxTilt={10} scale={1.03} className="h-full">
              <div className="h-full rounded-[1.5rem] border border-border bg-surface/95 p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default transition-colors">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent transition-colors group-hover:bg-brand">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-6 text-xs font-black text-primary tracking-widest uppercase">STEP 4</div>
                <div className="mt-1.5 font-bold text-lg text-text">Submit &amp; Get Verified</div>
                <div className="mt-1.5 text-xs text-text-muted leading-relaxed">
                  Share proof and earn points
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Step 5 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <TiltCard maxTilt={10} scale={1.03} className="h-full">
              <div className="h-full rounded-[1.5rem] border border-border bg-surface/95 p-6 shadow-soft-sm hover:border-primary/50 hover:shadow-glow cursor-default transition-colors">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent transition-colors group-hover:bg-brand">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-6 text-xs font-black text-primary tracking-widest uppercase">STEP 5</div>
                <div className="mt-1.5 font-bold text-lg text-text">Climb the Leaderboard</div>
                <div className="mt-1.5 text-xs text-text-muted leading-relaxed">
                  Compete, grow and unlock rewards
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Live Campus Missions Section */}
      <section id="benefits" className="relative z-10 mx-auto max-w-[1360px] px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
              Active Opportunities
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-text">
              Live Ambassador Missions
            </h2>
          </div>
          <Link
            href="/missions"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <span>View All Missions</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {liveMissions.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-border bg-surface/50 p-10 text-center shadow-soft-sm">
              <Sparkles className="mx-auto h-8 w-8 text-primary mb-2" />
              <h3 className="font-display text-lg font-bold text-text">New Campus Missions Dropping Soon</h3>
              <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                Official missions and technical challenges are being scheduled. Create your student account today to be notified the moment tasks go live!
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="brand-gradient-bg text-white px-5 py-2 rounded-full text-xs font-bold hover:brightness-110 shadow-soft-sm transition-all"
                >
                  Create Student Account
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-full border border-border bg-surface text-xs font-bold text-text hover:bg-surface-2 transition-all"
                >
                  Ambassador Login
                </Link>
              </div>
            </div>
          ) : (
            liveMissions.slice(0, 2).map((m) => (
              <TiltCard key={m.id} maxTilt={6} scale={1.02}>
                <MissionCard mission={m} state="AVAILABLE" />
              </TiltCard>
            ))
          )}
        </div>
      </section>

      {/* Partner Colleges Strip */}
      <section className="border-y border-border/80 bg-surface/60 backdrop-blur-md py-12 overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-6 text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-text-muted">
            Partner Collegiate Chapters
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 justify-center flex-wrap px-6 max-w-[1360px] mx-auto">
          {SEED_COLLEGES.map((c) => (
            <div
              key={c.id}
              className="interactive-card flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-surface border border-border shadow-soft-sm text-xs font-bold text-text hover:border-primary/50"
            >
              <Building className="h-4 w-4 text-primary" />
              <span>{c.name} ({c.shortName})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="relative z-10 mx-auto max-w-4xl px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-2 mb-14"
        >
          <span className="rounded-full bg-accent px-4 py-1 text-xs font-bold text-accent-fg border border-accent-fg/10">
            FAQ
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-text">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-2xl border border-border bg-surface/90 overflow-hidden transition-all shadow-soft-sm hover:border-primary/40"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-text flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-2 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-primary shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/80 backdrop-blur-md py-12 px-6 text-center text-xs text-text-muted">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/z3d-crystal.png"
              alt="Zyven Logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="font-black text-text text-sm">Zyven Student Ambassador Network</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/login" className="hover:text-text transition-colors">Ambassador Login</Link>
            <Link href="/register" className="hover:text-text transition-colors">Join Program</Link>
            <Link href="/leaderboard" className="hover:text-text transition-colors">Standings</Link>
          </div>
          <p>© 2026 Zyven Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
