import type { SupabaseClient } from "@supabase/supabase-js";

type NotificationInput = {
  userId: string;
  type: string;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
};

export async function insertNotifications(client: SupabaseClient, notifications: NotificationInput[]) {
  if (notifications.length === 0) return;
  const { error } = await client.from("notifications").insert(notifications.map((notification) => ({
    user_id: notification.userId,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    entity_type: notification.entityType ?? null,
    entity_id: notification.entityId ?? null,
  })));
  if (error) throw new Error(error.message || "Failed to create notifications.");
}

export async function notifyRole(client: SupabaseClient, role: "student" | "ambassador" | "admin", notification: Omit<NotificationInput, "userId">) {
  const { data, error } = await client.from("profiles").select("id").eq("role", role).neq("status", "suspended");
  if (error) throw new Error(error.message || "Failed to find notification recipients.");
  await insertNotifications(client, (data ?? []).map((profile) => ({ ...notification, userId: profile.id })));
}
