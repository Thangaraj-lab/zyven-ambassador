import type {
  User,
  AmbassadorProfile,
  Mission,
  Submission,
  PointTransaction,
  Notification,
  Announcement,
  AuditLog,
} from "../types";
import {
  CURRENT_USER,
  CURRENT_PROFILE,
  ADMIN_USER,
  SEED_MISSIONS,
  SEED_ANNOUNCEMENTS,
  SEED_DEMO_AMBASSADORS,
  SEED_PENDING_SUBMISSIONS,
} from "./seed";

const STORAGE_KEY = "zyven_portal_mock_store_v1";

export interface MockStoreState {
  users: User[];
  profiles: AmbassadorProfile[];
  missions: Mission[];
  submissions: Submission[];
  pointTransactions: PointTransaction[];
  notifications: Notification[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  currentUserId: string | null;
  approvalRequired: boolean;
  seenTiers: string[];
}

class MockStore {
  private state: MockStoreState;
  private listeners: Set<() => void> = new Set();
  private isClient: boolean = typeof window !== "undefined";

  constructor() {
    this.state = this.getInitialState();
    if (this.isClient) {
      this.loadFromStorage();
    }
  }

  private getInitialState(): MockStoreState {
    const demoUsers: User[] = SEED_DEMO_AMBASSADORS.map((d) => d.user);
    const demoProfiles: AmbassadorProfile[] = SEED_DEMO_AMBASSADORS.map(
      (d) => d.profile
    );

    // Initial point transactions for demo ambassadors
    const demoTransactions: PointTransaction[] = [];
    SEED_DEMO_AMBASSADORS.forEach((demo) => {
      if (demo.points > 0) {
        demoTransactions.push({
          id: `tx-${demo.user.id}-initial`,
          ambassadorId: demo.user.id,
          submissionId: `sub-${demo.user.id}-initial`,
          missionId: "mission-linkedin",
          points: demo.points,
          reason: "Prior verified missions",
          createdAt: demo.joinedAt,
        });
      }
    });

    const initialNotifications: Notification[] = [
      {
        id: "notif-welcome",
        userId: CURRENT_USER.id,
        type: "application_approved",
        title: "Welcome to Zyven!",
        body: "Your ambassador membership has been activated. Start your first mission to earn points.",
        createdAt: "2026-10-18T08:00:00Z",
        readAt: null,
        href: "/missions",
      },
      {
        id: "notif-mission-1",
        userId: CURRENT_USER.id,
        type: "new_mission",
        title: "New Mission: Follow & Post on LinkedIn",
        body: "Earn 50 Points and jump immediately to Bronze tier.",
        createdAt: "2026-10-18T08:05:00Z",
        readAt: null,
        href: "/missions/linkedin-follow-post",
      },
    ];

    return {
      users: [CURRENT_USER, ADMIN_USER, ...demoUsers],
      profiles: [CURRENT_PROFILE, ...demoProfiles],
      missions: [...SEED_MISSIONS],
      submissions: [...SEED_PENDING_SUBMISSIONS],
      pointTransactions: [...demoTransactions],
      notifications: [...initialNotifications],
      announcements: [...SEED_ANNOUNCEMENTS],
      auditLogs: [
        {
          id: "audit-init",
          actorId: ADMIN_USER.id,
          action: "INITIALIZE_PORTAL",
          entity: "System",
          entityId: "system",
          createdAt: "2026-10-01T00:00:00Z",
        },
      ],
      currentUserId: CURRENT_USER.id,
      approvalRequired: false,
      seenTiers: [],
    };
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = {
          ...this.state,
          ...parsed,
        };
      }
    } catch {
      // Local storage not accessible or corrupt
    }
  }

  private persist() {
    if (this.isClient) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch {
        // Local storage full or unavailable
      }
    }
    this.notify();
  }

  public getState(): MockStoreState {
    return this.state;
  }

  public setState(updater: (prev: MockStoreState) => Partial<MockStoreState>) {
    const updates = updater(this.state);
    this.state = { ...this.state, ...updates };
    this.persist();
  }

  public resetToSeed() {
    this.state = this.getInitialState();
    if (this.isClient) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    this.persist();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch {}
    });
  }
}

export const mockStore = new MockStore();
