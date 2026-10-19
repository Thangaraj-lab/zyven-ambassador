"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, useMyTeam, useMyPoints } from "@/lib/data/hooks";
import { getRepository } from "@/lib/data/repository";
import { Button } from "@/components/ui/Button";
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ShieldCheck,
  Award,
  LogOut,
  Building,
  CheckCircle2,
  ExternalLink,
  Settings,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function AmbassadorProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: myTeam } = useMyTeam();
  const { data: pointsData } = useMyPoints();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profile = session?.profile;
  const user = session?.user;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const repo = await getRepository();
      await repo.logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ambassador Credentials
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 20</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Ambassador Profile
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage your campus ambassador identity, squad assignment, and account
            security.
          </p>
        </div>

        <Button
          variant="ghost"
          size="md"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="font-bold text-xs gap-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 self-start sm:self-auto border border-rose-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* Main Ambassador Card */}
      <div className="bg-surface/90 border border-border/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-soft-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent text-white font-black text-2xl flex items-center justify-center shadow-soft-md shrink-0">
              {user?.name?.[0] || "T"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-text">
                  {user?.name || "Ambassador"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  Campus Lead
                </span>
              </div>
              <div className="text-xs sm:text-sm text-text-muted mt-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>{profile?.college || "Muthayammal Engineering College"}</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end justify-between gap-1 bg-surface-elevated/40 sm:bg-transparent p-3 sm:p-0 rounded-xl">
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Cohort Assignment
            </div>
            <div className="text-sm font-black text-primary">
              Cohort #{profile?.cohortNumber || 37}
            </div>
            <div className="text-[11px] text-text-muted">
              Member since {profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString([], { month: "short", year: "numeric" }) : "Oct 2026"}
            </div>
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/40">
            <div className="text-[11px] font-semibold text-text-muted">Total Points</div>
            <div className="text-lg font-black text-amber-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {pointsData?.total || 420} pts
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/40">
            <div className="text-[11px] font-semibold text-text-muted">Squad Name</div>
            <div className="text-sm font-bold text-text truncate mt-1">
              {myTeam?.name || "MEC Alpha"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/40">
            <div className="text-[11px] font-semibold text-text-muted">Squad Members</div>
            <div className="text-lg font-black text-primary mt-1 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {myTeam?.memberCount || 8}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/40">
            <div className="text-[11px] font-semibold text-text-muted">Role Authority</div>
            <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Ambassador
            </div>
          </div>
        </div>

        {/* Campus & Department Details */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Academic & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-elevated/30 border border-border/40 flex items-center gap-3">
              <Mail className="w-4 h-4 text-text-muted shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-text-muted font-semibold">Campus Email</div>
                <div className="font-bold text-text truncate">{user?.email || "thangaraj.mec@zyven.student"}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated/30 border border-border/40 flex items-center gap-3">
              <Phone className="w-4 h-4 text-text-muted shrink-0" />
              <div>
                <div className="text-[10px] text-text-muted font-semibold">Phone Number</div>
                <div className="font-bold text-text">{user?.phone || "+91 98765 43210"}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated/30 border border-border/40 flex items-center gap-3">
              <Building className="w-4 h-4 text-text-muted shrink-0" />
              <div>
                <div className="text-[10px] text-text-muted font-semibold">Department & Year</div>
                <div className="font-bold text-text">
                  {profile?.department || "CSBS"} • {profile?.year || "2nd Year"}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated/30 border border-border/40 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-text-muted shrink-0" />
              <div>
                <div className="text-[10px] text-text-muted font-semibold">Student ID</div>
                <div className="font-bold text-text">{profile?.studentId || "23CB042"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interests & Skills */}
        {profile?.interests && profile.interests.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Focus Areas & Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-surface-elevated/60 text-text border border-border/60"
                >
                  {interest}
                </span>
              ))}
              {profile.skills?.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
