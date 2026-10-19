-- ============================================================
-- ZYVEN PRODUCTION RLS & RPC (MIGRATION 01)
-- Row Level Security + review_submission Transaction + Storage
-- ============================================================

-- ============================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassador_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Helper function to check if current user is ambassador
CREATE OR REPLACE FUNCTION public.is_ambassador()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ambassador'
  );
$$;

-- ============================================================
-- 2. RLS POLICIES
-- ============================================================

-- PROFILES
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update their own non-role profile attributes"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()) -- Cannot change own role
);

CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL TO authenticated
USING (public.is_admin());

-- COLLEGES
CREATE POLICY "Colleges are readable by everyone authenticated"
ON public.colleges FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins manage colleges"
ON public.colleges FOR ALL TO authenticated
USING (public.is_admin());

-- AMBASSADOR REQUESTS
CREATE POLICY "Students can view own requests"
ON public.ambassador_requests FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Students can insert own request"
ON public.ambassador_requests FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() AND public.current_user_role() = 'student');

CREATE POLICY "Admins can update ambassador requests"
ON public.ambassador_requests FOR UPDATE TO authenticated
USING (public.is_admin());

-- TASKS
CREATE POLICY "Students see live tasks within valid dates"
ON public.tasks FOR SELECT TO authenticated
USING (
    status = 'live' 
    AND start_at <= timezone('utc'::text, now())
    AND (deadline IS NULL OR deadline >= timezone('utc'::text, now()))
    OR created_by = auth.uid()
    OR public.is_admin()
);

CREATE POLICY "Ambassadors can insert own drafts"
ON public.tasks FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = created_by 
    AND (public.is_ambassador() OR public.is_admin())
);

CREATE POLICY "Ambassadors can update own non-live tasks"
ON public.tasks FOR UPDATE TO authenticated
USING (
    auth.uid() = created_by 
    AND status IN ('draft', 'changes_requested', 'paused')
    OR public.is_admin()
);

CREATE POLICY "Admins have full control over tasks"
ON public.tasks FOR ALL TO authenticated
USING (public.is_admin());

-- TASK REQUIREMENTS & STEPS
CREATE POLICY "Requirements readable for viewable tasks"
ON public.task_requirements FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Creators manage their task requirements"
ON public.task_requirements FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND created_by = auth.uid())
    OR public.is_admin()
);

CREATE POLICY "Steps readable for viewable tasks"
ON public.task_steps FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Creators manage their task steps"
ON public.task_steps FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND created_by = auth.uid())
    OR public.is_admin()
);

-- SUBMISSIONS
CREATE POLICY "Students can view own submissions"
ON public.submissions FOR SELECT TO authenticated
USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND created_by = auth.uid())
    OR public.is_admin()
);

CREATE POLICY "Students can insert own submissions"
ON public.submissions FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() AND public.current_user_role() = 'student');

CREATE POLICY "Students can update own in-progress submissions"
ON public.submissions FOR UPDATE TO authenticated
USING (
    student_id = auth.uid() AND status IN ('in_progress', 'changes_requested')
);

-- SUBMISSION ITEMS
CREATE POLICY "Submission items accessible by owner, task creator, or admin"
ON public.submission_items FOR SELECT TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.submissions WHERE id = submission_id AND student_id = auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.submissions s 
        JOIN public.tasks t ON t.id = s.task_id 
        WHERE s.id = submission_id AND t.created_by = auth.uid()
    )
    OR public.is_admin()
);

CREATE POLICY "Students can insert submission items for own submission"
ON public.submission_items FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (SELECT 1 FROM public.submissions WHERE id = submission_id AND student_id = auth.uid())
);

-- POINT TRANSACTIONS (Append-only, strictly immutable to client)
CREATE POLICY "Users can read own point transactions"
ON public.point_transactions FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_admin());

-- TIERS & REWARDS
CREATE POLICY "Tiers readable by all"
ON public.tiers FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Rewards readable by all"
ON public.rewards FOR SELECT TO authenticated
USING (true);

-- NOTIFICATIONS
CREATE POLICY "Users can read and update own notifications"
ON public.notifications FOR ALL TO authenticated
USING (user_id = auth.uid());

-- ANNOUNCEMENTS
CREATE POLICY "Users can read published announcements"
ON public.announcements FOR SELECT TO authenticated
USING (status = 'published' OR public.is_admin() OR created_by = auth.uid());

CREATE POLICY "Admins manage announcements"
ON public.announcements FOR ALL TO authenticated
USING (public.is_admin());

-- PLATFORM SETTINGS
CREATE POLICY "Settings readable by authenticated users"
ON public.platform_settings FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Only admins can modify settings"
ON public.platform_settings FOR ALL TO authenticated
USING (public.is_admin());

