-- ============================================================
-- ZYVEN PRODUCTION LAUNCH MIGRATION (02)
-- Starts 100% clean and empty for live production tasks
-- ============================================================

-- Ensure no demo tasks exist
DELETE FROM public.tasks WHERE id IN (
    't0000000-0000-0000-0000-000000000001',
    't0000000-0000-0000-0000-000000000002'
);
