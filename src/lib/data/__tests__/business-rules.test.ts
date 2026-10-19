import { describe, it, expect, beforeEach } from "vitest";
import {
  validateLinkedInUrl,
  cleanUrl,
  calculateTier,
  mockRepository,
} from "../mock/mockRepository";
import { mockStore } from "../mock/store";

describe("Zyven Business Rules & Data Layer", () => {
  beforeEach(() => {
    mockStore.resetToSeed();
  });

  describe("LinkedIn URL Validator", () => {
    it("accepts valid LinkedIn post URLs", () => {
      expect(
        validateLinkedInUrl(
          "https://www.linkedin.com/posts/username_zyven-ambassador-activity-1234567890"
        )
      ).toBe(true);
      expect(
        validateLinkedInUrl(
          "https://linkedin.com/feed/update/urn:li:activity:7123456789012345678"
        )
      ).toBe(true);
    });

    it("rejects non-LinkedIn URLs or invalid paths", () => {
      expect(validateLinkedInUrl("https://twitter.com/post/123")).toBe(false);
      expect(validateLinkedInUrl("https://linkedin.com/in/username")).toBe(false);
      expect(validateLinkedInUrl("not-a-url")).toBe(false);
    });
  });

  describe("URL Normalization & Deduplication", () => {
    it("normalizes URLs by stripping tracking parameters, www, and trailing slashes", () => {
      const dirty1 =
        "https://www.linkedin.com/posts/test-post/?utm_source=share&utm_medium=member_desktop";
      const dirty2 = "https://linkedin.com/posts/test-post";

      const cleaned1 = cleanUrl(dirty1);
      const cleaned2 = cleanUrl(dirty2);

      expect(cleaned1).toBe("https://linkedin.com/posts/test-post");
      expect(cleaned1).toBe(cleaned2);
    });
  });

  describe("Tier Derivation", () => {
    it("correctly derives tiers and points to next tier", () => {
      // 0 points -> Bronze target (50 pts to Bronze)
      const t0 = calculateTier(0);
      expect(t0.currentTier).toBe("bronze");
      expect(t0.pointsToNext).toBe(50);

      // 50 points -> Bronze unlocked, next is Silver (100 pts away)
      const t50 = calculateTier(50);
      expect(t50.currentTier).toBe("bronze");
      expect(t50.nextTier).toBe("silver");
      expect(t50.pointsToNext).toBe(100);

      // 80 points -> Bronze, 70 pts to Silver
      const t80 = calculateTier(80);
      expect(t80.currentTier).toBe("bronze");
      expect(t80.nextTier).toBe("silver");
      expect(t80.pointsToNext).toBe(70);

      // 150 points -> Silver unlocked, next is Gold (150 pts away)
      const t150 = calculateTier(150);
      expect(t150.currentTier).toBe("silver");
      expect(t150.nextTier).toBe("gold");
      expect(t150.pointsToNext).toBe(150);

      // 300 points -> Gold unlocked, next is Champion (200 pts away)
      const t300 = calculateTier(300);
      expect(t300.currentTier).toBe("gold");
      expect(t300.nextTier).toBe("champion");
      expect(t300.pointsToNext).toBe(200);

      // 500 points -> Champion unlocked, nextTier is null
      const t500 = calculateTier(500);
      expect(t500.currentTier).toBe("champion");
      expect(t500.nextTier).toBe(null);
      expect(t500.pointsToNext).toBe(0);
    });
  });

  describe("Points Sum & Atomic Idempotent Approval", () => {
    it("never doubles points when approving the same submission twice", async () => {
      // Seed test mission fixture
      mockStore.setState((prev) => ({
        missions: [
          {
            id: "mission-linkedin",
            slug: "linkedin-follow-post",
            title: "Follow & Post on LinkedIn",
            titleTa: "LinkedIn-இல் பின்தொடருங்கள்",
            description: "Follow Zyven and share announcement",
            descriptionTa: "Zyven பக்கத்தைப் பின்தொடரவும்",
            category: "Social Media",
            brand: "linkedin",
            taskType: "url",
            points: 50,
            difficulty: "Easy",
            estimatedMinutes: 5,
            startsAt: "2026-10-01T00:00:00Z",
            status: "live",
            audience: "public",
            proofTypes: ["url"],
            proofRequired: { url: true, screenshot: false },
            verification: "manual",
            instructions: [],
          },
        ],
      }));

      // Create a submission
      const sub = await mockRepository.startMission("mission-linkedin");
      await mockRepository.submitProof({
        missionId: "mission-linkedin",
        proofUrl:
          "https://www.linkedin.com/posts/thangaraj_zyven-activity-987654321",
      });

      // Approve once
      await mockRepository.reviewSubmission({
        submissionId: sub.id,
        decision: "approve",
      });

      const pointsAfterFirst = await mockRepository.getMyPoints();
      expect(pointsAfterFirst.total).toBe(50);

      // Approve again (e.g. admin double clicks)
      await mockRepository.reviewSubmission({
        submissionId: sub.id,
        decision: "approve",
      });

      const pointsAfterSecond = await mockRepository.getMyPoints();
      expect(pointsAfterSecond.total).toBe(50); // Points MUST remain 50!
      expect(pointsAfterSecond.transactions.length).toBe(1);
    });
  });

  describe("Leaderboard Tie-Break", () => {
    it("breaks ties by earliest timestamp that reached the score", async () => {
      // Add two users with same points but different timestamps
      mockStore.setState((prev) => ({
        users: [
          ...prev.users,
          {
            id: "user-early",
            role: "student",
            name: "Early Student",
            email: "early@test.com",
            avatarUrl: null,
          },
          {
            id: "user-late",
            role: "student",
            name: "Late Student",
            email: "late@test.com",
            avatarUrl: null,
          },
        ],
        profiles: [
          ...prev.profiles,
          {
            userId: "user-early",
            college: "MEC",
            department: "CSE",
            year: "2",
            city: "Rasipuram",
            interests: [],
            skills: [],
            whyJoin: "",
            status: "active",
            joinedAt: "2026-10-01T00:00:00Z",
            cohortNumber: 99,
          },
          {
            userId: "user-late",
            college: "PSG",
            department: "IT",
            year: "2",
            city: "Coimbatore",
            interests: [],
            skills: [],
            whyJoin: "",
            status: "active",
            joinedAt: "2026-10-05T00:00:00Z",
            cohortNumber: 100,
          },
        ],
        pointTransactions: [
          ...prev.pointTransactions,
          {
            id: "tx-early",
            ambassadorId: "user-early",
            submissionId: "sub-early",
            missionId: "m1",
            points: 1000,
            reason: "Bonus",
            createdAt: "2026-10-10T10:00:00Z",
          },
          {
            id: "tx-late",
            ambassadorId: "user-late",
            submissionId: "sub-late",
            missionId: "m1",
            points: 1000,
            reason: "Bonus",
            createdAt: "2026-10-12T10:00:00Z",
          },
        ],
      }));

      const leaderboard = (await mockRepository.getLeaderboard({
        scope: "individual",
      })) as import("../types").LeaderboardEntry[];

      const earlyIdx = leaderboard.findIndex(
        (e) => e.ambassadorId === "user-early"
      );
      const lateIdx = leaderboard.findIndex(
        (e) => e.ambassadorId === "user-late"
      );

      expect(earlyIdx).toBeLessThan(lateIdx);
      expect(leaderboard[earlyIdx].rank).toBeLessThan(
        leaderboard[lateIdx].rank
      );
    });
  });
});