-- ============================================================
-- 3. AUTHORITATIVE RPC: review_submission
-- Atomic transaction for reviewing and awarding points
-- ============================================================
CREATE OR REPLACE FUNCTION public.review_submission(
    p_submission_id UUID,
    p_action TEXT, -- 'approved', 'rejected', 'changes_requested'
    p_reason TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_reviewer_id UUID;
    v_reviewer_role TEXT;
    v_sub RECORD;
    v_task RECORD;
    v_points_awarded INTEGER := 0;
BEGIN
    -- 1. Identify and authenticate caller
    v_reviewer_id := auth.uid();
    IF v_reviewer_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    SELECT role INTO v_reviewer_role FROM public.profiles WHERE id = v_reviewer_id;
    IF v_reviewer_role NOT IN ('ambassador', 'admin') THEN
        RAISE EXCEPTION 'Unauthorized: Caller is not an ambassador or admin.';
    END IF;

    -- 2. Lock and retrieve submission
    SELECT * INTO v_sub FROM public.submissions WHERE id = p_submission_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Submission not found.';
    END IF;

    -- 3. Retrieve task
    SELECT * INTO v_task FROM public.tasks WHERE id = v_sub.task_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Associated task not found.';
    END IF;

    -- 4. Authorize reviewer: Must be task creator OR admin
    IF v_reviewer_role = 'ambassador' AND v_task.created_by != v_reviewer_id THEN
        RAISE EXCEPTION 'Forbidden: Ambassador can only review submissions to their own tasks.';
    END IF;

    -- 5. Prevent double approval
    IF v_sub.status = 'approved' THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Submission is already approved.',
            'status', v_sub.status
        );
    END IF;

    -- 6. Execute review action
    IF p_action = 'approved' THEN
        UPDATE public.submissions
        SET status = 'approved',
            reviewed_at = timezone('utc'::text, now()),
            reviewed_by = v_reviewer_id,
            review_reason = p_reason,
            score = v_task.points,
            updated_at = timezone('utc'::text, now())
        WHERE id = p_submission_id;

        -- Create atomic point transaction (protected by UNIQUE constraint on submission_id, type)
        INSERT INTO public.point_transactions (
            student_id,
            submission_id,
            amount,
            type,
            reason,
            created_by
        ) VALUES (
            v_sub.student_id,
            p_submission_id,
            v_task.points,
            'task_approved',
            'Completed task: ' || v_task.title,
            v_reviewer_id
        )
        ON CONFLICT (submission_id, type) DO NOTHING;

        v_points_awarded := v_task.points;

        -- Notification to student
        INSERT INTO public.notifications (
            user_id,
            type,
            title,
            body,
            entity_type,
            entity_id
        ) VALUES (
            v_sub.student_id,
            'submission_approved',
            'Task Approved: +' || v_task.points || ' pts!',
            'Your submission for "' || v_task.title || '" has been verified and points awarded.',
            'submission',
            p_submission_id
        );

    ELSIF p_action = 'changes_requested' THEN
        UPDATE public.submissions
        SET status = 'changes_requested',
            reviewed_at = timezone('utc'::text, now()),
            reviewed_by = v_reviewer_id,
            review_reason = p_reason,
            updated_at = timezone('utc'::text, now())
        WHERE id = p_submission_id;

        INSERT INTO public.notifications (
            user_id,
            type,
            title,
            body,
            entity_type,
            entity_id
        ) VALUES (
            v_sub.student_id,
            'submission_changes_requested',
            'Changes Requested on Task',
            'Feedback on "' || v_task.title || '": ' || COALESCE(p_reason, 'Please update your proof.'),
            'submission',
            p_submission_id
        );

    ELSIF p_action = 'rejected' THEN
        UPDATE public.submissions
        SET status = 'rejected',
            reviewed_at = timezone('utc'::text, now()),
            reviewed_by = v_reviewer_id,
            review_reason = p_reason,
            updated_at = timezone('utc'::text, now())
        WHERE id = p_submission_id;

        INSERT INTO public.notifications (
            user_id,
            type,
            title,
            body,
            entity_type,
            entity_id
        ) VALUES (
            v_sub.student_id,
            'submission_rejected',
            'Submission Not Accepted',
            'Your submission for "' || v_task.title || '" was not approved. ' || COALESCE(p_reason, ''),
            'submission',
            p_submission_id
        );

    ELSE
        RAISE EXCEPTION 'Invalid review action: %', p_action;
    END IF;

    -- 7. Audit log entry
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        metadata
    ) VALUES (
        v_reviewer_id,
        'review_submission_' || p_action,
        'submission',
        p_submission_id::text,
        jsonb_build_object(
            'student_id', v_sub.student_id,
            'task_id', v_sub.task_id,
            'points_awarded', v_points_awarded,
            'reason', p_reason
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'action', p_action,
        'points_awarded', v_points_awarded,
        'submission_id', p_submission_id
    );
END;
$$;

-- ============================================================
-- 4. RPC: get_student_points & Leaderboard Calculation
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_student_points(p_student_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(amount), 0)::INTEGER
  FROM public.point_transactions
  WHERE student_id = p_student_id;
$$;

-- ============================================================
-- 5. STORAGE BUCKET: proofs
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('proofs', 'proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Student uploads to proofs/{auth.uid()}
CREATE POLICY "Students can upload proofs into own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'proofs'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners, Task Reviewers, and Admin can read proofs"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'proofs'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR public.is_ambassador()
        OR public.is_admin()
    )
);
