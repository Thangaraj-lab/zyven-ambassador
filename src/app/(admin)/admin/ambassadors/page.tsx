"use client";

import React, { useState } from "react";
import { useAdminAmbassadors } from "@/lib/data/hooks";
import { mockRepository } from "@/lib/data/mock/mockRepository";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Search, X, Zap } from "lucide-react";
import { toast } from "sonner";
import type { User, AmbassadorProfile } from "@/lib/data/types";

export default function AdminAmbassadorsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAmbassador, setSelectedAmbassador] = useState<{
    user: User;
    profile: AmbassadorProfile;
    totalPoints: number;
  } | null>(null);

  const { data: ambassadors = [], refetch } = useAdminAmbassadors({
    status: statusFilter === "all" ? undefined : statusFilter,
    search: search || undefined,
  });

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "active" ? "suspended" : "active";
      await mockRepository.setAmbassadorStatus(userId, nextStatus);
      toast.success(
        `Ambassador ${nextStatus === "active" ? "reactivated" : "suspended"}`
      );
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Ambassador Management
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or college..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "active", "pending", "suspended"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors capitalize cursor-pointer ${
                statusFilter === st
                  ? "brand-gradient-bg text-white"
                  : "bg-surface-2 text-text-muted hover:text-text border border-border"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ambassadors Table */}
      <div className="rounded-[24px] bg-surface border border-border shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 border-b border-border text-text-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Ambassador</th>
                <th className="p-4">College</th>
                <th className="p-4">Cohort</th>
                <th className="p-4">Points</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {ambassadors.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-text-muted text-xs"
                  >
                    No ambassadors found.
                  </td>
                </tr>
              ) : (
                ambassadors.map((item) => (
                  <tr
                    key={item.user.id}
                    className="hover:bg-surface-2/60 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={item.user.name}
                          src={item.user.avatarUrl}
                          size="sm"
                        />
                        <div>
                          <span className="font-bold text-text block">
                            {item.user.name}
                          </span>
                          <span className="text-[11px] text-text-muted">
                            {item.user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-text block">
                        {item.profile.college}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {item.profile.department} ({item.profile.year})
                      </span>
                    </td>

                    <td className="p-4 font-mono text-text font-bold">
                      #{item.profile.cohortNumber}
                    </td>

                    <td className="p-4 font-bold text-text tabular-nums">
                      {item.totalPoints.toLocaleString()} pts
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.profile.status === "active"
                            ? "bg-success/10 text-success border border-success/30"
                            : item.profile.status === "pending"
                            ? "bg-warning/10 text-warning border border-warning/30"
                            : "bg-danger/10 text-danger border border-danger/30"
                        }`}
                      >
                        {item.profile.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedAmbassador(item)}
                        >
                          View Profile
                        </Button>
                        <Button
                          variant={
                            item.profile.status === "active"
                              ? "outline"
                              : "primary"
                          }
                          size="sm"
                          onClick={() =>
                            handleStatusToggle(item.user.id, item.profile.status)
                          }
                        >
                          {item.profile.status === "active"
                            ? "Suspend"
                            : "Activate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Details Drawer */}
      {selectedAmbassador && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-surface border-l border-border p-6 shadow-soft-lg overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-bold text-base text-text">
                Ambassador Profile
              </h3>
              <button
                onClick={() => setSelectedAmbassador(null)}
                className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:text-text cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Avatar
                name={selectedAmbassador.user.name}
                src={selectedAmbassador.user.avatarUrl}
                size="lg"
              />
              <div>
                <h4 className="text-base font-extrabold text-text">
                  {selectedAmbassador.user.name}
                </h4>
                <p className="text-xs text-text-muted">
                  Cohort #{selectedAmbassador.profile.cohortNumber}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-2 border border-border">
                <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                  Total Points
                </span>
                <span className="text-xl font-black text-text tabular-nums flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" />
                  {selectedAmbassador.totalPoints} Points
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">
                    College
                  </span>
                  <span className="font-semibold text-text">
                    {selectedAmbassador.profile.college}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">
                    Department & Year
                  </span>
                  <span className="font-semibold text-text">
                    {selectedAmbassador.profile.department} (
                    {selectedAmbassador.profile.year})
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">
                    Why they joined
                  </span>
                  <p className="text-text-muted mt-0.5 leading-relaxed bg-surface-2 p-3 rounded-xl border border-border">
                    {selectedAmbassador.profile.whyJoin}
                  </p>
                </div>

                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold mb-1">
                    Areas of Interest
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAmbassador.profile.interests.map((i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
