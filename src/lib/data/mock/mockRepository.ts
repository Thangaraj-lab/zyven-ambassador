import type { Repository } from "../repository";
import type {
  User,
  MissionType,
  TaskAudience,
  AmbassadorProfile,
  Mission,
  Submission,
  PointTransaction,
  Notification,
  AuditLog,
  Announcement,
  LeaderboardEntry,
  CollegeLeaderboardEntry,
  Tier,
} from "../types";
import { mockStore } from "./store";
import {
  SEED_COLLEGES,
  SEED_REWARDS,
  ADMIN_USER,
  ADMIN_CREDENTIAL_PASSWORD,
  CURRENT_USER,
  AMBASSADOR_USER,
} from "./seed";
import normalizeUrl from "normalize-url";
import { validateTaskSubmissionUrl, normalizeSubmissionUrl } from "@/lib/security/linkValidator";

// Artificial latency helper (300-500ms)
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export function validateLinkedInUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("linkedin.com")) return false;
    return /linkedin\.com\/(posts|feed\/update)/i.test(url);
  } catch {
    return false;
  }
}

export function cleanUrl(url: string): string {
  try {
    return normalizeUrl(url, {
      stripWWW: true,
      removeTrailingSlash: true,
      stripHash: true,
      removeQueryParameters: [/^utm_\w+/i, "trackingId", "rcm", "ref", "source"],
    });
  } catch {
    return url.trim().toLowerCase();
  }
}

export function calculateTier(points: number): {
  currentTier: Tier;
  nextTier: Tier | null;
  pointsToNext: number;
  progressPercentage: number;
} {
  if (points >= 500) {
    return {
      currentTier: "champion",
      nextTier: null,
      pointsToNext: 0,
      progressPercentage: 100,
    };
  }
  if (points >= 300) {
    const progress = Math.round(((points - 300) / 200) * 100);
    return {
      currentTier: "gold",
      nextTier: "champion",
      pointsToNext: 500 - points,
      progressPercentage: progress,
    };
  }
  if (points >= 150) {
    const progress = Math.round(((points - 150) / 150) * 100);
    return {
      currentTier: "silver",
      nextTier: "gold",
      pointsToNext: 300 - points,
      progressPercentage: progress,
    };
  }
  if (points >= 50) {
    const progress = Math.round(((points - 50) / 100) * 100);
    return {
      currentTier: "bronze",
      nextTier: "silver",
      pointsToNext: 150 - points,
      progressPercentage: progress,
    };
  }
  const progress = Math.round((points / 50) * 100);
  return {
    currentTier: "bronze",
    nextTier: "bronze",
    pointsToNext: 50 - points,
    progressPercentage: progress,
  };
}

