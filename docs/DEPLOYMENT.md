# ZYVEN Deployment Guide

## Architecture
- **Hosting**: Vercel (Next.js 16 App Router)
- **Database & Storage**: Supabase Production Instance (PostgreSQL 15+, Supabase Auth, Storage)

## Step-by-Step Deployment

### 1. Supabase Setup
1. Create a production Supabase project at [supabase.com](https://supabase.com).
2. Authenticate the Supabase CLI and link this project:
   ```bash
   supabase login
   supabase link --project-ref waytzdemvxwlkrejkjki
   ```
3. Apply the tracked migrations from the repository:
   ```bash
   supabase db push
   ```
   This is the permanent deployment path; it records migration versions and prevents accidental re-execution.
4. The migrations are also available in `supabase/migrations/`:
   - `20261019000000_zyven_core_schema.sql`
   - `20261019000001_zyven_rpc_and_rls.sql`
   - `20261019000002_zyven_launch_tasks.sql`
   - `20261019000003_auth_hardening_and_launch.sql`
5. Confirm private bucket `proofs` exists under Supabase Storage.
6. Enable Supabase Realtime for `tasks`, `submissions`, `point_transactions`, `notifications`.
7. Configure Auth URL redirects:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/**`

### 2. Vercel Environment Variables
Set the following environment variables in the Vercel Dashboard:
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_URL`
- `NEXT_PUBLIC_LINKEDIN_URL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_USE_MOCK=false`

### 3. Deploy
```bash
git push origin main
```
Vercel automatically builds and triggers production deployment.
