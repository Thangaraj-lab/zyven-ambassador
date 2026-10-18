"use client";

import React, { useState } from "react";
import { useMissions } from "@/lib/data/hooks";
import { mockRepository } from "@/lib/data/mock/mockRepository";
import { Button } from "@/components/ui/Button";
import { PointsPill } from "@/components/ui/PointsPill";
import { Plus, Clock, Edit, X, Check } from "lucide-react";
import { toast } from "sonner";
import type { Mission } from "@/lib/data/types";

export default function AdminMissionsPage() {
  const { data: missions = [], refetch } = useMissions();

  const [editingMission, setEditingMission] = useState<Partial<Mission> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [titleTa, setTitleTa] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(50);
  const [estimatedMinutes, setEstimatedMinutes] = useState(10);
  const [status, setStatus] = useState<Mission["status"]>("live");
  const [brand, setBrand] = useState<Mission["brand"]>("event");

  const handleOpenEdit = (m?: Mission) => {
    if (m) {
      setEditingMission(m);
      setTitle(m.title);
      setTitleTa(m.titleTa);
      setDescription(m.description);
      setPoints(m.points);
      setEstimatedMinutes(m.estimatedMinutes);
      setStatus(m.status);
      setBrand(m.brand);
    } else {
      setEditingMission({});
      setTitle("");
      setTitleTa("");
      setDescription("");
      setPoints(50);
      setEstimatedMinutes(10);
      setStatus("live");
      setBrand("event");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please enter a title and description");
      return;
    }

    setIsSaving(true);
    try {
      await mockRepository.upsertMission({
        id: editingMission?.id,
        title,
        titleTa: titleTa || title,
        description,
        descriptionTa: description,
        points: Number(points),
        estimatedMinutes: Number(estimatedMinutes),
        status,
        brand,
        proofTypes: ["url"],
        proofRequired: { url: true, screenshot: false },
        verification: "manual",
      });

      toast.success(
        editingMission?.id ? "Mission updated!" : "New mission published!"
      );
      setEditingMission(null);
      refetch();
    } catch {
      toast.error("Failed to save mission");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Campaigns
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Manage Campus Missions
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => handleOpenEdit()}
          className="gap-2 font-bold shadow-soft-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Create Mission</span>
        </Button>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-[20px] bg-surface border border-border shadow-soft-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {m.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    m.status === "live"
                      ? "bg-success/10 text-success border border-success/30"
                      : m.status === "coming_soon"
                      ? "bg-surface-2 text-text-muted border border-border"
                      : "bg-warning/10 text-warning border border-warning/30"
                  }`}
                >
                  {m.status.replace("_", " ")}
                </span>
              </div>

              <h3 className="text-base font-bold text-text mb-1">{m.title}</h3>
              <p className="text-xs text-text-muted line-clamp-2">
                {m.description}
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
                <PointsPill points={m.points} size="sm" />
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="h-3 w-3" /> {m.estimatedMinutes} mins
                </span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleOpenEdit(m)}
                className="gap-1.5"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Sheet Modal */}
      {editingMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[24px] bg-surface p-6 sm:p-8 border border-border shadow-soft-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-extrabold text-base text-text">
                {editingMission.id ? "Edit Mission" : "Create New Mission"}
              </h3>
              <button
                onClick={() => setEditingMission(null)}
                className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:text-text cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-text mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Share Instagram Story"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">
                  Title (Tamil)
                </label>
                <input
                  type="text"
                  value={titleTa}
                  onChange={(e) => setTitleTa(e.target.value)}
                  placeholder="e.g. Instagram Story பகிரவும்"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instructions for student ambassadors..."
                  className="w-full p-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">
                    Points Reward
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text mb-1">
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as Mission["status"])
                    }
                    className="w-full h-10 px-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="live">Live</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-text mb-1">
                    Brand Category
                  </label>
                  <select
                    value={brand}
                    onChange={(e) =>
                      setBrand(e.target.value as Mission["brand"])
                    }
                    className="w-full h-10 px-3 rounded-xl border border-border bg-bg text-text focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="event">Campus Event</option>
                    <option value="referral">Referral</option>
                    <option value="college">College Battle</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => setEditingMission(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSaving}
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  <span>Save Mission</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