export const mockRepository: Repository = {
  async getSession() {
    await delay(150);
    const { users, profiles, currentUserId } = mockStore.getState();
    if (!currentUserId) return { user: null, profile: null };

    const user = users.find((u) => u.id === currentUserId) || null;
    const profile = profiles.find((p) => p.userId === currentUserId) || null;
    return { user, profile };
  },

  async login(email: string, password?: string, requestedRole: "student" | "ambassador" = "student") {
    await delay(350);
    const normalizedEmail = email.trim().toLowerCase();

    // Check if logging in as Admin with the configured admin credentials
    if (normalizedEmail === ADMIN_USER.email.toLowerCase()) {
      if (password && password !== ADMIN_CREDENTIAL_PASSWORD) {
        throw new Error("Invalid admin password");
      }
      mockStore.setState(() => ({ currentUserId: ADMIN_USER.id }));
      return ADMIN_USER;
    }

    const state = mockStore.getState();
    const existing = state.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (existing) {
      mockStore.setState(() => ({ currentUserId: existing.id }));
      return existing;
    }

    // Create new account with requested role
    const newUser: User = {
      id: `user-${Date.now()}`,
      role: requestedRole,
      name: normalizedEmail.split("@")[0].replace(/[._-]/g, " "),
      email: normalizedEmail,
      avatarUrl: null,
    };

    const newProfile: AmbassadorProfile = {
      userId: newUser.id,
      college: "Muthayammal Engineering College",
      department: "Engineering",
      year: "1st Year",
      city: "Tamil Nadu",
      interests: ["Tech Opportunities"],
      skills: ["Problem Solving"],
      whyJoin: "Participate in Zyvex initiatives",
      status: "active",
      joinedAt: new Date().toISOString(),
      cohortNumber: 1,
    };

    mockStore.setState((prev) => ({
      users: [...prev.users, newUser],
      profiles: [...prev.profiles, newProfile],
      currentUserId: newUser.id,
    }));

    return newUser;
  },

  async loginWithGoogleMock(email?: string, requestedRole: "student" | "ambassador" = "student") {
    await delay(350);
    const normalizedEmail = (
      email ||
      (requestedRole === "ambassador"
        ? AMBASSADOR_USER.email
        : CURRENT_USER.email)
    ).trim().toLowerCase();

    // Check if logging in as Admin
    if (normalizedEmail === ADMIN_USER.email.toLowerCase()) {
      mockStore.setState(() => ({ currentUserId: ADMIN_USER.id }));
      return ADMIN_USER;
    }

    const state = mockStore.getState();
    const existing = state.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (existing) {
      mockStore.setState(() => ({ currentUserId: existing.id }));
      return existing;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      role: requestedRole,
      name: requestedRole === "ambassador" ? "Ambassador Leader" : "Student Member",
      email: normalizedEmail,
      avatarUrl: null,
    };

    const newProfile: AmbassadorProfile = {
      userId: newUser.id,
      college: "Muthayammal Engineering College",
      department: "Engineering",
      year: "1st Year",
      city: "Tamil Nadu",
      interests: ["Technology", "Leadership"],
      skills: ["Communication"],
      whyJoin: "Explore student opportunities",
      status: "active",
      joinedAt: new Date().toISOString(),
      cohortNumber: 1,
    };

    mockStore.setState((prev) => ({
      users: [...prev.users, newUser],
      profiles: [...prev.profiles, newProfile],
      currentUserId: newUser.id,
    }));

    return newUser;
  },

  async loginAdminMock() {
    await delay(250);
    mockStore.setState(() => ({ currentUserId: ADMIN_USER.id }));
    return ADMIN_USER;
  },

  async logout() {
    await delay(150);
    mockStore.setState(() => ({ currentUserId: null }));
  },

  async registerAmbassador(data) {
    await delay(450);
    const userId = `user-${Date.now()}`;
    const newUser: User = {
      id: userId,
      role: "ambassador",
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatarUrl: null,
    };

    const state = mockStore.getState();
    const cohortNumber = state.profiles.length + 1;

    const newProfile: AmbassadorProfile = {
      userId,
      college: data.college,
      department: data.department,
      year: data.year,
      city: data.city,
      studentId: data.studentId,
      linkedin: data.linkedin,
      instagram: data.instagram,
      interests: data.interests,
      skills: data.skills,
      whyJoin: data.whyJoin,
      status: state.approvalRequired ? "pending" : "active",
      joinedAt: new Date().toISOString(),
      cohortNumber,
    };

    const welcomeNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      type: "application_approved",
      title: "Welcome to Zyvex!",
      body: "Your ambassador membership is active. Complete your first task now!",
      createdAt: new Date().toISOString(),
      readAt: null,
      href: "/missions",
    };

    mockStore.setState((prev) => ({
      users: [...prev.users, newUser],
      profiles: [...prev.profiles, newProfile],
      notifications: [...prev.notifications, welcomeNotif],
      currentUserId: userId,
    }));

    return { user: newUser, profile: newProfile };
  },

  async updateProfile(data) {
    await delay(300);
    const { currentUserId } = mockStore.getState();
    if (!currentUserId) throw new Error("Not logged in");

    let updated: AmbassadorProfile | null = null;
    mockStore.setState((prev) => {
      const newProfiles = prev.profiles.map((p) => {
        if (p.userId === currentUserId) {
          updated = { ...p, ...data };
          return updated;
        }
        return p;
      });
      return { profiles: newProfiles };
    });

    if (!updated) throw new Error("Profile not found");
    return updated;
  },

  async getMe() {
    await delay(150);
    const { user, profile } = await this.getSession();
    if (!user || !profile) return null;
    return { user, profile };
  },

  async getMissions() {
    await delay(200);
    return mockStore.getState().missions;
  },

  async getMission(slug: string) {
    await delay(200);
    const missions = mockStore.getState().missions;
    return missions.find((m) => m.slug === slug) || null;
  },

  async startMission(missionId: string) {
    await delay(250);
    const { currentUserId, submissions } = mockStore.getState();
    if (!currentUserId) throw new Error("Not logged in");

    const existing = submissions.find(
      (s) => s.missionId === missionId && s.ambassadorId === currentUserId
    );
    if (existing) return existing;

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      missionId,
      ambassadorId: currentUserId,
      state: "STARTED",
    };

    mockStore.setState((prev) => ({
      submissions: [...prev.submissions, newSub],
    }));

    return newSub;
  },

  async submitProof({ missionId, proofUrl, screenshotDataUrl, note }) {
    await delay(450);
    const { currentUserId, missions, submissions } = mockStore.getState();
    if (!currentUserId) throw new Error("Not logged in");

    const mission = missions.find((m) => m.id === missionId);
    if (!mission) throw new Error("Mission not found");

    // Validation rules
    let normalized: string | undefined = undefined;
    if (mission.proofRequired.url) {
      if (!proofUrl) {
        throw new Error("URL proof is required for this mission");
      }
      const urlCheck = validateTaskSubmissionUrl(proofUrl, mission.brand);
      if (!urlCheck.isValid) {
        throw new Error(urlCheck.error || "Invalid submission URL provided");
      }
      normalized = normalizeSubmissionUrl(proofUrl);

      // Duplicate URL check across all students
      const duplicate = submissions.find(
        (s) =>
          s.missionId === missionId &&
          s.normalizedUrl === normalized &&
          s.ambassadorId !== currentUserId
      );
      if (duplicate) {
        throw new Error("This link has already been submitted by another student. Each submission must be unique.");
      }
    }

    if (mission.proofRequired.screenshot && !screenshotDataUrl) {
      throw new Error("Screenshot proof is required for this mission");
    }

    const existingSub = submissions.find(
      (s) => s.missionId === missionId && s.ambassadorId === currentUserId
    );

    const now = new Date().toISOString();
    let updatedSubmission: Submission;

    if (existingSub) {
      updatedSubmission = {
        ...existingSub,
        state: "SUBMITTED",
        proofUrl,
        normalizedUrl: normalized,
        screenshotDataUrl,
        note,
        submittedAt: now,
      };
      mockStore.setState((prev) => ({
        submissions: prev.submissions.map((s) =>
          s.id === existingSub?.id ? updatedSubmission : s
        ),
      }));
    } else {
      updatedSubmission = {
        id: `sub-${Date.now()}`,
        missionId,
        ambassadorId: currentUserId,
        state: "SUBMITTED",
        proofUrl,
        normalizedUrl: normalized,
        screenshotDataUrl,
        note,
        submittedAt: now,
      };
      mockStore.setState((prev) => ({
        submissions: [...prev.submissions, updatedSubmission],
      }));
    }

    return updatedSubmission;
  },

  async getMySubmissions() {
    await delay(200);
    const { currentUserId, submissions } = mockStore.getState();
    if (!currentUserId) return [];
    return submissions.filter((s) => s.ambassadorId === currentUserId);
  },

  async getSubmission(id: string) {
    await delay(200);
    return mockStore.getState().submissions.find((s) => s.id === id) || null;
  },

  async getMyPoints() {
    await delay(200);
    const { currentUserId, pointTransactions } = mockStore.getState();
    if (!currentUserId) return { total: 0, transactions: [] };

    const myTxs = pointTransactions.filter(
      (tx) => tx.ambassadorId === currentUserId
    );
    const total = myTxs.reduce((sum, tx) => sum + tx.points, 0);
    return { total, transactions: myTxs };
  },

  async getMyRank() {
    await delay(250);
    const leaderboard = (await this.getLeaderboard({
      scope: "individual",
    })) as LeaderboardEntry[];
    const { currentUserId } = mockStore.getState();
    const myEntry = leaderboard.find((e) => e.ambassadorId === currentUserId);

    return {
      rank: myEntry ? myEntry.rank : leaderboard.length + 1,
      totalAmbassadors: leaderboard.length,
    };
  },

  async getLeaderboard({ scope }) {
    await delay(300);
    const state = mockStore.getState();

    if (scope === "individual") {
      // Points derived strictly by summing pointTransactions
      const pointsMap: Record<string, { total: number; earliest: string }> = {};

      state.pointTransactions.forEach((tx) => {
        if (!pointsMap[tx.ambassadorId]) {
          pointsMap[tx.ambassadorId] = { total: 0, earliest: tx.createdAt };
        }
        pointsMap[tx.ambassadorId].total += tx.points;
        if (new Date(tx.createdAt) < new Date(pointsMap[tx.ambassadorId].earliest)) {
          pointsMap[tx.ambassadorId].earliest = tx.createdAt;
        }
      });

      const entries: LeaderboardEntry[] = state.users
        .filter((u) => u.role === "student")
        .map((u) => {
          const profile = state.profiles.find((p) => p.userId === u.id);
          const pointsData = pointsMap[u.id] || {
            total: 0,
            earliest: profile?.joinedAt || "2026-10-18T00:00:00Z",
          };
          return {
            rank: 1, // calculated next
            ambassadorId: u.id,
            name: u.name,
            college: profile?.college || "Tamil Nadu College",
            points: pointsData.total,
            avatarUrl: u.avatarUrl,
            isYou: u.id === state.currentUserId,
            earliestTimestamp: pointsData.earliest,
          };
        });

      // Sort by points desc; tie-break: earliest timestamp that reached the score
      entries.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return (
          new Date(a.earliestTimestamp).getTime() -
          new Date(b.earliestTimestamp).getTime()
        );
      });

      // Assign 1-indexed ranks
      entries.forEach((e, idx) => {
        e.rank = idx + 1;
      });

      return entries;
    }

    // College leaderboard
    const collegeMap: Record<
      string,
      {
        totalPoints: number;
        members: Set<string>;
        topAmbassador: { name: string; points: number };
      }
    > = {};

    SEED_COLLEGES.forEach((c) => {
      collegeMap[c.name] = {
        totalPoints: 0,
        members: new Set(),
        topAmbassador: { name: "Founding Member", points: 0 },
      };
    });

    // Sum transactions per college
    state.profiles.forEach((p) => {
      if (collegeMap[p.college]) {
        collegeMap[p.college].members.add(p.userId);
      }
    });

    state.pointTransactions.forEach((tx) => {
      const profile = state.profiles.find((p) => p.userId === tx.ambassadorId);
      if (profile && collegeMap[profile.college]) {
        collegeMap[profile.college].totalPoints += tx.points;
        const user = state.users.find((u) => u.id === tx.ambassadorId);
        if (user && tx.points > collegeMap[profile.college].topAmbassador.points) {
          collegeMap[profile.college].topAmbassador = {
            name: user.name,
            points: tx.points,
          };
        }
      }
    });

    const collegeEntries: CollegeLeaderboardEntry[] = SEED_COLLEGES.map((c) => {
      const data = collegeMap[c.name] || {
        totalPoints: 0,
        members: new Set(),
        topAmbassador: { name: "Founding Member", points: 0 },
      };
      const memberCount = Math.max(1, data.members.size);
      const avg = Math.round(data.totalPoints / memberCount);

      return {
        rank: 1,
        collegeId: c.id,
        name: c.name,
        shortName: c.shortName,
        totalPoints: data.totalPoints,
        memberCount,
        averagePoints: avg,
        topAmbassadorName: data.topAmbassador.name,
        color: c.color,
      };
    });

    collegeEntries.sort((a, b) => b.totalPoints - a.totalPoints);
    collegeEntries.forEach((c, idx) => {
      c.rank = idx + 1;
    });

    return collegeEntries;
  },

  async getRewards() {
    await delay(150);
    return SEED_REWARDS;
  },

  async getMyTier() {
    const { total } = await this.getMyPoints();
    return calculateTier(total);
  },

  async getNotifications() {
    await delay(150);
    const { currentUserId, notifications } = mockStore.getState();
    if (!currentUserId) return [];
    return notifications
      .filter((n) => n.userId === currentUserId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  async markNotificationRead(id: string) {
    const now = new Date().toISOString();
    mockStore.setState((prev) => ({
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, readAt: now } : n
      ),
    }));
  },

  async getAnnouncements() {
    await delay(150);
    return mockStore.getState().announcements;
  },

  // Admin APIs
  async listSubmissions(params) {
    await delay(300);
    let subs = mockStore.getState().submissions;
    if (params?.missionId) {
      subs = subs.filter((s) => s.missionId === params.missionId);
    }
    if (params?.state) {
      subs = subs.filter((s) => s.state === params.state);
    }
    return subs;
  },

  async reviewSubmission({ submissionId, decision, reason }) {
    await delay(400);
    const state = mockStore.getState();
    const submission = state.submissions.find((s) => s.id === submissionId);
    if (!submission) throw new Error("Submission not found");

    const mission = state.missions.find((m) => m.id === submission.missionId);
    if (!mission) throw new Error("Mission not found");

    const now = new Date().toISOString();

    if (decision === "approve") {
      // Idempotency: check if already approved / awarded
      const alreadyAwarded = state.pointTransactions.some(
        (tx) => tx.submissionId === submissionId
      );

      const updatedSub: Submission = {
        ...submission,
        state: "APPROVED",
        reviewedAt: now,
        reviewerId: ADMIN_USER.id,
        reviewReason: reason || "Verified by admin",
      };

      const newTx: PointTransaction | null = alreadyAwarded
        ? null
        : {
            id: `tx-${Date.now()}`,
            ambassadorId: submission.ambassadorId,
            submissionId,
            missionId: submission.missionId,
            points: mission.points,
            reason: `Completed: ${mission.title}`,
            createdAt: now,
          };

      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: submission.ambassadorId,
        type: "submission_approved",
        title: `Mission Approved! +${mission.points} Points`,
        body: `Your submission for "${mission.title}" has been verified. You earned ${mission.points} points!`,
        createdAt: now,
        readAt: null,
        href: "/dashboard",
      };

      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: ADMIN_USER.id,
        action: "APPROVE_SUBMISSION",
        entity: "Submission",
        entityId: submissionId,
        createdAt: now,
      };

      mockStore.setState((prev) => ({
        submissions: prev.submissions.map((s) =>
          s.id === submissionId ? updatedSub : s
        ),
        pointTransactions: newTx
          ? [...prev.pointTransactions, newTx]
          : prev.pointTransactions,
        notifications: [...prev.notifications, notif],
        auditLogs: [...prev.auditLogs, audit],
      }));

      return updatedSub;
    }

    if (decision === "reject") {
      const updatedSub: Submission = {
        ...submission,
        state: "REJECTED",
        reviewedAt: now,
        reviewerId: ADMIN_USER.id,
        reviewReason: reason || "Proof did not meet guidelines",
      };

      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: submission.ambassadorId,
        type: "submission_rejected",
        title: `Mission Update: ${mission.title}`,
        body: `Your submission needs correction: ${reason || "Invalid link or missing proof"}`,
        createdAt: now,
        readAt: null,
        href: `/missions/${mission.slug}`,
      };

      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: ADMIN_USER.id,
        action: "REJECT_SUBMISSION",
        entity: "Submission",
        entityId: submissionId,
        createdAt: now,
      };

      mockStore.setState((prev) => ({
        submissions: prev.submissions.map((s) =>
          s.id === submissionId ? updatedSub : s
        ),
        notifications: [...prev.notifications, notif],
        auditLogs: [...prev.auditLogs, audit],
      }));

      return updatedSub;
    }

    // requestChanges
    const updatedSub: Submission = {
      ...submission,
      state: "CHANGES_REQUESTED",
      reviewedAt: now,
      reviewerId: ADMIN_USER.id,
      reviewReason: reason || "Please provide clearer screenshot or post URL",
    };

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: submission.ambassadorId,
      type: "submission_rejected",
      title: `Changes Requested: ${mission.title}`,
      body: reason || "Please update your proof link or image.",
      createdAt: now,
      readAt: null,
      href: `/missions/${mission.slug}`,
    };

    mockStore.setState((prev) => ({
      submissions: prev.submissions.map((s) =>
        s.id === submissionId ? updatedSub : s
      ),
      notifications: [...prev.notifications, notif],
    }));

    return updatedSub;
  },

  async listAmbassadors(params) {
    await delay(300);
    const state = mockStore.getState();
    const result: Array<{
      user: User;
      profile: AmbassadorProfile;
      totalPoints: number;
    }> = [];

    state.users
      .filter((u) => u.role === "ambassador")
      .forEach((user) => {
        const profile = state.profiles.find((p) => p.userId === user.id);
        if (!profile) return;

        if (params?.status && profile.status !== params.status) return;
        if (params?.search) {
          const q = params.search.toLowerCase();
          if (
            !user.name.toLowerCase().includes(q) &&
            !profile.college.toLowerCase().includes(q)
          ) {
            return;
          }
        }

        const userTxs = state.pointTransactions.filter(
          (t) => t.ambassadorId === user.id
        );
        const total = userTxs.reduce((sum, t) => sum + t.points, 0);

        result.push({ user, profile, totalPoints: total });
      });

    return result;
  },

  async setAmbassadorStatus(userId, status) {
    await delay(250);
    let updated: AmbassadorProfile | null = null;
    mockStore.setState((prev) => ({
      profiles: prev.profiles.map((p) => {
        if (p.userId === userId) {
          updated = { ...p, status };
          return updated;
        }
        return p;
      }),
    }));
    if (!updated) throw new Error("Ambassador not found");
    return updated;
  },

  async listMissions() {
    return this.getMissions();
  },

  async upsertMission(missionData) {
    await delay(300);
    let result: Mission;
    const state = mockStore.getState();

    if (missionData.id) {
      const existing = state.missions.find((m) => m.id === missionData.id);
      if (!existing) throw new Error("Mission not found");
      result = { ...existing, ...missionData } as Mission;
      mockStore.setState((prev) => ({
        missions: prev.missions.map((m) => (m.id === result.id ? result : m)),
      }));
    } else {
      result = {
        id: `mission-${Date.now()}`,
        slug: missionData.slug || `mission-${Date.now()}`,
        title: missionData.title || "New Mission",
        titleTa: missionData.titleTa || missionData.title || "புதிய பணி",
        description: missionData.description || "",
        descriptionTa: missionData.descriptionTa || "",
        category: missionData.category || "General",
        instructions: missionData.instructions || [],
        points: missionData.points || 50,
        difficulty: missionData.difficulty || "Easy",
        estimatedMinutes: missionData.estimatedMinutes || 10,
        startsAt: new Date().toISOString(),
        status: missionData.status || "live",
        taskType: missionData.taskType || "url",
        audience: missionData.audience || "public",
        proofTypes: missionData.proofTypes || ["url"],
        proofRequired: missionData.proofRequired || { url: true, screenshot: false },
        verification: missionData.verification || "manual",
        brand: missionData.brand || "event",
      };
      mockStore.setState((prev) => ({
        missions: [...prev.missions, result],
      }));
    }

    return result;
  },

  async getAdminStats() {
    await delay(250);
    const state = mockStore.getState();
    const ambassadors = state.users.filter((u) => u.role === "ambassador");
    const pendingSubs = state.submissions.filter(
      (s) => s.state === "SUBMITTED" || s.state === "UNDER_REVIEW"
    );
    const pointsAwarded = state.pointTransactions.reduce(
      (sum, tx) => sum + tx.points,
      0
    );

    const totalDecided = state.submissions.filter(
      (s) => s.state === "APPROVED" || s.state === "REJECTED"
    ).length;
    const approvedCount = state.submissions.filter(
      (s) => s.state === "APPROVED"
    ).length;
    const rate = totalDecided > 0 ? Math.round((approvedCount / totalDecided) * 100) : 94;

    return {
      totalAmbassadors: ambassadors.length,
      pendingReviews: pendingSubs.length,
      pointsAwarded,
      approvalRate: rate,
    };
  },

  async getAuditLog() {
    await delay(200);
    return mockStore.getState().auditLogs;
  },

  // DevPanel helpers
  async resetSeed() {
    mockStore.resetToSeed();
  },

  async setSubmissionState(submissionId, newState, reason) {
    const target = mockStore.getState().submissions.find((s) => s.id === submissionId);
    if (!target) throw new Error("Submission not found");

    if (newState === "APPROVED") {
      return this.reviewSubmission({
        submissionId,
        decision: "approve",
        reason: reason || "Dev approved",
      });
    }

    mockStore.setState((prev) => ({
      submissions: prev.submissions.map((s) =>
        s.id === submissionId
          ? { ...s, state: newState, reviewReason: reason }
          : s
      ),
    }));
    return { ...target, state: newState, reviewReason: reason };
  },

  async simulateAdminApprove(submissionId) {
    const state = mockStore.getState();
    const sub = submissionId
      ? state.submissions.find((s) => s.id === submissionId)
      : state.submissions.find(
          (s) => s.state === "SUBMITTED" || s.state === "UNDER_REVIEW"
        );
    if (!sub) return null;

    return this.reviewSubmission({
      submissionId: sub.id,
      decision: "approve",
      reason: "Simulated auto-approval from DevPanel",
    });
  },

  async loadProgressDemo() {
    // Sets 80 points for Thangaraj (LinkedIn 50 + WhatsApp 30)
    const thangarajId = CURRENT_USER.id;

    // Switch active user to Thangaraj
    mockStore.setState(() => ({ currentUserId: thangarajId }));

    const linkedinSub: Submission = {
      id: `sub-thangaraj-linkedin`,
      missionId: "mission-linkedin",
      ambassadorId: thangarajId,
      state: "APPROVED",
      proofUrl: "https://www.linkedin.com/posts/thangaraj-mec_zyven-activity-12345",
      normalizedUrl: "https://linkedin.com/posts/thangaraj-mec_zyven-activity-12345",
      submittedAt: "2026-10-18T09:00:00Z",
      reviewedAt: "2026-10-18T09:30:00Z",
      reviewerId: ADMIN_USER.id,
      reviewReason: "Verified post on LinkedIn",
    };

    const whatsappSub: Submission = {
      id: `sub-thangaraj-whatsapp`,
      missionId: "mission-whatsapp",
      ambassadorId: thangarajId,
      state: "APPROVED",
      screenshotDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'><rect width='400' height='200' fill='%2325D366'/><text x='50%25' y='50%25' fill='white' font-size='20' text-anchor='middle'>WhatsApp Joined</text></svg>",
      submittedAt: "2026-10-18T10:00:00Z",
      reviewedAt: "2026-10-18T10:15:00Z",
      reviewerId: ADMIN_USER.id,
      reviewReason: "Verified screenshot",
    };

    const tx1: PointTransaction = {
      id: `tx-thangaraj-1`,
      ambassadorId: thangarajId,
      submissionId: linkedinSub.id,
      missionId: "mission-linkedin",
      points: 50,
      reason: "Completed: Follow & Post on LinkedIn",
      createdAt: "2026-10-18T09:30:00Z",
    };

    const tx2: PointTransaction = {
      id: `tx-thangaraj-2`,
      ambassadorId: thangarajId,
      submissionId: whatsappSub.id,
      missionId: "mission-whatsapp",
      points: 30,
      reason: "Completed: Join Zyvex WhatsApp Community",
      createdAt: "2026-10-18T10:15:00Z",
    };

    mockStore.setState((prev) => ({
      submissions: [
        ...prev.submissions.filter(
          (s) =>
            s.ambassadorId !== thangarajId ||
            (s.missionId !== "mission-linkedin" && s.missionId !== "mission-whatsapp")
        ),
        linkedinSub,
        whatsappSub,
      ],
      pointTransactions: [
        ...prev.pointTransactions.filter((t) => t.ambassadorId !== thangarajId),
        tx1,
        tx2,
      ],
      currentUserId: thangarajId,
    }));
  },

  // Team & Ambassador Management
  async getMyTeam() {
    await delay(150);
    const { currentUserId, teams } = mockStore.getState();
    if (!currentUserId) return teams[0] || null;
    const team = teams.find((t) => t.ambassadorId === currentUserId);
    return team || teams[0] || null;
  },

  async listTeams() {
    await delay(150);
    return mockStore.getState().teams;
  },

  async createTeam(data: { name: string; college: string; ambassadorId: string }) {
    await delay(250);
    const { users, currentUserId } = mockStore.getState();
    const ambassador = users.find((u) => u.id === data.ambassadorId);
    const inviteCode = `ZYV-${data.college.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTeam: import("../types").Team = {
      id: `team-${Date.now()}`,
      name: data.name,
      college: data.college,
      ambassadorId: data.ambassadorId,
      ambassadorName: ambassador?.name || "Ambassador",
      inviteCode,
      memberCount: 1,
      totalPoints: 0,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    const auditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actorId: currentUserId || ADMIN_USER.id,
      actorName: "Admin Operations",
      action: "CREATE_TEAM",
      entity: "Team",
      entityId: newTeam.id,
      target: newTeam.name,
      result: "SUCCESS",
      metadata: { college: newTeam.college, inviteCode },
      createdAt: new Date().toISOString(),
    };

    mockStore.setState((prev) => ({
      teams: [newTeam, ...prev.teams],
      auditLogs: [auditLog, ...prev.auditLogs],
    }));

    return newTeam;
  },

  async joinTeam(inviteCode: string) {
    await delay(200);
    const { teams, currentUserId } = mockStore.getState();
    const team = teams.find((t) => t.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase());
    if (!team) throw new Error("Invalid team invite code");

    const updatedTeam = {
      ...team,
      memberCount: team.memberCount + 1,
    };

    mockStore.setState((prev) => ({
      teams: prev.teams.map((t) => (t.id === team.id ? updatedTeam : t)),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          userId: team.ambassadorId,
          type: "team_joined" as const,
          title: "New Student Joined Your Team!",
          body: `A new student has joined ${team.name} via invite code.`,
          createdAt: new Date().toISOString(),
          href: "/ambassador/team",
        },
        ...prev.notifications,
      ],
    }));

    return updatedTeam;
  },

  // Ambassador Tasks & Approval
  async createAmbassadorTask(data: Partial<Mission>) {
    await delay(300);
    const { currentUserId, platformSettings } = mockStore.getState();
    const cappedPoints = Math.min(
      data.points || 20,
      platformSettings.maxAmbassadorTaskPoints || 25
    );

    const newTask: Mission = {
      id: `mission-amb-${Date.now()}`,
      slug: (data.title || "ambassador-task").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: data.title || "Campus Initiative",
      titleTa: data.titleTa || data.title || "வளாக பணி",
      description: data.description || "Ambassador campus task for team members.",
      descriptionTa: data.descriptionTa || "வளாக பணி விளக்கம்",
      category: data.category || "Campus",
      instructions: data.instructions || [
        {
          stepNumber: 1,
          title: "Participate in Initiative",
          description: "Follow the guidelines provided by your student ambassador.",
        },
        {
          stepNumber: 2,
          title: "Submit Evidence",
          description: "Provide proof link or screenshot for ambassador review.",
        },
      ],
      points: cappedPoints,
      difficulty: data.difficulty || "Easy",
      estimatedMinutes: data.estimatedMinutes || 5,
      startsAt: new Date().toISOString(),
      status: "pending_approval",
      taskType: (data.taskType as MissionType) || "url",
      audience: (data.audience as TaskAudience) || "public",
      googleFormUrl: data.googleFormUrl,
      googleSpreadsheetUrl: data.googleSpreadsheetUrl,
      collegeId: data.collegeId,
      proofTypes: data.proofTypes || ["url", "screenshot"],
      proofRequired: data.proofRequired || { url: true, screenshot: false },
      verification: "manual",
      externalUrl: data.externalUrl,
      brand: data.brand || "college",
      teamId: data.teamId,
      createdById: currentUserId || undefined,
      postTemplate: data.postTemplate,
    };

    const auditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actorId: currentUserId || "ambassador",
      actorName: "Ambassador",
      action: "CREATE_AMBASSADOR_TASK",
      entity: "Mission",
      entityId: newTask.id,
      target: newTask.title,
      result: "PENDING_APPROVAL",
      metadata: { points: cappedPoints, audience: newTask.audience },
      createdAt: new Date().toISOString(),
    };

    mockStore.setState((prev) => ({
      missions: [newTask, ...prev.missions],
      auditLogs: [auditLog, ...prev.auditLogs],
    }));

    return newTask;
  },

  async approveTask(taskId: string) {
    await delay(250);
    const { missions, currentUserId } = mockStore.getState();
    const task = missions.find((m) => m.id === taskId);
    if (!task) throw new Error("Task not found");

    const approvedTask: Mission = {
      ...task,
      status: "live",
    };

    const auditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actorId: currentUserId || ADMIN_USER.id,
      actorName: "Admin Operations",
      action: "APPROVE_TASK",
      entity: "Mission",
      entityId: task.id,
      target: task.title,
      result: "APPROVED_TO_LIVE",
      createdAt: new Date().toISOString(),
    };

    const notifications: Notification[] = task.createdById
      ? [
          {
            id: `notif-${Date.now()}`,
            userId: task.createdById,
            type: "task_approved" as const,
            title: "Task Approved by Admin!",
            body: `Your team task "${task.title}" is now LIVE for students.`,
            createdAt: new Date().toISOString(),
            href: "/ambassador/tasks",
          },
        ]
      : [];

    mockStore.setState((prev) => ({
      missions: prev.missions.map((m) => (m.id === taskId ? approvedTask : m)),
      notifications: [...notifications, ...prev.notifications],
      auditLogs: [auditLog, ...prev.auditLogs],
    }));

    return approvedTask;
  },

  async rejectTask(taskId: string, reason?: string) {
    await delay(250);
    const { missions, currentUserId } = mockStore.getState();
    const task = missions.find((m) => m.id === taskId);
    if (!task) throw new Error("Task not found");

    const rejectedTask: Mission = {
      ...task,
      status: "rejected",
      feedback: reason || "Task did not meet guidelines.",
    };

    const auditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actorId: currentUserId || ADMIN_USER.id,
      actorName: "Admin Operations",
      action: "REJECT_TASK",
      entity: "Mission",
      entityId: task.id,
      target: task.title,
      result: "REJECTED",
      metadata: { reason },
      createdAt: new Date().toISOString(),
    };

    const notifications: Notification[] = task.createdById
      ? [
          {
            id: `notif-${Date.now()}`,
            userId: task.createdById,
            type: "task_rejected" as const,
            title: "Task Changes Requested",
            body: `Task "${task.title}": ${reason || "Please revise your instructions."}`,
            createdAt: new Date().toISOString(),
            href: "/ambassador/tasks",
          },
        ]
      : [];

    mockStore.setState((prev) => ({
      missions: prev.missions.map((m) => (m.id === taskId ? rejectedTask : m)),
      notifications: [...notifications, ...prev.notifications],
      auditLogs: [auditLog, ...prev.auditLogs],
    }));

    return rejectedTask;
  },

  async setTaskStatus(taskId: string, status: "live" | "paused" | "archived") {
    await delay(200);
    const { missions, currentUserId } = mockStore.getState();
    const task = missions.find((m) => m.id === taskId);
    if (!task) throw new Error("Task not found");

    const updatedTask: Mission = {
      ...task,
      status,
    };

    mockStore.setState((prev) => ({
      missions: prev.missions.map((m) => (m.id === taskId ? updatedTask : m)),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          actorId: currentUserId || ADMIN_USER.id,
          actorName: "User",
          action: "SET_TASK_STATUS",
          entity: "Mission",
          entityId: taskId,
          target: task.title,
          result: status.toUpperCase(),
          createdAt: new Date().toISOString(),
        },
        ...prev.auditLogs,
      ],
    }));

    return updatedTask;
  },

  // User & Role Management
  async listUsers(params?: { role?: string; status?: string; search?: string }) {
    await delay(200);
    const { users, profiles, pointTransactions } = mockStore.getState();

    let list = users.map((user) => {
      const profile = profiles.find((p) => p.userId === user.id) || null;
      const points = pointTransactions
        .filter((t) => t.ambassadorId === user.id)
        .reduce((sum, t) => sum + t.points, 0);
      return {
        user,
        profile,
        points,
        status: profile?.status || "active",
      };
    });

    if (params?.role) {
      list = list.filter((item) => item.user.role === params.role);
    }
    if (params?.status) {
      list = list.filter((item) => item.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (item) =>
          item.user.name.toLowerCase().includes(q) ||
          item.user.email.toLowerCase().includes(q) ||
          (item.profile?.college && item.profile.college.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async setUserRole(userId: string, role: "student" | "ambassador" | "admin") {
    await delay(300);
    const { users, currentUserId } = mockStore.getState();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, role };

    const auditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actorId: currentUserId || ADMIN_USER.id,
      actorName: "Admin Operations",
      action: "CHANGE_USER_ROLE",
      entity: "User",
      entityId: userId,
      target: user.name,
      result: `ROLE_CHANGED_TO_${role.toUpperCase()}`,
      metadata: { previousRole: user.role, newRole: role },
      createdAt: new Date().toISOString(),
    };

    mockStore.setState((prev) => ({
      users: prev.users.map((u) => (u.id === userId ? updatedUser : u)),
      auditLogs: [auditLog, ...prev.auditLogs],
    }));

    return updatedUser;
  },

  async setUserStatus(userId: string, status: "active" | "suspended" | "pending") {
    await delay(250);
    const { profiles, currentUserId } = mockStore.getState();
    mockStore.setState((prev) => ({
      profiles: prev.profiles.map((p) =>
        p.userId === userId ? { ...p, status } : p
      ),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          actorId: currentUserId || ADMIN_USER.id,
          actorName: "Admin Operations",
          action: "SET_USER_STATUS",
          entity: "AmbassadorProfile",
          entityId: userId,
          result: status.toUpperCase(),
          createdAt: new Date().toISOString(),
        },
        ...prev.auditLogs,
      ],
    }));
  },

  // Announcements & Directory
  async publishAnnouncement(data: {
    title: string;
    body: string;
    audience?: "all" | "team" | "ambassadors";
    teamId?: string;
    pinned?: boolean;
  }) {
    await delay(250);
    const { currentUserId, users } = mockStore.getState();
    const author = users.find((u) => u.id === currentUserId);

    const announcement: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      body: data.body,
      createdAt: new Date().toISOString(),
      pinned: data.pinned ?? false,
      audience: data.audience || "all",
      teamId: data.teamId,
      authorName: author?.name || "Zyvex Operations",
    };

    mockStore.setState((prev) => ({
      announcements: [announcement, ...prev.announcements],
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          actorId: currentUserId || ADMIN_USER.id,
          actorName: author?.name || "Admin",
          action: "PUBLISH_ANNOUNCEMENT",
          entity: "Announcement",
          entityId: announcement.id,
          target: announcement.title,
          result: "PUBLISHED",
          createdAt: new Date().toISOString(),
        },
        ...prev.auditLogs,
      ],
    }));

    return announcement;
  },

  async listColleges() {
    await delay(150);
    return SEED_COLLEGES;
  },

  async upsertCollege(data: Partial<import("../types").College>) {
    await delay(200);
    const college = {
      id: data.id || `col-${Date.now()}`,
      name: data.name || "Engineering College",
      shortName: data.shortName || "COL",
      color: data.color || "#5B5BF0",
    };
    return college;
  },

  // Platform Settings
  async getPlatformSettings() {
    await delay(100);
    return mockStore.getState().platformSettings;
  },

  async updatePlatformSettings(settings: Partial<import("../types").PlatformSettings>) {
    await delay(250);
    const { platformSettings, currentUserId } = mockStore.getState();
    const updated = { ...platformSettings, ...settings };

    mockStore.setState((prev) => ({
      platformSettings: updated,
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          actorId: currentUserId || ADMIN_USER.id,
          actorName: "Admin Operations",
          action: "UPDATE_PLATFORM_SETTINGS",
          entity: "PlatformSettings",
          entityId: "platform-settings",
          result: "SETTINGS_UPDATED",
          metadata: settings as Record<string, unknown>,
          createdAt: new Date().toISOString(),
        },
        ...prev.auditLogs,
      ],
    }));

    return updated;
  },
};
