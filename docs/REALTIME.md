# ZYVEN Realtime Architecture

## Realtime Invalidation Flow
1. **Ambassador Task Approved**:
   - Admin approves task via `approveTaskAction`.
   - PostgreSQL emits `UPDATE` on `public.tasks`.
   - `public-tasks` Realtime channel catches event.
   - TanStack Query invalidates `["missions"]`.
   - Students see the new live task appear in real time without refreshing.

2. **Student Submits Task**:
   - Student submits proof via `submitTaskProofAction`.
   - PostgreSQL emits `INSERT` on `public.submissions`.
   - `public-submissions` Realtime channel invalidates `["ambassador-metrics"]` & `["submissions"]`.
   - Ambassador review queue updates in real time.

3. **Ambassador Approves Submission**:
   - `review_submission` RPC executes atomically.
   - Point transaction inserted -> emits `INSERT` on `point_transactions`.
   - Notification inserted -> emits `INSERT` on `notifications`.
   - Student receives live bell badge + points increment + leaderboard update.
