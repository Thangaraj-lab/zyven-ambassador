-- Enforce task audience visibility at the database boundary.
DROP POLICY IF EXISTS "Students see live tasks within valid dates" ON public.tasks;
CREATE POLICY "Students see live tasks within valid dates" ON public.tasks FOR SELECT TO authenticated
USING (
  (
    status = 'live'
    AND start_at <= timezone('utc'::text, now())
    AND (deadline IS NULL OR deadline >= timezone('utc'::text, now()))
    AND EXISTS (
      SELECT 1
      FROM public.task_audiences audience
      LEFT JOIN public.profiles viewer ON viewer.id = auth.uid()
      WHERE audience.task_id = tasks.id
        AND (
          audience.audience_type IN ('public', 'all_students')
          OR (audience.audience_type = 'college' AND audience.college_id = viewer.college_id)
          OR (audience.audience_type = 'selected_students' AND EXISTS (
            SELECT 1 FROM public.task_recipients recipient
            WHERE recipient.task_id = tasks.id AND recipient.student_id = auth.uid()
          ))
        )
    )
  )
  OR created_by = auth.uid()
  OR public.is_admin()
);
