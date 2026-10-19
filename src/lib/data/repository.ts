import type {
  User,
  AmbassadorProfile,
  Mission,
  Submission,
  PointTransaction,
  Reward,
  Notification,
  Announcement,
  AuditLog,
  LeaderboardEntry,
  CollegeLeaderboardEntry,
  AdminStats,
  Tier,
} from "./types";

export interface Repository {
  // Session & Auth
  getSession(): Promise<{ user: User | null; profile: AmbassadorProfile | null }>;
  login(email: string, password?: string, requestedRole?: "student" | "ambassador"): Promise<User>;
  loginWithGoogleMock(email?: string, requestedRole?: "student" | "ambassador"): Promise<User>;
  loginAdminMock(): Promise<User>;
  logout(): Promise<void>;
  registerAmbassador(data: {
    name: string;
    email: string;
    phone?: string;
    college: string;
    department: string;
    year: string;
    city: string;
    studentId?: string;
    linkedin?: string;
    instagram?: string;
    interests: string[];
    skills: string[];
    whyJoin: string;
  }): Promise<{ user: User; profile: AmbassadorProfile }>;
  updateProfile(data: Partial<AmbassadorProfile>): Promise<AmbassadorProfile>;
  getMe(): Promise<{ user: User; profile: AmbassadorProfile } | null>;

  // Missions
  getMissions(): Promise<Mission[]>;
  getMission(slug: string): Promise<Mission | null>;
  startMission(missionId: string): Promise<Submission>;
  submitProof(data: {
    missionId: string;
    proofUrl?: string;
    screenshotDataUrl?: string;
    note?: string;
    filePath?: string;
  }): Promise<Submission>;
  getMySubmissions(): Promise<Submission[]>;
  getSubmission(id: string): Promise<Submission | null>;

  // Points, Leaderboard & Rewards
  getMyPoints(): Promise<{ total: number; transactions: PointTransaction[] }>;
  getMyRank(): Promise<{ rank: number; totalAmbassadors: number }>;
  getLeaderboard(params: {
    scope: "individual" | "college";
    period?: "all-time" | "weekly" | "monthly";
  }): Promise<LeaderboardEntry[] | CollegeLeaderboardEntry[]>;
  getRewards(): Promise<Reward[]>;
  getMyTier(): Promise<{
    currentTier: Tier;
    nextTier: Tier | null;
    pointsToNext: number;
    progressPercentage: number;
  }>;

  // Notifications & Announcements
  getNotifications(): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
  getAnnouncements(): Promise<Announcement[]>;

  // Admin
  listSubmissions(params?: {
    missionId?: string;
    state?: string;
    search?: string;
  }): Promise<Submission[]>;
  reviewSubmission(params: {
    submissionId: string;
    decision: "approve" | "reject" | "requestChanges";
    reason?: string;
  }): Promise<Submission>;
  listAmbassadors(params?: { status?: string; search?: string }): Promise<
    Array<{ user: User; profile: AmbassadorProfile; totalPoints: number }>
  >;
  setAmbassadorStatus(
    userId: string,
    status: "active" | "suspended" | "pending" | "rejected"
  ): Promise<AmbassadorProfile>;
  listMissions(): Promise<Mission[]>;
  upsertMission(mission: Partial<Mission> & { id?: string }): Promise<Mission>;
  getAdminStats(): Promise<AdminStats>;
  getAuditLog(): Promise<AuditLog[]>;

  // Team & Ambassador Management
  getMyTeam(): Promise<import("./types").Team | null>;
  listTeams(): Promise<import("./types").Team[]>;
  createTeam(data: { name: string; college: string; ambassadorId: string }): Promise<import("./types").Team>;
  joinTeam(inviteCode: string): Promise<import("./types").Team>;

  // Ambassador Tasks & Approval
  createAmbassadorTask(data: Partial<Mission>): Promise<Mission>;
  approveTask(taskId: string): Promise<Mission>;
  rejectTask(taskId: string, reason?: string): Promise<Mission>;
  setTaskStatus(taskId: string, status: "live" | "paused" | "archived"): Promise<Mission>;

  // User & Role Management
  listUsers(params?: { role?: string; status?: string; search?: string }): Promise<
    Array<{ user: User; profile?: AmbassadorProfile | null; points?: number; status?: string }>
  >;
  setUserRole(userId: string, role: "student" | "ambassador" | "admin"): Promise<User>;
  setUserStatus(userId: string, status: "active" | "suspended" | "pending"): Promise<void>;

  // Announcements & Directory
  publishAnnouncement(data: {
    title: string;
    body: string;
    audience?: "all" | "team" | "ambassadors";
    teamId?: string;
    pinned?: boolean;
  }): Promise<Announcement>;
  listColleges(): Promise<import("./types").College[]>;
  upsertCollege(data: Partial<import("./types").College>): Promise<import("./types").College>;

  // Platform Settings
  getPlatformSettings(): Promise<import("./types").PlatformSettings>;
  updatePlatformSettings(settings: Partial<import("./types").PlatformSettings>): Promise<import("./types").PlatformSettings>;

  // Dev & Testing
  resetSeed(): Promise<void>;
  setSubmissionState(
    submissionId: string,
    state: Submission["state"],
    reason?: string
  ): Promise<Submission>;
  simulateAdminApprove(submissionId?: string): Promise<Submission | null>;
  loadProgressDemo(): Promise<void>;
}

// Global factory to get configured repository
let repositoryInstance: Repository | null = null;

export async function getRepository(): Promise<Repository> {
  if (repositoryInstance) return repositoryInstance;

  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    const { mockRepository } = await import("./mock/mockRepository");
    repositoryInstance = mockRepository;
  } else {
    const { supabaseRepository } = await import("./supabase/supabaseRepository");
    repositoryInstance = supabaseRepository;
  }
  return repositoryInstance;
}
