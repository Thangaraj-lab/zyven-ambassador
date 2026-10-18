"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Zyven3DMark } from "@/components/brand/Zyven3DMark";
import { mockRepository } from "@/lib/data/mock/mockRepository";
import { ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { triggerRgbAlert, triggerRedAlarm } from "@/components/effects/RGBAlertSystem";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  const redirectByRole = (role: string) => {
    if (nextUrl) {
      router.push(nextUrl);
      return;
    }
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "ambassador") {
      router.push("/ambassador");
    } else {
      router.push("/dashboard");
    }
  };

  const handleOAuthLogin = async (provider: string = "google") => {
    setIsLoading(true);
    try {
      const user = await mockRepository.loginWithGoogleMock();
      triggerRgbAlert("LOGIN SUCCESSFUL", `Authenticated via ${provider.toUpperCase()} • RGB LED Online`);
      toast.success(`Welcome to Zyven! Signed in via ${provider.toUpperCase()}.`);
      setTimeout(() => {
        redirectByRole(user.role);
      }, 700);
    } catch {
      triggerRedAlarm("AUTH ERROR", "Provider authentication failed");
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // High Red LED Alarm for Wrong Password Demonstration
    if (password === "wrong" || password === "error" || (password && password.length < 4)) {
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
      triggerRedAlarm("ACCESS DENIED: WRONG PASSWORD", "High Red Strobe Emergency Alarm Active");
      toast.error("Security alert: Wrong password entered!");
      return;
    }

    setIsLoading(true);
    try {
      const user = await mockRepository.loginWithGoogleMock(email);
      triggerRgbAlert("LOGIN SUCCESSFUL", "Ambassador Protocol Initialized • RGB LED Active");
      toast.success("Welcome back!");
      setTimeout(() => {
        redirectByRole(user.role);
      }, 750);
    } catch {
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
      triggerRedAlarm("SECURITY ALERT: INVALID CREDENTIALS", "High Red Strobe Alert Activated");
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full max-w-4xl rounded-[24px] bg-surface border border-border shadow-soft-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all ${
        shakeCard ? "animate-card-shake border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.6)]" : ""
      }`}
    >
      {/* Left Column: Zyven Brand & 3D Experience */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-surface-2 border-r border-border relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zyven Ambassador Portal</span>
          </div>
          <h2 className="text-3xl font-extrabold text-text tracking-tight leading-tight">
            Represent Zyven.<br />
            Complete tasks.<br />
            Earn points.
          </h2>
          <p className="text-xs text-text-muted leading-relaxed max-w-xs">
            Join the founding network of student leaders across Tamil Nadu engineering & arts institutions.
          </p>
        </div>

        {/* 3D Visual Accent */}
        <div className="my-auto py-4 flex items-center justify-center z-10">
          <Zyven3DMark size={160} />
        </div>

        <div className="z-10 text-[11px] text-text-muted">
          <span>Protected by Zyven Protocol • Zero-trust verified</span>
        </div>

        {/* Radial ambient background light */}
        <div className="absolute inset-0 bg-radial-wash pointer-events-none opacity-80" />
      </div>

      {/* Right Column: Authentication Form */}
      <div className="p-7 sm:p-10 flex flex-col justify-center space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Sign in with your student or campus account.
          </p>
        </div>

        {/* Social Auth Providers */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
            className="h-11 rounded-[12px] border border-border bg-surface hover:bg-surface-2 text-text font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-soft-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="hidden sm:inline">Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin("linkedin")}
            disabled={isLoading}
            className="h-11 rounded-[12px] border border-border bg-surface hover:bg-surface-2 text-text font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-soft-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="h-4 w-4 fill-[#0A66C2]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.05 1.53 1.53 0 0 0 0 3.05m1.39 9.74v-8.37H5.07v8.37h2.78z" />
            </svg>
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin("github")}
            disabled={isLoading}
            className="h-11 rounded-[12px] border border-border bg-surface hover:bg-surface-2 text-text font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-soft-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-surface px-3 text-[11px] font-semibold text-text-muted uppercase">
            or
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-3.5">
          <Input
            label="Email"
            type="email"
            placeholder="thangaraj@mec.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
          />

          <Button
            variant="primary"
            size="md"
            className="w-full font-bold gap-2 mt-2"
            isLoading={isLoading}
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Footer Link */}
        <div className="pt-2 text-center">
          <p className="text-xs text-text-muted">
            New ambassador?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
