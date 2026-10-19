"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  AdminStats,
  AmbassadorProfile,
  Announcement,
  AuditLog,
  College,
  CollegeLeaderboardEntry,
  LeaderboardEntry,
  Mission,
  Notification,
  PointTransaction,
  Reward,
  Submission,
  Tier,
  User,
} from "../types";
import type { Repository } from "../repository";

type Row = Record<string, unknown>;

function client() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("The Zyvex backend is not configured.");
  return supabase;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : fallback;
}

function userFromProfile(profile: Row): User {
  return {
    id: asString(profile.id),
    role: asString(profile.role, "student") as User["role"],
    name: asString(profile.full_name, "Student"),
    email: asString(profile.email),
    avatarUrl: typeof profile.avatar_url === "string" ? profile.avatar_url : null,
  };
}

function ambassadorProfileFromRow(profile: Row): AmbassadorProfile {
  return {
    userId: asString(profile.id),
    college: asString((profile.colleges as Row | null)?.name),
    department: asString(profile.department),
    year: asString(profile.year),
    city: asString(profile.city),
    interests: [],
    skills: [],
    whyJoin: asString(profile.bio),
    status: asString(profile.status, "active") as AmbassadorProfile["status"],
    joinedAt: asString(profile.created_at),
    cohortNumber: 1,
  };
}

function missionFromRow(task: Row, requirements: Row[] = [], steps: Row[] = []): Mission {
  const title = asString(task.title);
  return {
    id: asString(task.id),
    slug: asString(task.id),
    title,
    titleTa: title,
    description: asString(task.description),
    descriptionTa: asString(task.description),
    category: asString(task.category, "Social Media"),
    taskType: asString(task.task_type, "URL").toLowerCase() as Mission["taskType"],
    instructions: steps.map((step, index) => ({
      stepNumber: asNumber(step.step_number, index + 1),
      title: asString(step.title),
      description: asString(step.content),
      actionType: step.external_url ? "link" : "text",
      actionUrl: typeof step.external_url === "string" ? step.external_url : undefined,
    })),
    points: asNumber(task.points),
    difficulty: "Easy",
    estimatedMinutes: asNumber(task.estimated_minutes, 10),
    startsAt: asString(task.start_at),
    deadline: typeof task.deadline === "string" ? task.deadline : undefined,
    status: asString(task.status) as Mission["status"],
    proofTypes: requirements.map((requirement) => asString(requirement.type)),
    proofRequired: {
      url: requirements.some((requirement) => requirement.type === "url"),
      screenshot: requirements.some((requirement) => ["screenshot", "image"].includes(asString(requirement.type))),
      document: requirements.some((requirement) => ["pdf", "doc", "ppt", "file"].includes(asString(requirement.type))),
      text: requirements.some((requirement) => requirement.type === "text"),
    },
    verification: "manual",
    googleFormUrl: typeof task.google_form_url === "string" ? task.google_form_url : undefined,
    googleSpreadsheetUrl: typeof task.google_spreadsheet_url === "string" ? task.google_spreadsheet_url : undefined,
    brand: "college",
    audience: "public",
    createdById: typeof task.created_by === "string" ? task.created_by : undefined,
  };
}

function submissionFromRow(row: Row): Submission {
  const status = asString(row.status);
  const state = status === "in_progress" ? "STARTED" : status === "submitted" ? "UNDER_REVIEW" : status.toUpperCase();
  return {
    id: asString(row.id),
    missionId: asString(row.task_id),
    ambassadorId: asString(row.reviewed_by),
    state: state as Submission["state"],
    submittedAt: typeof row.submitted_at === "string" ? row.submitted_at : undefined,
    reviewedAt: typeof row.reviewed_at === "string" ? row.reviewed_at : undefined,
    reviewerId: typeof row.reviewed_by === "string" ? row.reviewed_by : undefined,
    reviewReason: typeof row.review_reason === "string" ? row.review_reason : undefined,
  };
}

async function currentProfile(): Promise<Row | null> {
  const supabase = client();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) throw error;
  return data as Row | null;
}

