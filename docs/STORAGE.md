# ZYVEN Storage & Realtime

## Supabase Storage
- **Bucket**: `proofs` (Private bucket).
- **Structure**: `proofs/{student_id}/{submission_id}/{filename}`
- **Access Policies**:
  - Insert: Only the authenticated student owning `{student_id}`.
  - Select: Student owner, Ambassador creating the task, or Admin.
  - Signed URLs: Pre-signed with short expiration (600s) for reviewers.

## Supabase Realtime Architecture
- Subscribed channels:
  - `public-tasks`: Invalidates `["tasks"]` and `["missions"]` on status change (e.g., when Admin approves task).
  - `public-submissions`: Invalidates `["submissions"]` and `["ambassador-metrics"]` when a new submission arrives.
  - `user-{userId}`: Invalidates notifications and point ledger for the active student immediately upon review approval.
- **Cache Invalidation over Blind Append**:
  - The client invalidates queries rather than appending JSON directly, ensuring strict consistency with PostgreSQL.
