"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SEED_COLLEGES } from "@/lib/data/mock/seed";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Building,
  Calendar,
  MapPin,
  Share2,
  Sparkles,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { ease } from "@/lib/motion";

const INTEREST_OPTIONS = [
  "Campus Leadership",
  "Tech Meetups & Events",
  "Open Source & AI",
  "Content & Social Media",
  "Hackathons",
  "Public Speaking",
  "Web & App Development",
  "Community Building",
];

export default function RegisterProfilePage() {
  const router = useRouter();

  // Step 2, 3, 4
  const [currentStep, setCurrentStep] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const [name] = useState(() => {
    if (typeof window === "undefined") return "Thangaraj";
    try {
      const d = localStorage.getItem("zyven_register_draft_step1");
      return d ? JSON.parse(d).name || "Thangaraj" : "Thangaraj";
    } catch {
      return "Thangaraj";
    }
  });
  const [email] = useState(() => {
    if (typeof window === "undefined") return "thangaraj@mec.edu";
    try {
      const d = localStorage.getItem("zyven_register_draft_step1");
      return d ? JSON.parse(d).email || "thangaraj@mec.edu" : "thangaraj@mec.edu";
    } catch {
      return "thangaraj@mec.edu";
    }
  });
  const [phone] = useState(() => {
    if (typeof window === "undefined") return "+91 98765 43210";
    try {
      const d = localStorage.getItem("zyven_register_draft_step1");
      return d ? JSON.parse(d).phone || "+91 98765 43210" : "+91 98765 43210";
    } catch {
      return "+91 98765 43210";
    }
  });

  const [college, setCollege] = useState(SEED_COLLEGES[0]?.name || "Kongu Engineering College");
  const [department, setDepartment] = useState("Computer Science and Engineering");
  const [year, setYear] = useState("3rd Year");
  const [city, setCity] = useState("Perundurai, Erode");
  const [studentId, setStudentId] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [interests, setInterests] = useState<string[]>(["Campus Leadership", "Hackathons"]);
  const [whyJoin, setWhyJoin] = useState("");
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (!college || !department || !year || !city) {
        toast.error("Please fill in all academic details");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedGuidelines || !agreedTerms) {
      toast.error("Please agree to the ambassador guidelines and terms");
      return;
    }

    if (whyJoin.trim().length < 20) {
      toast.error("Please share why you want to join (at least 20 characters)");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error("Registration is temporarily unavailable. Please try again shortly.");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in before submitting your ambassador application.");

      const { data: matchingCollege } = await supabase
        .from("colleges")
        .select("id")
        .eq("name", college)
        .maybeSingle();

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          college_id: matchingCollege?.id ?? null,
          department,
          year,
          city,
          bio: `Student ID: ${studentId || "not provided"}\nLinkedIn: ${linkedin || "not provided"}\nInstagram: ${instagram || "not provided"}`,
        })
        .eq("id", user.id);
      if (profileError) throw profileError;

      const application = [
        `College: ${college}`,
        `Department: ${department}`,
        `Year: ${year}`,
        `City: ${city}`,
        `Phone: ${phone || "not provided"}`,
        `LinkedIn: ${linkedin || "not provided"}`,
        `Instagram: ${instagram || "not provided"}`,
        `Interests: ${interests.join(", ") || "not provided"}`,
        "",
        whyJoin.trim(),
      ].join("\n");
      const { error: requestError } = await supabase
        .from("ambassador_requests")
        .insert({ student_id: user.id, reason: application });
      if (requestError) {
        if (requestError.code === "23505") {
          throw new Error("You already have an ambassador application awaiting review.");
        }
        throw requestError;
      }

      // Clear draft
      try {
        localStorage.removeItem("zyven_register_draft_step1");
      } catch {}

      toast.success("Application submitted! We will notify you after review.");
      router.push("/pending");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-[24px] bg-surface p-6 sm:p-9 border border-border shadow-soft-lg space-y-6">
      {/* Top Stepper Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-text-muted">
          <span className="text-primary uppercase tracking-wider text-[11px]">
            Step {currentStep} of 4
          </span>
          <span>
            {currentStep === 2
              ? "Academic Details"
              : currentStep === 3
              ? "Social Profiles"
              : "Ambassador Statement"}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          <div className="rounded-full brand-gradient-bg h-full" />
          <div
            className={`rounded-full h-full transition-colors ${
              currentStep >= 2 ? "brand-gradient-bg" : "bg-surface-2 border border-border"
            }`}
          />
          <div
            className={`rounded-full h-full transition-colors ${
              currentStep >= 3 ? "brand-gradient-bg" : "bg-surface-2 border border-border"
            }`}
          />
          <div
            className={`rounded-full h-full transition-colors ${
              currentStep >= 4 ? "brand-gradient-bg" : "bg-surface-2 border border-border"
            }`}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 2: ACADEMIC */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: ease.out }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-extrabold text-text">Academic Information</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Tell us where you study and your current department.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  College / Institution
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
                  >
                    {SEED_COLLEGES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.shortName})
                      </option>
                    ))}
                    <option value="Other Tamil Nadu College">Other Tamil Nadu College</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  Department / Branch
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. CSE, IT, CSBS, ECE"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text mb-1">
                    Year of Study
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1">
                    City / Town
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Rasipuram, Salem"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  Roll / Register Number (Optional)
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="23CB042"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => router.push("/register")}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
              <Button variant="primary" size="md" onClick={handleNextStep}>
                Next: Social Presence <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: SOCIAL */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: ease.out }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-extrabold text-text">Social & Campus Reach</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Missions involve sharing updates on LinkedIn and student groups.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <Share2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://www.linkedin.com/in/yourname"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  Instagram Handle (Optional)
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(2)}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
              <Button variant="primary" size="md" onClick={handleNextStep}>
                Next: Ambassador Statement <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: AMBASSADOR PROFILE & AGREEMENTS */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: ease.out }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-extrabold text-text">Ambassador Goals</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Select your focus areas and explain your motivation.
              </p>
            </div>

            <div className="space-y-4">
              {/* Interest Chips */}
              <div>
                <label className="block text-xs font-bold text-text mb-2">
                  Areas of Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((item) => {
                    const isSelected = interests.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
                          isSelected
                            ? "brand-gradient-bg text-white border-transparent scale-105 shadow-soft-sm"
                            : "bg-surface-2 border-border text-text hover:border-primary/40"
                        }`}
                      >
                        {isSelected && <Check className="inline h-3 w-3 mr-1 stroke-[3]" />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Why join textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-text">
                    Why do you want to be a Zyven Ambassador?
                  </label>
                  <span className="text-[10px] text-text-muted tabular-nums">
                    {whyJoin.length} chars (min 20)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={whyJoin}
                  onChange={(e) => setWhyJoin(e.target.value)}
                  placeholder="Share what excites you about leading tech initiatives at your college..."
                  className="w-full p-3 rounded-xl border border-border bg-bg text-text text-xs focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              {/* Agreements */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="flex items-start gap-2.5 text-xs text-text cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedGuidelines}
                    onChange={(e) => setAgreedGuidelines(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary"
                  />
                  <span>
                    I agree to follow the <strong>Zyven Student Ambassador Code of Conduct</strong> and represent the brand responsibly.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-text cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary"
                  />
                  <span>
                    I confirm my academic information is authentic and agree to the portal terms.
                  </span>
                </label>
              </div>

              {/* Fake Cloudflare Turnstile placeholder */}
              <div className="p-2.5 rounded-xl bg-surface-2 border border-border text-center text-[11px] text-text-muted flex items-center justify-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Cloudflare Turnstile Verified (Security Protection)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(3)}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleFinalSubmit}
                isLoading={isLoading}
              >
                Complete Registration <Check className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
