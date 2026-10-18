"use client";

import React, { useState } from "react";
import { useMissions, useMySubmissions } from "@/lib/data/hooks";
import { MissionCard } from "@/components/ui/MissionCard";
import { type MissionState } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sparkles, Filter } from "lucide-react";
import { useTranslations } from "next-intl";

type FilterType = "all" | "available" | "in_review" | "completed" | "coming_soon";

export default function MissionsListPage() {
  const t = useTranslations("missions");
  const { data: missions = [] } = useMissions();
  const { data: submissions = [] } = useMySubmissions();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const getMissionState = (missionId: string, missionStatus: string): MissionState => {
    if (missionStatus === "coming_soon") return "LOCKED";
    const sub = submissions.find((s) => s.missionId === missionId);
    if (!sub) return "AVAILABLE";
    if (sub.state === "APPROVED") return "APPROVED";
    if (sub.state === "REJECTED") return "REJECTED";
    if (sub.state === "SUBMITTED" || sub.state === "UNDER_REVIEW") return "UNDER_REVIEW";
    if (sub.state === "STARTED") return "STARTED";
    return "AVAILABLE";
  };

  const filteredMissions = missions.filter((mission) => {
    const state = getMissionState(mission.id, mission.status);

    if (activeFilter === "all") return true;
    if (activeFilter === "available") return state === "AVAILABLE" || state === "STARTED";
    if (activeFilter === "in_review") return state === "UNDER_REVIEW";
    if (activeFilter === "completed") return state === "APPROVED";
    if (activeFilter === "coming_soon") return state === "LOCKED";
    return true;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: t("filters.all") },
    { key: "available", label: t("filters.available") },
    { key: "in_review", label: t("filters.inReview") },
    { key: "completed", label: t("filters.completed") },
    { key: "coming_soon", label: t("filters.comingSoon") },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>{t("title")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-border">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === f.key
                  ? "brand-gradient-bg text-white shadow-soft-sm"
                  : "text-text-muted hover:text-text hover:bg-surface-2"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Missions Grid */}
      {filteredMissions.length === 0 ? (
        <EmptyState
          icon={<Filter className="h-6 w-6" />}
          title="No missions found"
          description="There are currently no tasks matching this filter. Switch back to 'All' to view all campus opportunities."
          actionLabel="Show All Missions"
          onAction={() => setActiveFilter("all")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredMissions.map((mission) => {
            const state = getMissionState(mission.id, mission.status);
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                state={state}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
