"use server";

import { z } from "zod";
import { requireAmbassador, requireAdmin } from "@/lib/auth/serverAuth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const CreateTaskSchema = z.object({
  title: z.string().min(3).max(100),
  shortDescription: z.string().max(200).optional(),
  description: z.string().min(10),
  category: z.string().default("Social Media"),
  taskType: z.enum([
    "QUIZ", "MCQ", "UPLOAD", "PPT", "DOCUMENT", "IMAGE", "VIDEO",
    "URL", "TEXT", "COURSE_COMPLETION", "CERTIFICATE", "SCREENSHOT",
    "FORM", "SURVEY", "EVENT", "REFERRAL", "SOCIAL_MEDIA", "MULTI_STEP", "HYBRID"
  ]).default("HYBRID"),
  points: z.number().int().min(5).max(100),
  estimatedMinutes: z.number().int().min(1).default(10),
  audience: z.enum(["public", "all_students", "college", "selected_students"]).default("all_students"),
  collegeId: z.string().uuid().optional(),
  googleFormUrl: z.string().url().optional().or(z.literal("")),
  googleSpreadsheetUrl: z.string().url().optional().or(z.literal("")),
  submitForApproval: z.boolean().default(false),
});

export async function createTaskAction(input: z.infer<typeof CreateTaskSchema>) {
  const profile = await requireAmbassador();
  const parsed = CreateTaskSchema.parse(input);

  // Ambassador point limit check
  if (profile.role === "ambassador" && parsed.points > 25) {
    throw new Error("Ambassadors cannot create tasks worth more than 25 points without admin override.");
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    throw new Error("Database connection unavailable.");
  }

  const initialStatus = profile.role === "admin"
    ? "live"
    : (parsed.submitForApproval ? "pending_approval" : "draft");

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      created_by: profile.id,
      title: parsed.title,
      short_description: parsed.shortDescription || parsed.title,
      description: parsed.description,
      category: parsed.category,
      task_type: parsed.taskType,
      points: parsed.points,
      estimated_minutes: parsed.estimatedMinutes,
      status: initialStatus,
      google_form_url: parsed.googleFormUrl || null,
      google_spreadsheet_url: parsed.googleSpreadsheetUrl || null,
    })
    .select()
    .single();

  if (error || !task) {
    throw new Error(error?.message || "Failed to create task");
  }

  // Insert audience
  await supabase.from("task_audiences").insert({
    task_id: task.id,
    audience_type: parsed.audience,
    college_id: parsed.collegeId || null,
  });

  revalidatePath("/ambassador");
  revalidatePath("/admin/tasks");
  revalidatePath("/missions");

  return { success: true, task };
}

export async function approveTaskAction(taskId: string) {
  const profile = await requireAdmin();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const { error } = await supabase
    .from("tasks")
    .update({ status: "live", updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) throw new Error(error.message);

  // Log audit
  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "approve_task",
    entity_type: "task",
    entity_id: taskId,
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/ambassador");
  revalidatePath("/missions");

  return { success: true };
}

export async function rejectTaskAction(taskId: string, reason: string) {
  const profile = await requireAdmin();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const { error } = await supabase
    .from("tasks")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    action: "reject_task",
    entity_type: "task",
    entity_id: taskId,
    metadata: { reason },
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/ambassador");

  return { success: true };
}

export async function pauseTaskAction(taskId: string) {
  const profile = await requireAmbassador();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  // Check ownership if not admin
  const query = supabase.from("tasks").update({ status: "paused" }).eq("id", taskId);
  if (profile.role !== "admin") {
    query.eq("created_by", profile.id);
  }

  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/ambassador");
  revalidatePath("/missions");
  return { success: true };
}

export async function resumeTaskAction(taskId: string) {
  const profile = await requireAmbassador();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const query = supabase.from("tasks").update({ status: "live" }).eq("id", taskId);
  if (profile.role !== "admin") {
    query.eq("created_by", profile.id);
  }

  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/ambassador");
  revalidatePath("/missions");
  return { success: true };
}
