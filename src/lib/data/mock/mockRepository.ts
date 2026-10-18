import type { Repository } from "../repository";
import type {
  User,
  AmbassadorProfile,
  Mission,
  Submission,
  PointTransaction,
  Notification,
  AuditLog,
  LeaderboardEntry,
  CollegeLeaderboardEntry,
  Tier,
} from "../types";
import { mockStore } from "./store";
import { SEED_COLLEGES, SEED_REWARDS, ADMIN_USER, CURRENT_USER } from "./seed";
import normalizeUrl from "normalize-url";

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

  async loginWithGoogleMock(email?: string) {
    await delay(350);
    const state = mockStore.getState();
    const existing = state.users.find(
      (u) => u.email === (email || CURRENT_USER.email)
    );
    if (existing) {
      mockStore.setState(() => ({ currentUserId: existing.id }));
      return existing;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      role: "ambassador",
      name: "Google Student",
      email: email || "student@zyven.mock",
      avatarUrl: null,
    };
    mockStore.setState((prev) => ({
      users: [...prev.users, newUser],
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
      title: "Welcome to Zyven!",
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
      if (mission.brand === "linkedin" && !validateLinkedInUrl(proofUrl)) {
        throw new Error("Please enter a valid LinkedIn post URL (e.g. linkedin.com/posts/...)");
      }
      normalized = cleanUrl(proofUrl);

      // Duplicate URL check
      const duplicate = submissions.find(
        (s) =>
          s.missionId === missionId &&
          s.normalizedUrl === normalized &&
          s.ambassadorId !== currentUserId
      );
      if (duplicate) {
        throw new Error("This post URL has already been submitted by another ambassador.");
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
        .filter((u) => u.role === "ambassador")
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
      reason: "Completed: Join Zyven WhatsApp Community",
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
};
