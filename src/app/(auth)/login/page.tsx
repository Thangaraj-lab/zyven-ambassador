"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Zyven3DMark } from "@/components/brand/Zyven3DMark";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArrowRight, Mail, Lock, Sparkles, GraduationCap, Award } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { triggerRgbAlert, triggerRedAlarm } from "@/components/effects/RGBAlertSystem";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");
  const authError = searchParams.get("error");

  // Selected login intent (ONLY Student or Ambassador visible in UI)
  const [selectedRole, setSelectedRole] = useState<"student" | "ambassador">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  const redirectByRole = (role: string) => {
    let destination = "/dashboard";
    const safeNext = nextUrl && nextUrl.startsWith("/") && !nextUrl.startsWith("//")
      ? nextUrl
      : null;
    if (safeNext) {
      destination = safeNext;
    } else if (role === "admin") {
      destination = "/admin";
    } else if (role === "ambassador") {
      destination = "/ambassador";
    }

    // Force a fresh document after authentication so React Query cannot reuse
    // the previous user's cached role/session from the same browser tab.
    window.location.assign(destination);
  };

  const handleOAuthLogin = async (provider: string = "google") => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        throw new Error(
          "Supabase backend is not configured in .env.local. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: (() => {
            const callbackUrl = new URL("/auth/callback", window.location.origin);
            if (nextUrl) callbackUrl.searchParams.set("next", nextUrl);
            callbackUrl.searchParams.set("intent", selectedRole);
            return callbackUrl.toString();
          })(),
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      triggerRedAlarm("AUTH ERROR", (err as Error)?.message || "Google authentication failed");
      toast.error((err as Error)?.message || "Google authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        throw new Error(
          "Supabase backend is not configured in .env.local. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
      }

      // Real Supabase Authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("User authentication failed.");
      }

      // Authoritative Role Resolution from Supabase PostgreSQL public.profiles
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role, status, full_name")
        .eq("id", data.user.id)
        .single();

      if (profileErr || !profile) {
        throw new Error("User profile not found in database.");
      }

      if (profile.status === "suspended") {
        throw new Error("Your account has been suspended by an administrator.");
      }

      const resolvedRole = profile.role || selectedRole;

      triggerRgbAlert(
        "LOGIN SUCCESSFUL",
        `${profile.full_name || data.user.email} • Role: ${resolvedRole.toUpperCase()}`
      );
      toast.success(`Welcome back, ${profile.full_name || "User"}!`);

      setTimeout(() => {
        redirectByRole(resolvedRole);
      }, 500);
    } catch (err: unknown) {
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
      triggerRedAlarm("ACCESS DENIED", (err as Error)?.message || "Invalid credentials");
      toast.error((err as Error)?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat dark:block"
        style={{ backgroundImage: "url('/assets/zyvex-login-campus.jpeg')" }}
      >
        <div className="absolute inset-0 bg-[#080615]/55 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#120a2c]/55 via-transparent to-[#09051b]/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 w-full max-w-4xl rounded-[24px] bg-surface border border-border shadow-soft-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all dark:block dark:border-white/25 dark:bg-white/[0.12] dark:shadow-[0_24px_90px_rgba(18,8,55,0.58)] dark:backdrop-blur-2xl ${
          shakeCard ? "animate-card-shake border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.6)]" : ""
        }`}
      >
      {/* Left Column: Zyvex Brand & 3D Experience */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-surface-2 border-r border-border relative overflow-hidden dark:hidden">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zyvex Official Network</span>
          </div>
          <h2 className="text-3xl font-extrabold text-text tracking-tight leading-tight">
            {selectedRole === "student" ? (
              <>
                Learn skills.<br />
                Complete tasks.<br />
                Earn rewards.
              </>
            ) : (
              <>
                Create tasks.<br />
                Lead campus.<br />
                Drive impact.
              </>
            )}
          </h2>
          <p className="text-xs text-text-muted leading-relaxed max-w-xs">
            {selectedRole === "student"
              ? "Access verified campus tasks, participate in collegiate challenges, and climb the leaderboard."
              : "Launch initiatives, review verified student submissions, and manage campus campaigns."}
          </p>
        </div>

        {/* 3D Visual Accent */}
        <div className="my-auto py-4 flex items-center justify-center z-10">
          <Zyven3DMark size={160} />
        </div>

        <div className="z-10 text-[11px] text-text-muted">
          <span>Protected by Zyvex Protocol • Zero-Trust Role Verification</span>
        </div>

        {/* Radial ambient background light */}
        <div className="absolute inset-0 bg-radial-wash pointer-events-none opacity-80" />
      </div>

      {/* Right Column: Authentication Form */}
      <div className="p-7 sm:p-10 flex flex-col justify-center space-y-5 dark:p-7 sm:dark:p-10">
        <div>
          <div className="mb-5 hidden items-center justify-center dark:flex">
            <Zyven3DMark size={72} />
          </div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase">
            ZYVEX
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mt-0.5">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Choose your role and sign in to your workspace.
          </p>
          {authError === "ambassador_access_required" && (
            <p className="mt-3 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs font-semibold text-warning">
              This Google account is registered as a student. An administrator must approve it as an ambassador before ambassador access is available.
            </p>
          )}
        </div>

        {/* STRICT PUBLIC ROLE SELECTION TABS (Student & Ambassador ONLY) */}
        <div className="grid grid-cols-2 p-1 bg-surface-2 rounded-xl border border-border dark:border-white/20 dark:bg-black/20">
          <button
            type="button"
            onClick={() => setSelectedRole("student")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              selectedRole === "student"
                ? "bg-surface text-text shadow-sm border border-border dark:bg-white/20 dark:border-white/25 dark:text-white"
                : "text-text-muted hover:text-text"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("ambassador")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              selectedRole === "ambassador"
                ? "bg-surface text-text shadow-sm border border-border dark:bg-white/20 dark:border-white/25 dark:text-white"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Ambassador</span>
          </button>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-3.5">
          <Input
            label="Email"
            type="email"
            placeholder={
              selectedRole === "student"
                ? "student@mec.edu"
                : "ambassador@zyven.network"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
            className="dark:border-white/25 dark:bg-black/20 dark:text-white dark:placeholder:text-white/55"
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              className="dark:border-white/25 dark:bg-black/20 dark:text-white dark:placeholder:text-white/55"
              required
            />
            <div className="flex justify-end pt-0.5">
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Password reset link will be sent to your verified email.");
                }}
                className="text-[11px] text-text-muted hover:text-primary transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full font-bold gap-2 mt-1"
            isLoading={isLoading}
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-surface px-3 text-[11px] font-semibold text-text-muted uppercase dark:bg-transparent dark:text-white/70">
            or continue with
          </span>
        </div>

        {/* Social Auth: Google */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading}
          className="w-full h-11 rounded-[14px] border border-border bg-surface hover:bg-surface-2 text-text font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-soft-sm cursor-pointer disabled:opacity-50 dark:border-white/25 dark:bg-black/20 dark:text-white dark:hover:bg-white/15"
          title={`Continue with Google as ${selectedRole}`}
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
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <div className="pt-2 text-center">
          <p className="text-xs text-text-muted">
            New student?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              Create Student Account
            </Link>
          </p>
        </div>
      </div>
      </motion.div>
    </>
  );
}