export const supabaseRepository: Repository = {
  async getSession() {
    const profile = await currentProfile();
    if (!profile) return { user: null, profile: null };
    return { user: userFromProfile(profile), profile: ambassadorProfileFromRow(profile) };
  },
  async login() { throw new Error("Use Supabase Auth directly for login."); },
  async loginWithGoogleMock() { throw new Error("Mock login is disabled in production."); },
  async loginAdminMock() { throw new Error("Mock login is disabled in production."); },
  async logout() { const { error } = await client().auth.signOut(); if (error) throw error; },
  async registerAmbassador() { throw new Error("Submit ambassador applications through the registration form."); },
  async updateProfile(data) {
    const profile = await currentProfile();
    if (!profile) throw new Error("Authentication required.");
    const updates: Record<string, string> = {};
    if (typeof data.department === "string") updates.department = data.department;
    if (typeof data.year === "string") updates.year = data.year;
    if (typeof data.city === "string") updates.city = data.city;
    if (typeof data.whyJoin === "string") updates.bio = data.whyJoin;

    const { data: updated, error } = await client()
      .from("profiles")
      .update(updates)
      .eq("id", profile.id)
      .select("*, colleges(name, code)")
      .single();
    if (error) throw error;
    return ambassadorProfileFromRow(updated as Row);
  },
  async getMe() {
    const profile = await currentProfile();
    return profile ? { user: userFromProfile(profile), profile: ambassadorProfileFromRow(profile) } : null;
  },
  async getMissions() {
    const { data, error } = await client().from("tasks").select("*, task_requirements(*), task_steps(*) ").order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as Row[]).map((task) => missionFromRow(task, (task.task_requirements as Row[]) ?? [], (task.task_steps as Row[]) ?? []));
  },
  async getMission(slug) { return (await this.getMissions()).find((mission) => mission.slug === slug || mission.id === slug) ?? null; },
  async startMission(missionId) {
    const profile = await currentProfile(); if (!profile) throw new Error("Authentication required.");
    const { data, error } = await client().from("submissions").upsert({ task_id: missionId, student_id: profile.id, status: "in_progress" }, { onConflict: "task_id,student_id" }).select("*").single();
    if (error) throw error; return submissionFromRow(data as Row);
  },
  async submitProof(data) {
    const profile = await currentProfile(); if (!profile) throw new Error("Authentication required.");
    const { data: submission, error } = await client().from("submissions").upsert({ task_id: data.missionId, student_id: profile.id, status: "submitted", submitted_at: new Date().toISOString() }, { onConflict: "task_id,student_id" }).select("*").single();
    if (error) throw error;
    if (data.proofUrl || data.note) {
      const { error: itemError } = await client().from("submission_items").insert({ submission_id: submission.id, url_value: data.proofUrl ?? null, text_value: data.note ?? null });
      if (itemError) throw itemError;
    }
    return submissionFromRow(submission as Row);
  },
  async getMySubmissions() { const { data, error } = await client().from("submissions").select("*").order("created_at", { ascending: false }); if (error) throw error; return ((data ?? []) as Row[]).map(submissionFromRow); },
  async getSubmission(id) { const { data, error } = await client().from("submissions").select("*").eq("id", id).maybeSingle(); if (error) throw error; return data ? submissionFromRow(data as Row) : null; },
  async getMyPoints() { const { data, error } = await client().from("point_transactions").select("*").order("created_at", { ascending: false }); if (error) throw error; const rows = (data ?? []) as Row[]; return { total: rows.reduce((total, row) => total + asNumber(row.amount), 0), transactions: rows.map((row) => ({ id: asString(row.id), ambassadorId: asString(row.student_id), submissionId: asString(row.submission_id), missionId: "", points: asNumber(row.amount), reason: asString(row.reason), createdAt: asString(row.created_at) })) }; },
  async getMyRank() { const profile = await currentProfile(); const leaderboard = await this.getLeaderboard({ scope: "individual" }) as LeaderboardEntry[]; const rank = leaderboard.find((entry) => entry.ambassadorId === profile?.id)?.rank ?? 0; return { rank, totalAmbassadors: leaderboard.length }; },
  async getLeaderboard({ scope }) {
    const { data: profiles, error: profilesError } = await client().from("profiles").select("id, full_name, college_id, avatar_url, colleges(name, code)").eq("leaderboard_visibility", true);
    if (profilesError) throw profilesError;
    const { data: points, error: pointsError } = await client().from("point_transactions").select("student_id, amount, created_at");
    if (pointsError) throw pointsError;
    const totals = new Map<string, number>();
    for (const point of (points ?? []) as Row[]) totals.set(asString(point.student_id), (totals.get(asString(point.student_id)) ?? 0) + asNumber(point.amount));
    const individuals = ((profiles ?? []) as Row[]).map((profile) => ({ ambassadorId: asString(profile.id), name: asString(profile.full_name, "Student"), college: asString((profile.colleges as Row | null)?.name, "Zyvex"), points: totals.get(asString(profile.id)) ?? 0, avatarUrl: typeof profile.avatar_url === "string" ? profile.avatar_url : null, isYou: false, earliestTimestamp: "" })).sort((a, b) => b.points - a.points).map((entry, index) => ({ ...entry, rank: index + 1 }));
    if (scope === "individual") return individuals;
    const colleges = new Map<string, CollegeLeaderboardEntry>();
    individuals.forEach((entry) => { const existing = colleges.get(entry.college) ?? { rank: 0, collegeId: entry.college, name: entry.college, shortName: entry.college, totalPoints: 0, memberCount: 0, averagePoints: 0, topAmbassadorName: entry.name, color: "var(--primary)" }; existing.totalPoints += entry.points; existing.memberCount += 1; if (entry.points > (existing.totalPoints - entry.points)) existing.topAmbassadorName = entry.name; colleges.set(entry.college, existing); });
    return [...colleges.values()].map((entry) => ({ ...entry, averagePoints: entry.memberCount ? entry.totalPoints / entry.memberCount : 0 })).sort((a, b) => b.totalPoints - a.totalPoints).map((entry, index) => ({ ...entry, rank: index + 1 }));
  },
  async getRewards() { const { data, error } = await client().from("rewards").select("*, tiers(*)"); if (error) throw error; return ((data ?? []) as Row[]).map((row) => ({ id: asString(row.id), tier: asString((row.tiers as Row | null)?.id, "bronze") as Reward["tier"], threshold: asNumber((row.tiers as Row | null)?.min_points), title: asString(row.title), titleTa: asString(row.title), perks: [asString(row.description)] })); },
  async getMyTier() { const points = await this.getMyPoints(); const { data, error } = await client().from("tiers").select("*").order("min_points"); if (error) throw error; const tiers = (data ?? []) as Row[]; const current = [...tiers].reverse().find((tier) => asNumber(tier.min_points) <= points.total) ?? tiers[0]; const next = tiers.find((tier) => asNumber(tier.min_points) > points.total); const mapTier = (tier: Row): Tier => asString(tier.id) as Tier; return { currentTier: mapTier(current), nextTier: next ? mapTier(next) : null, pointsToNext: next ? asNumber(next.min_points) - points.total : 0, progressPercentage: next ? Math.min(100, (points.total / asNumber(next.min_points)) * 100) : 100 }; },
  async getNotifications() { const { data, error } = await client().from("notifications").select("*").order("created_at", { ascending: false }); if (error) throw error; return ((data ?? []) as Row[]).map((row) => ({ id: asString(row.id), userId: asString(row.user_id), type: asString(row.type, "announcement") as Notification["type"], title: asString(row.title), body: asString(row.body), createdAt: asString(row.created_at), readAt: typeof row.read_at === "string" ? row.read_at : null })); },
  async markNotificationRead(id) { const { error } = await client().from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id); if (error) throw error; },
  async getAnnouncements() { const { data, error } = await client().from("announcements").select("*").order("published_at", { ascending: false }); if (error) throw error; return ((data ?? []) as Row[]).map((row) => ({ id: asString(row.id), title: asString(row.title), body: asString(row.content), createdAt: asString(row.published_at), pinned: false, audience: "all" })); },
  async listSubmissions() { const { data, error } = await client().from("submissions").select("*").order("created_at", { ascending: false }); if (error) throw error; return ((data ?? []) as Row[]).map(submissionFromRow); },
  async reviewSubmission({ submissionId, decision, reason }) { const action = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "changes_requested"; const { error } = await client().rpc("review_submission", { p_submission_id: submissionId, p_action: action, p_reason: reason ?? "" }); if (error) throw error; const submission = await this.getSubmission(submissionId); if (!submission) throw new Error("Submission not found."); return submission; },
  async listAmbassadors(params) {
    let query = client().from("profiles").select("*, colleges(name, code)").eq("role", "ambassador").order("created_at", { ascending: false });
    if (params?.status) query = query.eq("status", params.status);
    const { data, error } = await query;
    if (error) throw error;
    const profiles = (data ?? []) as Row[];
    const { data: points, error: pointsError } = await client().from("point_transactions").select("student_id, amount");
    if (pointsError) throw pointsError;
    const totals = new Map<string, number>();
    for (const point of (points ?? []) as Row[]) totals.set(asString(point.student_id), (totals.get(asString(point.student_id)) ?? 0) + asNumber(point.amount));
    return profiles.filter((profile) => !params?.search || `${asString(profile.full_name)} ${asString(profile.email)}`.toLowerCase().includes(params.search.toLowerCase())).map((profile) => ({
      user: userFromProfile(profile),
      profile: ambassadorProfileFromRow(profile),
      totalPoints: totals.get(asString(profile.id)) ?? 0,
    }));
  },
  async setAmbassadorStatus() { throw new Error("Use the admin user-management view."); },
  async listMissions() { return this.getMissions(); },
  async upsertMission() { throw new Error("Use the Ambassador Task Studio."); },
  async getAdminStats(): Promise<AdminStats> { const [users, submissions, points] = await Promise.all([client().from("profiles").select("id", { count: "exact", head: true }).eq("role", "ambassador"), client().from("submissions").select("id,status"), client().from("point_transactions").select("amount")]); if (users.error || submissions.error || points.error) throw users.error || submissions.error || points.error; const submissionRows = (submissions.data ?? []) as Row[]; return { totalAmbassadors: users.count ?? 0, pendingReviews: submissionRows.filter((row) => row.status === "submitted").length, pointsAwarded: ((points.data ?? []) as Row[]).reduce((total, row) => total + asNumber(row.amount), 0), approvalRate: submissionRows.length ? Math.round((submissionRows.filter((row) => row.status === "approved").length / submissionRows.length) * 100) : 0 }; },
  async getAuditLog(): Promise<AuditLog[]> { const { data, error } = await client().from("audit_logs").select("*").order("created_at", { ascending: false }); if (error) throw error; return ((data ?? []) as Row[]).map((row) => ({ id: asString(row.id), actorId: asString(row.actor_id), action: asString(row.action), entity: asString(row.entity_type), entityId: asString(row.entity_id), metadata: (row.metadata as Record<string, unknown>) ?? {}, createdAt: asString(row.created_at) })); },
  async getMyTeam() { return null; }, async listTeams() { return []; }, async createTeam() { throw new Error("Teams are not part of the Zyvex production portal."); }, async joinTeam() { throw new Error("Teams are not part of the Zyvex production portal."); },
  async createAmbassadorTask() { throw new Error("Use the Task Studio server action."); }, async approveTask() { throw new Error("Use the admin task approval action."); }, async rejectTask() { throw new Error("Use the admin task review action."); }, async setTaskStatus() { throw new Error("Use the Task Studio server action."); },
  async listUsers(params) {
    let query = client().from("profiles").select("*, colleges(name, code)").order("created_at", { ascending: false });
    if (params?.role) query = query.eq("role", params.role);
    if (params?.status) query = query.eq("status", params.status);
    const { data, error } = await query;
    if (error) throw error;
    const profiles = (data ?? []) as Row[];
    const { data: points, error: pointsError } = await client().from("point_transactions").select("student_id, amount");
    if (pointsError) throw pointsError;
    const totals = new Map<string, number>();
    for (const point of (points ?? []) as Row[]) {
      const id = asString(point.student_id);
      totals.set(id, (totals.get(id) ?? 0) + asNumber(point.amount));
    }
    return profiles
      .filter((profile) => !params?.search || `${asString(profile.full_name)} ${asString(profile.email)} ${asString(profile.id)}`.toLowerCase().includes(params.search.toLowerCase()))
      .map((profile) => ({
        user: userFromProfile(profile),
        profile: ambassadorProfileFromRow(profile),
        points: totals.get(asString(profile.id)) ?? 0,
        status: asString(profile.status, "active"),
      }));
  }, async setUserRole() { throw new Error("Use the admin role action."); }, async setUserStatus() { throw new Error("Use the admin status action."); },
  async publishAnnouncement() { throw new Error("Use the announcement server action."); },
  async listColleges() { const { data, error } = await client().from("colleges").select("*").eq("status", "active").order("name"); if (error) throw error; return ((data ?? []) as Row[]).map((row) => ({ id: asString(row.id), name: asString(row.name), shortName: asString(row.code), color: "var(--primary)" })); },
  async upsertCollege() { throw new Error("College management is restricted to administrators."); },
  async getPlatformSettings() { const { data, error } = await client().from("platform_settings").select("key,value"); if (error) throw error; const values = new Map(((data ?? []) as Row[]).map((row) => [asString(row.key), row.value])); return { maxAmbassadorTaskPoints: Number(values.get("max_ambassador_task_points") ?? 25), allowAmbassadorReview: true, requireScreenshotCompression: true, maintenanceMode: false }; },
  async updatePlatformSettings() { throw new Error("Platform settings are restricted to administrators."); },
  async resetSeed() { throw new Error("Seed reset is disabled in production."); }, async setSubmissionState() { throw new Error("Use the review workflow."); }, async simulateAdminApprove() { throw new Error("Simulation is disabled in production."); }, async loadProgressDemo() { throw new Error("Demo data is disabled in production."); },
};
