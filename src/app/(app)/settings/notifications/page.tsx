"use client";

import { useEffect, useState } from "react";
import { Bell, Mail, Megaphone, ShieldAlert, Save, Clock3 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  getNotificationPreferencesAction,
  updateNotificationPreferencesAction,
  type NotificationPreferences,
} from "@/actions/notificationActions";

const labels: Array<{ key: keyof NotificationPreferences; title: string; description: string; icon: typeof Bell }> = [
  { key: "email_enabled", title: "Email notifications", description: "Allow important updates to be delivered by email when email service is configured.", icon: Mail },
  { key: "task_updates", title: "Task updates", description: "New, approved, rejected, or changed tasks.", icon: Bell },
  { key: "submission_updates", title: "Submission updates", description: "Submission received, reviewed, or changes requested.", icon: Bell },
  { key: "announcements", title: "Announcements", description: "Platform announcements sent to your role or college.", icon: Megaphone },
  { key: "deadline_reminders", title: "Deadline reminders", description: "One daily reminder for tasks approaching their deadline.", icon: Clock3 },
  { key: "security_alerts", title: "Security alerts", description: "Account status and security-related notifications.", icon: ShieldAlert },
];

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNotificationPreferencesAction()
      .then(setPreferences)
      .catch(() => toast.error("Unable to load notification preferences."));
  }, []);

  if (!preferences) return <div className="max-w-2xl mx-auto p-8 text-sm text-text-muted">Loading notification preferences…</div>;

  const save = async () => {
    setSaving(true);
    try {
      setPreferences(await updateNotificationPreferencesAction(preferences));
      toast.success("Notification preferences saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Preferences</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text flex items-center gap-2"><Bell className="h-6 w-6 text-primary" /> Notifications</h1>
        <p className="text-sm text-text-muted mt-1">Choose which activity should appear in your feed and email.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface divide-y divide-border/60">
        {labels.map(({ key, title, description, icon: Icon }) => (
          <label key={key} className="flex items-center justify-between gap-4 p-4 cursor-pointer">
            <span className="flex items-start gap-3"><Icon className="h-4 w-4 text-primary mt-0.5" /><span><span className="block text-sm font-bold text-text">{title}</span><span className="block text-xs text-text-muted mt-0.5">{description}</span></span></span>
            <input type="checkbox" checked={preferences[key]} onChange={(event) => setPreferences({ ...preferences, [key]: event.target.checked })} className="h-5 w-5 accent-primary shrink-0" />
          </label>
        ))}
      </div>
      <Button type="button" variant="primary" onClick={save} isLoading={saving} className="gap-2"><Save className="h-4 w-4" /> Save preferences</Button>
    </div>
  );
}

