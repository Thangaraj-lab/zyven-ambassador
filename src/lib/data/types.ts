import { z } from "zod";

export const UserRoleSchema = z.enum(["student", "ambassador", "admin"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  role: UserRoleSchema,
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional().nullable(),
});
export type User = z.infer<typeof UserSchema>;

export const AmbassadorStatusSchema = z.enum([
  "pending",
  "active",
  "rejected",
  "suspended",
]);
export type AmbassadorStatus = z.infer<typeof AmbassadorStatusSchema>;

export const AmbassadorProfileSchema = z.object({
  userId: z.string(),
  college: z.string(),
  department: z.string(),
  year: z.string(),
  city: z.string(),
  studentId: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  interests: z.array(z.string()),
  skills: z.array(z.string()),
  whyJoin: z.string(),
  status: AmbassadorStatusSchema,
  joinedAt: z.string(),
  cohortNumber: numberOrString(),
  isDemo: z.boolean().optional(),
});
export type AmbassadorProfile = z.infer<typeof AmbassadorProfileSchema>;

function numberOrString() {
  return z.union([z.number(), z.string()]);
}

export const MissionStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  titleTa: z.string().optional(),
  description: z.string(),
  descriptionTa: z.string().optional(),
  actionType: z.enum(["link", "copy", "upload", "text"]).optional(),
  actionUrl: z.string().optional(),
});
export type MissionStep = z.infer<typeof MissionStepSchema>;

export const MissionStatusSchema = z.enum([
  "draft",
  "pending_approval",
  "live",
  "paused",
  "archived",
  "rejected",
  "coming_soon",
]);
export type MissionStatus = z.infer<typeof MissionStatusSchema>;

export const BrandTypeSchema = z.enum([
  "linkedin",
  "whatsapp",
  "instagram",
  "event",
  "referral",
  "college",
]);
export type BrandType = z.infer<typeof BrandTypeSchema>;

export const MissionTypeSchema = z.enum([
  "quiz",
  "upload",
  "url",
  "text",
  "course_completion",
  "screenshot",
  "document",
  "ppt",
  "video",
  "image",
  "form",
  "multi_step",
  "hybrid",
]);
export type MissionType = z.infer<typeof MissionTypeSchema>;

export const TaskAudienceSchema = z.enum([
  "public",
  "all_students",
  "college",
  "selected_students",
  "everyone",
  "own_team",
  "specific_members",
]);
export type TaskAudience = z.infer<typeof TaskAudienceSchema>;

export const MissionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  titleTa: z.string(),
  description: z.string(),
  descriptionTa: z.string(),
  category: z.string(),
  taskType: MissionTypeSchema.optional().default("url"),
  instructions: z.array(MissionStepSchema),
  points: z.number(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  estimatedMinutes: z.number(),
  startsAt: z.string(),
  deadline: z.string().optional(),
  status: MissionStatusSchema,
  proofTypes: z.array(z.string()),
  proofRequired: z.object({
    url: z.boolean(),
    screenshot: z.boolean(),
    document: z.boolean().optional(),
    text: z.boolean().optional(),
  }),
  verification: z.enum(["manual", "auto"]),
  externalUrl: z.string().optional(),
  googleFormUrl: z.string().optional(),
  googleSpreadsheetUrl: z.string().optional(),
  brand: BrandTypeSchema,
  teamId: z.string().optional(),
  createdById: z.string().optional(),
  collegeId: z.string().optional(),
  selectedStudentIds: z.array(z.string()).optional(),
  audience: TaskAudienceSchema.optional().default("public"),
  feedback: z.string().optional(),
  postTemplate: z
    .object({
      en: z.string(),
      ta: z.string(),
    })
    .optional(),
  quizData: z
    .object({
      questions: z.array(
        z.object({
          id: z.string(),
          question: z.string(),
          type: z.string(),
          options: z.array(z.string()),
          points: z.number(),
          correctAnswerIndex: z.number().optional(),
          explanation: z.string().optional(),
        })
      ),
      passPercentage: z.number().optional(),
    })
    .optional(),
});
export type Mission = z.infer<typeof MissionSchema>;

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  college: z.string(),
  ambassadorId: z.string(),
  ambassadorName: z.string().optional(),
  inviteCode: z.string(),
  memberCount: z.number(),
  totalPoints: z.number(),
  createdAt: z.string(),
  status: z.enum(["active", "archived"]),
});
export type Team = z.infer<typeof TeamSchema>;

