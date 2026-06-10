-- ============================================================
-- The Shopper — Supabase Schema
-- Run this in the Supabase SQL Editor for your project.
-- ============================================================

-- ------------------------------------------------------------
-- 1. profiles (extends auth.users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id        UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT        NOT NULL DEFAULT '',
  phone     TEXT,
  role      TEXT        NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. statuses reference table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.statuses (
  id   SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO public.statuses (name) VALUES
  ('New'),
  ('In Progress'),
  ('Sourced'),
  ('Completed')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------
-- 3. requests
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.requests (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  UUID        NOT NULL,
  status_id  SMALLINT    NOT NULL DEFAULT 1,
  item_name  TEXT        NOT NULL,
  brand      TEXT,
  budget_gbp NUMERIC(10, 2),
  size       TEXT,
  colour     TEXT,
  notes         TEXT,
  phone_number  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_requests_client FOREIGN KEY (client_id)
    REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_requests_status FOREIGN KEY (status_id)
    REFERENCES public.statuses(id)
);

-- ------------------------------------------------------------
-- 4. request_notes (concierge notes)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.request_notes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID        NOT NULL,
  admin_id   UUID        NOT NULL,
  note_text  TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_request_notes_request FOREIGN KEY (request_id)
    REFERENCES public.requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_request_notes_admin FOREIGN KEY (admin_id)
    REFERENCES public.profiles(id)
);

-- ------------------------------------------------------------
-- 5. Auto-create profile row on signup
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------
-- 6. Auto-update updated_at on requests
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS requests_updated_at ON public.requests;
CREATE TRIGGER requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ------------------------------------------------------------
-- 7. Row-Level Security
-- ------------------------------------------------------------
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statuses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_notes ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- profiles
CREATE POLICY "profiles: own or admin read"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- statuses (public read)
CREATE POLICY "statuses: anyone reads"
  ON public.statuses FOR SELECT
  USING (true);

-- requests
CREATE POLICY "requests: own or admin read"
  ON public.requests FOR SELECT
  USING (client_id = auth.uid() OR is_admin());

CREATE POLICY "requests: client insert"
  ON public.requests FOR INSERT
  WITH CHECK (client_id = auth.uid());

-- Restricted to admins only — clients never need to update requests directly.
-- The status update API route runs under an authenticated admin session, so
-- is_admin() resolves correctly there.
CREATE POLICY "requests: admin update"
  ON public.requests FOR UPDATE
  USING (is_admin());

-- request_notes
CREATE POLICY "request_notes: accessible request read"
  ON public.request_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.requests r
      WHERE r.id = request_id
        AND (r.client_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "request_notes: admin insert"
  ON public.request_notes FOR INSERT
  WITH CHECK (is_admin() AND admin_id = auth.uid());

-- ------------------------------------------------------------
-- 8. reviews
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

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Approved reviews are publicly readable (landing page, unauthenticated visitors)
CREATE POLICY "reviews: approved public read"
  ON public.reviews FOR SELECT
  USING (approved = true);

-- Admins can read every review (including unapproved ones in the queue)
CREATE POLICY "reviews: admin read all"
  ON public.reviews FOR SELECT
  USING (is_admin());

-- Authenticated users may insert their own review; unauthenticated cannot
CREATE POLICY "reviews: authenticated insert"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Only admins may update reviews (approve / reject)
CREATE POLICY "reviews: admin update"
  ON public.reviews FOR UPDATE
  USING (is_admin());

-- ============================================================
-- To promote a user to admin, run:
--   UPDATE public.profiles SET role = 'admin' WHERE id = '<user-uuid>';
-- ============================================================
