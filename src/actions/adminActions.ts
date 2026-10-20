"use server";

import { requireAdmin, requireAdminMFA } from "@/lib/auth/serverAuth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { insertNotifications } from "@/lib/notifications/server";

export async function setUserRoleAction(userId: string, role: "student" | "ambassador" | "admin") {
  // Role promotion is available to an authenticated admin. If the admin has
  // enrolled a verified MFA factor, the session is still challenged by the
  // MFA gate before this action is reached.
  const admin = await requireAdmin();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const { data: updated, error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select("id, role")
    .single();

  if (error) throw new Error(error.message);
  if (!updated || updated.role !== role) throw new Error("The user role was not updated.");

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

  await insertNotifications(supabase, [{
    userId,
    type: status === "suspended" ? "account_suspended" : "account_status_changed",
    title: status === "suspended" ? "Account Suspended" : "Account Status Updated",
    body: status === "suspended" ? "Your Zyvex account has been suspended by an administrator." : `Your account status is now ${status}.`,
    entityType: "profile",
    entityId: userId,
  }]);

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

  await insertNotifications(supabase, [{
    userId: studentId,
    type: "points_adjusted",
    title: amount >= 0 ? `+${amount} Points Added` : `${amount} Points Adjustment`,
    body: reason,
    entityType: "point_transaction",
    entityId: studentId,
  }]);

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
    body: "Congratulations! You are now an official Zyvex Campus Ambassador. You can now access the Ambassador portal and create tasks.",
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

  let recipientQuery = supabase.from("profiles").select("id").neq("status", "suspended");
  if (audienceType === "all_students") recipientQuery = recipientQuery.eq("role", "student");
  if (audienceType === "ambassadors") recipientQuery = recipientQuery.eq("role", "ambassador");
  if (audienceType === "college" && collegeId) recipientQuery = recipientQuery.eq("college_id", collegeId);
  const { data: recipients, error: recipientError } = await recipientQuery;
  if (recipientError) throw new Error(recipientError.message);
  await insertNotifications(supabase, (recipients ?? []).map((recipient) => ({
    userId: recipient.id,
    type: "announcement",
    title,
    body: content,
    entityType: "announcement",
    entityId: data.id,
  })));

  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return { success: true, announcement: data };
}
