"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Wrench,
  X,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  User,
  Sun,
  Moon,
  Languages,
  CheckCircle,
} from "lucide-react";
import { mockStore } from "@/lib/data/mock/store";
import { mockRepository } from "@/lib/data/mock/mockRepository";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { ADMIN_USER, CURRENT_USER } from "@/lib/data/mock/seed";

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();

  const state = mockStore.getState();
  const currentUserId = state.currentUserId;
  const isAdmin = currentUserId === ADMIN_USER.id;

  const handleSwitchRole = (role: "ambassador" | "admin") => {
    mockStore.setState(() => ({
      currentUserId: role === "admin" ? ADMIN_USER.id : CURRENT_USER.id,
    }));
    toast.success(`Switched role to ${role.toUpperCase()}`);
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const handleResetSeed = async () => {
    await mockRepository.resetSeed();
    toast.info("Database reset to initial seed data");
    router.refresh();
  };

  const handleLoadProgress = async () => {
    await mockRepository.loadProgressDemo();
    toast.success("Progress demo loaded: 80 Points (Bronze tier unlocked)!");
    router.refresh();
  };

  const handleSimulateApprove = async () => {
    const approved = await mockRepository.simulateAdminApprove();
    if (approved) {
      toast.success(`Approved submission: ${approved.id}`);
      router.refresh();
    } else {
      toast.info("No pending submissions to approve in queue");
    }
  };

  const toggleApprovalRequired = () => {
    mockStore.setState((prev) => ({
      approvalRequired: !prev.approvalRequired,
    }));
    toast.info(
      `Approval required set to: ${!state.approvalRequired ? "ON" : "OFF"}`
    );
  };

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ta" : "en";
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <>
      {/* Floating collapsed pill */}
      <div className="fixed bottom-4 left-4 z-50 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-text text-bg shadow-soft-lg text-xs font-bold hover:scale-105 active:scale-95 transition-all border border-border/40 cursor-pointer"
          aria-label="Open Dev Control Panel"
        >
          <Wrench className="h-3.5 w-3.5 text-primary" />
          <span>DevPanel</span>
          <span className="h-2 w-2 rounded-full bg-success" />
        </button>
      </div>

      {/* Expanded Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 z-50 w-84 sm:w-96 rounded-2xl bg-surface border border-border shadow-soft-lg p-5 overflow-y-auto max-h-[80vh] text-text">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm">Developer Tools</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:text-text cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="py-4 space-y-4 text-xs">
            {/* Role switch */}
            <div>
              <label className="font-bold block text-text-muted mb-1.5 uppercase text-[10px]">
                Active Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSwitchRole("ambassador")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border font-bold cursor-pointer transition-colors ${
                    !isAdmin
                      ? "brand-gradient-bg text-white border-transparent"
                      : "bg-surface-2 border-border text-text hover:bg-surface"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Ambassador</span>
                </button>
                <button
                  onClick={() => handleSwitchRole("admin")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border font-bold cursor-pointer transition-colors ${
                    isAdmin
                      ? "brand-gradient-bg text-white border-transparent"
                      : "bg-surface-2 border-border text-text hover:bg-surface"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Quick Demo States */}
            <div>
              <label className="font-bold block text-text-muted mb-1.5 uppercase text-[10px]">
                Simulation Controls
              </label>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-start text-xs font-bold"
                  onClick={handleLoadProgress}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                  Load Progress Demo (80 pts / Bronze)
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start text-xs font-bold"
                  onClick={handleSimulateApprove}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-success" />
                  Simulate Admin Approve Latest
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs font-bold"
                  onClick={handleResetSeed}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-2" />
                  Reset to Clean Seed
                </Button>
              </div>
            </div>

            {/* Environment toggles */}
            <div>
              <label className="font-bold block text-text-muted mb-1.5 uppercase text-[10px]">
                Quick Settings
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-border bg-surface-2 hover:bg-surface font-semibold text-text cursor-pointer"
                >
                  {theme === "dark" ? (
                    <Sun className="h-3.5 w-3.5" />
                  ) : (
                    <Moon className="h-3.5 w-3.5" />
                  )}
                  <span>Toggle Theme</span>
                </button>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-border bg-surface-2 hover:bg-surface font-semibold text-text cursor-pointer"
                >
                  <Languages className="h-3.5 w-3.5" />
                  <span>{locale === "en" ? "தமிழ்" : "English"}</span>
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-surface-2 border border-border">
                <span className="font-medium text-text">Require Approval</span>
                <button
                  onClick={toggleApprovalRequired}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    state.approvalRequired ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      state.approvalRequired ? "translate-x-4" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
