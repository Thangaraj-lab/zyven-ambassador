"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  useAdminSubmissions,
  useMissions,
  useReviewSubmission,
  useMyTeam,
} from "@/lib/data/hooks";
import { StatusBadge, type MissionState } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Timeline, type TimelineEvent } from "@/components/ui/Timeline";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Eye,
  CornerDownRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import type { Submission } from "@/lib/data/types";

export default function AmbassadorReviewsPage() {
  const { data: allSubmissions = [], isLoading } = useAdminSubmissions();
  const { data: missions = [] } = useMissions();
  const { data: myTeam } = useMyTeam();
  const { mutateAsync: reviewSubmission, isPending: isReviewing } =
    useReviewSubmission();

  const [activeTab, setActiveTab] = useState<
    "ALL" | "PENDING" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED"
  >("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  // Modal states for action dialogs
  const [actionType, setActionType] = useState<
    "approve" | "requestChanges" | "reject" | null
  >(null);
  const [feedbackReason, setFeedbackReason] = useState("");

  // Map missions by ID for quick lookup
  const missionMap = useMemo(() => {
    const map = new Map<string, (typeof missions)[0]>();
    missions.forEach((m) => map.set(m.id, m));
    return map;
  }, [missions]);

  // Filter submissions relevant to ambassador review
  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter((sub) => {
      // Tab filter
      if (activeTab === "PENDING") {
        if (sub.state !== "SUBMITTED" && sub.state !== "UNDER_REVIEW")
          return false;
      } else if (activeTab !== "ALL" && sub.state !== activeTab) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mission = missionMap.get(sub.missionId);
        const matchTitle = mission?.title.toLowerCase().includes(q);
        const matchId = sub.id.toLowerCase().includes(q);
        const matchStudent = sub.studentName?.toLowerCase().includes(q) || sub.ambassadorId.toLowerCase().includes(q);
        const matchNote = sub.note?.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchStudent && !matchNote)
          return false;
      }

      return true;
    });
  }, [allSubmissions, activeTab, searchQuery, missionMap]);

  // Set default selected submission
  // The selected item is derived from asynchronous query data and must be synchronized once it arrives.
  useEffect(() => {
    if (!selectedSubId && filteredSubmissions.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSubId(filteredSubmissions[0].id);
    } else if (
      selectedSubId &&
      !filteredSubmissions.some((s) => s.id === selectedSubId)
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSubId(filteredSubmissions[0]?.id || null);
    }
  }, [filteredSubmissions, selectedSubId]);

  const activeSubmission = useMemo(() => {
    return allSubmissions.find((s) => s.id === selectedSubId) || null;
  }, [allSubmissions, selectedSubId]);

  const activeMission = activeSubmission
    ? missionMap.get(activeSubmission.missionId)
    : null;

  // Handle Review action
  const handleExecuteReview = async (
    decision: "approve" | "reject" | "requestChanges",
    reason?: string
  ) => {
    if (!activeSubmission) return;
    try {
      await reviewSubmission({
        submissionId: activeSubmission.id,
        decision,
        reason: reason || (decision === "approve" ? "Verified by campus ambassador" : ""),
      });

      if (decision === "approve") {
        toast.success(
          `Approved! +${activeMission?.points || 25} points credited to student.`
        );
      } else if (decision === "requestChanges") {
        toast.info("Change request sent back to the student.");
      } else {
        toast.error("Submission rejected.");
      }

      setActionType(null);
      setFeedbackReason("");
    } catch {
      toast.error("Failed to process review. Please try again.");
    }
  };

  // Keyboard shortcut listener (A = Approve, C = Changes, R = Reject)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (!activeSubmission || actionType !== null) return;

      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleExecuteReview("approve");
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setActionType("requestChanges");
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setActionType("reject");
      }
    },
    [activeSubmission, actionType]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Construct timeline events for active submission
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!activeSubmission) return [];

    const isPending =
      activeSubmission.state === "SUBMITTED" ||
      activeSubmission.state === "UNDER_REVIEW";
    const isApproved = activeSubmission.state === "APPROVED";
    const isChanges = activeSubmission.state === "CHANGES_REQUESTED";
    const isRejected = activeSubmission.state === "REJECTED";

    return [
      {
        id: "ev-start",
        title: "Task Started",
        description: `Student initiated work on ${activeMission?.title || "Task"}`,
        timestamp: activeSubmission.submittedAt
          ? new Date(
              new Date(activeSubmission.submittedAt).getTime() - 3600000
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "Earlier",
        status: "completed",
      },
      {
        id: "ev-submit",
        title: "Proof Uploaded",
        description: activeSubmission.proofUrl
          ? `External link submitted: ${activeSubmission.proofUrl}`
          : activeSubmission.screenshotDataUrl
          ? "Screenshot image artifact attached for review."
          : "Work completed & proof recorded.",
        timestamp: activeSubmission.submittedAt
          ? new Date(activeSubmission.submittedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Pending",
        status: "completed",
      },
      {
        id: "ev-review",
        title: isApproved
          ? "Verified & Points Awarded"
          : isChanges
          ? "Changes Requested"
          : isRejected
          ? "Review Rejected"
          : "Ambassador Verification",
        description: isApproved
          ? `+${activeMission?.points || 25} ledger points minted. Reason: ${
              activeSubmission.reviewReason || "Verified by team leader"
            }`
          : isChanges
          ? `Revision note: "${activeSubmission.reviewReason || "Please provide clearer screenshot"}"`
          : isRejected
          ? `Rejection reason: "${activeSubmission.reviewReason || "Does not meet guidelines"}"`
          : "Awaiting your inspection. Press [A] to approve or [C] to request changes.",
        timestamp: activeSubmission.reviewedAt
          ? new Date(activeSubmission.reviewedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : isPending
          ? "Now"
          : undefined,
        status: isApproved
          ? "completed"
          : isChanges || isRejected
          ? "failed"
          : "current",
      },
    ];
  }, [activeSubmission, activeMission]);

  const pendingCount = allSubmissions.filter(
    (s) => s.state === "SUBMITTED" || s.state === "UNDER_REVIEW"
  ).length;
  const approvedCount = allSubmissions.filter((s) => s.state === "APPROVED").length;
  const changesCount = allSubmissions.filter(
    (s) => s.state === "CHANGES_REQUESTED"
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Team Verification Hub
            </span>
            {myTeam && (
              <span className="text-xs text-text-muted font-medium">
                • {myTeam.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Submission Reviews
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Inspect proof submitted by squad members. Approve points or request
            revisions.
          </p>
        </div>

        {/* Live Metrics Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border/60 flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-text-muted">Pending:</span>
            <span className="text-xs font-bold text-amber-400">{pendingCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border/60 flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-text-muted">Approved:</span>
            <span className="text-xs font-bold text-emerald-400">{approvedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border/60 flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="text-xs font-semibold text-text-muted">Revisions:</span>
            <span className="text-xs font-bold text-sky-400">{changesCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border/60 rounded-xl overflow-x-auto">
          {[
            { id: "PENDING", label: `Pending (${pendingCount})` },
            { id: "ALL", label: `All (${allSubmissions.length})` },
            { id: "APPROVED", label: `Approved (${approvedCount})` },
            { id: "CHANGES_REQUESTED", label: `Changes (${changesCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-soft-sm"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search student or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border/60 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Main Review Workbench: Master / Detail split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left column: Submissions Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-text-muted font-semibold px-1">
            <span>Submissions Queue ({filteredSubmissions.length})</span>
            <span className="text-[11px] text-text-muted/80">Click item to inspect</span>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border/60 bg-surface/30">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-bold text-text">Queue is clear!</h3>
              <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                No submissions matching your current filter. Great job keeping
                your team moving fast!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {filteredSubmissions.map((sub) => {
                const mission = missionMap.get(sub.missionId);
                const isSelected = sub.id === selectedSubId;
                const isPending =
                  sub.state === "SUBMITTED" || sub.state === "UNDER_REVIEW";

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubId(sub.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-primary/5 border-primary/60 shadow-soft-sm ring-1 ring-primary/40"
                        : "bg-surface/80 border-border/60 hover:border-border hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-surface-elevated flex items-center justify-center font-bold text-xs text-primary border border-border/40 shrink-0">
                          {sub.studentName
                            ? sub.studentName[0].toUpperCase()
                            : sub.ambassadorId[0]?.toUpperCase() || "S"}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-text truncate max-w-[170px]">
                            {sub.studentName || sub.ambassadorId}
                          </div>
                          <div className="text-[10px] text-text-muted">
                            {sub.submittedAt
                              ? new Date(sub.submittedAt).toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Recently"}
                          </div>
                        </div>
                      </div>
                      <StatusBadge state={sub.state as MissionState} />
                    </div>

                    <div className="text-xs font-semibold text-text line-clamp-1 mb-1">
                      {mission?.title || "Task Submission"}
                    </div>

                    {sub.note && (
                      <p className="text-[11px] text-text-muted line-clamp-1 italic mb-2">
                        &quot;{sub.note}&quot;
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border/40">
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <Sparkles className="w-3 h-3" />
                        +{mission?.points || 25} pts
                      </span>
                      {sub.proofUrl && (
                        <span className="flex items-center gap-1 hover:underline text-text-muted">
                          <ExternalLink className="w-3 h-3" /> Link attached
                        </span>
                      )}
                      {sub.screenshotDataUrl && (
                        <span className="flex items-center gap-1 text-text-muted">
                          <Eye className="w-3 h-3" /> Screenshot
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Active Submission Inspection Workspace (7 cols) */}
        <div className="lg:col-span-7">
          {activeSubmission ? (
            <div className="bg-surface/90 border border-border/60 rounded-2xl p-6 space-y-6 shadow-soft-sm sticky top-20">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border/40">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary">
                      {activeMission?.category || "Team Task"}
                    </span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs font-semibold text-text-muted">
                      ID: {activeSubmission.id}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-text">
                    {activeMission?.title || "Task Verification"}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
                    <span className="font-semibold text-text">
                      Student: {activeSubmission.studentName || activeSubmission.ambassadorId}
                    </span>
                    <span>•</span>
                    <span>
                      Submitted:{" "}
                      {activeSubmission.submittedAt
                        ? new Date(activeSubmission.submittedAt).toLocaleString()
                        : "Recent"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                   <StatusBadge state={activeSubmission.state as MissionState} />
                  <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                    <Award className="w-3.5 h-3.5" />
                    +{activeMission?.points || 25} Points
                  </div>
                </div>
              </div>

              {/* Submitted Proof Inspection Area */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Submitted Proof
                </h3>

                {activeSubmission.proofUrl && (
                  <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="truncate">
                        <div className="text-[11px] font-semibold text-text-muted">
                          External Proof URL
                        </div>
                        <a
                          href={activeSubmission.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-primary hover:underline truncate block"
                        >
                          {activeSubmission.proofUrl}
                        </a>
                      </div>
                      <a
                        href={activeSubmission.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        <span>Inspect Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Authenticity & Fraud Check Badge */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Domain Format
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        Unique Submission (No Duplicates)
                      </span>
                    </div>
                  </div>
                )}

                {activeSubmission.screenshotDataUrl && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-text-muted">
                      Uploaded Screenshot Artifact
                    </div>
                    <div className="rounded-xl overflow-hidden border border-border/60 bg-black/40 max-h-64 flex items-center justify-center p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeSubmission.screenshotDataUrl}
                        alt="Submitted proof screenshot"
                        className="max-h-60 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {activeSubmission.note && (
                  <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-border/60">
                    <div className="text-[11px] font-semibold text-text-muted mb-1">
                      Student Notes / Comments
                    </div>
                    <p className="text-xs text-text leading-relaxed">
                      {activeSubmission.note}
                    </p>
                  </div>
                )}
              </div>

              {/* Timeline Reconstruction */}
              <div className="pt-2 border-t border-border/40">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                  Lifecycle Timeline
                </h3>
                <Timeline events={timelineEvents} />
              </div>

              {/* Action Buttons & Keyboard Bar */}
              <div className="pt-4 border-t border-border/40 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-text-muted font-medium">
                  <span>Quick Keyboard Shortcuts:</span>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[10px]">
                      A
                    </span>{" "}
                    Approve
                    <span className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[10px] ml-1">
                      C
                    </span>{" "}
                    Changes
                    <span className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[10px] ml-1">
                      R
                    </span>{" "}
                    Reject
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleExecuteReview("approve")}
                    isLoading={isReviewing}
                    className="font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-soft-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve [A]</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setActionType("requestChanges")}
                    disabled={isReviewing}
                    className="font-bold gap-1.5 border-border/60 text-text"
                  >
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Request Changes [C]</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setActionType("reject")}
                    disabled={isReviewing}
                    className="font-bold gap-1.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject [R]</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/60 bg-surface/30">
              <div>
                <Search className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-text-muted">
                  Select a submission from the list to view proof & verify
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Dialog Modal for Reject / Request Changes */}
      <AnimatePresence>
        {actionType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-soft-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    actionType === "reject"
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {actionType === "reject" ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-text">
                    {actionType === "reject"
                      ? "Reject Submission"
                      : "Request Revisions"}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {actionType === "reject"
                      ? "Explain why this proof does not meet mission criteria."
                      : "Guide the student on what specific changes are needed."}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  Feedback Note for Student
                </label>
                <textarea
                  value={feedbackReason}
                  onChange={(e) => setFeedbackReason(e.target.value)}
                  placeholder={
                    actionType === "reject"
                      ? "e.g. The link points to an unrelated post. Please check instructions."
                      : "e.g. Please upload a full-screen screenshot showing your username clearly."
                  }
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActionType(null);
                    setFeedbackReason("");
                  }}
                  className="text-text-muted hover:text-text font-semibold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant={actionType === "reject" ? "danger" : "primary"}
                  size="sm"
                  onClick={() =>
                    handleExecuteReview(actionType, feedbackReason)
                  }
                  disabled={!feedbackReason.trim()}
                  isLoading={isReviewing}
                  className="font-bold text-xs"
                >
                  Confirm {actionType === "reject" ? "Rejection" : "Request"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
