import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Server database is not configured." }, { status: 503 });

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const { data: tasks, error: taskError } = await supabase
    .from("tasks")
    .select("id, title, deadline, created_by")
    .eq("status", "live")
    .gt("deadline", now.toISOString())
    .lte("deadline", tomorrow.toISOString());
  if (taskError) return NextResponse.json({ error: taskError.message }, { status: 500 });

  let created = 0;
  const dateKey = now.toISOString().slice(0, 10);
  for (const task of tasks ?? []) {
    const { data: recipients } = await supabase
      .from("profiles")
      .select("id")
      .neq("status", "suspended")
      .in("role", ["student", "ambassador"]);
    for (const recipient of recipients ?? []) {
      const { data: preference } = await supabase.from("notification_preferences").select("deadline_reminders").eq("user_id", recipient.id).maybeSingle();
      if (preference && preference.deadline_reminders === false) continue;
      const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", recipient.id).eq("entity_id", task.id).eq("type", "deadline_reminder").gte("created_at", `${dateKey}T00:00:00.000Z`);
      if (count) continue;
      const { error } = await supabase.from("notifications").insert({ user_id: recipient.id, type: "deadline_reminder", title: "Task deadline tomorrow", body: `“${task.title}” is due within the next 24 hours.`, entity_type: "task", entity_id: task.id });
      if (!error) created += 1;
    }
  }
  return NextResponse.json({ ok: true, tasks: tasks?.length ?? 0, notifications: created });
}

