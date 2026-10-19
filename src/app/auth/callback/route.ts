import { getSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, status, full_name")
            .eq("id", user.id)
            .maybeSingle();

          // New profiles are created by the auth.users database trigger. Never
          // accept a role from the URL: query parameters are public input.
          if (!profile) {
            return NextResponse.redirect(
              `${origin}/login?error=${encodeURIComponent(
                profileError?.message || "profile_not_ready"
              )}`
            );
          }

          if (profile?.status === "suspended") {
            return NextResponse.redirect(`${origin}/login?error=account_suspended`);
          }

          if (profile?.role === "admin") {
            return NextResponse.redirect(`${origin}/admin`);
          } else if (profile?.role === "ambassador") {
            return NextResponse.redirect(`${origin}/ambassador`);
          }

          const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
          return NextResponse.redirect(`${origin}${safeNext}`);
        }
      }
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}${next}`);
}
