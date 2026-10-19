"use server";

import { requireAdmin, requireAdminMFA } from "@/lib/auth/serverAuth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setUserRoleAction(userId: string, role: "student" | "ambassador" | "admin") {
  // Sensitive action requires MFA assurance
  const admin = await requireAdminMFA();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const { error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: "set_user_role",
    entity_type: "profile",
    entity_id: userId,
    metadata: { role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function setUserStatusAction(userId: string, status: "active" | "suspended" | "pending") {
  const admin = await requireAdminMFA();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const { error } = await supabase
    .from("profiles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: "set_user_status",
    entity_type: "profile",
    entity_id: userId,
    metadata: { status },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function adjustPointsAction(studentId: string, amount: number, reason: string) {
  const admin = await requireAdminMFA();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const { error } = await supabase.from("point_transactions").insert({
    student_id: studentId,
    amount,
    type: "admin_adjustment",
    reason,
    created_by: admin.id,
  });

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: "adjust_points",
    entity_type: "point_transaction",
    entity_id: studentId,
    metadata: { amount, reason },
  });

  revalidatePath("/admin/users");
  revalidatePath("/leaderboard");
  return { success: true };
}

export async function approveAmbassadorRequestAction(requestId: string) {
  const admin = await requireAdmin();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const { data: req, error: fetchErr } = await supabase
    .from("ambassador_requests")
    .select("student_id")
    .eq("id", requestId)
    .single();

  if (fetchErr || !req) throw new Error("Request not found.");

  // Update request status
  await supabase
    .from("ambassador_requests")
    .update({
      status: "approved",
      reviewed_by: admin.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  // Upgrade student role to ambassador
  await supabase
    .from("profiles")
    .update({ role: "ambassador", updated_at: new Date().toISOString() })
    .eq("id", req.student_id);

  // Send notification
  await supabase.from("notifications").insert({
    user_id: req.student_id,
    type: "ambassador_approved",
    title: "Ambassador Application Approved!",
    body: "Congratulations! You are now an official Zyven Campus Ambassador. You can now access the Ambassador portal and create tasks.",
  });

  // Audit log
  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: "approve_ambassador_request",
    entity_type: "ambassador_request",
    entity_id: requestId,
    metadata: { student_id: req.student_id },
  });

  revalidatePath("/admin/ambassadors");
  return { success: true };
}

export async function createAnnouncementAction(
  title: string,
  content: string,
  audienceType: "all_students" | "ambassadors" | "college" = "all_students",
  collegeId?: string
) {
  const admin = await requireAdmin();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      created_by: admin.id,
      title,
      content,
      audience_type: audienceType,
      college_id: collegeId || null,
      status: "published",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return { success: true, announcement: data };
}
