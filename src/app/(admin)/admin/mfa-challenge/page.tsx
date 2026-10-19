"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function AdminMfaChallengePage() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadFactors = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setError("Authentication service is unavailable.");
        setIsLoading(false);
        return;
      }

      const { data, error: factorError } = await supabase.auth.mfa.listFactors();
      if (cancelled) return;
      const verified = data?.totp?.find((factor: { id: string; status: string }) => factor.status === "verified");
      setFactorId(verified?.id ?? null);
      setError(factorError?.message || (!verified ? "No verified admin authenticator is configured." : ""));
      setIsLoading(false);
    };
    void loadFactors();
    return () => {
      cancelled = true;
    };
  }, []);

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!factorId || code.trim().length !== 6) {
      setError("Enter the six-digit code from your authenticator app.");
      return;
    }

    setIsVerifying(true);
    setError("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication service is unavailable.");
      setIsVerifying(false);
      return;
    }

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError || !challenge) {
      setError(challengeError?.message || "Unable to start the MFA challenge.");
      setIsVerifying(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });
    if (verifyError) {
      setError(verifyError.message || "The MFA code is invalid or expired.");
      setIsVerifying(false);
      return;
    }

    router.replace("/admin/users");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <form onSubmit={verifyCode} className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface p-7 shadow-soft-lg">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">Admin verification required</h1>
            <p className="mt-1 text-sm text-text-muted">Verify your authenticator before changing account roles or points.</p>
          </div>
        </div>

        {!factorId ? (
          <p className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
            No verified authenticator is configured for this admin account. Add a TOTP factor in Supabase Auth settings, then try the promotion again.
          </p>
        ) : (
          <>
            <label className="block space-y-2 text-sm font-semibold text-text" htmlFor="mfa-code">
              Six-digit authenticator code
              <input
                id="mfa-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-center text-xl tracking-[0.35em] text-text outline-none focus:border-primary"
              />
            </label>
            <Button type="submit" isLoading={isVerifying} className="w-full" disabled={isVerifying}>
              Verify and continue
            </Button>
          </>
        )}

        {error && <p className="text-sm font-medium text-danger">{error}</p>}
      </form>
    </div>
  );
}