export const PlatformSettingsSchema = z.object({
  maxAmbassadorTaskPoints: z.number().default(25),
  allowAmbassadorReview: z.boolean().default(true),
  requireScreenshotCompression: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
});
export type PlatformSettings = z.infer<typeof PlatformSettingsSchema>;

export const SubmissionStateSchema = z.enum([
  "STARTED",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "CHANGES_REQUESTED",
]);
export type SubmissionState = z.infer<typeof SubmissionStateSchema>;

export const SubmissionSchema = z.object({
  id: z.string(),
  missionId: z.string(),
  ambassadorId: z.string(),
  teamId: z.string().optional(),
  studentName: z.string().optional(),
  college: z.string().optional(),
  state: SubmissionStateSchema,
  proofUrl: z.string().optional(),
  normalizedUrl: z.string().optional(),
  screenshotDataUrl: z.string().optional(),
  note: z.string().optional(),
  proofItems: z.array(z.object({
    id: z.string().optional(),
    requirementId: z.string().optional().nullable(),
    textValue: z.string().optional().nullable(),
    urlValue: z.string().optional().nullable(),
    filePath: z.string().optional().nullable(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })).optional(),
  submittedAt: z.string().optional(),
  reviewedAt: z.string().optional(),
  reviewerId: z.string().optional(),
  reviewReason: z.string().optional(),
});
export type Submission = z.infer<typeof SubmissionSchema>;

export const PointTransactionSchema = z.object({
  id: z.string(),
  ambassadorId: z.string(),
  submissionId: z.string(),
  missionId: z.string(),
  points: z.number(),
  reason: z.string(),
  createdAt: z.string(),
});
export type PointTransaction = z.infer<typeof PointTransactionSchema>;

export const TierSchema = z.enum(["bronze", "silver", "gold", "champion"]);
export type Tier = z.infer<typeof TierSchema>;

export const RewardSchema = z.object({
  id: z.string(),
  tier: TierSchema,
  threshold: z.number(),
  title: z.string(),
  titleTa: z.string(),
  perks: z.array(z.string()),
});
export type Reward = z.infer<typeof RewardSchema>;

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum([
    "application_approved",
    "new_mission",
    "deadline_soon",
    "submission_approved",
    "submission_rejected",
    "changes_requested",
    "task_approved",
    "task_rejected",
    "team_joined",
    "points_awarded",
    "rank_changed",
    "reward_unlocked",
    "announcement",
  ]),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
  readAt: z.string().optional().nullable(),
  href: z.string().optional(),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const AnnouncementSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
  pinned: z.boolean(),
  audience: z.enum(["all", "team", "ambassadors"]).optional(),
  teamId: z.string().optional(),
  authorName: z.string().optional(),
});
export type Announcement = z.infer<typeof AnnouncementSchema>;

export const AuditLogSchema = z.object({
  id: z.string(),
  actorId: z.string(),
  actorName: z.string().optional(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string(),
  target: z.string().optional(),
  result: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string(),
});
export type AuditLog = z.infer<typeof AuditLogSchema>;

export const CollegeSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  color: z.string(),
});
export type College = z.infer<typeof CollegeSchema>;

export interface LeaderboardEntry {
  rank: number;
  ambassadorId: string;
  name: string;
  college: string;
  points: number;
  avatarUrl?: string | null;
  isYou: boolean;
  earliestTimestamp: string;
}

export interface CollegeLeaderboardEntry {
  rank: number;
  collegeId: string;
  name: string;
  shortName: string;
  totalPoints: number;
  memberCount: number;
  averagePoints: number;
  topAmbassadorName: string;
  color: string;
}

export interface AdminStats {
  totalAmbassadors: number;
  pendingReviews: number;
  pointsAwarded: number;
  approvalRate: number;
}
