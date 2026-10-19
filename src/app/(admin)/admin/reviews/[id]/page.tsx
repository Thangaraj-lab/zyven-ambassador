"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useSubmission,
  useMissions,
  useReviewSubmission,
  useAdminSubmissions,
} from "@/lib/data/hooks";
import { StatusBadge, type MissionState } from "@/components/ui/StatusBadge";
import { PointsPill } from "@/components/ui/PointsPill";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ZoomIn,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "motion/react";

const REASON_PRESETS = [
  "Post URL is invalid or inaccessible",
  "Post is missing mandatory hashtag #Zyvex",
  "Screenshot does not clearly show group membership",
  "Post has already been submitted by another ambassador",
  "Account appears to be inactive or fake profile",
];

export default function ReviewDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: submission, isLoading: subLoading } = useSubmission(id);
  const { data: missions = [] } = useMissions();
  const { data: allSubmissions = [] } = useAdminSubmissions();
  const { mutateAsync: reviewSubmission, isPending: isReviewing } =
    useReviewSubmission();

  const [reason, setReason] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const mission = missions.find((m) => m.id === submission?.missionId);

  // Next pending submission in queue
  const pendingQueue = allSubmissions.filter(
    (s) => (s.state === "SUBMITTED" || s.state === "UNDER_REVIEW") && s.id !== id
  );
  const nextPendingId = pendingQueue.length > 0 ? pendingQueue[0].id : null;

  const handleDecision = useCallback(
    async (decision: "approve" | "reject" | "requestChanges") => {
      if (!submission) return;

      if ((decision === "reject" || decision === "requestChanges") && !reason.trim()) {
        toast.error("Please provide or select a reason for this decision");
        return;
      }

      try {
        await reviewSubmission({
          submissionId: submission.id,
          decision,
          reason: reason || undefined,
        });

        toast.success(
          decision === "approve"
            ? `Submission approved! +${mission?.points || 50} Points awarded.`
            : decision === "requestChanges"
            ? "Changes requested from student."
            : "Submission rejected."
        );

        // Section 21: Current submission slides away
        setIsExiting(true);
        setTimeout(() => {
          if (nextPendingId) {
            router.push(`/admin/reviews/${nextPendingId}`);
            setIsExiting(false);
          } else {
            router.push("/admin/reviews");
          }
        }, 220);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to process review";
        toast.error(msg);
      }
    },
    [submission, reason, mission, nextPendingId, reviewSubmission, router]
  );

  // Section 21 Keyboard shortcuts (A = Approve, C = Changes, R = Reject)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in textarea/input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleDecision("approve");
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        if (reason) {
          handleDecision("requestChanges");
        } else {
          setReason(REASON_PRESETS[0]);
          toast.info("Preset reason selected. Press C again to request changes.");
        }
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        if (reason) {
          handleDecision("reject");
        } else {
          setReason(REASON_PRESETS[0]);
          toast.info("Preset reason selected. Press R again to confirm rejection.");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDecision, reason]);

  if (subLoading || !submission) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      animate={isExiting ? { x: -80, opacity: 0 } : { x: 0, opacity: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/reviews"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Review Queue
        </Link>

        {nextPendingId && (
          <Link
            href={`/admin/reviews/${nextPendingId}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>Next Pending ({pendingQueue.length})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Proof Viewer */}
        <div className="lg:col-span-7 rounded-[24px] bg-surface p-6 border border-border shadow-soft-sm space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Submission #{submission.id.slice(-6)}
              </span>
              <h1 className="text-xl font-extrabold text-text mt-0.5">
                {mission?.title || "Mission Verification"}
              </h1>
              <p className="text-xs text-text-muted mt-1">
                Student:{" "}
                <span className="font-mono text-text font-bold">
                  {submission.studentName || submission.ambassadorId}
                </span>
              </p>
            </div>
            <StatusBadge state={submission.state as MissionState} />
          </div>

          {/* Proof URL Viewer */}
          {submission.proofUrl && (
            <div className="p-4 rounded-2xl bg-surface-2 border border-border space-y-2">
              <span className="text-xs font-bold text-text block">
                Submitted Live URL:
              </span>
              <div className="flex items-center justify-between gap-3 bg-bg p-3 rounded-xl border border-border">
                <span className="text-xs font-mono text-text truncate">
                  {submission.proofUrl}
                </span>
                <a
                  href={submission.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg brand-gradient-bg text-white text-xs font-bold shrink-0 hover:brightness-105"
                >
                  <span>Open Link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Screenshot Viewer */}
          {submission.screenshotDataUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text">
                  Screenshot Proof:
                </span>
                <button
                  type="button"
                  onClick={() => setIsZoomed(true)}
                  className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  <span>Enlarge Preview</span>
                </button>
              </div>

              <div
                onClick={() => setIsZoomed(true)}
                className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-border bg-black/5 cursor-zoom-in"
              >
                <Image
                  src={submission.screenshotDataUrl}
                  alt="Submission proof"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {submission.note && (
            <div className="p-4 rounded-xl bg-surface-2 border border-border text-xs">
              <span className="font-bold text-text block mb-1">
                Ambassador Note:
              </span>
              <p className="text-text-muted">{submission.note}</p>
            </div>
          )}

          {submission.proofItems && submission.proofItems.length > 0 && (
            <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-3">
              <span className="text-xs font-bold text-text block">
                Original uploaded evidence ({submission.proofItems.length} item{submission.proofItems.length === 1 ? "" : "s"}):
              </span>
              {submission.proofItems.map((item, index) => (
                <div key={item.id || index} className="rounded-lg border border-border/60 bg-bg p-3 space-y-1.5 text-xs">
                  <div className="font-semibold text-text">Evidence {index + 1}</div>
                  {item.urlValue && (
                    <a href={item.urlValue} target="_blank" rel="noopener noreferrer" className="block break-all text-primary hover:underline">
                      {item.urlValue}
                    </a>
                  )}
                  {item.filePath && <div className="break-all text-text-muted">File: {item.filePath}</div>}
                  {item.textValue && <div className="whitespace-pre-wrap text-text-muted">{item.textValue}</div>}
                  {item.metadata && Object.keys(item.metadata).filter((key) => key !== "screenshotDataUrl").length > 0 && (
                    <pre className="overflow-x-auto whitespace-pre-wrap text-[10px] text-text-muted">{JSON.stringify(Object.fromEntries(Object.entries(item.metadata).filter(([key]) => key !== "screenshotDataUrl")), null, 2)}</pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Decision Panel */}
        <div className="lg:col-span-5 rounded-[24px] bg-surface p-6 border border-border shadow-soft-sm space-y-6 sticky top-20">
          <div>
            <h3 className="text-base font-extrabold text-text">
              Review Decision
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Review proof against requirements and award ledger points.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-2 border border-border space-y-2">
            <span className="text-[10px] uppercase font-bold text-text-muted block">
              Reward to Award
            </span>
            <div className="flex items-center gap-2">
              <PointsPill points={mission?.points || 50} size="md" />
              <span className="text-xs text-text-muted font-medium">
                credited immediately to ambassador
              </span>
            </div>
          </div>

          {/* Preset Reasons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-text block">
              Quick Reason Presets:
            </span>
            <div className="space-y-1.5">
              {REASON_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setReason(preset)}
                  className={`w-full text-left p-2 rounded-xl text-[11px] font-medium border transition-colors cursor-pointer ${
                    reason === preset
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border/80 bg-surface-2 text-text-muted hover:text-text hover:bg-surface"
                  }`}
                >
                  • {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          <div>
            <label className="block text-xs font-bold text-text mb-1">
              Feedback Reason (for Reject / Request Changes):
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this proof does not qualify or what needs to be fixed..."
              className="w-full p-3 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2 border-t border-border/80">
            <Button
              variant="primary"
              size="md"
              className="w-full font-bold gap-2 shadow-soft-sm"
              isLoading={isReviewing}
              onClick={() => handleDecision("approve")}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Approve & Award +{mission?.points || 50} Points (A)</span>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="danger"
                size="md"
                className="w-full font-bold gap-1.5 text-xs"
                isLoading={isReviewing}
                onClick={() => handleDecision("reject")}
              >
                <XCircle className="h-4 w-4" />
                <span>Reject (R)</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                className="w-full font-bold gap-1.5 text-xs"
                isLoading={isReviewing}
                onClick={() => handleDecision("requestChanges")}
              >
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>Need Fixes</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enlarge Screenshot Modal */}
      {isZoomed && submission.screenshotDataUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-[80vh]">
            <Image
              src={submission.screenshotDataUrl}
              alt="Zoomed screenshot"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
