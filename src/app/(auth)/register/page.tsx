"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight, User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "sonner";
import { mockRepository } from "@/lib/data/mock/mockRepository";

function getDraft() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("zyven_register_draft_step1");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function RegisterStep1Page() {
  const router = useRouter();

  const [name, setName] = useState(() => getDraft()?.name || "");
  const [email, setEmail] = useState(() => getDraft()?.email || "");
  const [phone, setPhone] = useState(() => getDraft()?.phone || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveDraft = (updates: { name?: string; email?: string; phone?: string }) => {
    try {
      const current = { name, email, phone, ...updates };
      localStorage.setItem("zyven_register_draft_step1", JSON.stringify(current));
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please enter your full name and student email");
      return;
    }

    handleSaveDraft({ name, email, phone });
    // Proceed to Step 2-4 profile setup
    router.push("/register/profile");
  };

  const handleGoogleQuickstart = async () => {
    setIsLoading(true);
    try {
      const user = await mockRepository.loginWithGoogleMock();
      handleSaveDraft({ name: user.name, email: user.email });
      router.push("/register/profile");
    } catch {
      toast.error("Google sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[24px] bg-surface p-7 sm:p-9 border border-border shadow-soft-lg space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-text-muted">
          <span className="text-primary uppercase tracking-wider text-[11px]">
            Step 1 of 4
          </span>
          <span>Account Setup</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          <div className="rounded-full brand-gradient-bg h-full" />
          <div className="rounded-full bg-surface-2 border border-border h-full" />
          <div className="rounded-full bg-surface-2 border border-border h-full" />
          <div className="rounded-full bg-surface-2 border border-border h-full" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-text tracking-tight">
          Join Founding Cohort
        </h1>
        <p className="text-xs text-text-muted">
          Create your Zyven Ambassador account to represent your college.
        </p>
      </div>

      {/* Google Quick Button */}
      <button
        type="button"
        onClick={handleGoogleQuickstart}
        disabled={isLoading}
        className="w-full h-11 px-4 rounded-xl border border-border bg-surface-2 hover:bg-surface text-text font-bold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-soft-sm cursor-pointer"
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
        <span>Sign Up with Google (Fast)</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-border w-full" />
        <span className="bg-surface px-3 text-[11px] font-semibold text-text-muted uppercase">
          Or fill manually
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-text mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleSaveDraft({ name: e.target.value });
              }}
              placeholder="Thangaraj Pandian"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-text-muted/60"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text mb-1">College Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleSaveDraft({ email: e.target.value });
              }}
              placeholder="thangaraj@mec.edu"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-text-muted/60"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text mb-1">WhatsApp Phone (Optional)</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                handleSaveDraft({ phone: e.target.value });
              }}
              placeholder="+91 98765 43210"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-text-muted/60"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-text-muted/60"
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full font-bold gap-2 mt-2"
          isLoading={isLoading}
        >
          <span>Continue to Academic Profile</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="text-center text-xs text-text-muted">
        Already registered?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
