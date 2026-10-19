# ZYVEN Authentication & Authorization

## Authentication Architecture
- **Provider**: Supabase Auth (Email/Password, OAuth: Google, GitHub, LinkedIn).
- **Public Login Page**: `/login`
  - Visual selector tabs: **Student** and **Ambassador** only.
  - Admin login: Uses the same login form. No admin button or role switch is displayed publicly.
  - Role resolution: Server-side query against `public.profiles` upon session establishment.
- **Admin MFA**:
  - Sensitive administrative actions require Authenticator Assurance Level 2 (AAL2 / TOTP).
  - Enforced via `requireAdminMFA()` in `src/lib/auth/serverAuth.ts`.

## Role Model
There are exactly THREE backend roles:
1. `student`: Enrolls in tasks, submits proof, completes quizzes, tracks dynamic points & leaderboard.
2. `ambassador`: SOLO task creator and reviewer for own tasks. No team ownership or management.
3. `admin`: Global authority. Approves tasks, adjusts points, resolves ambassador requests, configures platform settings.

## Server-Side Authorization Functions
Defined in `src/lib/auth/serverAuth.ts`:
- `requireUser()`: Asserts valid Supabase session.
- `requireActiveUser()`: Asserts account is not suspended.
- `requireStudent()`: Restricts access to students.
- `requireAmbassador()`: Restricts access to ambassadors (or admins).
- `requireAdmin()`: Restricts access strictly to admins.
- `requireAdminMFA()`: Asserts admin role + AAL2 MFA verification.
