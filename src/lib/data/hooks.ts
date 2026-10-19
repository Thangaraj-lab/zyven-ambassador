"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getRepository } from "./repository";
import { mockStore } from "./mock/store";
import {
  createTaskAction,
  approveTaskAction,
  rejectTaskAction,
  pauseTaskAction,
  resumeTaskAction,
  archiveTaskAction,
} from "@/actions/taskActions";
import { setUserRoleAction, setUserStatusAction } from "@/actions/adminActions";


// Auto invalidate queries when mockStore updates
export function useStoreSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = mockStore.subscribe(() => {
      queryClient.invalidateQueries();
    });
    return unsubscribe;
  }, [queryClient]);
}

export function useSession() {
  useStoreSync();
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getSession();
    },
  });
}

export function useMe() {
  useStoreSync();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getMe();
    },
  });
}

export function useMissions() {
  useStoreSync();
  return useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getMissions();
    },
  });
}

export function useMission(slug: string) {
  useStoreSync();
  return useQuery({
    queryKey: ["mission", slug],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getMission(slug);
    },
    enabled: !!slug,
  });
}

export function useMySubmissions() {
  useStoreSync();
  return useQuery({
    queryKey: ["mySubmissions"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getMySubmissions();
    },
  });
}

export function useSubmission(id: string) {
  useStoreSync();
  return useQuery({
    queryKey: ["submission", id],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getSubmission(id);
    },
    enabled: !!id,
  });
}

export function useMyPoints() {
  useStoreSync();
  return useQuery({
    queryKey: ["myPoints"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getMyPoints();
    },
  });
}

export function useMyRank() {
  useStoreSync();
  return useQuery({
    queryKey: ["myRank"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getMyRank();
    },
  });
}

export function useMyTier() {
  useStoreSync();
  return useQuery({
    queryKey: ["myTier"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getMyTier();
    },
  });
}

export function useLeaderboard(
  scope: "individual" | "college" = "individual",
  period: "all-time" | "weekly" | "monthly" = "all-time"
) {
  useStoreSync();
  return useQuery({
    queryKey: ["leaderboard", scope, period],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getLeaderboard({ scope, period });
    },
  });
}

export function useRewards() {
  useStoreSync();
  return useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getRewards();
    },
  });
}

export function useNotifications() {
  useStoreSync();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getNotifications();
    },
  });
}

export function useAnnouncements() {
  useStoreSync();
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getAnnouncements();
    },
  });
}

// Admin hooks
export function useAdminStats() {
  useStoreSync();
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getAdminStats();
    },
  });
}

export function useAdminSubmissions(params?: {
  missionId?: string;
  state?: string;
  search?: string;
}) {
  useStoreSync();
  return useQuery({
    queryKey: ["adminSubmissions", params],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.listSubmissions(params);
    },
  });
}

export function useAdminAmbassadors(params?: {
  status?: string;
  search?: string;
}) {
  useStoreSync();
  return useQuery({
    queryKey: ["adminAmbassadors", params],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.listAmbassadors(params);
    },
  });
}

// Mutations
export function useStartMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (missionId: string) => {
      const repo = await getRepository();
      return repo.startMission(missionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubmissions"] });
    },
  });
}

export function useSubmitProof() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      missionId: string;
      proofUrl?: string;
      screenshotDataUrl?: string;
      note?: string;
    }) => {
      const repo = await getRepository();
      return repo.submitProof(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useReviewSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      submissionId: string;
      decision: "approve" | "reject" | "requestChanges";
      reason?: string;
    }) => {
      const repo = await getRepository();
      return repo.reviewSubmission(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const repo = await getRepository();
      return repo.markNotificationRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Team & Ambassador Hooks
export function useMyTeam() {
  useStoreSync();
  return useQuery({
    queryKey: ["myTeam"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getMyTeam();
    },
  });
}

export function useTeams() {
  useStoreSync();
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.listTeams();
    },
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; college: string; ambassadorId: string }) => {
      const repo = await getRepository();
      return repo.createTeam(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["myTeam"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useJoinTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const repo = await getRepository();
      return repo.joinTeam(inviteCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["myTeam"] });
    },
  });
}

// Ambassador Task Hooks
export function useCreateAmbassadorTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<import("./types").Mission>) => {
      const result = await createTaskAction({
        title: data.title || "",
        shortDescription: data.description,
        description: data.description || "",
        category: data.category || "Social Media",
        taskType: String(data.taskType || "HYBRID").toUpperCase() as never,
        points: Number(data.points || 5),
        estimatedMinutes: Number(data.estimatedMinutes || 10),
        audience: data.audience === "college" ? "college" : data.audience === "selected_students" ? "selected_students" : data.audience === "all_students" ? "all_students" : "public",
        collegeId: data.collegeId,
        googleFormUrl: data.googleFormUrl,
        googleSpreadsheetUrl: data.googleSpreadsheetUrl,
        submitForApproval: data.status === "pending_approval",
      });
      return result.task as unknown as import("./types").Mission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useApproveTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      const result = await approveTaskAction(taskId);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useRejectTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: string; reason?: string }) => {
      return rejectTaskAction(taskId, reason || "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useSetTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: "live" | "paused" | "archived";
    }) => {
      if (status === "live") return resumeTaskAction(taskId);
      if (status === "archived") return archiveTaskAction(taskId);
      return pauseTaskAction(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

// Admin Users & Role Hooks
export function useAdminUsers(params?: { role?: string; status?: string; search?: string }) {
  useStoreSync();
  return useQuery({
    queryKey: ["adminUsers", params],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.listUsers(params);
    },
  });
}

export function useSetUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: "student" | "ambassador" | "admin";
    }) => {
      return setUserRoleAction(userId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useSetUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: string;
      status: "active" | "suspended" | "pending";
    }) => {
      return setUserStatusAction(userId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

// Announcements & Directory Hooks
export function usePublishAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      body: string;
      audience?: "all" | "team" | "ambassadors";
      teamId?: string;
      pinned?: boolean;
    }) => {
      const repo = await getRepository();
      return repo.publishAnnouncement(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useColleges() {
  useStoreSync();
  return useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.listColleges();
    },
  });
}

export function usePlatformSettings() {
  useStoreSync();
  return useQuery({
    queryKey: ["platformSettings"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getPlatformSettings();
    },
  });
}

export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<import("./types").PlatformSettings>) => {
      const repo = await getRepository();
      return repo.updatePlatformSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog"] });
    },
  });
}

export function useAuditLogs() {
  useStoreSync();
  return useQuery({
    queryKey: ["auditLog"],
    queryFn: async () => {
      const repo = await getRepository();
      return repo.getAuditLog();
    },
  });
}

