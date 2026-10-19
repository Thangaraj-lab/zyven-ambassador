# ZYVEN Production Architecture

```
                    ZYVEN
                      │
                      ▼
              PUBLIC LOGIN (/login)
              [Student]  [Ambassador]
                      │
                      ▼
              SUPABASE AUTH
                      │
                      ▼
             SERVER SESSION (SSR)
                      │
                      ▼
              PROFILES.ROLE
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
     STUDENT      AMBASSADOR      ADMIN
    /dashboard   /ambassador     /admin (MFA)
        │             │             │
        │             │             │
        │             ▼             │
        │        CREATE TASK        │
        │             │             │
        │             ▼             │
        │       ADMIN APPROVAL ◄────┘
        │             │
        │             ▼
        │            LIVE
        │             │
        ▼             │
   ELIGIBLE TASK ◄────┘
        │
        ▼
    COMPLETE
        │
        ▼
   SUBMIT PROOF
        │
        ▼
   AMBASSADOR REVIEW
        │
   ┌────┼────┐
   ▼    ▼    ▼
APPROVE CHANGES REJECT
   │      │
   │      └──────→ RESUBMIT
   │
   ▼
ATOMIC TRANSACTION (PostgreSQL RPC)
   │
   ├── submission approved
   ├── points created (SUM from ledger)
   ├── notification
   └── audit log
   │
   ▼
 REALTIME (Cache Invalidation)
   │
   ▼
STUDENT
   │
   ├── POINTS
   ├── LEADERBOARD
   └── TIER/REWARD
```

## Layers
1. **Frontend**: Next.js 16 App Router + React 19 + Tailwind CSS v4 + Framer Motion / GSAP / Three.js.
2. **Session / SSR**: `@supabase/ssr` cookies stored via `getSupabaseServerClient()` and refreshed in `middleware.ts`.
3. **Authorization**: Centralized server guards in `src/lib/auth/serverAuth.ts` (`requireUser`, `requireActiveUser`, `requireStudent`, `requireAmbassador`, `requireAdmin`, `requireAdminMFA`).
4. **Database & Storage**: Supabase PostgreSQL with strict RLS enabled on all tables; private `proofs` storage bucket with signed URLs.
5. **Realtime Sync**: Supabase Realtime channels bound to TanStack Query invalidation (`useRealtimeSync`).
