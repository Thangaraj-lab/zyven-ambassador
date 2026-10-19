-- ============================================================
-- ZYVEN PRODUCTION LAUNCH MIGRATION (02)
-- Starts 100% clean and empty for live production tasks
-- ============================================================

-- Tasks are created through the authenticated admin/task workflow after the
-- first admin profile exists. This migration intentionally does not delete or
-- seed rows, so it is safe on a fresh production database.
DO $$
BEGIN
    NULL;
END;
$$;
