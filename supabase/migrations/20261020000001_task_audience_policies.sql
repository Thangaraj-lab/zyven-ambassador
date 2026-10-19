-- Allow task creators and administrators to configure task audiences.
ALTER TABLE public.task_audiences ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.tasks, public.task_audiences, public.task_requirements, public.task_steps TO authenticated;

CREATE OR REPLACE FUNCTION public.can_manage_task_audience(target_task_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.tasks
      WHERE tasks.id = target_task_id
        AND tasks.created_by = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.can_manage_task_audience(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_manage_task_audience(UUID) TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can read task audiences" ON public.task_audiences;
CREATE POLICY "Authenticated users can read task audiences"
ON public.task_audiences
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Creators and admins manage task audiences" ON public.task_audiences;
CREATE POLICY "Creators and admins manage task audiences" ON public.task_audiences
FOR ALL TO authenticated
USING (
    public.can_manage_task_audience(task_audiences.task_id)
)
WITH CHECK (
    public.can_manage_task_audience(task_audiences.task_id)
);
