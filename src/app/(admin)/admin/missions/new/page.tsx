"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createTaskAction } from "@/actions/taskActions";
import { Button } from "@/components/ui/Button";
import { PointsPill } from "@/components/ui/PointsPill";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Send,
  Clock,
  Save,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import type { Mission } from "@/lib/data/types";

const STEPS = [
  { id: 1, name: "Basics", desc: "Title & category" },
  { id: 2, name: "Proof", desc: "Verification rules" },
  { id: 3, name: "Audience", desc: "Colleges & points" },
  { id: 4, name: "Review", desc: "Preview & publish" },
];

export default function TaskCreationStudioPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [titleTa, setTitleTa] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState<Mission["brand"]>("linkedin");
  const [category] = useState("Social Sharing");
  const [estimatedMinutes, setEstimatedMinutes] = useState(5);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");

  // Step 2: Proof
  const [requireUrl, setRequireUrl] = useState(true);
  const [requireScreenshot, setRequireScreenshot] = useState(false);
  const [postTemplateEn, setPostTemplateEn] = useState(
    "Excited to represent Zyvex on our campus! Join us in building India's premier student innovation community. #Zyvex #StudentAmbassador"
  );

  // Step 3: Audience & Reward
  const [points, setPoints] = useState(50);
  const [targetColleges, setTargetColleges] = useState("all");

  const canContinue = () => {
    if (currentStep === 1) return title.trim().length > 3 && description.trim().length > 10;
    if (currentStep === 2) return requireUrl || requireScreenshot;
    if (currentStep === 3) return points > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePublish = async (isDraft = false) => {
    setIsSubmitting(true);
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await createTaskAction({
        title,
        shortDescription: description,
        description,
        category,
        taskType: requireScreenshot ? "SCREENSHOT" : "URL",
        points: Number(points),
        estimatedMinutes: Number(estimatedMinutes),
        audience: targetColleges === "all" ? "all_students" : "college",
        submitForApproval: !isDraft,
      });

      toast.success(isDraft ? "Task saved as draft" : "Task published to ambassador network!");
      router.push("/admin/missions");
    } catch {
      toast.error("Failed to create mission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/missions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Missions
        </Link>
        <span className="text-xs text-text-muted font-bold uppercase tracking-wider">
          Task Creation Studio
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight flex items-center gap-2.5">
          <Sparkles className="h-6 w-6 text-primary" />
          <span>Create Campus Task</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Design and deploy verified activities for students across Tamil Nadu colleges.
        </p>
      </div>

      {/* Step Indicator (Section 20: 01 Basics ─ 02 Proof ─ 03 Audience ─ 04 Review) */}
      <div className="p-4 rounded-[20px] bg-surface border border-border shadow-soft-sm">
        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((s) => {
            const isActive = currentStep === s.id;
            const isDone = currentStep > s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => isDone && setCurrentStep(s.id)}
                className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2 sm:p-3 rounded-xl transition-all text-left ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : isDone
                    ? "text-success hover:bg-surface-2 cursor-pointer"
                    : "text-text-muted opacity-60"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? "brand-gradient-bg text-white shadow-soft-sm"
                      : isDone
                      ? "bg-success text-white"
                      : "bg-surface-2 text-text-muted border border-border"
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : `0${s.id}`}
                </div>
                <div className="hidden sm:block">
                  <span className="text-xs font-extrabold block">{s.name}</span>
                  <span className="text-[10px] text-text-muted truncate block">{s.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content Area */}
      <div className="rounded-[24px] bg-surface p-6 sm:p-8 border border-border shadow-soft-sm">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-text">01. Task Basics</h2>
                <p className="text-xs text-text-muted">Define the task identity, channel, and scope.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">Task Title (English) *</label>
                  <Input
                    placeholder="e.g. Follow & Share Zyvex Announcement on LinkedIn"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">Task Title (Tamil / Localized)</label>
                  <Input
                    placeholder="e.g. LinkedIn-இல் பின்தொடர்ந்து பதிவிடுங்கள்"
                    value={titleTa}
                    onChange={(e) => setTitleTa(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">Task Description *</label>
                  <Textarea
                    rows={3}
                    placeholder="Clearly describe what ambassadors must accomplish to earn verification..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">Platform Brand</label>
                    <Select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value as Mission["brand"])}
                      options={[
                        { value: "linkedin", label: "LinkedIn" },
                        { value: "whatsapp", label: "WhatsApp" },
                        { value: "instagram", label: "Instagram" },
                        { value: "event", label: "Campus Event" },
                        { value: "community", label: "Community" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">Est. Time (Minutes)</label>
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      value={estimatedMinutes}
                      onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">Difficulty</label>
                    <Select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                      options={[
                        { value: "Easy", label: "Easy" },
                        { value: "Medium", label: "Medium" },
                        { value: "Hard", label: "Hard" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-text">02. Proof & Verification Rules</h2>
                <p className="text-xs text-text-muted">Specify evidence required for admin approval.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3 p-4 rounded-2xl bg-surface-2 border border-border">
                  <span className="text-xs font-bold text-text block">Acceptable Proof Formats:</span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
                      <Checkbox
                        checked={requireUrl}
                        onCheckedChange={(checked) => setRequireUrl(checked)}
                      />
                      <span>Require Live Post / Activity URL (e.g. LinkedIn post link)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
                      <Checkbox
                        checked={requireScreenshot}
                        onCheckedChange={(checked) => setRequireScreenshot(checked)}
                      />
                      <span>Require Screenshot Proof (PNG, JPG auto-compressed)</span>
                    </label>
                  </div>
                </div>

                {brand === "linkedin" && (
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">
                      Suggested Post Copy Template
                    </label>
                    <Textarea
                      rows={4}
                      value={postTemplateEn}
                      onChange={(e) => setPostTemplateEn(e.target.value)}
                      placeholder="Template copy students can copy directly into LinkedIn..."
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-text">03. Audience & Ledger Reward</h2>
                <p className="text-xs text-text-muted">Configure cohort eligibility and points awarded upon approval.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">Reward Points *</label>
                  <div className="flex items-center gap-3">
                    {[30, 50, 75, 100].map((pts) => (
                      <button
                        key={pts}
                        type="button"
                        onClick={() => setPoints(pts)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          points === pts
                            ? "brand-gradient-bg text-white border-transparent shadow-soft-sm"
                            : "bg-surface-2 text-text border-border hover:border-primary/40"
                        }`}
                      >
                        +{pts} Points
                      </button>
                    ))}
                    <Input
                      type="number"
                      className="w-28 text-center"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">Target Colleges</label>
                  <Select
                    value={targetColleges}
                    onChange={(e) => setTargetColleges(e.target.value)}
                    options={[
                      { value: "all", label: "All Partner Colleges (Open Cohort)" },
                      { value: "engineering", label: "Engineering Campuses Only (MEC, PSG, Kongu, KSR)" },
                      { value: "founding", label: "Founding Cohort Ambassadors Only" },
                    ]}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-text">04. Review & Deploy</h2>
                <p className="text-xs text-text-muted">Confirm details before launching to the student portal.</p>
              </div>

              {/* Task Preview Card */}
              <div className="p-6 rounded-[20px] bg-surface-2 border border-border space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {brand.toUpperCase()} • {category}
                    </span>
                    <h3 className="text-lg font-extrabold text-text mt-0.5">{title || "Untitled Mission"}</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      {description || "No description provided."}
                    </p>
                  </div>
                  <PointsPill points={points} size="md" />
                </div>

                <div className="flex items-center gap-4 text-xs text-text-muted pt-3 border-t border-border">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {estimatedMinutes} mins
                  </span>
                  <span>Difficulty: <strong className="text-text">{difficulty}</strong></span>
                  <span>Target: <strong className="text-text">{targetColleges}</strong></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
          {currentStep > 1 ? (
            <Button variant="outline" size="sm" onClick={handleBack} disabled={isSubmitting}>
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {currentStep === 4 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePublish(true)}
                isLoading={isSubmitting}
                className="gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={!canContinue()}
                className="gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handlePublish(false)}
                isLoading={isSubmitting}
                className="gap-1.5 shadow-soft-sm"
              >
                <Send className="h-4 w-4" />
                <span>Publish Mission</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
