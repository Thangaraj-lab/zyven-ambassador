"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { mockRepository } from "@/lib/data/mock/mockRepository";
import { ArrowRight, Mail, ShieldAlert, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await mockRepository.loginWithGoogleMock();
      toast.success("Logged in successfully!");
      router.push(nextUrl);
    } catch {
      toast.error("Failed to login");
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
    setIsLoading(true);
    try {
      await mockRepository.loginWithGoogleMock(email);
      toast.success("Welcome back!");
      router.push(nextUrl);
    } catch {
      toast.error("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    try {
      await mockRepository.loginAdminMock();
      toast.success("Logged in as Admin");
      router.push("/admin");
    } catch {
      toast.error("Failed to login as admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[24px] bg-surface p-7 sm:p-9 border border-border shadow-soft-lg space-y-6">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Student Ambassador Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Sign in to access your missions, points ledger, and rewards.
        </p>
      </div>

      {/* Google Mock Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full h-12 px-4 rounded-xl border border-border bg-surface-2 hover:bg-surface text-text font-bold text-sm flex items-center justify-center gap-3 transition-colors shadow-soft-sm cursor-pointer disabled:opacity-50"
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
        <span>Continue with Google (Demo)</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-border w-full" />
        <span className="bg-surface px-3 text-[11px] font-semibold text-text-muted uppercase">
          Or with email
        </span>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-text mb-1">
            Student Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="thangaraj@mec.edu"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-text-muted/60"
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full font-bold gap-2"
          isLoading={isLoading}
        >
          <span>Sign In to Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Footer links */}
      <div className="pt-2 text-center space-y-3">
        <p className="text-xs text-text-muted">
          New ambassador?{" "}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline"
          >
            Apply for Cohort 1
          </Link>
        </p>

        <div className="pt-2 border-t border-border/80 flex items-center justify-center">
          <button
            type="button"
            onClick={handleAdminLogin}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Switch to Admin Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
