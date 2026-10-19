-- ============================================================
-- ZYVEN AUTH HARDENING + INITIAL LAUNCH CONFIGURATION
-- ============================================================

-- Profiles are created only by this trigger. Public clients can never select
-- a privileged role during signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    status
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(COALESCE(NEW.email, 'Student'), '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url',
    'student',
    'active'
  ) ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- A student may have one open ambassador application at a time.
CREATE UNIQUE INDEX IF NOT EXISTS ambassador_requests_one_open_request
  ON public.ambassador_requests (student_id)
  WHERE status = 'pending';

-- Avoid duplicate task submissions per student; the app supports resubmission
-- by updating the existing record.
CREATE UNIQUE INDEX IF NOT EXISTS submissions_one_per_student_task
  ON public.submissions (task_id, student_id);

-- Realtime channels required by the client cache invalidation hook.
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.point_transactions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- The proof bucket must reject arbitrary file types and oversized uploads.
UPDATE storage.buckets
SET file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
      'image/jpeg', 'image/png', 'image/webp', 'application/pdf'
    ]
WHERE id = 'proofs';

-- Insert the approved launch tasks only when a real administrator exists.
-- This intentionally cannot run until an administrator is promoted in profiles.
DO $$
DECLARE
  launch_admin UUID;
  linkedin_task UUID;
  whatsapp_task UUID;
BEGIN
  SELECT id INTO launch_admin
  FROM public.profiles
  WHERE role = 'admin' AND status = 'active'
  ORDER BY created_at
  LIMIT 1;

  IF launch_admin IS NULL THEN
    RAISE NOTICE 'No active administrator found: launch tasks were not seeded.';
    RETURN;
  END IF;

  INSERT INTO public.tasks (
    created_by, title, short_description, description, category, task_type,
    points, estimated_minutes, status, is_public
  ) VALUES (
    launch_admin,
    'LinkedIn Follow + Post',
    'Follow Zyven on LinkedIn and publish the approved launch post.',
    'Follow the official Zyven LinkedIn page, publish the approved post, and submit the public post URL as proof.',
    'Social Media', 'URL', 50, 10, 'live', true
  ) ON CONFLICT DO NOTHING
  RETURNING id INTO linkedin_task;

  IF linkedin_task IS NOT NULL THEN
    INSERT INTO public.task_audiences (task_id, audience_type)
    VALUES (linkedin_task, 'all_students');
    INSERT INTO public.task_requirements (task_id, type, title, description, required, sort_order)
    VALUES (linkedin_task, 'url', 'LinkedIn post URL', 'Submit the public URL of your Zyven launch post.', true, 1);
  END IF;

  INSERT INTO public.tasks (
    created_by, title, short_description, description, category, task_type,
    points, estimated_minutes, status, is_public
  ) VALUES (
    launch_admin,
    'Join Zyven WhatsApp Community',
    'Join the official Zyven community and upload a confirmation screenshot.',
    'Join the official Zyven WhatsApp community using the approved link and upload a screenshot showing your membership.',
    'Community', 'SCREENSHOT', 30, 5, 'live', true
  ) ON CONFLICT DO NOTHING
  RETURNING id INTO whatsapp_task;

  IF whatsapp_task IS NOT NULL THEN
    INSERT INTO public.task_audiences (task_id, audience_type)
    VALUES (whatsapp_task, 'all_students');
    INSERT INTO public.task_requirements (task_id, type, title, description, required, sort_order)
    VALUES (whatsapp_task, 'screenshot', 'Membership screenshot', 'Upload a clear screenshot confirming you joined the official community.', true, 1);
  END IF;
END $$;
