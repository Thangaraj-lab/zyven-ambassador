import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AuthenticatedProfile {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "ambassador" | "admin";
  status: "active" | "suspended" | "pending";
  college_id: string | null;
  avatar_url: string | null;
}

/**
 * Ensures a valid session exists in Supabase Auth.
 * Redirects to /login if unauthenticated.
 */
export async function requireUser(): Promise<{ user: { id: string; email?: string } }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    // When Supabase is not configured yet, redirect to login
    redirect("/login");
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  return { user };
}

/**
 * Ensures user has an active profile.
 * Redirects to /suspended if suspended.
 */
export async function requireActiveUser(): Promise<{ user: { id: string; email?: string }; profile: AuthenticatedProfile }> {
  const { user } = await requireUser();
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, status, college_id, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login?error=profile_not_found");
  }

  if (profile.status === "suspended") {
    redirect("/login?error=account_suspended");
  }

  return { user, profile: profile as AuthenticatedProfile };
}

/**
 * Authorizes student role only.
 */
export async function requireStudent(): Promise<AuthenticatedProfile> {
  const { profile } = await requireActiveUser();
  if (profile.role !== "student") {
    redirect(profile.role === "admin" ? "/admin" : "/ambassador");
  }
  return profile;
}

/**
 * Authorizes ambassador role (or admin).
 */
export async function requireAmbassador(): Promise<AuthenticatedProfile> {
  const { profile } = await requireActiveUser();
  if (profile.role !== "ambassador" && profile.role !== "admin") {
    redirect("/dashboard");
  }
  return profile;
}

/**
 * Authorizes admin role strictly.
 */
export async function requireAdmin(): Promise<AuthenticatedProfile> {
  const { profile } = await requireActiveUser();
  if (profile.role !== "admin") {
    redirect(profile.role === "ambassador" ? "/ambassador" : "/dashboard");
  }
  return profile;
}

/**
 * Authorizes admin role with MFA / AAL2 assurance check.
 */
export async function requireAdminMFA(): Promise<AuthenticatedProfile> {
  const profile = await requireAdmin();
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const [{ data: assurance }, { data: factors }] = await Promise.all([
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      supabase.auth.mfa.listFactors(),
    ]);
    const hasVerifiedFactor = factors?.totp?.some((factor) => factor.status === "verified") ?? false;

    // Enforce AAL2 only when this admin has actually enrolled a verified
    // authenticator. Accounts without a factor must not be trapped in a
    // challenge redirect they cannot complete.
    if (hasVerifiedFactor && assurance?.currentLevel !== "aal2" && assurance?.nextLevel === "aal2") {
      redirect("/admin/mfa-challenge");
    }
  }

  return profile;
}
