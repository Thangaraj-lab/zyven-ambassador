-- Allow a student to read the non-sensitive metadata for tasks they have
-- already submitted. This lets the UI render historical completion details
-- without making every archived task public.
DROP POLICY IF EXISTS "Students can view tasks with their submissions" ON public.tasks;
CREATE POLICY "Students can view tasks with their submissions"
ON public.tasks
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.submissions
    WHERE submissions.task_id = tasks.id
      AND submissions.student_id = auth.uid()
  )
);
