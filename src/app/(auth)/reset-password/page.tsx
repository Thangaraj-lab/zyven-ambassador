"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error("Supabase backend is not configured.");
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password/update`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[24px] border border-border bg-surface p-7 shadow-soft-lg sm:p-9">
      {sent ? (
        <div className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h1 className="text-2xl font-extrabold text-text">Check your inbox</h1>
          <p className="text-sm text-text-muted">If an account exists for that email, Supabase has sent a secure password-reset link.</p>
          <Link href="/login" className="inline-flex text-sm font-bold text-primary hover:underline">Return to login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">ZYVEX ACCOUNT RECOVERY</span>
            <h1 className="mt-1 text-2xl font-extrabold text-text">Reset your password</h1>
            <p className="mt-1 text-sm text-text-muted">We’ll send a secure recovery link to your verified email.</p>
          </div>
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" leftIcon={<Mail className="h-4 w-4" />} required />
          <Button type="submit" variant="primary" size="md" className="w-full gap-2 font-bold" isLoading={isLoading}>
            Send reset link <ArrowRight className="h-4 w-4" />
          </Button>
          <Link href="/login" className="block text-center text-xs font-bold text-text-muted hover:text-primary">Back to login</Link>
        </form>
      )}
    </div>
  );
}
