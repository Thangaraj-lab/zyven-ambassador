"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useAdminSubmissions,
  useMissions,
  useReviewSubmission,
} from "@/lib/data/hooks";
import { StatusBadge, type MissionState } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Search, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const router = useRouter();
  const { data: submissions = [] } = useAdminSubmissions();
  const { data: missions = [] } = useMissions();
  const { mutateAsync: reviewSubmission } = useReviewSubmission();

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkApproving, setIsBulkApproving] = useState(false);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (stateFilter !== "ALL" && sub.state !== stateFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const urlMatch = sub.proofUrl?.toLowerCase().includes(q);
        const idMatch = sub.id.toLowerCase().includes(q);
        if (!urlMatch && !idMatch) return false;
      }
      return true;
    });
  }, [submissions, stateFilter, search]);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredSubmissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubmissions.map((s) => s.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkApproving(true);
    try {
      for (const id of Array.from(selectedIds)) {
        await reviewSubmission({
          submissionId: id,
          decision: "approve",
          reason: "Bulk verified by admin",
        });
      }
      toast.success(`Successfully approved ${selectedIds.size} submissions!`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Failed to approve selected submissions");
    } finally {
      setIsBulkApproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Verification Queue
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Submissions Review
          </h1>
        </div>

        {selectedIds.size > 0 && (
          <Button
            variant="primary"
            size="md"
            onClick={handleBulkApprove}
            isLoading={isBulkApproving}
            className="gap-2 font-bold shadow-soft-sm"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Approve Selected ({selectedIds.size})</span>
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proof URL or ID..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStateFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  stateFilter === st
                    ? "brand-gradient-bg text-white"
                    : "bg-surface-2 text-text-muted hover:text-text border border-border"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-[24px] bg-surface border border-border shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 border-b border-border text-text-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.size > 0 &&
                      selectedIds.size === filteredSubmissions.length
                    }
                    onChange={handleSelectAll}
                    className="rounded text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="p-4">Mission</th>
                <th className="p-4">Ambassador ID</th>
                <th className="p-4">Proof Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-text-muted text-xs"
                  >
                    No submissions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const mission = missions.find((m) => m.id === sub.missionId);
                  const isSelected = selectedIds.has(sub.id);

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => router.push(`/admin/reviews/${sub.id}`)}
                      className={`hover:bg-surface-2/60 transition-colors cursor-pointer ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onClick={(e) => toggleSelect(sub.id, e)}
                          onChange={() => {}}
                          className="rounded text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>

                      <td className="p-4 font-bold text-text">
                        <span className="block truncate max-w-xs">
                          {mission?.title || sub.missionId}
                        </span>
                        <span className="text-[10px] text-text-muted font-normal">
                          +{mission?.points || 50} pts
                        </span>
                      </td>

                      <td className="p-4 font-mono text-text-muted">
                        {sub.ambassadorId}
                      </td>

                      <td className="p-4 text-text-muted max-w-xs truncate">
                        {sub.proofUrl ? (
                          <span className="truncate block">{sub.proofUrl}</span>
                        ) : sub.screenshotDataUrl ? (
                          <span className="text-primary font-semibold">
                            Screenshot attached
                          </span>
                        ) : (
                          "Text note"
                        )}
                      </td>

                      <td className="p-4">
                        <StatusBadge
                          state={sub.state as MissionState}
                          size="sm"
                        />
                      </td>

                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 text-primary font-bold hover:underline">
                          <span>Review</span>
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
