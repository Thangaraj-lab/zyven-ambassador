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
  AMBASSADOR_USER,
  AMBASSADOR_PROFILE,
  ADMIN_USER,
  SEED_MISSIONS,
  SEED_ANNOUNCEMENTS,
} from "./seed";

const STORAGE_KEY = "zyven_portal_production_store_v4";

export interface MockStoreState {
  users: User[];
  profiles: AmbassadorProfile[];
  missions: Mission[];
  submissions: Submission[];
  pointTransactions: PointTransaction[];
  notifications: Notification[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  teams: import("../types").Team[];
  platformSettings: import("../types").PlatformSettings;
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
    const initialNotifications: Notification[] = [
      {
        id: "notif-welcome",
        userId: CURRENT_USER.id,
        type: "application_approved",
        title: "Welcome to Zyven!",
        body: "Your membership is active. Complete your initial missions to start earning verified points.",
        createdAt: "2026-10-18T08:00:00Z",
        readAt: null,
        href: "/missions",
      },
    ];

    return {
      users: [ADMIN_USER, CURRENT_USER, AMBASSADOR_USER],
      profiles: [CURRENT_PROFILE, AMBASSADOR_PROFILE],
      missions: [...SEED_MISSIONS],
      submissions: [],
      pointTransactions: [],
      notifications: [...initialNotifications],
      announcements: [...SEED_ANNOUNCEMENTS],
      auditLogs: [
        {
          id: "audit-init",
          actorId: ADMIN_USER.id,
          actorName: ADMIN_USER.name,
          action: "INITIALIZE_PORTAL",
          entity: "System",
          entityId: "system",
          result: "SUCCESS",
          metadata: { version: "3.0.0", platform: "Zyven Production Platform" },
          createdAt: "2026-10-01T00:00:00Z",
        },
      ],
      teams: [],
      platformSettings: {
        maxAmbassadorTaskPoints: 25,
        allowAmbassadorReview: true,
        requireScreenshotCompression: true,
        maintenanceMode: false,
      },
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
