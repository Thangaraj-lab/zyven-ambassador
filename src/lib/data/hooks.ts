"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getRepository } from "./repository";
import { mockStore } from "./mock/store";


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
