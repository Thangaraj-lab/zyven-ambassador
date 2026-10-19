"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Listens to Supabase Realtime changes and safely invalidates TanStack Query caches.
 * Prevents duplicate items and ensures database is the single source of truth.
 */
export function useRealtimeSync(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    // Tasks channel
    const tasksChannel = supabase
      .channel("public-tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          queryClient.invalidateQueries({ queryKey: ["missions"] });
        }
      )
      .subscribe();

    // Submissions channel
    const submissionsChannel = supabase
      .channel("public-submissions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["submissions"] });
          queryClient.invalidateQueries({ queryKey: ["ambassador-metrics"] });
        }
      )
      .subscribe();

    // User-specific notifications & points
    let userChannel: ReturnType<typeof supabase.channel> | null = null;
    if (userId) {
      userChannel = supabase
        .channel(`user-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "point_transactions",
            filter: `student_id=eq.${userId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ["points"] });
            queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(submissionsChannel);
      if (userChannel) supabase.removeChannel(userChannel);
    };
  }, [queryClient, userId]);
}
