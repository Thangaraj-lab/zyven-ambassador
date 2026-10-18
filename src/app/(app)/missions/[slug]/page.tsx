"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMission,
  useMySubmissions,
  useSubmitProof,
  useStartMission,
} from "@/lib/data/hooks";
import { Stepper, type StepItem } from "@/components/ui/Stepper";
import { StatusBadge, type MissionState } from "@/components/ui/StatusBadge";
import { PointsPill } from "@/components/ui/PointsPill";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Timeline } from "@/components/ui/Timeline";
import { validateLinkedInUrl } from "@/lib/data/mock/mockRepository";
import {
  Clock,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Share2,
  Check,
  Send,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useMotionOK } from "@/lib/motion";

export default function MissionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const t = useTranslations("missions");
  const motionOK = useMotionOK();

  const { data: mission, isLoading: missionLoading } = useMission(slug);
  const { data: mySubmissions = [] } = useMySubmissions();
  const { mutateAsync: submitProof, isPending: isSubmitting } = useSubmitProof();
  const { mutateAsync: startMission } = useStartMission();

  // Active step in stepper
  const [activeStep, setActiveStep] = useState(0);

  // Form states
  const [proofUrl, setProofUrl] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [postLang, setPostLang] = useState<"en" | "ta">("en");
  const [followedConfirmed, setFollowedConfirmed] = useState(false);
  const [whatsappJoined, setWhatsappJoined] = useState(false);

  // Submitted success animation overlay
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);

  const existingSubmission = mySubmissions.find(
    (s) => s.missionId === mission?.id
  );

  // Derive submission state
  const missionState: MissionState = existingSubmission
    ? (existingSubmission.state as MissionState)
    : "AVAILABLE";

  // Auto initialize STARTED state on open
  useEffect(() => {
    if (mission && !existingSubmission) {
      startMission(mission.id).catch(() => {});
    }
  }, [mission, existingSubmission, startMission]);

  if (missionLoading || !mission) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const isLinkedInValid =
    mission.brand === "linkedin"
      ? validateLinkedInUrl(proofUrl)
      : proofUrl.trim().length > 0;

  const canSubmit =
    (!mission.proofRequired.url || isLinkedInValid) &&
    (!mission.proofRequired.screenshot || !!screenshotDataUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please provide all required verification proofs");
      return;
    }

    try {
      await submitProof({
        missionId: mission.id,
        proofUrl: mission.proofRequired.url ? proofUrl : undefined,
        screenshotDataUrl: mission.proofRequired.screenshot
          ? screenshotDataUrl || undefined
          : undefined,
      });

      // Haptic feedback
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(15);
      }

      setShowSuccessSheet(true);
      if (motionOK) {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#5B5BF0", "#8B5CF6", "#10B981"],
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit verification";
      toast.error(msg);
    }
  };

  // Build steps for LinkedIn mission
  const linkedinSteps: StepItem[] = [
    {
      id: "step-follow",
      title: "Follow Zyven on LinkedIn",
      description: "Stay connected with official announcements and events",
      content: (
        <div className="space-y-3.5 pt-1">
          <p className="text-xs text-text-muted leading-relaxed">
            Click the button below to visit our official company page and hit Follow.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.linkedin.com/company/zyven"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setFollowedConfirmed(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl brand-gradient-bg text-white text-xs font-bold hover:brightness-105"
            >
              <span>Open LinkedIn Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {followedConfirmed && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveStep(1)}
                className="gap-1.5"
              >
                <Check className="h-3.5 w-3.5 text-success stroke-[3]" />
                <span>I have followed Zyven</span>
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "step-post",
      title: "Publish Announcement Post",
      description: "Share the launch template with your student network",
      content: (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text">Choose Language:</span>
            <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setPostLang("en")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  postLang === "en"
                    ? "brand-gradient-bg text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPostLang("ta")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  postLang === "ta"
                    ? "brand-gradient-bg text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-2 border border-border/80 text-xs font-mono text-text whitespace-pre-wrap leading-relaxed">
            {mission.postTemplate?.[postLang]}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CopyButton
              textToCopy={mission.postTemplate?.[postLang] || ""}
              label="Copy Post Template"
            />
            <a
              href="https://www.linkedin.com/feed/?shareActive=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-surface-2 text-xs font-bold text-text transition-colors"
            >
              <span>Open LinkedIn Composer</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveStep(2)}
            >
              Next: Submit URL
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "step-submit",
      title: "Submit Post URL for Verification",
      description: "Paste your live post link to claim your 50 points",
      content: (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              Live LinkedIn Post URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://www.linkedin.com/posts/your-name_zyven-activity-..."
                className={`w-full h-11 px-4 pr-10 rounded-xl border text-xs focus:ring-2 focus:outline-none transition-all ${
                  proofUrl
                    ? isLinkedInValid
                      ? "border-success bg-success/5 focus:ring-success"
                      : "border-danger bg-danger/5 focus:ring-danger"
                    : "border-border bg-bg text-text focus:ring-primary"
                }`}
              />
              {proofUrl && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isLinkedInValid ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-danger" />
                  )}
                </div>
              )}
            </div>
            {proofUrl && !isLinkedInValid && (
              <p className="text-[11px] text-danger mt-1">
                Please enter a valid LinkedIn post link (e.g. linkedin.com/posts/... or linkedin.com/feed/update/...)
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              Optional Screenshot
            </label>
            <FileDropzone onImageSelected={setScreenshotDataUrl} />
          </div>

          <div className="p-3 rounded-xl bg-surface-2 border border-border text-[11px] text-text-muted">
            ℹ️ {t("verificationNote")}
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full font-bold gap-2"
            disabled={!canSubmit}
            isLoading={isSubmitting}
          >
            <Send className="h-4 w-4" />
            <span>Submit Verification Proof</span>
          </Button>
        </form>
      ),
    },
  ];

  // Build steps for WhatsApp mission
  const whatsappSteps: StepItem[] = [
    {
      id: "step-wa-join",
      title: "Join Official WhatsApp Group",
      description: "Direct community channel for announcements & tasks",
      content: (
        <div className="space-y-3.5 pt-1">
          <p className="text-xs text-text-muted leading-relaxed">
            Click below to join our private WhatsApp ambassador community.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://chat.whatsapp.com/zyven-community-demo"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setWhatsappJoined(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:brightness-105"
            >
              <span>Join WhatsApp Group</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {whatsappJoined && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveStep(1)}
                className="gap-1.5"
              >
                <Check className="h-3.5 w-3.5 text-success stroke-[3]" />
                <span>I have joined the group</span>
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "step-wa-upload",
      title: "Upload Group Screenshot",
      description: "Screenshot of group info or chat screen",
      content: (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              Screenshot Proof (Required)
            </label>
            <FileDropzone onImageSelected={setScreenshotDataUrl} />
          </div>

          <div className="p-3 rounded-xl bg-surface-2 border border-border text-[11px] text-text-muted">
            ℹ️ {t("verificationNote")}
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full font-bold gap-2"
            disabled={!screenshotDataUrl}
            isLoading={isSubmitting}
          >
            <Send className="h-4 w-4" />
            <span>Submit WhatsApp Screenshot</span>
          </Button>
        </form>
      ),
    },
  ];

  const stepsToRender =
    mission.brand === "whatsapp" ? whatsappSteps : linkedinSteps;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/missions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Missions
        </Link>
      </div>

      {/* Grid: Left Summary, Right Guided Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mission Overview Card */}
        <div className="lg:col-span-5 rounded-[24px] bg-surface p-6 border border-border shadow-soft-sm space-y-6 sticky top-20">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {mission.category}
              </span>
              <h1 className="text-xl font-extrabold text-text tracking-tight">
                {mission.title}
              </h1>
            </div>
            <StatusBadge state={missionState} size="sm" />
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            {mission.description}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/80">
            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Reward
              </span>
              <PointsPill points={mission.points} size="sm" />
            </div>

            <div className="p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Estimated Time
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-text">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{mission.estimatedMinutes} mins</span>
              </div>
            </div>
          </div>

          {/* Approved state banner */}
          {missionState === "APPROVED" && (
            <div className="p-4 rounded-2xl bg-success/10 border border-success/30 space-y-2">
              <div className="flex items-center gap-2 text-success font-bold text-xs">
                <CheckCircle className="h-4 w-4" />
                <span>Mission Completed & Verified!</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                You earned +{mission.points} Points. Great job representing Zyven!
              </p>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  "https://zyven.network"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Achievement on LinkedIn</span>
              </a>
            </div>
          )}

          {/* Rejected state banner */}
          {missionState === "REJECTED" && (
            <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 space-y-2">
              <div className="flex items-center gap-2 text-danger font-bold text-xs">
                <AlertCircle className="h-4 w-4" />
                <span>Verification Needs Correction</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Reason: {existingSubmission?.reviewReason || "Proof was invalid or unreachable."}
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setActiveStep(mission.brand === "whatsapp" ? 1 : 2);
                }}
              >
                Resubmit with Fixes
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Guided Stepper or Submission Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {missionState === "UNDER_REVIEW" || missionState === "SUBMITTED" ? (
            <div className="rounded-[24px] bg-surface p-6 sm:p-8 border border-border shadow-soft-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-warning/15 text-warning flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-text">
                    Submission Under Review
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Your verification proof has been logged and queued for admin check.
                  </p>
                </div>
              </div>

              <Timeline
                events={[
                  {
                    id: "ev-start",
                    title: "Mission Started",
                    timestamp: "Step Completed",
                    status: "completed",
                  },
                  {
                    id: "ev-sub",
                    title: "Proof Submitted",
                    timestamp: existingSubmission?.submittedAt
                      ? new Date(existingSubmission.submittedAt).toLocaleTimeString()
                      : "Just now",
                    description: existingSubmission?.proofUrl
                      ? `URL: ${existingSubmission.proofUrl}`
                      : "Screenshot uploaded",
                    status: "completed",
                  },
                  {
                    id: "ev-rev",
                    title: "Verification Review",
                    description: "Admin reviewing proof (typically < 24 hours)",
                    status: "current",
                  },
                  {
                    id: "ev-done",
                    title: "Award +50 Points",
                    description: "Points will reflect automatically on ledger",
                    status: "upcoming",
                  },
                ]}
              />

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border text-center text-xs text-text-muted">
                You will receive a notification as soon as verification completes.
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] bg-surface p-6 sm:p-8 border border-border shadow-soft-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-text">
                    Guided Task Steps
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Follow the sequential steps to submit verification.
                  </p>
                </div>
                <span className="text-xs font-bold text-primary">
                  Step {activeStep + 1} of {stepsToRender.length}
                </span>
              </div>

              <Stepper
                steps={stepsToRender}
                currentStep={activeStep}
                onStepClick={setActiveStep}
              />
            </div>
          )}
        </div>
      </div>

      {/* Submission Success Modal / Sheet */}
      <AnimatePresence>
        {showSuccessSheet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-[24px] bg-surface p-6 border border-border shadow-soft-lg text-center space-y-4"
            >
              <div className="h-16 w-16 rounded-full brand-gradient-bg text-white flex items-center justify-center mx-auto shadow-soft-md">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-text">
                  Mission Submitted!
                </h3>
                <p className="text-xs text-text-muted">
                  Your proof has been submitted for review. Verification usually takes up to 24 hours.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full font-bold"
                onClick={() => {
                  setShowSuccessSheet(false);
                  router.refresh();
                }}
              >
                Done
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
