"use server";

import { requireActiveUser } from "@/lib/auth/serverAuth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type NotificationPreferences = {
  email_enabled: boolean;
  task_updates: boolean;
  submission_updates: boolean;
  announcements: boolean;
  deadline_reminders: boolean;
  security_alerts: boolean;
};

const defaults: NotificationPreferences = {
  email_enabled: true,
  task_updates: true,
  submission_updates: true,
  announcements: true,
  deadline_reminders: true,
  security_alerts: true,
};

export async function getNotificationPreferencesAction() {
  const { profile } = await requireActiveUser();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("email_enabled, task_updates, submission_updates, announcements, deadline_reminders, security_alerts")
    .eq("user_id", profile.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return { ...defaults, ...(data ?? {}) };
}

export async function updateNotificationPreferencesAction(input: Partial<NotificationPreferences>) {
  const { profile } = await requireActiveUser();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const values = { ...defaults, ...input };
  const { error } = await supabase.from("notification_preferences").upsert({
    user_id: profile.id,
    ...values,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return values;
}

