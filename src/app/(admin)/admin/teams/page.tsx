"use client";

import React, { useState, useMemo } from "react";
import { useTeams, useCreateTeam, useAdminAmbassadors } from "@/lib/data/hooks";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  Shield,
  Plus,
  Users,
  Building,
  Sparkles,
  Search,
  CheckCircle2,
  GraduationCap,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import type { Team } from "@/lib/data/types";

export default function AdminTeamsPage() {
  const { data: teams = [], isLoading } = useTeams();
  const { data: ambassadors = [] } = useAdminAmbassadors();
  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [teamName, setTeamName] = useState("");
  const [college, setCollege] = useState("");
  const [ambassadorId, setAmbassadorId] = useState("");

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const q = searchQuery.toLowerCase();
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.college.toLowerCase().includes(q) ||
        t.inviteCode.toLowerCase().includes(q) ||
        t.ambassadorName?.toLowerCase().includes(q)
    );
  }, [teams, searchQuery]);

  const totalMembers = teams.reduce((acc, t) => acc + t.memberCount, 0);
  const totalPoints = teams.reduce((acc, t) => acc + t.totalPoints, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !college.trim()) {
      toast.error("Please fill in team name and college");
      return;
    }

    try {
      await createTeam({
        name: teamName.trim(),
        college: college.trim(),
        ambassadorId: ambassadorId || ambassadors[0]?.user.id || "user-thangaraj",
      });

      toast.success(`Team "${teamName}" chartered successfully!`);
      setShowCreateModal(false);
      setTeamName("");
      setCollege("");
      setAmbassadorId("");
    } catch {
      toast.error("Failed to create squad");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Shield className="w-3.5 h-3.5" />
              Campus Squad Registry
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 25</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Teams & Campus Squads
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Oversee collegiate chapters, charter new campus teams, and inspect
            squad invite codes.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowCreateModal(true)}
          className="font-bold text-xs gap-1.5 shadow-soft-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Charter Campus Squad</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Total Squads</div>
          <div className="text-xl font-black text-text mt-1">{teams.length} Chapters</div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Enrolled Students</div>
          <div className="text-xl font-black text-primary mt-1">
            {totalMembers} Members
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Collective Points</div>
          <div className="text-xl font-black text-amber-400 mt-1 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            {totalPoints} pts
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search teams by name, college, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border/60 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="text-xs font-semibold text-text-muted">
          Showing {filteredTeams.length} campus squads
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="p-5 rounded-2xl bg-surface/90 border border-border/60 space-y-4 shadow-soft-sm hover:border-border transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {team.status}
                </span>
                <span className="text-xs font-mono text-text-muted">
                  {team.id}
                </span>
              </div>

              <h2 className="text-base font-bold text-text">{team.name}</h2>

              <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
                <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{team.college}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border/40 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-text-muted uppercase">
                  Invite Code
                </div>
                <div className="text-sm font-black font-mono text-primary mt-0.5">
                  {team.inviteCode}
                </div>
              </div>
              <CopyButton
                textToCopy={team.inviteCode}
                label="Copy"
                copiedLabel="Copied!"
                variant="secondary"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs text-text-muted">
              <div>
                <span className="font-semibold text-text">
                  {team.memberCount}
                </span>{" "}
                Members
              </div>
              <div className="text-right">
                <span className="font-bold text-amber-400">
                  {team.totalPoints} pts
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charter Squad Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-soft-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text">
                      Charter Campus Squad
                    </h3>
                    <p className="text-xs text-text-muted">
                      Setup a new collegiate chapter with automated invite passcodes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-text-muted hover:text-text text-sm font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Kongu Tech Innovators"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Collegiate Institution
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Kongu Engineering College"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Assigned Ambassador
                  </label>
                  <select
                    value={ambassadorId}
                    onChange={(e) => setAmbassadorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text focus:outline-none focus:border-primary"
                  >
                    <option value="">Select campus ambassador...</option>
                    {ambassadors.map((amb) => (
                      <option key={amb.user.id} value={amb.user.id}>
                        {amb.user.name} ({amb.profile.college})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                    className="font-semibold text-xs text-text-muted hover:text-text"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isCreating}
                    className="font-bold text-xs"
                  >
                    Charter Squad
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
