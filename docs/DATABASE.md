# ZYVEN Database Documentation

## 1. PostgreSQL Schema Overview
All tables reside in the `public` schema with Row Level Security (RLS) enabled.

### Core Tables
1. `profiles`: User accounts linked 1:1 with `auth.users(id)`.
   - `role`: `'student' | 'ambassador' | 'admin'`
   - `status`: `'active' | 'suspended' | 'pending'`
   - Points are NOT stored in profiles (calculated dynamically from `point_transactions`).
2. `colleges`: Verified campus institutions.
3. `ambassador_requests`: Student applications to become campus ambassadors.
4. `tasks`: Campaigns created by Ambassadors or Admins.
   - Statuses: `draft`, `pending_approval`, `changes_requested`, `live`, `paused`, `rejected`, `archived`.
   - Supported types: `QUIZ`, `MCQ`, `UPLOAD`, `PPT`, `DOCUMENT`, `IMAGE`, `VIDEO`, `URL`, `TEXT`, `COURSE_COMPLETION`, `CERTIFICATE`, `SCREENSHOT`, `FORM`, `SURVEY`, `EVENT`, `REFERRAL`, `SOCIAL_MEDIA`, `MULTI_STEP`, `HYBRID`.
5. `task_revisions`: Immutable audit of approved task configuration changes.
6. `task_audiences`: Target criteria (`public`, `all_students`, `college`, `selected_students`).
7. `task_recipients`: Specific user IDs for `selected_students` targeting.
8. `task_requirements`: Flexible requirement definitions (URLs, text, file specifications, screenshots).
9. `task_steps`: Ordered execution guide for participants.
10. `quiz_questions` & `quiz_options`: Quiz engine questions and option choices.
11. `submissions`: Student participation records.
12. `submission_items`: Specific answers, links, and file paths.
13. `point_transactions`: Authoritative append-only points ledger with unique constraints on `(submission_id, type)`.
14. `tiers`: Tier definition badges and score requirements (Bronze, Silver, Gold, Platinum).
15. `rewards`: Perks unlocked per tier.
16. `notifications`: User alert notifications with read receipts.
17. `announcements`: Broadcast announcements.
18. `audit_logs`: Immutable security ledger for administrative and review actions.
19. `platform_settings`: Global key-value settings (e.g. `max_ambassador_task_points`).

## 2. PostgreSQL Stored Procedures
- `review_submission(p_submission_id, p_action, p_reason)`:
  - Locks submission using `FOR UPDATE`.
  - Enforces reviewer authorization (Ambassador must own task; or Admin).
  - Updates submission status.
  - Inserts atomic row in `point_transactions` (idempotent via unique constraint).
  - Dispatches student notification.
  - Inserts entry into `audit_logs`.
- `get_student_points(p_student_id)`:
  - Returns `COALESCE(SUM(amount), 0)`.
