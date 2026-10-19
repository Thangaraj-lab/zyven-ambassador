# ZYVEN Launch Readiness Checklist

- [x] Zero mock or fake demo users in production seeds
- [x] Zero demo submissions in production seeds
- [x] Elimination of Team model (Ambassador is strictly SOLO)
- [x] Public login shows strictly [Student] and [Ambassador] tabs (No public Admin selector)
- [x] Server-side role resolution from `profiles.role`
- [x] Admin login routes to `/admin` securely via server-side session
- [x] Admin MFA / AAL2 security guards implemented
- [x] PostgreSQL schema migrations for 18 tables + indexes + constraints
- [x] Atomic `review_submission` RPC with `FOR UPDATE` locking and idempotency protection
- [x] Row Level Security (RLS) on 100% of tables
- [x] Private Supabase Storage bucket `proofs` with signed URLs
- [x] Only 2 approved real launch tasks:
  1. `LinkedIn Follow + Post` (50 pts)
  2. `WhatsApp Community` (30 pts)
- [x] Multi-step Ambassador Task Studio with Google Form & Spreadsheet URL options
- [x] Realtime sync hook with TanStack Query cache invalidation
- [x] Cloudflare Turnstile token validation
- [x] Rate limiting on sensitive mutations
- [x] Security headers (CSP, X-Frame-Options, X-Content-Type-Options) in middleware
- [x] TypeScript clean (`npm run typecheck`)
- [x] Test suite passing (`npm run test`)
