-- Remove historical test tasks from the active production workflow while
-- preserving them in the archive for auditability.
UPDATE public.tasks
SET status = 'archived', updated_at = now()
WHERE status <> 'archived'
  AND (
    title ILIKE 'E2E %'
    OR title ILIKE '%Final E2E%'
    OR title ILIKE '%Smoke Test%'
  );
