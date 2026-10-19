"use client";

import React, { useState, useMemo } from "react";
import {
  useMissions,
  useApproveTask,
  useRejectTask,
  useSetTaskStatus,
  usePlatformSettings,
} from "@/lib/data/hooks";
import { createTaskAction } from "@/actions/taskActions";
import { Button } from "@/components/ui/Button";
import { PointsPill } from "@/components/ui/PointsPill";
import {
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Pause,
  Archive,
  Search,
  Filter,
  Plus,
  AlertCircle,
  Sparkles,
  Users,
  Eye,
  CornerDownRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import type { Mission } from "@/lib/data/types";

export default function AdminTasksPage() {
  const { data: missions = [], refetch } = useMissions();
  const { data: settings } = usePlatformSettings();
  const { mutateAsync: approveTask, isPending: isApproving } = useApproveTask();
  const { mutateAsync: rejectTask, isPending: isRejecting } = useRejectTask();
  const { mutateAsync: setTaskStatus, isPending: isSettingStatus } =
    useSetTaskStatus();

  const [activeTab, setActiveTab] = useState<
    "ALL" | "PENDING" | "LIVE" | "PAUSED" | "REJECTED"
  >("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  // Reject modal state
  const [rejectingTaskId, setRejectingTaskId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Create Task Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPoints, setNewPoints] = useState(50);
  const [newCategory, setNewCategory] = useState("Platform");
  const [isCreating, setIsCreating] = useState(false);

  // Filter tasks
  const filteredMissions = useMemo(() => {
    return missions.filter((m) => {
      if (activeTab === "PENDING" && m.status !== "pending_approval") return false;
      if (activeTab === "LIVE" && m.status !== "live") return false;
      if (activeTab === "PAUSED" && m.status !== "paused") return false;
      if (activeTab === "REJECTED" && m.status !== "rejected") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [missions, activeTab, searchQuery]);

  const pendingCount = missions.filter(
    (m) => m.status === "pending_approval"
  ).length;
  const liveCount = missions.filter((m) => m.status === "live").length;
  const pausedCount = missions.filter((m) => m.status === "paused").length;

  const handleApprove = async (id: string, title: string) => {
    try {
      await approveTask(id);
      toast.success(`Task "${title}" is now LIVE!`);
    } catch {
      toast.error("Failed to approve task");
    }
  };

  const handleExecuteReject = async () => {
    if (!rejectingTaskId) return;
    try {
      await rejectTask({ taskId: rejectingTaskId, reason: rejectReason.trim() });
      toast.success("Task proposal rejected");
      setRejectingTaskId(null);
      setRejectReason("");
    } catch {
      toast.error("Failed to reject task");
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "live" | "paused" | "archived"
  ) => {
    try {
      await setTaskStatus({ taskId: id, status });
      toast.success(`Task marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCreateGlobalTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error("Please enter a title and description");
      return;
    }

    setIsCreating(true);
    try {
      const slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      await createTaskAction({
        title: newTitle.trim(),
        shortDescription: newDescription.trim(),
        description: newDescription.trim(),
        category: newCategory,
        taskType: "URL",
        points: Number(newPoints),
        estimatedMinutes: 15,
        audience: "all_students",
        submitForApproval: false,
      });

      toast.success(`Global task "${newTitle}" created and live!`);
      setShowCreateModal(false);
      setNewTitle("");
      setNewDescription("");
      setNewPoints(50);
      refetch();
    } catch {
      toast.error("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Target className="w-3.5 h-3.5" />
              Platform Operations
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 27</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Task Governance & Approval
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Review ambassador task proposals, audit criteria, and publish global
            challenges.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowCreateModal(true)}
          className="font-bold text-xs gap-1.5 shadow-soft-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Global Challenge</span>
        </Button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Awaiting Approval</div>
          <div className="text-xl font-black text-amber-400 mt-1 flex items-center gap-2">
            <span>{pendingCount}</span>
            {pendingCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                Action Required
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Live Tasks</div>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {liveCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Paused / Draft</div>
          <div className="text-xl font-black text-text-muted mt-1">
            {pausedCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="text-[11px] font-semibold text-text-muted">Max Ambassador Pts</div>
          <div className="text-xl font-black text-primary mt-1">
            {settings?.maxAmbassadorTaskPoints || 25} pts
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border/60 rounded-xl overflow-x-auto">
          {[
            { id: "PENDING", label: `Pending Approval (${pendingCount})` },
            { id: "LIVE", label: `Live (${liveCount})` },
            { id: "ALL", label: `All Tasks (${missions.length})` },
            { id: "PAUSED", label: `Paused (${pausedCount})` },
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
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border/60 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Tasks Table / Cards */}
      <div className="space-y-3">
        {filteredMissions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border/60 bg-surface/30">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-text">No tasks in this view</h3>
            <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
              All ambassador submissions have been processed, or no tasks match
              your filter.
            </p>
          </div>
        ) : (
          filteredMissions.map((task) => {
            const isPending = task.status === "pending_approval";
            const isLive = task.status === "live";
            const isPaused = task.status === "paused";
            const isRejected = task.status === "rejected";

            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isPending
                    ? "bg-gradient-to-r from-amber-500/5 via-surface to-surface border-amber-500/40 shadow-soft-sm ring-1 ring-amber-500/20"
                    : "bg-surface/90 border-border/60"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isPending
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : isLive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : isPaused
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {isPending
                          ? "Pending Admin Approval"
                          : isLive
                          ? "Live & Active"
                          : isPaused
                          ? "Paused"
                          : "Rejected"}
                      </span>
                      <span className="text-xs font-semibold text-text-muted">
                        • {task.category}
                      </span>
                      {task.audience && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-elevated text-text-muted">
                          Audience: {task.audience}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-text">
                      {task.title}
                    </h2>

                    <p className="text-xs text-text-muted line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-text-muted pt-1">
                      <span className="font-bold text-primary flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        +{task.points} pts
                      </span>
                      <span>•</span>
                      <span>~{task.estimatedMinutes} mins</span>
                      {task.instructions && (
                        <>
                          <span>•</span>
                          <span>{task.instructions.length} steps</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isPending ? (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(task.id, task.title)}
                          isLoading={isApproving}
                          className="font-bold text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-soft-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRejectingTaskId(task.id);
                            setRejectReason("");
                          }}
                          disabled={isRejecting}
                          className="font-bold text-xs gap-1.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        {isLive && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleStatusChange(task.id, "paused")}
                            isLoading={isSettingStatus}
                            className="font-semibold text-xs gap-1.5 border-border/60"
                          >
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </Button>
                        )}

                        {isPaused && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleStatusChange(task.id, "live")}
                            isLoading={isSettingStatus}
                            className="font-semibold text-xs gap-1.5 border-border/60 text-emerald-400"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(task.id, "archived")}
                          isLoading={isSettingStatus}
                          className="font-semibold text-xs gap-1.5 text-text-muted hover:text-text"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Archive</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reject Task Dialog */}
      <AnimatePresence>
        {rejectingTaskId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-soft-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text">
                    Reject Task Proposal
                  </h3>
                  <p className="text-xs text-text-muted">
                    Explain to the ambassador why this task cannot be approved.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Points exceed cap, or verification criteria is too vague..."
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
                    setRejectingTaskId(null);
                    setRejectReason("");
                  }}
                  className="text-text-muted hover:text-text font-semibold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleExecuteReject}
                  isLoading={isRejecting}
                  className="font-bold text-xs"
                >
                  Confirm Rejection
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Challenge Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-surface border border-border rounded-2xl p-6 space-y-5 shadow-soft-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text">
                      New Global Platform Challenge
                    </h3>
                    <p className="text-xs text-text-muted">
                      Directly publishes a challenge to all ambassadors & students across Tamil Nadu.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-text-muted hover:text-text text-sm font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateGlobalTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Zyven State Hackathon Campus Registration Drive"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text focus:outline-none focus:border-primary"
                    >
                      <option value="Event">Event</option>
                      <option value="Social">Social</option>
                      <option value="Campus">Campus</option>
                      <option value="Referral">Referral</option>
                      <option value="Community">Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                      Reward Points
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={200}
                      value={newPoints}
                      onChange={(e) => setNewPoints(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text focus:outline-none focus:border-primary font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Instructions & Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe what students need to do and what verification proof they must upload..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                    className="font-semibold text-xs text-text-muted hover:text-text"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isCreating}
                    className="font-bold text-xs gap-1.5 shadow-soft-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publish Global Task</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
