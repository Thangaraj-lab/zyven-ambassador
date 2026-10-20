import type { SupabaseClient } from "@supabase/supabase-js";

type NotificationInput = {
  userId: string;
  type: string;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
};

type EmailPreference = {
  email_enabled: boolean;
  task_updates: boolean;
  submission_updates: boolean;
  announcements: boolean;
  deadline_reminders: boolean;
  security_alerts: boolean;
};

function emailCategory(type: string): keyof Omit<EmailPreference, "email_enabled"> {
  if (type.includes("security") || type.includes("account_")) return "security_alerts";
  if (type === "announcement") return "announcements";
  if (type.includes("deadline")) return "deadline_reminders";
  if (type.includes("submission")) return "submission_updates";
  return "task_updates";
}

async function sendNotificationEmails(client: SupabaseClient, notifications: NotificationInput[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || notifications.length === 0) return;

  const userIds = [...new Set(notifications.map((notification) => notification.userId))];
  const [{ data: profiles }, { data: preferences }] = await Promise.all([
    client.from("profiles").select("id, email").in("id", userIds),
    client.from("notification_preferences").select("user_id, email_enabled, task_updates, submission_updates, announcements, deadline_reminders, security_alerts").in("user_id", userIds),
  ]);
  const emailByUser = new Map((profiles ?? []).map((profile) => [profile.id, profile.email]));
  const preferenceByUser = new Map((preferences ?? []).map((preference) => [preference.user_id, preference as EmailPreference]));

  await Promise.all(notifications.map(async (notification) => {
    const email = emailByUser.get(notification.userId);
    const preference = preferenceByUser.get(notification.userId);
    if (!email || preference?.email_enabled === false || (preference && preference[emailCategory(notification.type)] === false)) return;
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [email],
          subject: notification.title,
          html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>${escapeHtml(notification.title)}</h2><p>${escapeHtml(notification.body)}</p><p style="color:#6b7280;font-size:12px">ZYVEX Student Ambassador Platform</p></div>`,
        }),
      });
    } catch {
      // Email is best-effort; in-app notifications must still succeed.
    }
  }));
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character] ?? character));
}

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
  await sendNotificationEmails(client, notifications);
}

export async function notifyRole(client: SupabaseClient, role: "student" | "ambassador" | "admin", notification: Omit<NotificationInput, "userId">) {
  const { data, error } = await client.from("profiles").select("id").eq("role", role).neq("status", "suspended");
  if (error) throw new Error(error.message || "Failed to find notification recipients.");
  await insertNotifications(client, (data ?? []).map((profile) => ({ ...notification, userId: profile.id })));
}
