-- ==============================================================================
-- VANTA PRODUCTION — COMPREHENSIVE PRODUCTION DATABASE SCHEMA
-- Compatible with Supabase PostgreSQL, Row Level Security (RLS) & Triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. IDENTITY & PROFILES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  is_founder BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  position_id UUID,
  department_id UUID,
  reporting_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. ORGANIZATIONAL HIERARCHY & DEPARTMENTS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  head_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organizational_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  level INT NOT NULL, -- 1=Founder, 2=Co-Founder, 3=Executive, 4=Head Manager, 5=Department Head, etc.
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  is_default BOOLEAN DEFAULT FALSE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  previous_position_id UUID REFERENCES public.organizational_positions(id) ON DELETE SET NULL,
  new_position_id UUID NOT NULL REFERENCES public.organizational_positions(id) ON DELETE RESTRICT,
  approved_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.staff_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  from_department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  to_department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  approved_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. CUSTOM ROLES & GRANULAR PERMISSIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_role_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  scope TEXT DEFAULT 'global' CHECK (scope IN ('global', 'department', 'team', 'assigned', 'own')),
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  position_id UUID REFERENCES public.organizational_positions(id) ON DELETE SET NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked', 'expired')),
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. ARTIST PROFILES & PORTFOLIO ITEMS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.artist_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL DEFAULT 'Digital Artist',
  years_experience INT DEFAULT 1,
  banner_url TEXT DEFAULT '',
  theme_mode TEXT DEFAULT 'dark' CHECK (theme_mode IN ('dark', 'light')),
  layout_mode TEXT DEFAULT 'grid' CHECK (layout_mode IN ('grid', 'masonry', 'editorial')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'booked')),
  social_links JSONB DEFAULT '{"twitter":"","discord":"","youtube":"","instagram":"","portfolio":""}'::jsonb,
  display_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT 'Sparkles'
);

CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'embed')),
  external_url TEXT DEFAULT '',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewing', 'changes_requested', 'approved', 'rejected')),
  moderation_notes TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT FALSE,
  is_floating_hero BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.portfolio_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_item_id UUID NOT NULL REFERENCES public.portfolio_items(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
  moderation_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. RECRUITMENT & APPLICATIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  discord_tag TEXT NOT NULL,
  services TEXT[] DEFAULT '{}',
  experience TEXT NOT NULL,
  portfolio_links TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}'::jsonb,
  introduction TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  review_notes TEXT DEFAULT '',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. PROJECTS & TASKS (PRODUCTION OPERATIONS)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  creator_id UUID,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'in_review', 'completed', 'cancelled')),
  deadline TIMESTAMPTZ,
  budget NUMERIC(10,2) DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'submitted', 'review', 'completed')),
  deadline TIMESTAMPTZ,
  deliverable_url TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_assignments (
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (task_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 7. CMS (CREATORS, SERVICES, HOMEPAGE SETTINGS)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  channel_url TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  subscriber_count TEXT DEFAULT '',
  view_count TEXT DEFAULT '',
  category TEXT DEFAULT 'Gaming',
  is_featured BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Paintbrush',
  deliverables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.homepage_config (
  id INT PRIMARY KEY DEFAULT 1,
  hero_headline TEXT DEFAULT 'CREATIVITY. BUILT TOGETHER.',
  hero_subheading TEXT DEFAULT 'An independent creative production network bringing talented artists and creators together.',
  enable_floating_artwork BOOLEAN DEFAULT TRUE,
  floating_speed FLOAT DEFAULT 1.0,
  floating_intensity FLOAT DEFAULT 1.0,
  floating_count INT DEFAULT 8,
  floating_opacity FLOAT DEFAULT 0.85,
  sections_visibility JSONB DEFAULT '{"hero":true,"floating":true,"work":true,"artists":true,"creators":true,"services":true,"about":true,"footer":true}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. ANNOUNCEMENTS, NOTIFICATIONS & AUDIT LOGS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_scope TEXT DEFAULT 'global' CHECK (target_scope IN ('global', 'department', 'team')),
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT DEFAULT '',
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'approval', 'rejection', 'task', 'warning')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. FOUNDER PROTECTION TRIGGER & ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------

-- Prevent removing, demoting or modifying founder status unless explicitly executed by founder
CREATE OR REPLACE FUNCTION protect_founder_account()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_founder = TRUE AND NEW.is_founder = FALSE THEN
    RAISE EXCEPTION 'CRITICAL SECURITY: The Founder status cannot be revoked or demoted.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_protect_founder ON public.profiles;
CREATE TRIGGER tr_protect_founder
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION protect_founder_account();

-- Enable RLS on core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_config ENABLE ROW LEVEL SECURITY;

-- Public readable policies
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public can read approved portfolio items" ON public.portfolio_items FOR SELECT USING (status = 'approved' OR auth.uid() = artist_id);
CREATE POLICY "Public can read artist profiles" ON public.artist_profiles FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Public can read creators" ON public.creators FOR SELECT USING (is_public = true);
CREATE POLICY "Public can read active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read homepage config" ON public.homepage_config FOR SELECT USING (true);
CREATE POLICY "Public can submit applications" ON public.applications FOR INSERT WITH CHECK (true);
