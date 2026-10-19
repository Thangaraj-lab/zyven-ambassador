"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BackButton } from "@/components/ui/BackButton";
import { useCreateAmbassadorTask, usePlatformSettings, useColleges } from "@/lib/data/hooks";
import type { MissionType } from "@/lib/data/types";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  Link as LinkIcon,
  HelpCircle,
  Plus,
  Trash2,
  Globe,
  GraduationCap,
  Building2,
  UserCheck,
  FileText,
  UploadCloud,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export default function CreateAmbassadorTaskPage() {
  const router = useRouter();
  const { data: colleges = [] } = useColleges();
  const { data: settings } = usePlatformSettings();
  const { mutateAsync: createTask, isPending } = useCreateAmbassadorTask();

  const maxPointsCap = settings?.maxAmbassadorTaskPoints || 25;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1 — TASK BASICS
  const [title, setTitle] = useState("");
  const [titleTa, setTitleTa] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [category, setCategory] = useState("Social Media");
  const [taskType, setTaskType] = useState<string>("url");
  const [language, setLanguage] = useState<"English" | "Tamil" | "Both">("English");
  const [brand, setBrand] = useState<"college" | "linkedin" | "whatsapp" | "instagram" | "event">("college");
  const [estimatedMinutes, setEstimatedMinutes] = useState(10);
  const [externalUrl, setExternalUrl] = useState("");

  // STEP 2 — INSTRUCTIONS BUILDER
  const [instructions, setInstructions] = useState([
    {
      stepNumber: 1,
      title: "Review Task Guidelines",
      description: "Carefully read all task prerequisites and rules before starting.",
      actionType: "link" as const,
      actionUrl: "",
    },
    {
      stepNumber: 2,
      title: "Perform Required Activity",
      description: "Execute the task as instructed and collect proof of completion.",
      actionType: "text" as const,
    },
    {
      stepNumber: 3,
      title: "Submit Verification Proof",
      description: "Submit your live link, uploaded file, or registration response.",
      actionType: "upload" as const,
    },
  ]);

  // STEP 3 — REQUIREMENTS & GOOGLE FORM / SPREADSHEET INTEGRATION
  const [urlRequired, setUrlRequired] = useState(true);
  const [screenshotRequired, setScreenshotRequired] = useState(false);
  const [documentRequired, setDocumentRequired] = useState(false);
  const [postTemplateEn, setPostTemplateEn] = useState("");

  // Google Form & Spreadsheet Options
  const [enableGoogleForm, setEnableGoogleForm] = useState(false);
  const [googleFormUrl, setGoogleFormUrl] = useState("");
  const [googleSpreadsheetUrl, setGoogleSpreadsheetUrl] = useState("");

  // Course Completion Task Fields
  const [courseProvider, setCourseProvider] = useState("");
  const [courseCompletionPct, setCourseCompletionPct] = useState(100);

  // STEP 4 — AUDIENCE & POINTS (SOLO AMBASSADOR - NO TEAMS)
  const [points, setPoints] = useState(25);
  const [audience, setAudience] = useState<"public" | "all_students" | "college" | "selected_students">("public");
  const [selectedCollegeId, setSelectedCollegeId] = useState("col-mec");

  const addInstruction = () => {
    setInstructions([
      ...instructions,
      {
        stepNumber: instructions.length + 1,
        title: "",
        description: "",
        actionType: "text",
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

  const updateInstruction = (idx: number, field: "title" | "description" | "actionUrl", val: string) => {
    const updated = [...instructions];
    updated[idx] = { ...updated[idx], [field]: val };
    setInstructions(updated);
  };

  const handleSubmit = async (submitStatus: "draft" | "pending_approval") => {
    if (!title.trim() || !shortDescription.trim()) {
      toast.error("Please complete the task title and description");
      return;
    }

    try {
      await createTask({
        title,
        titleTa: titleTa || title,
        description: shortDescription,
        descriptionTa: detailedDescription || shortDescription,
        category,
        taskType: taskType as MissionType,
        brand,
        estimatedMinutes: Number(estimatedMinutes),
        externalUrl: externalUrl || undefined,
        googleFormUrl: enableGoogleForm && googleFormUrl ? googleFormUrl : undefined,
        googleSpreadsheetUrl: enableGoogleForm && googleSpreadsheetUrl ? googleSpreadsheetUrl : undefined,
        instructions: instructions.map((i) => ({
          stepNumber: i.stepNumber,
          title: i.title,
          description: i.description,
          actionType: i.actionType,
          actionUrl: i.actionUrl || undefined,
        })),
        proofRequired: {
          url: urlRequired,
          screenshot: screenshotRequired,
          document: documentRequired,
        },
        proofTypes: [
          ...(urlRequired ? ["url" as const] : []),
          ...(screenshotRequired ? ["screenshot" as const] : []),
          ...(documentRequired ? ["document" as const] : []),
          ...(enableGoogleForm ? ["form" as const] : []),
        ],
        points: Math.min(Number(points), maxPointsCap),
        audience,
        collegeId: audience === "college" ? selectedCollegeId : undefined,
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
      toast.error("Failed to save task");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <BackButton fallbackHref="/ambassador/tasks" label="Back to Tasks" />

      {/* Stepper Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-text-muted">
          <span>STEP {step} OF 4</span>
          <span className="text-primary font-black uppercase tracking-wider">
            {step === 1 && "Step 1: Task Basics"}
            {step === 2 && "Step 2: Step-by-Step Instructions"}
            {step === 3 && "Step 3: Requirements & Form Integration"}
            {step === 4 && "Step 4: Audience & Points"}
          </span>
        </div>
        <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-border">
          <div
            className="h-full brand-gradient-bg transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: TASK BASICS */}
      {step === 1 && (
        <div className="p-7 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Task Creation Studio</span>
            </div>
            <h2 className="text-2xl font-black text-text tracking-tight">Step 1 — Task Basics</h2>
            <p className="text-xs text-text-muted mt-1">
              Configure the foundational metadata and type for your Zyven student initiative.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Task Title *"
              placeholder="e.g. Follow & Post on LinkedIn or Register for Campus Hackathon"
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="Social Media">Social Media</option>
                  <option value="Learning">Learning</option>
                  <option value="Course">Course</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Competition">Competition</option>
                  <option value="Event">Event</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Referral">Referral</option>
                  <option value="Survey">Survey</option>
                  <option value="Community">Community</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1.5">Task Type *</label>
                <select
                  value={taskType}
                  onChange={(e) => {
                    const t = e.target.value;
                    setTaskType(t);
                    if (t === "form") setEnableGoogleForm(true);
                  }}
                  className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="url">URL Submission</option>
                  <option value="screenshot">Screenshot Proof</option>
                  <option value="form">Form / Google Form Registration</option>
                  <option value="document">Document / PDF Submission</option>
                  <option value="ppt">PPT Submission</option>
                  <option value="quiz">Quiz Task</option>
                  <option value="course_completion">Course Completion</option>
                  <option value="text">Text Response</option>
                  <option value="multi_step">Multi-step Initiative</option>
                  <option value="hybrid">Hybrid Task</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1.5">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as typeof language)}
                  className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Both">Both (Bilingual)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1.5">Short Description *</label>
              <textarea
                rows={2}
                placeholder="A compelling 1-2 sentence overview shown on task cards..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-surface text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1.5">Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Complete details, background, learning outcomes, and verification criteria..."
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-surface text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">Platform Brand Target</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as typeof brand)}
                  className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="college">College Campus</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="event">Campus Event</option>
                </select>
              </div>

              <Input
                label="Estimated Completion Time (Minutes)"
                type="number"
                min={1}
                max={180}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              />
            </div>

            <Input
              label="External Reference or Action URL (Optional)"
              placeholder="https://... official post link or external platform URL"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="md"
              disabled={!title.trim() || !shortDescription.trim()}
              onClick={() => setStep(2)}
              className="gap-2 font-bold"
            >
              <span>Next: Instructions</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: INSTRUCTIONS */}
      {step === 2 && (
        <div className="p-7 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-text tracking-tight">Step 2 — Task Instructions</h2>
              <p className="text-xs text-text-muted mt-1">
                Build clear, sequential steps for students to follow. Add as many steps as needed.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={addInstruction} className="gap-1.5 text-xs font-bold">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Step</span>
            </Button>
          </div>

          <div className="space-y-3.5">
            {instructions.map((inst, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-surface-2 border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                    Step {inst.stepNumber}
                  </span>
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(idx)}
                      className="text-danger hover:opacity-80 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Step title (e.g. Join Discord or Open Google Form)"
                  value={inst.title}
                  onChange={(e) => updateInstruction(idx, "title", e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs font-bold text-text focus:outline-none"
                />

                <textarea
                  rows={2}
                  placeholder="Step instructions and guidance..."
                  value={inst.description}
                  onChange={(e) => updateInstruction(idx, "description", e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text focus:outline-none"
                />

                <input
                  type="url"
                  placeholder="Optional external link for this step (https://...)"
                  value={inst.actionUrl || ""}
                  onChange={(e) => updateInstruction(idx, "actionUrl", e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-surface text-[11px] text-text font-mono focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button variant="outline" size="md" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(3)} className="gap-2 font-bold">
              <span>Next: Requirements & Forms</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: REQUIREMENTS & GOOGLE FORM / SPREADSHEET */}
      {step === 3 && (
        <div className="p-7 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-6">
          <div>
            <h2 className="text-2xl font-black text-text tracking-tight">Step 3 — Proof Requirements & Forms</h2>
            <p className="text-xs text-text-muted mt-1">
              Specify what students must provide for review, and configure Google Form / Spreadsheet integrations.
            </p>
          </div>

          {/* GOOGLE FORM & SPREADSHEET CARD */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-xs font-black uppercase text-text tracking-wider">
                    Google Form & Spreadsheet Integration
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    Collect registrations, surveys, and track responses via Google Sheets
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableGoogleForm}
                  onChange={(e) => setEnableGoogleForm(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {enableGoogleForm && (
              <div className="space-y-3 pt-2 border-t border-primary/20">
                <Input
                  label="Google Form URL (for student registration / survey)"
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  value={googleFormUrl}
                  onChange={(e) => setGoogleFormUrl(e.target.value)}
                  leftIcon={<LinkIcon className="h-4 w-4 text-primary" />}
                />

                <Input
                  label="Google Spreadsheet Tracking URL (Optional - View / Verification)"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit?usp=sharing"
                  value={googleSpreadsheetUrl}
                  onChange={(e) => setGoogleSpreadsheetUrl(e.target.value)}
                  leftIcon={<FileSpreadsheet className="h-4 w-4 text-emerald-500" />}
                />
                <p className="text-[10px] text-text-muted">
                  Students will be prompted to open the Google Form to complete their task registration.
                </p>
              </div>
            )}
          </div>

          {/* PROOF CHECKBOXES */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-text block uppercase tracking-wider">
              Student Proof Types
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="p-3.5 rounded-xl border border-border bg-surface-2 flex items-center gap-2.5 cursor-pointer hover:border-primary/40 transition-colors">
                <input
                  type="checkbox"
                  checked={urlRequired}
                  onChange={(e) => setUrlRequired(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-bold text-text">URL Link Proof</span>
              </label>

              <label className="p-3.5 rounded-xl border border-border bg-surface-2 flex items-center gap-2.5 cursor-pointer hover:border-primary/40 transition-colors">
                <input
                  type="checkbox"
                  checked={screenshotRequired}
                  onChange={(e) => setScreenshotRequired(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-bold text-text">Screenshot Upload</span>
              </label>

              <label className="p-3.5 rounded-xl border border-border bg-surface-2 flex items-center gap-2.5 cursor-pointer hover:border-primary/40 transition-colors">
                <input
                  type="checkbox"
                  checked={documentRequired}
                  onChange={(e) => setDocumentRequired(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-bold text-text">Document / PPT Proof</span>
              </label>
            </div>
          </div>

          {/* SOCIAL POST TEMPLATE */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              Social Media Post Template (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Pre-written announcement text students can copy with one click..."
              value={postTemplateEn}
              onChange={(e) => setPostTemplateEn(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-surface text-xs text-text focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button variant="outline" size="md" onClick={() => setStep(2)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(4)} className="gap-2 font-bold">
              <span>Next: Audience & Points</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: AUDIENCE & POINTS (SOLO AMBASSADOR - NO TEAMS) */}
      {step === 4 && (
        <div className="p-7 rounded-[28px] bg-surface border border-border shadow-soft-sm space-y-6">
          <div>
            <h2 className="text-2xl font-black text-text tracking-tight">Step 4 — Task Audience & Points</h2>
            <p className="text-xs text-text-muted mt-1">
              Choose who receives the task and designate reward points (capped at {maxPointsCap} pts).
            </p>
          </div>

          <div className="space-y-5">
            {/* REWARD POINTS */}
            <div className="p-4 rounded-2xl bg-surface-2 border border-border space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-text">
                Task Reward Points
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={5}
                  max={maxPointsCap}
                  value={points}
                  onChange={(e) => setPoints(Math.min(Number(e.target.value), maxPointsCap))}
                  className="w-28 p-2.5 rounded-xl border border-border bg-surface text-base font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 tabular-nums"
                />
                <span className="text-xs text-text-muted">
                  Points awarded upon verified review (Platform policy: max {maxPointsCap} pts for ambassador tasks)
                </span>
              </div>
            </div>

            {/* AUDIENCE SELECTOR (SECTION 14 - NO TEAMS) */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black uppercase tracking-wider text-text">
                Task Audience Selection
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. PUBLIC */}
                <div
                  onClick={() => setAudience("public")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    audience === "public"
                      ? "border-primary bg-primary/5 text-text"
                      : "border-border bg-surface text-text-muted hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Globe className="h-4 w-4 text-primary" />
                    <span>1. Public</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    Visible to all eligible Zyven visitors and students across campuses.
                  </p>
                </div>

                {/* 2. ALL STUDENTS */}
                <div
                  onClick={() => setAudience("all_students")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    audience === "all_students"
                      ? "border-primary bg-primary/5 text-text"
                      : "border-border bg-surface text-text-muted hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>2. All Students</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    Available to every authenticated student account on the platform.
                  </p>
                </div>

                {/* 3. COLLEGE TARGETING */}
                <div
                  onClick={() => setAudience("college")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    audience === "college"
                      ? "border-primary bg-primary/5 text-text"
                      : "border-border bg-surface text-text-muted hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>3. College Targeting</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    Only students belonging to the chosen campus can discover this task.
                  </p>
                </div>

                {/* 4. SELECTED STUDENTS */}
                <div
                  onClick={() => setAudience("selected_students")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    audience === "selected_students"
                      ? "border-primary bg-primary/5 text-text"
                      : "border-border bg-surface text-text-muted hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <span>4. Selected Students</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    Targeted directly to specific student delegates for special initiatives.
                  </p>
                </div>
              </div>

              {/* College Dropdown if College Target is chosen */}
              {audience === "college" && (
                <div className="p-4 rounded-2xl bg-surface-2 border border-border space-y-2 mt-2">
                  <label className="block text-xs font-bold text-text">Select Target College</label>
                  <select
                    value={selectedCollegeId}
                    onChange={(e) => setSelectedCollegeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.shortName})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* SUBMISSION BUTTONS */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button variant="outline" size="md" onClick={() => setStep(3)} className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleSubmit("draft")}
                disabled={isPending}
                className="w-full sm:w-auto font-bold"
              >
                Save Draft
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => handleSubmit("pending_approval")}
                disabled={isPending}
                className="w-full sm:w-auto font-bold gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit for Admin Approval</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
