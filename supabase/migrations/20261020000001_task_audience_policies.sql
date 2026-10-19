-- Allow task creators and administrators to configure task audiences.
ALTER TABLE public.task_audiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read task audiences" ON public.task_audiences;
CREATE POLICY "Authenticated users can read task audiences"
ON public.task_audiences
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Creators and admins manage task audiences" ON public.task_audiences;
CREATE POLICY "Creators and admins manage task audiences" ON public.task_audiences
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.tasks
    WHERE tasks.id = task_audiences.task_id
      AND tasks.created_by = auth.uid()
  )
)
WITH CHECK (
  public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.tasks
    WHERE tasks.id = task_audiences.task_id
      AND tasks.created_by = auth.uid()
  )
);
