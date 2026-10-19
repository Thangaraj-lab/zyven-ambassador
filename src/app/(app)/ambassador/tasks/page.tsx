"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useMissions, useMyTeam, useSetTaskStatus } from "@/lib/data/hooks";
import {
  ClipboardList,
  PlusCircle,
  Play,
  Pause,
  Archive,
  Clock,
  Zap,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function AmbassadorTasksPage() {
  const { data: missions = [], isLoading } = useMissions();
  const { data: myTeam } = useMyTeam();
  const { mutateAsync: setStatus } = useSetTaskStatus();

  const [activeTab, setActiveTab] = useState<
    "all" | "draft" | "pending_approval" | "live" | "paused" | "archived"
  >("all");
  const [search, setSearch] = useState("");

  // Ambassador only manages their own team's tasks
  const teamTasks = missions.filter(
    (m) =>
      m.teamId === myTeam?.id ||
      m.audience === "own_team" ||
      m.createdById !== undefined
  );

  const filteredTasks = teamTasks.filter((task) => {
    const matchesTab =
      activeTab === "all" ? true : task.status === activeTab;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = async (
    taskId: string,
    newStatus: "live" | "paused" | "archived"
  ) => {
    try {
      await setStatus({ taskId, status: newStatus });
      toast.success(`Task status changed to ${newStatus.toUpperCase()}`);
    } catch {
      toast.error("Failed to update task status");
    }
  };

  const tabs = [
    { id: "all", label: "All Tasks" },
    { id: "pending_approval", label: "Pending Approval" },
    { id: "live", label: "Live" },
    { id: "draft", label: "Draft" },
    { id: "paused", label: "Paused" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <ClipboardList className="h-3.5 w-3.5" />
            <span>Team Task Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
            Team Tasks
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Create meaningful tasks for your team. Every new task requires admin approval.
          </p>
        </div>

        <Link href="/ambassador/tasks/new">
          <Button variant="primary" size="md" className="gap-2 font-bold shadow-soft-sm">
            <PlusCircle className="h-4 w-4" />
            <span>Create Task</span>
          </Button>
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "brand-gradient-bg text-white shadow-soft-sm"
                  : "text-text-muted hover:text-text hover:bg-surface-2"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-border bg-surface text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Tasks Grid / Cards */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-[28px] bg-surface border border-border space-y-3">
            <ClipboardList className="h-10 w-10 text-text-muted mx-auto opacity-40" />
            <h4 className="text-base font-bold text-text">No team tasks found</h4>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              {activeTab === "all"
                ? "You haven't created any tasks for your campus team yet."
                : `No tasks currently in ${activeTab.replace("_", " ")} status.`}
            </p>
            <Link href="/ambassador/tasks/new" className="inline-block pt-2">
              <Button variant="primary" size="sm">
                + Create First Team Task
              </Button>
            </Link>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 shadow-soft-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm font-extrabold text-text truncate">
                    {task.title}
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    +{task.points} pts
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">
                    {task.category}
                  </span>
                </div>
                <p className="text-xs text-text-muted line-clamp-1">
                  {task.description}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-text-muted pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~{task.estimatedMinutes} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Audience: {task.audience === "own_team" ? "Own Team" : "Specific Members"}
                  </span>
                </div>
              </div>

              {/* Status and Action Controls */}
              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
                <StatusBadge
                  state={
                    task.status === "live"
                      ? "AVAILABLE"
                      : task.status === "pending_approval"
                      ? "UNDER_REVIEW"
                      : "LOCKED"
                  }
                  size="sm"
                />

                {task.status === "live" && (
                  <button
                    onClick={() => handleStatusChange(task.id, "paused")}
                    className="p-2 rounded-xl text-text-muted hover:text-warning hover:bg-warning/10 transition-colors cursor-pointer"
                    title="Pause task"
                  >
                    <Pause className="h-4 w-4" />
                  </button>
                )}

                {task.status === "paused" && (
                  <button
                    onClick={() => handleStatusChange(task.id, "live")}
                    className="p-2 rounded-xl text-text-muted hover:text-success hover:bg-success/10 transition-colors cursor-pointer"
                    title="Resume task"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                )}

                {task.status !== "archived" && (
                  <button
                    onClick={() => handleStatusChange(task.id, "archived")}
                    className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    title="Archive task"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
