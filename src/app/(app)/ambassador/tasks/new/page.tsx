"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BackButton } from "@/components/ui/BackButton";
import { useCreateAmbassadorTask, useMyTeam, usePlatformSettings } from "@/lib/data/hooks";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Users,
  Shield,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function CreateAmbassadorTaskPage() {
  const router = useRouter();
  const { data: myTeam } = useMyTeam();
  const { data: settings } = usePlatformSettings();
  const { mutateAsync: createTask, isPending } = useCreateAmbassadorTask();

  const maxPointsCap = settings?.maxAmbassadorTaskPoints || 25;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Basics
  const [title, setTitle] = useState("");
  const [titleTa, setTitleTa] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionTa, setDescriptionTa] = useState("");
  const [brand, setBrand] = useState<"college" | "linkedin" | "whatsapp" | "instagram" | "event">("college");
  const [estimatedMinutes, setEstimatedMinutes] = useState(5);
  const [externalUrl, setExternalUrl] = useState("");

  // Step 2: Instructions & Proof
  const [instructions, setInstructions] = useState([
    { stepNumber: 1, title: "Review Guidelines", description: "Follow the campus instructions provided by ambassador." },
    { stepNumber: 2, title: "Execute Action", description: "Perform the activity and record proof." },
    { stepNumber: 3, title: "Submit Verification", description: "Submit link or screenshot for review." },
  ]);
  const [urlRequired, setUrlRequired] = useState(true);
  const [screenshotRequired, setScreenshotRequired] = useState(false);
  const [postTemplateEn, setPostTemplateEn] = useState("");

  // Step 3: Points & Audience (Capped at maxPointsCap, NEVER 'everyone')
  const [points, setPoints] = useState(20);
  const [audience, setAudience] = useState<"own_team" | "specific_members">("own_team");

  const addInstruction = () => {
    setInstructions([
      ...instructions,
      {
        stepNumber: instructions.length + 1,
        title: "",
        description: "",
      },
    ]);
  };

  const removeInstruction = (idx: number) => {
    if (instructions.length <= 1) return;
    const updated = instructions
      .filter((_, i) => i !== idx)
      .map((item, i) => ({ ...item, stepNumber: i + 1 }));
    setInstructions(updated);
  };

  const updateInstruction = (idx: number, field: "title" | "description", val: string) => {
    const updated = [...instructions];
    updated[idx][field] = val;
    setInstructions(updated);
  };

  const handleSubmit = async (submitStatus: "draft" | "pending_approval") => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please complete the required task details");
      return;
    }

    try {
      await createTask({
        title,
        titleTa: titleTa || title,
        description,
        descriptionTa: descriptionTa || description,
        brand,
        estimatedMinutes: Number(estimatedMinutes),
        externalUrl: externalUrl || undefined,
        instructions,
        proofRequired: {
          url: urlRequired,
          screenshot: screenshotRequired,
        },
        proofTypes: [
          ...(urlRequired ? ["url" as const] : []),
          ...(screenshotRequired ? ["screenshot" as const] : []),
        ],
        points: Math.min(Number(points), maxPointsCap),
        audience,
        teamId: myTeam?.id,
        category: "Campus Initiative",
        status: submitStatus,
        postTemplate: postTemplateEn ? { en: postTemplateEn, ta: "" } : undefined,
      });

      toast.success(
        submitStatus === "pending_approval"
          ? "Task submitted for Admin approval!"
          : "Task saved as draft."
      );
      router.push("/ambassador/tasks");
    } catch {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      <BackButton fallbackHref="/ambassador/tasks" label="Back to Team Tasks" />

      {/* Stepper Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-text-muted">
          <span>STEP {step} OF 4</span>
          <span className="text-primary">
            {step === 1 && "Basic Information"}
            {step === 2 && "Instructions & Proof"}
            {step === 3 && "Points & Audience"}
            {step === 4 && "Review & Submit"}
          </span>
        </div>
        <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-border">
          <div
            className="h-full brand-gradient-bg transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Basics */}
      {step === 1 && (
        <div className="p-7 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-text">Task Basics</h2>
            <p className="text-xs text-text-muted mt-1">
              Provide clear and concise details for your campus task.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Task Title (English) *"
              placeholder="e.g. Share Tech Symposium Announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Input
              label="Task Title (Tamil - Optional)"
              placeholder="e.g. கருத்தரங்கு அறிவிப்பைப் பகிரவும்"
              value={titleTa}
              onChange={(e) => setTitleTa(e.target.value)}
            />

            <div>
              <label className="block text-xs font-bold text-text mb-1.5">
                Description (English) *
              </label>
              <textarea
                rows={3}
                placeholder="Explain the purpose and outcome of this campus initiative..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-border bg-surface text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  Platform / Brand
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as typeof brand)}
                  className="w-full p-3 rounded-xl border border-border bg-surface text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="college">College Campus</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="event">Campus Event</option>
                </select>
              </div>

              <Input
                label="Estimated Minutes"
                type="number"
                min={1}
                max={60}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              />
            </div>

            <Input
              label="External Reference Link (Optional)"
              placeholder="https://chat.whatsapp.com/... or event link"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="md"
              disabled={!title.trim() || !description.trim()}
              onClick={() => setStep(2)}
              className="gap-2 font-bold"
            >
              <span>Next: Instructions</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Instructions */}
      {step === 2 && (
        <div className="p-7 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-text">Instructions & Proof</h2>
            <p className="text-xs text-text-muted mt-1">
              Define the verification steps your team members must follow.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text">Steps Checklist</span>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              {instructions.map((inst, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-surface-2 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-primary">
                      Step {inst.stepNumber}
                    </span>
                    {instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(idx)}
                        className="text-danger hover:opacity-80 p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Step Title"
                    value={inst.title}
                    onChange={(e) => updateInstruction(idx, "title", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Step Instruction Details"
                    value={inst.description}
                    onChange={(e) => updateInstruction(idx, "description", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border space-y-3">
              <span className="text-xs font-bold text-text block">Proof Requirements</span>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text">
                  <input
                    type="checkbox"
                    checked={urlRequired}
                    onChange={(e) => setUrlRequired(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>Live URL Proof Required</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text">
                  <input
                    type="checkbox"
                    checked={screenshotRequired}
                    onChange={(e) => setScreenshotRequired(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>Screenshot Proof Required</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1.5">
                Social Post Template (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Pre-approved post template text for students to copy..."
                value={postTemplateEn}
                onChange={(e) => setPostTemplateEn(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-border bg-surface text-xs text-text focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button variant="outline" size="md" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(3)} className="gap-2 font-bold">
              <span>Next: Points & Audience</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Points & Audience */}
      {step === 3 && (
        <div className="p-7 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-text">Points & Audience</h2>
            <p className="text-xs text-text-muted mt-1">
              Ambassador task points are capped at {maxPointsCap} points by platform policy.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-text mb-1.5">
                Reward Points (Max {maxPointsCap} pts)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={5}
                  max={maxPointsCap}
                  value={points}
                  onChange={(e) => setPoints(Math.min(Number(e.target.value), maxPointsCap))}
                  className="w-32 p-3 rounded-xl border border-border bg-surface text-sm font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-xs text-text-muted">
                  Points awarded upon verified review
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-text">Audience Target</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setAudience("own_team")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    audience === "own_team"
                      ? "border-primary bg-primary/5 text-text"
                      : "border-border bg-surface text-text-muted hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Entire Campus Team</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">
                    Available to all members of {myTeam?.name || "your campus cohort"}.
                  </p>
                </div>

                <div
                  onClick={() => setAudience("specific_members")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    audience === "specific_members"
                      ? "border-primary bg-primary/5 text-text"
                      : "border-border bg-surface text-text-muted hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Selected Members</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">
                    Assigned to specific student delegates for special initiatives.
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-text-muted pt-1">
                Note: Only Administrators can broadcast global tasks to all users.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button variant="outline" size="md" onClick={() => setStep(2)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(4)} className="gap-2 font-bold">
              <span>Next: Review & Submit</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review Preview & Submit */}
      {step === 4 && (
        <div className="p-7 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-text">Review Task Preview</h2>
            <p className="text-xs text-text-muted mt-1">
              Every ambassador-created task requires admin approval before becoming live.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-2 border border-border space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  {brand.toUpperCase()} • Campus Initiative
                </span>
                <h3 className="text-lg font-black text-text mt-0.5">{title}</h3>
                <p className="text-xs text-text-muted mt-1">{description}</p>
              </div>
              <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary shrink-0">
                +{points} Points
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-border/80">
              <div>
                <span className="text-text-muted block text-[10px] uppercase font-bold">Audience</span>
                <span className="font-bold text-text">{audience === "own_team" ? "Own Team" : "Specific Members"}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase font-bold">Est. Time</span>
                <span className="font-bold text-text">~{estimatedMinutes} mins</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase font-bold">Proof Type</span>
                <span className="font-bold text-text">
                  {urlRequired && screenshotRequired ? "URL + Screenshot" : urlRequired ? "URL Link" : "Screenshot"}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/80">
              <span className="text-[11px] font-bold text-text block">Steps ({instructions.length}):</span>
              <div className="space-y-1">
                {instructions.map((inst) => (
                  <div key={inst.stepNumber} className="text-xs text-text-muted flex items-center gap-2">
                    <span className="h-5 w-5 rounded-md bg-surface border border-border font-bold text-[10px] flex items-center justify-center shrink-0">
                      {inst.stepNumber}
                    </span>
                    <span className="font-bold text-text">{inst.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted leading-relaxed">
              When submitted, this task moves to <strong className="text-text">Pending Approval</strong>.
              Admins review and publish to your students. You will receive an instant notification once approved.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <Button variant="outline" size="md" onClick={() => setStep(3)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                disabled={isPending}
                onClick={() => handleSubmit("draft")}
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isPending}
                onClick={() => handleSubmit("pending_approval")}
                className="gap-2 font-bold"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Send for Approval</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
