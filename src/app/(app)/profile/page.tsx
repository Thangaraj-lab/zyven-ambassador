"use client";

import React, { useState } from "react";
import {
  useSession,
  useMyPoints,
  useMyRank,
  useMyTier,
  useMySubmissions,
  useMissions,
} from "@/lib/data/hooks";
import { Avatar } from "@/components/ui/Avatar";
import { TierBadge } from "@/components/ui/TierBadge";
import { Button } from "@/components/ui/Button";
import { mockRepository } from "@/lib/data/mock/mockRepository";
import {
  Building,
  Trophy,
  Zap,
  CheckCircle2,
  Edit,
  X,
  Check,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { BackButton } from "@/components/ui/BackButton";

export default function ProfilePage() {
  const { data: session, refetch: refetchSession } = useSession();
  const { data: pointsData } = useMyPoints();
  const { data: rankData } = useMyRank();
  const { data: tierData } = useMyTier();
  const { data: submissions = [] } = useMySubmissions();
  const { data: missions = [] } = useMissions();

  const [activeTab, setActiveTab] = useState<
    "about" | "missions" | "ledger"
  >("about");
  const [isEditing, setIsEditing] = useState(false);

  // Edit states
  const user = session?.user;
  const profile = session?.profile;

  const [department, setDepartment] = useState(profile?.department || "");
  const [city, setCity] = useState(profile?.city || "");
  const [whyJoin, setWhyJoin] = useState(profile?.whyJoin || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = () => {
    setDepartment(profile?.department || "");
    setCity(profile?.city || "");
    setWhyJoin(profile?.whyJoin || "");
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await mockRepository.updateProfile({
        department,
        city,
        whyJoin,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      refetchSession();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const completedSubmissions = submissions.filter(
    (s) => s.state === "APPROVED"
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Universal Back Navigation */}
      <div>
        <BackButton fallbackHref="/dashboard" label="Back to Dashboard" />
      </div>

      {/* Cover Gradient & Header Card */}
      <div className="rounded-[28px] overflow-hidden bg-surface border border-border shadow-soft-sm">
        {/* Decorative Cover Gradient */}
        <div className="h-32 sm:h-40 brand-gradient-bg relative" />

        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar floating over banner */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-4">
            <div className="relative">
              <Avatar
                name={user?.name || "Ambassador"}
                src={user?.avatarUrl}
                size="xl"
                className="ring-4 ring-surface"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenEdit}
              className="gap-1.5 self-start sm:self-auto"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Button>
          </div>

          {/* User Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-text">{user?.name}</h1>
              <TierBadge tier={tierData?.currentTier ?? "bronze"} size="sm" />
            </div>
            <p className="text-xs sm:text-sm text-text-muted">
              Student Ambassador • Founding Ambassador #{profile?.cohortNumber || 37}
            </p>
            <p className="text-xs text-text-muted flex items-center gap-1.5 pt-1">
              <Building className="h-3.5 w-3.5 text-primary" />
              <span>{profile?.college}</span>
            </p>
          </div>

          {/* 4 Stats Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-border">
            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Points
              </span>
              <span className="text-lg font-black text-text tabular-nums flex items-center gap-1">
                <Zap className="h-4 w-4 text-primary" />
                {pointsData?.total ?? 0}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Campus Rank
              </span>
              <span className="text-lg font-black text-text tabular-nums flex items-center gap-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                #{rankData?.rank ?? 24}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Completed
              </span>
              <span className="text-lg font-black text-text tabular-nums flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {completedSubmissions.length}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Tier
              </span>
              <span className="text-sm font-black capitalize text-text block pt-1">
                {tierData?.currentTier ?? "Bronze"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-surface border border-border max-w-sm">
        <button
          onClick={() => setActiveTab("about")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "about"
              ? "brand-gradient-bg text-white shadow-soft-sm"
              : "text-text-muted hover:text-text"
          }`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab("missions")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "missions"
              ? "brand-gradient-bg text-white shadow-soft-sm"
              : "text-text-muted hover:text-text"
          }`}
        >
          Completed ({completedSubmissions.length})
        </button>
        <button
          onClick={() => setActiveTab("ledger")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ledger"
              ? "brand-gradient-bg text-white shadow-soft-sm"
              : "text-text-muted hover:text-text"
          }`}
        >
          Points History
        </button>
      </div>

      {/* Tab 1: About */}
      {activeTab === "about" && (
        <div className="p-6 rounded-[24px] bg-surface border border-border shadow-soft-sm space-y-5">
          <h3 className="text-base font-extrabold text-text">
            Academic & Ambassador Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-text-muted font-bold block text-[10px] uppercase">
                Department
              </span>
              <span className="font-semibold text-text">
                {profile?.department}
              </span>
            </div>

            <div>
              <span className="text-text-muted font-bold block text-[10px] uppercase">
                Year of Study
              </span>
              <span className="font-semibold text-text">{profile?.year}</span>
            </div>

            <div>
              <span className="text-text-muted font-bold block text-[10px] uppercase">
                Location
              </span>
              <span className="font-semibold text-text">{profile?.city}</span>
            </div>

            <div>
              <span className="text-text-muted font-bold block text-[10px] uppercase">
                Student ID
              </span>
              <span className="font-semibold text-text">
                {profile?.studentId || "Verified"}
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-3 border-t border-border">
            <span className="text-text-muted font-bold block text-[10px] uppercase">
              Why I Joined Zyven
            </span>
            <p className="text-xs text-text leading-relaxed bg-surface-2 p-3.5 rounded-xl border border-border">
              {profile?.whyJoin}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-text-muted font-bold block text-[10px] uppercase">
              Areas of Interest
            </span>
            <div className="flex flex-wrap gap-2">
              {profile?.interests?.map((i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Completed Missions */}
      {activeTab === "missions" && (
        <div className="space-y-3">
          {completedSubmissions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface border border-border text-center text-xs text-text-muted">
              No completed missions yet. Pick a live task from the Missions page!
            </div>
          ) : (
            completedSubmissions.map((sub) => {
              const mission = missions.find((m) => m.id === sub.missionId);
              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-surface border border-border shadow-soft-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-success/10 text-success flex items-center justify-center">
                      <Check className="h-5 w-5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text">
                        {mission?.title || "Mission"}
                      </h4>
                      <span className="text-xs text-text-muted">
                        Verified by Admin
                      </span>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-success tabular-nums">
                    +{mission?.points || 50} pts
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Points History (The Ledger) */}
      {activeTab === "ledger" && (
        <div className="p-6 rounded-[24px] bg-surface border border-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-text">
              Transparent Ledger History
            </h3>
            <span className="text-xs text-text-muted">
              {pointsData?.transactions.length || 0} transaction(s)
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {(!pointsData?.transactions ||
              pointsData.transactions.length === 0) ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No ledger transactions recorded yet. Complete missions to begin!
              </div>
            ) : (
              pointsData.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h5 className="text-xs font-bold text-text">{tx.reason}</h5>
                    <span className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span className="text-sm font-black text-success tabular-nums shrink-0">
                    +{tx.points} pts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Drawer / Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] bg-surface p-6 sm:p-8 border border-border shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-extrabold text-base text-text">
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:text-text cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-text mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">
                  Ambassador Motivation
                </label>
                <textarea
                  rows={3}
                  value={whyJoin}
                  onChange={(e) => setWhyJoin(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
