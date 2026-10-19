-- ============================================================
-- ZYVEN PRODUCTION DATABASE SCHEMA (MIGRATION 00)
-- PostgreSQL + Supabase
-- ============================================================

-- Ensure uuid-ossp or pgcrypto is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    city TEXT,
    state TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PROFILES TABLE (Linked directly to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'ambassador', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    department TEXT,
    year TEXT,
    city TEXT,
    bio TEXT,
    language TEXT NOT NULL DEFAULT 'en',
    theme TEXT NOT NULL DEFAULT 'dark',
    leaderboard_visibility BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. AMBASSADOR REQUESTS
CREATE TABLE IF NOT EXISTS public.ambassador_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TASKS TABLE (SOLO ambassador / Admin authority)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    short_description TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Social Media',
    task_type TEXT NOT NULL DEFAULT 'HYBRID' CHECK (
        task_type IN (
            'QUIZ', 'MCQ', 'UPLOAD', 'PPT', 'DOCUMENT', 'IMAGE', 'VIDEO',
            'URL', 'TEXT', 'COURSE_COMPLETION', 'CERTIFICATE', 'SCREENSHOT',
            'FORM', 'SURVEY', 'EVENT', 'REFERRAL', 'SOCIAL_MEDIA', 'MULTI_STEP', 'HYBRID'
        )
    ),
    points INTEGER NOT NULL CHECK (points > 0),
    estimated_minutes INTEGER NOT NULL DEFAULT 10,
    start_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deadline TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'pending_approval', 'changes_requested', 'live', 'paused', 'rejected', 'archived')
    ),
    cover_image TEXT,
    language TEXT NOT NULL DEFAULT 'en',
    is_public BOOLEAN NOT NULL DEFAULT true,
    google_form_url TEXT,
    google_spreadsheet_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TASK REVISIONS
CREATE TABLE IF NOT EXISTS public.task_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TASK AUDIENCES (PUBLIC, ALL_STUDENTS, COLLEGE, SELECTED_STUDENTS)
CREATE TABLE IF NOT EXISTS public.task_audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    audience_type TEXT NOT NULL DEFAULT 'all_students' CHECK (
        audience_type IN ('public', 'all_students', 'college', 'selected_students')
    ),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TASK RECIPIENTS (For targeted audience: selected_students)
CREATE TABLE IF NOT EXISTS public.task_recipients (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (task_id, student_id)
);

-- 8. TASK REQUIREMENTS
CREATE TABLE IF NOT EXISTS public.task_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (
        type IN ('url', 'text', 'file', 'image', 'video', 'screenshot', 'ppt', 'pdf', 'doc', 'certificate', 'quiz', 'course_proof')
    ),
    title TEXT NOT NULL,
    description TEXT,
    required BOOLEAN NOT NULL DEFAULT true,
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TASK STEPS
CREATE TABLE IF NOT EXISTS public.task_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    external_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. QUIZ QUESTIONS & OPTIONS
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'single_choice' CHECK (
        question_type IN ('single_choice', 'multiple_choice', 'true_false', 'short_answer')
    ),
    points INTEGER NOT NULL DEFAULT 5,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.quiz_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 11. SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (
        status IN ('in_progress', 'submitted', 'approved', 'changes_requested', 'rejected')
    ),
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_reason TEXT,
    score INTEGER NOT NULL DEFAULT 0,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. SUBMISSION ITEMS
CREATE TABLE IF NOT EXISTS public.submission_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES public.task_requirements(id) ON DELETE SET NULL,
    text_value TEXT,
    url_value TEXT,
    file_path TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. POINT TRANSACTIONS (Append-only authoritative ledger)
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('task_approved', 'admin_adjustment', 'reward_adjustment')),
    reason TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Prevent duplicate point awards per submission for task_approved
    CONSTRAINT unique_submission_points UNIQUE (submission_id, type)
);

-- 14. TIERS & REWARDS
CREATE TABLE IF NOT EXISTS public.tiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    min_points INTEGER NOT NULL UNIQUE,
    description TEXT,
    badge TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_id TEXT NOT NULL REFERENCES public.tiers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'redeemed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    audience_type TEXT NOT NULL DEFAULT 'all_students' CHECK (
        audience_type IN ('all_students', 'ambassadors', 'college')
    ),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. AUDIT LOGS (Immutable security ledger)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- PERFORMANCE & SECURITY INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_college_id ON public.profiles(college_id);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON public.tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_start_at ON public.tasks(start_at);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON public.tasks(deadline);

CREATE INDEX IF NOT EXISTS idx_submissions_task_id ON public.submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

CREATE INDEX IF NOT EXISTS idx_point_transactions_student_id ON public.point_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_submission_id ON public.point_transactions(submission_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ============================================================
-- INITIAL CORE SEED (Tiers, Platform Settings, Initial Colleges)
-- ============================================================
INSERT INTO public.platform_settings (key, value, description)
VALUES 
    ('max_ambassador_task_points', '25'::jsonb, 'Maximum points an ambassador can assign to a task without admin override'),
    ('allow_student_signup', 'true'::jsonb, 'Toggle student public registration')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.tiers (id, name, min_points, description, badge, sort_order)
VALUES 
    ('bronze', 'Bronze Cadet', 0, 'Beginning your campus advocacy journey', '🥉', 1),
    ('silver', 'Silver Pioneer', 150, 'Recognized campus contributor', '🥈', 2),
    ('gold', 'Gold Vanguard', 400, 'Top-tier campus leader', '🥇', 3),
    ('platinum', 'Platinum Legend', 1000, 'Elite Zyven campus representative', '💎', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.colleges (id, name, code, city, state)
VALUES 
    ('c0000000-0000-0000-0000-000000000001', 'Indian Institute of Technology Madras', 'IITM', 'Chennai', 'Tamil Nadu'),
    ('c0000000-0000-0000-0000-000000000002', 'National Institute of Technology Trichy', 'NITT', 'Tiruchirappalli', 'Tamil Nadu'),
    ('c0000000-0000-0000-0000-000000000003', 'College of Engineering Guindy', 'CEG', 'Chennai', 'Tamil Nadu')
ON CONFLICT (code) DO NOTHING;
