"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [ready, setReady] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    void supabase.auth.getSession().then((result: { data: { session: unknown } }) => setReady(Boolean(result.data.session)));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (password !== confirmation) return toast.error("Passwords do not match.");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return toast.error("Supabase backend is not configured.");
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (error) return toast.error(error.message);
    setUpdated(true);
    await supabase.auth.signOut();
  };

  if (updated) return <div className="w-full max-w-md space-y-4 rounded-[24px] border border-border bg-surface p-8 text-center shadow-soft-lg"><CheckCircle2 className="mx-auto h-12 w-12 text-success" /><h1 className="text-2xl font-extrabold text-text">Password updated</h1><p className="text-sm text-text-muted">You can now sign in with your new password.</p><Link href="/login" className="font-bold text-primary hover:underline">Continue to login</Link></div>;
  if (!ready) return <div className="w-full max-w-md rounded-[24px] border border-border bg-surface p-8 text-center text-sm text-text-muted shadow-soft-lg">This recovery link is invalid or expired. Please request a new one.</div>;

  return <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-[24px] border border-border bg-surface p-7 shadow-soft-lg sm:p-9"><div><span className="text-xs font-bold uppercase tracking-widest text-primary">ZYVEX ACCOUNT RECOVERY</span><h1 className="mt-1 text-2xl font-extrabold text-text">Choose a new password</h1></div><Input label="New password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} leftIcon={<Lock className="h-4 w-4" />} minLength={8} required /><Input label="Confirm password" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} leftIcon={<Lock className="h-4 w-4" />} minLength={8} required /><Button type="submit" variant="primary" className="w-full font-bold" isLoading={isLoading}>Update password</Button></form>;
}
