"use client";

import React from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HowItWorksPage() {
  const stages = [
    {
      num: "01",
      title: "Register & Join the Cohort",
      desc: "Sign up with your college email and select your Tamil Nadu institution. It takes less than 60 seconds to get your Founding Ambassador ID.",
      details: ["Fast Google or email signup", "Instant cohort placement", "No fees or credit card required"],
    },
    {
      num: "02",
      title: "Complete Your Ambassador Profile",
      desc: "Provide your department, academic year, social links (LinkedIn, Instagram), and leadership interests so we can assign tailored tasks.",
      details: ["College-verified identity", "Student ID accreditation", "Targeted campus developer initiatives"],
    },
    {
      num: "03",
      title: "Explore & Undertake Live Missions",
      desc: "Access active missions from your dashboard. From sharing official LinkedIn announcements to growing your college developer chapter, every mission has crystal-clear instructions.",
      details: ["Curated live tasks", "Estimated completion times", "Sequential guided step-by-step UI"],
    },
    {
      num: "04",
      title: "Submit Proof & Fast Verification",
      desc: "Submit your post URL or upload a compressed screenshot proof directly in the portal. Our operations team reviews submissions within 24 hours.",
      details: ["URL link validation", "Automated image compression", "Direct reviewer feedback on fixes"],
    },
    {
      num: "05",
      title: "Earn Ledger Points & Unlock Tiers",
      desc: "Points are atomically credited to your personal transparent ledger. Climb the individual and college battle leaderboards, and unlock physical swag boxes and certificates.",
      details: ["Bronze (50 pts), Silver (150 pts), Gold (300 pts), Champion (500 pts)", "Real-time rank updates", "Official Digital Credentials"],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SectionHeading
        eyebrow="Blueprint"
        title="How the Zyven Ambassador Program Works"
        description="A complete guide to our five-stage progression loop from discovery to rewards."
      />

      <div className="space-y-6">
        {stages.map((stage) => (
          <div
            key={stage.num}
            className="p-6 sm:p-8 rounded-[24px] bg-surface border border-border shadow-soft-sm flex flex-col md:flex-row md:items-start gap-6"
          >
            <div className="h-14 w-14 rounded-2xl brand-gradient-bg text-white flex items-center justify-center font-black text-xl shadow-soft-sm shrink-0">
              {stage.num}
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-extrabold text-text">
                {stage.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {stage.desc}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                {stage.details.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-border text-text font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    <span>{d}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link href="/register">
          <Button variant="primary" size="lg" className="font-extrabold gap-2">
            <span>Ready to Begin? Register Now</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
