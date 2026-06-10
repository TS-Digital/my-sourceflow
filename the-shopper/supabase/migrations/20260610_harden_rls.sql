-- ============================================================
-- Migration: harden RLS policies
-- Run this in the Supabase SQL Editor.
-- Safe to run multiple times (uses DROP IF EXISTS + CREATE).
-- ============================================================

-- ------------------------------------------------------------
-- 1. Fix requests: restrict UPDATE to admins only
--    (clients had self-update permission which allowed direct
--    status manipulation via the Supabase client)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "requests: own or admin update" ON public.requests;

CREATE POLICY "requests: admin update"
  ON public.requests FOR UPDATE
  USING (is_admin());

-- ------------------------------------------------------------
-- 2. Create reviews table (if not already in DB)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT        NOT NULL DEFAULT '',
  rating      SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  quote       TEXT        NOT NULL,
  location    TEXT,
  approved    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. Enable RLS on reviews (idempotent)
-- ------------------------------------------------------------
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 4. reviews policies
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "reviews: approved public read"    ON public.reviews;
DROP POLICY IF EXISTS "reviews: admin read all"          ON public.reviews;
DROP POLICY IF EXISTS "reviews: authenticated insert"    ON public.reviews;
DROP POLICY IF EXISTS "reviews: admin update"            ON public.reviews;

-- Unauthenticated visitors can read approved reviews (landing page)
CREATE POLICY "reviews: approved public read"
  ON public.reviews FOR SELECT
  USING (approved = true);

-- Admins see everything including the unapproved queue
CREATE POLICY "reviews: admin read all"
  ON public.reviews FOR SELECT
  USING (is_admin());

-- Authenticated users may submit their own review; anon cannot
CREATE POLICY "reviews: authenticated insert"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Only admins may approve or reject reviews
CREATE POLICY "reviews: admin update"
  ON public.reviews FOR UPDATE
  USING (is_admin());

-- ------------------------------------------------------------
-- Verify: run this after applying to confirm all policies
-- ------------------------------------------------------------
-- SELECT tablename, policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, cmd;
