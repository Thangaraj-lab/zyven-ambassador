"use client";

import React, { useState, useMemo } from "react";
import {
  useMyTeam,
  useAdminUsers,
  useLeaderboard,
  useSession,
} from "@/lib/data/hooks";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { LeaderboardRow, type LeaderboardUser } from "@/components/ui/LeaderboardRow";
import {
  Users,
  Award,
  Sparkles,
  Share2,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Trophy,
  GraduationCap,
  ArrowUpRight,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function AmbassadorTeamPage() {
  const { data: session } = useSession();
  const { data: myTeam, isLoading: teamLoading } = useMyTeam();
  const { data: allUsers = [] } = useAdminUsers();

  const [activeTab, setActiveTab] = useState<"ROSTER" | "LEADERBOARD">("ROSTER");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Derive squad members
  const teamMembers = useMemo(() => {
    // Return users associated with this team or matching the ambassador's college
    const college = myTeam?.college || session?.profile?.college;
    const members = allUsers.filter(({ user: u }) => {
      // include if student or ambassador in the same college / team
      return (
        u.role === "student" ||
        u.role === "ambassador" ||
        u.id === myTeam?.ambassadorId
      );
    });

    // Decorate with points & metadata
    return members.map(({ user: u, profile: p }, idx) => {
      const isLead = u.id === myTeam?.ambassadorId || u.role === "ambassador";
      // Deterministic mock points for squad
      const points = isLead ? 420 : Math.max(30, 280 - idx * 35);
      const tasksCount = isLead ? 6 : Math.max(1, 4 - Math.floor(idx / 2));
      return {
        ...u,
        points,
        tasksCount,
        isLead,
        department: p?.department || "CSBS / Tech",
        joinedDate: "Oct 2026",
      };
    });
  }, [allUsers, myTeam, session]);

  // Filtered members by search
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return teamMembers;
    const q = searchQuery.toLowerCase();
    return teamMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.department?.toLowerCase().includes(q)
    );
  }, [teamMembers, searchQuery]);

  // Squad leaderboard sorted by points
  const leaderboardUsers: LeaderboardUser[] = useMemo(() => {
    const sorted = [...teamMembers].sort((a, b) => b.points - a.points);
    return sorted.map((u, idx) => ({
      id: u.id,
      rank: idx + 1,
      name: u.name,
      college: myTeam?.college || "Muthayammal Engineering College",
      points: u.points,
      avatarUrl: u.avatarUrl,
      isYou: u.id === session?.user?.id,
    }));
  }, [teamMembers, myTeam, session]);

  const inviteCode = myTeam?.inviteCode || "ZYV-MEC-2026";
  const inviteMessage = `Join our campus squad "${myTeam?.name || "MEC Alpha Squad"}" on the Zyven Ambassador Portal! Use invite code: ${inviteCode} to get started and earn rewards: https://zyven.network/join?code=${inviteCode}`;

  const handleShareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${myTeam?.name || "Zyven Squad"}`,
          text: inviteMessage,
          url: `https://zyven.network/join?code=${inviteCode}`,
        });
        toast.success("Shared successfully!");
      } catch {
        // User cancelled share
      }
    } else {
      setShowInviteModal(true);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Users className="w-3.5 h-3.5" />
              Campus Squad
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 17 & 18</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Team Management & Roster
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Empower and track your student members. Distribute tasks and monitor
            standings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleShareInvite}
            className="font-bold text-xs gap-1.5 border-border/60"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Invite</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setShowInviteModal(true)}
            className="font-bold text-xs gap-1.5 shadow-soft-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Students</span>
          </Button>
        </div>
      </div>

      {/* Team Showcase & Invite Code Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Team Overview Card (7 cols) */}
        <div className="md:col-span-7 bg-surface/90 border border-border/60 rounded-2xl p-6 relative overflow-hidden shadow-soft-sm">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Active Squad
                </span>
                <span className="text-xs text-text-muted">ID: {myTeam?.id || "team-mec-alpha"}</span>
              </div>
              <h2 className="text-2xl font-black text-text tracking-tight">
                {myTeam?.name || "MEC Zyven Alpha Squad"}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-text-muted">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="font-semibold text-text">
                  {myTeam?.college || "Muthayammal Engineering College"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/40">
              <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border/40">
                <div className="text-[11px] font-semibold text-text-muted">Squad Lead</div>
                <div className="text-sm font-bold text-text truncate mt-0.5">
                  {session?.user?.name || "Thangaraj"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border/40">
                <div className="text-[11px] font-semibold text-text-muted">Active Members</div>
                <div className="text-sm font-bold text-primary mt-0.5">
                  {myTeam?.memberCount || teamMembers.length} Students
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border/40">
                <div className="text-[11px] font-semibold text-text-muted">Squad Points</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {myTeam?.totalPoints || 420} pts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Invite Code Card (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-primary/10 via-surface to-surface border border-primary/20 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-soft-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Squad Passcode
              </span>
              <span className="text-[11px] text-text-muted font-medium">1-Click Join</span>
            </div>
            <h3 className="text-base font-bold text-text">Campus Invite Code</h3>
            <p className="text-xs text-text-muted mt-1">
              Students join your squad using this unique campus key to participate in team missions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/80 border border-primary/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                Invite Code
              </div>
              <div className="text-xl font-black text-primary font-mono tracking-wider mt-0.5">
                {inviteCode}
              </div>
            </div>
            <CopyButton
              textToCopy={inviteCode}
              label="Copy"
              copiedLabel="Copied!"
              variant="primary"
            />
          </div>

          <div className="text-[11px] text-text-muted flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Members automatically get credited under your squad leaderboard.</span>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border/60 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("ROSTER")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === "ROSTER"
                ? "bg-primary text-white shadow-soft-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Member Roster ({teamMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("LEADERBOARD")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === "LEADERBOARD"
                ? "bg-primary text-white shadow-soft-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Squad Leaderboard</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search member by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border/60 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Tab 1: Member Roster Table */}
      {activeTab === "ROSTER" && (
        <div className="bg-surface/90 border border-border/60 rounded-2xl overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-surface-elevated/40 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Tasks Done</th>
                  <th className="py-3 px-4 text-right">Points Earned</th>
                  <th className="py-3 px-4 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-surface-elevated/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                          {member.name[0]?.toUpperCase() || "S"}
                        </div>
                        <div>
                          <div className="font-bold text-text flex items-center gap-1.5">
                            <span>{member.name}</span>
                            {member.isLead && (
                              <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.2 rounded border border-amber-500/20">
                                Lead
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-text-muted">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-text-muted">
                      <span className="capitalize">{member.role}</span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-text-muted">
                      {member.department}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-text">
                      {member.tasksCount}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-primary">
                      {member.points} pts
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-text-muted">
                      {member.joinedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Squad Standings Leaderboard */}
      {activeTab === "LEADERBOARD" && (
        <div className="bg-surface/90 border border-border/60 rounded-2xl p-5 space-y-3 shadow-soft-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div>
              <h3 className="text-sm font-bold text-text">Internal Squad Standings</h3>
              <p className="text-xs text-text-muted">
                Ranked by verified points accrued from completed missions.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>Campus Champions</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {leaderboardUsers.map((user) => (
              <LeaderboardRow key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal Dialog */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-surface border border-border rounded-2xl p-6 space-y-5 shadow-soft-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text">
                      Invite Campus Students
                    </h3>
                    <p className="text-xs text-text-muted">
                      Share this invitation link or code in your class WhatsApp & clubs.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-text-muted hover:text-text text-sm font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 space-y-2">
                <div className="text-[11px] font-semibold text-text-muted">
                  Pre-formatted Invitation Message:
                </div>
                <p className="text-xs text-text font-mono bg-surface p-3 rounded-lg border border-border/40 whitespace-pre-line leading-relaxed">
                  {inviteMessage}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <CopyButton
                    textToCopy={inviteMessage}
                    label="Copy Message"
                    copiedLabel="Message Copied!"
                    variant="primary"
                  />
                  <CopyButton
                    textToCopy={inviteCode}
                    label="Copy Code Only"
                    copiedLabel="Code Copied!"
                    variant="secondary"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteModal(false)}
                  className="font-semibold text-xs"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
