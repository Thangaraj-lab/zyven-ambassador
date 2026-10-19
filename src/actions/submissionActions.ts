"use server";

import { z } from "zod";
import { requireStudent, requireAmbassador } from "@/lib/auth/serverAuth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function startTaskAction(taskId: string) {
  const profile = await requireStudent();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  // Check if live
  const { data: task } = await supabase
    .from("tasks")
    .select("id, status")
    .eq("id", taskId)
    .single();

  if (!task || task.status !== "live") {
    throw new Error("This task is not currently available to start.");
  }

  // Create or return active submission
  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status")
    .eq("task_id", taskId)
    .eq("student_id", profile.id)
    .maybeSingle();

  if (existing) {
    return { success: true, submissionId: existing.id, status: existing.status };
  }

  const { data: submission, error } = await supabase
    .from("submissions")
    .insert({
      task_id: taskId,
      student_id: profile.id,
      status: "in_progress",
    })
    .select()
    .single();

  if (error || !submission) {
    throw new Error(error?.message || "Failed to start task.");
  }

  return { success: true, submissionId: submission.id, status: submission.status };
}

const SubmissionItemsSchema = z.array(z.object({
  requirementId: z.string().uuid().optional(),
  textValue: z.string().optional(),
  urlValue: z.string().url().optional().or(z.literal("")),
  filePath: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
}));

import { validateTaskSubmissionUrl, normalizeSubmissionUrl } from "@/lib/security/linkValidator";

export async function submitTaskProofAction(taskId: string, items: z.infer<typeof SubmissionItemsSchema>) {
  const profile = await requireStudent();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  // Validate each submitted URL against real domain rules
  for (const item of items) {
    if (item.urlValue) {
      const result = validateTaskSubmissionUrl(item.urlValue);
      if (!result.isValid) {
        throw new Error(result.error || "The submitted URL is invalid or from an unsupported domain.");
      }
      item.urlValue = normalizeSubmissionUrl(item.urlValue);
    }
  }

  // Find or create in_progress submission
  let { data: sub } = await supabase
    .from("submissions")
    .select("id, status")
    .eq("task_id", taskId)
    .eq("student_id", profile.id)
    .maybeSingle();

  if (!sub) {
    const { data: created, error } = await supabase
      .from("submissions")
      .insert({
        task_id: taskId,
        student_id: profile.id,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !created) throw new Error("Failed to submit task proof.");
    sub = created;
  } else {
    // Update status to submitted
    const { error: updateError } = await supabase
      .from("submissions")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", sub.id);
    if (updateError) throw new Error(updateError.message || "Failed to submit task proof.");
  }

  const currentSub = sub as { id: string; status: string };

  // Insert submission items
  if (items.length > 0) {
    const rows = items.map((item) => ({
      submission_id: currentSub.id,
      requirement_id: item.requirementId || null,
      text_value: item.textValue || null,
      url_value: item.urlValue || null,
      file_path: item.filePath || null,
      metadata: item.metadata || {},
    }));
    const { error: itemError } = await supabase.from("submission_items").insert(rows);
    if (itemError) throw new Error(itemError.message || "Failed to save task proof.");
  }

  revalidatePath(`/missions/${taskId}`);
  revalidatePath("/dashboard");
  revalidatePath("/ambassador/submissions");

  return { success: true, submissionId: currentSub.id };
}

export async function reviewSubmissionAction(
  submissionId: string,
  action: "approved" | "rejected" | "changes_requested",
  reason: string = ""
) {
  // Authorization is validated inside requireAmbassador and then inside PostgreSQL RPC
  await requireAmbassador();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  // Call authoritative atomic RPC
  const { data, error } = await supabase.rpc("review_submission", {
    p_submission_id: submissionId,
    p_action: action,
    p_reason: reason,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/ambassador/submissions");
  revalidatePath("/ambassador");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");

  return data;
}
