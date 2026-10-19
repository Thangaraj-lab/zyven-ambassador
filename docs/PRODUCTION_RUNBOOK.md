# ZYVEN Production Runbook

## Rollback Procedures
- **Vercel Rollback**: Instant rollback to previous deployment sha via Vercel dashboard.
- **Database Rollback**:
  - Revert migrations via down scripts or point-in-time recovery (PITR) in Supabase.
- **Circuit Breaker / Emergency Fallback**:
  - Set `NEXT_PUBLIC_USE_MOCK=true` if database connection suffers total outage.

## Incident Management
1. **Database Connection Errors**: Check Supabase connection pool and API health at status.supabase.com.
2. **Review Duplicate Attempts**: Handled transparently by PostgreSQL `unique_submission_points` constraint.
3. **Admin Credential Rotation**: Rotate immediately via Supabase Auth dashboard or SQL update.
