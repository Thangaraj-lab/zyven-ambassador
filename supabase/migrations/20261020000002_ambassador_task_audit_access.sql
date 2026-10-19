-- Allow ambassadors to audit only tasks they created and their student submissions.
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins and task owners can read audit logs" ON public.audit_logs;
CREATE POLICY "Admins and task owners can read audit logs"
ON public.audit_logs
FOR SELECT TO authenticated
USING (
    public.is_admin()
    OR (
        public.is_ambassador()
        AND (
            (
                entity_type = 'task'
                AND EXISTS (
                    SELECT 1
                    FROM public.tasks
                    WHERE tasks.id::text = audit_logs.entity_id
                      AND tasks.created_by = auth.uid()
                )
            )
            OR (
                entity_type = 'submission'
                AND EXISTS (
                    SELECT 1
                    FROM public.submissions
                    JOIN public.tasks ON tasks.id = submissions.task_id
                    WHERE submissions.id::text = audit_logs.entity_id
                      AND tasks.created_by = auth.uid()
                )
            )
        )
    )
);

GRANT SELECT ON public.audit_logs TO authenticated;
