"use client";

import React, { useState, useEffect } from "react";
import {
  usePlatformSettings,
  useUpdatePlatformSettings,
} from "@/lib/data/hooks";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = usePlatformSettings();
  const { mutateAsync: updateSettings, isPending: isSaving } =
    useUpdatePlatformSettings();

  const [maxPoints, setMaxPoints] = useState(25);
  const [allowReview, setAllowReview] = useState(true);
  const [requireCompression, setRequireCompression] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    if (settings) {
      setMaxPoints(settings.maxAmbassadorTaskPoints || 25);
      setAllowReview(settings.allowAmbassadorReview ?? true);
      setRequireCompression(settings.requireScreenshotCompression ?? true);
      setMaintenance(settings.maintenanceMode ?? false);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        maxAmbassadorTaskPoints: Number(maxPoints),
        allowAmbassadorReview: allowReview,
        requireScreenshotCompression: requireCompression,
        maintenanceMode: maintenance,
      });
      toast.success("Platform settings successfully synchronized!");
    } catch {
      toast.error("Failed to update platform settings");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Settings className="w-3.5 h-3.5" />
              System Configuration
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 32</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Platform Governance Rules
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Configure global task point ceilings, verification privileges, and
            media processing policies.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Rule 1: Ambassador Task Points Ceiling */}
        <div className="p-6 rounded-2xl bg-surface/90 border border-border/60 space-y-4 shadow-soft-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <h2 className="text-base font-bold text-text">
                  Ambassador Task Point Ceiling
                </h2>
              </div>
              <p className="text-xs text-text-muted mt-1">
                Hard maximum point reward an ambassador can assign when creating
                a custom squad challenge. Keeps platform economy balanced.
              </p>
            </div>

            <div className="w-28 shrink-0">
              <input
                type="number"
                min={5}
                max={50}
                value={maxPoints}
                onChange={(e) => setMaxPoints(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-elevated/40 border border-border text-base font-black text-primary text-center focus:outline-none focus:border-primary"
              />
              <span className="text-[10px] text-text-muted text-center block mt-1 font-semibold">
                Points Max
              </span>
            </div>
          </div>
        </div>

        {/* Rule 2: Peer & Squad Verification Privileges */}
        <div className="p-6 rounded-2xl bg-surface/90 border border-border/60 space-y-4 shadow-soft-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-text">
                  Ambassador Review Privileges
                </h2>
              </div>
              <p className="text-xs text-text-muted mt-1 max-w-lg">
                When enabled, campus ambassadors can directly approve submissions
                and award ledger points to students within their own team.
              </p>
            </div>

            <input
              type="checkbox"
              checked={allowReview}
              onChange={(e) => setAllowReview(e.target.checked)}
              className="w-5 h-5 accent-primary rounded cursor-pointer shrink-0"
            />
          </div>
        </div>

        {/* Rule 3: Client-side Screenshot Optimization */}
        <div className="p-6 rounded-2xl bg-surface/90 border border-border/60 space-y-4 shadow-soft-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-bold text-text">
                  High-DPI Screenshot Compression
                </h2>
              </div>
              <p className="text-xs text-text-muted mt-1 max-w-lg">
                Automatically compress uploaded proof screenshots to under 800KB
                on the client prior to storage transmission.
              </p>
            </div>

            <input
              type="checkbox"
              checked={requireCompression}
              onChange={(e) => setRequireCompression(e.target.checked)}
              className="w-5 h-5 accent-primary rounded cursor-pointer shrink-0"
            />
          </div>
        </div>

        {/* Rule 4: Platform Maintenance Mode */}
        <div className="p-6 rounded-2xl bg-surface/90 border border-border/60 space-y-4 shadow-soft-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                <h2 className="text-base font-bold text-text">
                  Emergency Maintenance Mode
                </h2>
              </div>
              <p className="text-xs text-text-muted mt-1 max-w-lg">
                Restricts submissions and point distributions while allowing
                read-only inspection.
              </p>
            </div>

            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
              className="w-5 h-5 accent-rose-500 rounded cursor-pointer shrink-0"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            className="font-bold text-xs gap-1.5 shadow-soft-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
