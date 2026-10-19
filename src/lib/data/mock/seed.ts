import type {
  User,
  AmbassadorProfile,
  Mission,
  Submission,
  Reward,
  Announcement,
  College,
} from "../types";

export const SEED_COLLEGES: College[] = [
  { id: "col-mec", name: "Muthayammal Engineering College", shortName: "MEC", color: "#6366F1" },
  { id: "col-ksr", name: "K.S. Rangasamy College of Technology", shortName: "KSR", color: "#8B5CF6" },
  { id: "col-kongu", name: "Kongu Engineering College", shortName: "Kongu", color: "#EC4899" },
  { id: "col-psg", name: "PSG College of Technology", shortName: "PSG", color: "#3B82F6" },
  { id: "col-sona", name: "Sona College of Technology", shortName: "Sona", color: "#F59E0B" },
  { id: "col-srm", name: "SRM Institute of Science and Technology", shortName: "SRM", color: "#10B981" },
];

export const ADMIN_CREDENTIAL_PASSWORD = "raj@123";

export const ADMIN_USER: User = {
  id: "user-admin",
  role: "admin",
  name: "Pandithangamalai (Admin)",
  email: "pandithangamalai3@gmail.com",
  avatarUrl: null,
};

export const CURRENT_USER: User = {
  id: "user-student-thangaraj",
  role: "student",
  name: "Thangaraj",
  email: "thangaraj.mec@zyven.student",
  phone: "+91 98765 43210",
  avatarUrl: null,
};

export const AMBASSADOR_USER: User = {
  id: "user-ambassador-kavitha",
  role: "ambassador",
  name: "Kavitha Rajan",
  email: "ambassador@zyven.network",
  phone: "+91 98765 43211",
  avatarUrl: null,
};

export const CURRENT_PROFILE: AmbassadorProfile = {
  userId: "user-student-thangaraj",
  college: "Muthayammal Engineering College",
  department: "Computer Science and Business Systems (CSBS)",
  year: "2nd Year",
  city: "Rasipuram",
  studentId: "23CB042",
  linkedin: "https://linkedin.com/in/thangaraj-mec",
  instagram: "@thangaraj_dev",
  interests: ["Tech Communities", "Event Organizing", "Web Development"],
  skills: ["Public Speaking", "Community Building", "Frontend"],
  whyJoin: "I want to bring high-impact tech opportunities and student developer programs directly to Muthayammal campus.",
  status: "active",
  joinedAt: "2026-10-01T08:00:00Z",
  cohortNumber: 1,
};

export const AMBASSADOR_PROFILE: AmbassadorProfile = {
  userId: "user-ambassador-kavitha",
  college: "Muthayammal Engineering College",
  department: "Computer Science",
  year: "3rd Year",
  city: "Rasipuram",
  studentId: "22CS088",
  linkedin: "https://linkedin.com/in/kavitha-ambassador",
  interests: ["Community Leadership", "Event Organizing"],
  skills: ["Leadership", "Management"],
  whyJoin: "Lead Zyven campus initiatives",
  status: "active",
  joinedAt: "2026-10-01T08:00:00Z",
  cohortNumber: 1,
};

// Zero default missions - starts 100% empty for production launch
export const SEED_MISSIONS: Mission[] = [];

export const SEED_REWARDS: Reward[] = [
  {
    id: "rew-bronze",
    tier: "bronze",
    threshold: 50,
    title: "Bronze Ambassador",
    titleTa: "Bronze தூதர்",
    perks: [
      "Official Zyven Digital Certificate of Recognition",
      "Access to Private Discord & Founder AMAs",
      "Founding Ambassador Profile Badge",
    ],
  },
  {
    id: "rew-silver",
    tier: "silver",
    threshold: 150,
    title: "Silver Ambassador",
    titleTa: "Silver தூதர்",
    perks: [
      "Priority access to high-point campus missions",
      "Zyven Ambassador Welcome Kit & Stickers",
      "Spotlight feature on Zyven LinkedIn page",
    ],
  },
  {
    id: "rew-gold",
    tier: "gold",
    threshold: 300,
    title: "Gold Ambassador",
    titleTa: "Gold தூதர்",
    perks: [
      "Premium Zyven Ambassador Hoodie & Swag Box",
      "Fast-track internship interview consideration",
      "Exclusive invite to Regional Student Summit",
    ],
  },
  {
    id: "rew-champion",
    tier: "champion",
    threshold: 500,
    title: "Campus Champion",
    titleTa: "கேம்பஸ் சாம்பியன்",
    perks: [
      "Top-tier Cash Stipend / Campus Sponsorship",
      "Direct mentorship with Tech Founders & Industry Leaders",
      "Letter of Recommendation from Leadership",
    ],
  },
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Welcome Founding Ambassadors & Students to Zyven!",
    body: "We are thrilled to launch the Zyven Student Ambassador Platform. Complete your initial missions to start earning verified points.",
    createdAt: "2026-10-15T09:00:00Z",
    pinned: true,
  },
];

// Zero demo ambassadors in production
export const SEED_DEMO_AMBASSADORS: Array<{
  user: User;
  profile: AmbassadorProfile;
  points: number;
  joinedAt: string;
}> = [];

// Zero fake pending submissions in production
export const SEED_PENDING_SUBMISSIONS: Submission[] = [];
