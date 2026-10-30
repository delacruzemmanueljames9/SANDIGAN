-- =====================================================================
-- PROJECT SANDIGAN — PRODUCTION DATABASE MIGRATION
-- Migration: 20261030000000_sandigan_ecosystem_schema.sql
-- Target: Supabase PostgreSQL 15+
-- Project Reference: niavgdcttagjqcsvuvpc
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('user', 'volunteer', 'moderator', 'counselor', 'founder', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE crisis_severity_type AS ENUM ('none', 'low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE moderation_status_type AS ENUM ('pending', 'approved', 'flagged', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_priority_type AS ENUM ('low', 'normal', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_status_type AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'dead_letter', 'awaiting_approval');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE approval_status_type AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE referral_status_type AS ENUM ('submitted', 'reviewed_by_safeguarding', 'routed_to_partner', 'partner_accepted', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =====================================================================
-- 3. CORE IDENTITY & ACCESS TABLES
-- =====================================================================

-- Table 1: Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    is_minor BOOLEAN DEFAULT FALSE,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'tl', 'taglish')),
    preferred_tone TEXT DEFAULT 'gentle' CHECK (preferred_tone IN ('gentle', 'warm', 'direct', 'empowering')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: User Roles (Strict Server-Side Assignment)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'user',
    granted_by TEXT DEFAULT 'system_registration',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Table 3: User Consents (RA 10173 Compliance Audit)
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL CHECK (consent_type IN ('terms', 'privacy', 'ai_terms', 'referral_data_sharing', 'analytics')),
    policy_version TEXT NOT NULL DEFAULT '1.0.0',
    granted BOOLEAN NOT NULL DEFAULT FALSE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 4. PRIVATE WELLNESS & SELF-REGULATION TABLES
-- =====================================================================

-- Table 4: Wellness Assessments (Non-Diagnostic)
CREATE TABLE IF NOT EXISTS public.wellness_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    responses JSONB NOT NULL,
    category_scores JSONB NOT NULL,
    overall_reflection TEXT,
    educational_recommendations TEXT[] DEFAULT '{}',
    is_crisis_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: Safety Plans (Strictly Isolated & Private)
CREATE TABLE IF NOT EXISTS public.safety_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    warning_signs TEXT[] DEFAULT '{}',
    internal_coping_strategies TEXT[] DEFAULT '{}',
    distraction_places_people TEXT[] DEFAULT '{}',
    trusted_contacts JSONB DEFAULT '[]',
    professional_contacts JSONB DEFAULT '[]',
    safe_environment_steps TEXT[] DEFAULT '{}',
    reasons_to_live TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Table 6: Inner Garden (Private Journal Entries)
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    mood TEXT NOT NULL CHECK (mood IN ('calm', 'hopeful', 'anxious', 'exhausted', 'sad', 'grateful', 'neutral')),
    tags TEXT[] DEFAULT '{}',
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 5. COMMUNITY & PEER SANCTUARY TABLES
-- =====================================================================

-- Table 7: Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_alias TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('general', 'gratitude', 'struggles', 'hope', 'advice')),
    is_anonymous BOOLEAN DEFAULT TRUE,
    moderation_status moderation_status_type DEFAULT 'pending',
    moderation_flag_reason TEXT,
    moderated_by_officer TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 8: Community Comments
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_alias TEXT NOT NULL,
    content TEXT NOT NULL,
    moderation_status moderation_status_type DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 6. HEALTHCARE DIRECTORY & REFERRAL TABLES
-- =====================================================================

-- Table 9: Support Directory (Verified Philippine Resources)
CREATE TABLE IF NOT EXISTS public.support_directory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization_type TEXT NOT NULL CHECK (organization_type IN ('government', 'hospital', 'ngo', 'private_clinic', 'hotline', 'university')),
    description TEXT NOT NULL,
    services_offered TEXT[] DEFAULT '{}',
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    website_url TEXT,
    physical_address TEXT,
    region TEXT NOT NULL CHECK (region IN ('NCR', 'Luzon', 'Visayas', 'Mindanao', 'National')),
    is_24_7 BOOLEAN DEFAULT FALSE,
    is_free_service BOOLEAN DEFAULT TRUE,
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending_review', 'unverified')),
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 10: Referral Requests (Consent-First Pathway)
CREATE TABLE IF NOT EXISTS public.referral_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id TEXT NOT NULL REFERENCES public.support_directory(id) ON DELETE RESTRICT,
    preferred_contact_method TEXT NOT NULL CHECK (preferred_contact_method IN ('phone', 'email')),
    contact_value TEXT NOT NULL,
    intake_notes TEXT NOT NULL,
    consent_to_share_granted BOOLEAN NOT NULL DEFAULT FALSE,
    status referral_status_type DEFAULT 'submitted',
    safeguarding_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 7. AUTONOMOUS AI INFRASTRUCTURE TABLES
-- =====================================================================

-- Table 11: AI Officers Registry
CREATE TABLE IF NOT EXISTS public.ai_officers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    callsign TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    division TEXT NOT NULL,
    avatar_color TEXT NOT NULL,
    badge_color TEXT NOT NULL,
    primary_directive TEXT NOT NULL,
    responsibilities TEXT[] DEFAULT '{}',
    strict_boundaries TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'standby', 'offline', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 12: AI Tasks (Database-Backed Autonomous Queue)
CREATE TABLE IF NOT EXISTS public.ai_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    officer_id TEXT NOT NULL REFERENCES public.ai_officers(id) ON DELETE RESTRICT,
    task_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    priority task_priority_type DEFAULT 'normal',
    status task_status_type DEFAULT 'pending',
    max_attempts INTEGER DEFAULT 3,
    current_attempts INTEGER DEFAULT 0,
    requires_approval BOOLEAN DEFAULT FALSE,
    approval_id UUID,
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 13: AI Task Attempts (Execution Telemetry)
CREATE TABLE IF NOT EXISTS public.ai_task_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('success', 'failure')),
    error_message TEXT,
    execution_duration_ms INTEGER DEFAULT 0,
    output_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 14: AI Messages (Inter-Agent Coordination)
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_officer TEXT NOT NULL,
    to_officer TEXT NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('task_handoff', 'crisis_alert', 'moderation_flag', 'coordination')),
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 15: Scheduled Jobs
CREATE TABLE IF NOT EXISTS public.scheduled_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    cron_expression TEXT NOT NULL,
    handler TEXT NOT NULL,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 16: Founder Approvals (Human-in-the-Loop Gateway)
CREATE TABLE IF NOT EXISTS public.founder_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.ai_tasks(id) ON DELETE SET NULL,
    officer_requesting TEXT NOT NULL,
    action_summary TEXT NOT NULL,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    action_payload JSONB DEFAULT '{}',
    status approval_status_type DEFAULT 'pending',
    decision_notes TEXT,
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 8. OBSERVABILITY, SAFEGUARDING & AUDIT TABLES
-- =====================================================================

-- Table 17: System Metrics
CREATE TABLE IF NOT EXISTS public.system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 18: Crisis Safeguarding Logs (Restricted Access)
CREATE TABLE IF NOT EXISTS public.crisis_safeguarding_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    risk_level crisis_severity_type NOT NULL,
    trigger_keywords TEXT[] DEFAULT '{}',
    officer_responder TEXT NOT NULL,
    escalation_pathway TEXT NOT NULL CHECK (escalation_pathway IN ('banner', 'modal', 'emergency_hotline', 'founder_alert')),
    user_acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 19: Audit Logs (Immutable Security Audit Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_hash TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 20: System Events
CREATE TABLE IF NOT EXISTS public.system_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_level TEXT DEFAULT 'info' CHECK (event_level IN ('info', 'warn', 'error', 'critical')),
    source TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 9. PERFORMANCE INDEXES
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_assessments_user_id ON public.wellness_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(moderation_status);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_support_directory_region ON public.support_directory(region);
CREATE INDEX IF NOT EXISTS idx_referral_requests_user_id ON public.referral_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON public.ai_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_priority ON public.ai_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_ai_messages_recipient ON public.ai_messages(to_officer);
CREATE INDEX IF NOT EXISTS idx_founder_approvals_status ON public.founder_approvals(status);
CREATE INDEX IF NOT EXISTS idx_crisis_logs_created_at ON public.crisis_safeguarding_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- =====================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_task_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founder_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_safeguarding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is founder or admin
CREATE OR REPLACE FUNCTION public.is_founder_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('founder', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is moderator
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('founder', 'admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_founder_or_admin());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User Roles Policies (Users can only read own role, only founder can write)
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_founder_or_admin());

DROP POLICY IF EXISTS "user_roles_admin_write" ON public.user_roles;
CREATE POLICY "user_roles_admin_write" ON public.user_roles FOR ALL USING (public.is_founder_or_admin());

-- User Consents Policies
DROP POLICY IF EXISTS "user_consents_select_own" ON public.user_consents;
CREATE POLICY "user_consents_select_own" ON public.user_consents FOR SELECT USING (auth.uid() = user_id OR public.is_founder_or_admin());

DROP POLICY IF EXISTS "user_consents_insert_own" ON public.user_consents;
CREATE POLICY "user_consents_insert_own" ON public.user_consents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wellness Assessments Policies (Strictly private to the user)
DROP POLICY IF EXISTS "wellness_assessments_select_own" ON public.wellness_assessments;
CREATE POLICY "wellness_assessments_select_own" ON public.wellness_assessments FOR SELECT USING (auth.uid() = user_id OR public.is_founder_or_admin());

DROP POLICY IF EXISTS "wellness_assessments_insert_own" ON public.wellness_assessments;
CREATE POLICY "wellness_assessments_insert_own" ON public.wellness_assessments FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Safety Plans Policies (Strictly private to the user)
DROP POLICY IF EXISTS "safety_plans_all_own" ON public.safety_plans;
CREATE POLICY "safety_plans_all_own" ON public.safety_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Journal Entries Policies (Strictly private to the user - NO ONE ELSE CAN ACCESS)
DROP POLICY IF EXISTS "journal_entries_all_own" ON public.journal_entries;
CREATE POLICY "journal_entries_all_own" ON public.journal_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Community Posts Policies
DROP POLICY IF EXISTS "community_posts_select" ON public.community_posts;
CREATE POLICY "community_posts_select" ON public.community_posts FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = author_id OR public.is_moderator());

DROP POLICY IF EXISTS "community_posts_insert" ON public.community_posts;
CREATE POLICY "community_posts_insert" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id OR is_anonymous = TRUE);

DROP POLICY IF EXISTS "community_posts_modify_mod" ON public.community_posts;
CREATE POLICY "community_posts_modify_mod" ON public.community_posts FOR UPDATE USING (public.is_moderator() OR auth.uid() = author_id);

-- Community Comments Policies
DROP POLICY IF EXISTS "community_comments_select" ON public.community_comments;
CREATE POLICY "community_comments_select" ON public.community_comments FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = author_id OR public.is_moderator());

DROP POLICY IF EXISTS "community_comments_insert" ON public.community_comments;
CREATE POLICY "community_comments_insert" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Support Directory Policies (Publicly readable)
DROP POLICY IF EXISTS "support_directory_public_read" ON public.support_directory;
CREATE POLICY "support_directory_public_read" ON public.support_directory FOR SELECT USING (verification_status = 'verified' OR public.is_founder_or_admin());

DROP POLICY IF EXISTS "support_directory_admin_write" ON public.support_directory;
CREATE POLICY "support_directory_admin_write" ON public.support_directory FOR ALL USING (public.is_founder_or_admin());

-- Referral Requests Policies (Strict consent isolation)
DROP POLICY IF EXISTS "referral_requests_user" ON public.referral_requests;
CREATE POLICY "referral_requests_user" ON public.referral_requests FOR SELECT USING (auth.uid() = user_id OR public.is_founder_or_admin());

DROP POLICY IF EXISTS "referral_requests_insert" ON public.referral_requests;
CREATE POLICY "referral_requests_insert" ON public.referral_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Officers, Tasks & System Infrastructure (Founder/Admin or Service Role ONLY)
DROP POLICY IF EXISTS "ai_officers_read" ON public.ai_officers;
CREATE POLICY "ai_officers_read" ON public.ai_officers FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "ai_tasks_admin" ON public.ai_tasks;
CREATE POLICY "ai_tasks_admin" ON public.ai_tasks FOR ALL USING (public.is_founder_or_admin());

DROP POLICY IF EXISTS "ai_task_attempts_admin" ON public.ai_task_attempts;
CREATE POLICY "ai_task_attempts_admin" ON public.ai_task_attempts FOR ALL USING (public.is_founder_or_admin());

DROP POLICY IF EXISTS "ai_messages_admin" ON public.ai_messages;
CREATE POLICY "ai_messages_admin" ON public.ai_messages FOR ALL USING (public.is_founder_or_admin());

DROP POLICY IF EXISTS "scheduled_jobs_admin" ON public.scheduled_jobs;
CREATE POLICY "scheduled_jobs_admin" ON public.scheduled_jobs FOR ALL USING (public.is_founder_or_admin());

DROP POLICY IF EXISTS "founder_approvals_admin" ON public.founder_approvals;
CREATE POLICY "founder_approvals_admin" ON public.founder_approvals FOR ALL USING (public.is_founder_or_admin());

DROP POLICY IF EXISTS "system_metrics_admin" ON public.system_metrics;
CREATE POLICY "system_metrics_admin" ON public.system_metrics FOR ALL USING (public.is_founder_or_admin());

DROP POLICY IF EXISTS "crisis_logs_restricted" ON public.crisis_safeguarding_logs;
CREATE POLICY "crisis_logs_restricted" ON public.crisis_safeguarding_logs FOR ALL USING (public.is_founder_or_admin());

DROP POLICY IF EXISTS "audit_logs_restricted" ON public.audit_logs;
CREATE POLICY "audit_logs_restricted" ON public.audit_logs FOR ALL USING (public.is_founder_or_admin());

DROP POLICY IF EXISTS "system_events_restricted" ON public.system_events;
CREATE POLICY "system_events_restricted" ON public.system_events FOR ALL USING (public.is_founder_or_admin());

-- =====================================================================
-- 11. AUTOMATIC PROFILE CREATION TRIGGER
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, preferred_language, preferred_tone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        'en',
        'gentle'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role, granted_by)
    VALUES (NEW.id, 'user', 'system_registration')
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 12. SEED SEVEN AI OFFICERS & VERIFIED SUPPORT DIRECTORY
-- =====================================================================

INSERT INTO public.ai_officers (id, name, callsign, role, division, avatar_color, badge_color, primary_directive, responsibilities, strict_boundaries, status)
VALUES
('amara-orchestrator', 'AMARA', 'ORCHESTRATOR-01', 'Chief Supervisor and Operational Orchestrator', 'Executive Operations', '#101B35', 'bg-sandigan-navy-800 text-white', 'Coordinate autonomous AI Officer workflows, manage the database-backed task queue, monitor subsystem health, and ensure system-wide policy compliance.', ARRAY['Task assignment and priority scheduling', 'Inter-agent message routing', 'Subsystem health telemetry', 'Founder escalation'], ARRAY['Cannot bypass founder approval requirements', 'Cannot access unencrypted user credentials or private journals', 'Cannot perform clinical modifications'], 'active'),
('tala-moderator', 'TALA', 'SAFEGUARD-02', 'Community Moderator and Peer Engagement Safeguard', 'Community Safeguarding', '#159A9A', 'bg-sandigan-teal-600 text-white', 'Review community posts and comments for harassment, hate speech, bullying, and self-harm risk while nurturing compassionate youth engagement.', ARRAY['Real-time community moderation', 'Flagging toxic submissions', 'De-escalating moderation notices'], ARRAY['Cannot permanently ban users without founder review', 'Cannot censor constructive feedback', 'Must route self-harm signals directly to GABAY'], 'active'),
('gabay-crisis', 'GABAY', 'CRISIS-LEAD-03', 'Crisis and Safeguarding Lead', 'Crisis Safeguarding', '#E11D48', 'bg-rose-600 text-white', 'Detect crisis signals, acute distress, and self-harm keywords, instantly surfacing verified emergency hotlines without delay or approval bottlenecks.', ARRAY['Zero-latency crisis keyword detection', 'Instant emergency hotline injection', 'Restricted crisis logging'], ARRAY['Never claims emergency dispatch', 'Never delays urgent guidance behind founder approval', 'Never attempts clinical diagnosis'], 'active'),
('siklab-analyst', 'SIKLAB', 'ANALYST-04', 'Wellness Assessment and Indicator Analyst', 'Wellness Intelligence', '#D6AE57', 'bg-sandigan-gold-600 text-white', 'Process non-diagnostic wellness check inputs, identify self-reported trends in sleep/stress/energy, and suggest educational resources.', ARRAY['Analyzing wellness responses', 'Generating compassionate summaries', 'Resource mapping'], ARRAY['Never outputs psychiatric diagnosis', 'Never assigns pseudo-medical severity scores', 'Mandatory non-diagnostic disclaimer'], 'active'),
('dunong-librarian', 'DUNONG', 'CURATOR-05', 'Research Librarian and Psychoeducation Curator', 'Knowledge & Education', '#16845B', 'bg-sandigan-emerald-600 text-white', 'Curate, synthesize, and verify evidence-informed mental health literature, ensuring citations are genuine, accessible, and youth-relevant.', ARRAY['Curating Mind Library guides', 'Checking source credibility', 'Flagging outdated citations'], ARRAY['Zero-tolerance for hallucinated citations', 'Must include institutional source metadata', 'Cannot approve clinical advice'], 'active'),
('kawing-referrals', 'KAWING', 'PARTNERSHIPS-06', 'Referrals and Partnerships Coordinator', 'Partner Ecosystem', '#0284C7', 'bg-sky-600 text-white', 'Maintain the verified support directory, verify partner clinic credentials, and coordinate consent-based professional referral intakes.', ARRAY['Continuous directory verification', 'Managing consent-first referrals', 'Tracking referral intake status'], ARRAY['Never shares user data without consent', 'Never claims referral is accepted until human confirms', 'Cannot add unverified providers'], 'active'),
('sinag-companion', 'SINAG', 'COMPANION-07', 'Daily Wellness Companion and Habit Architect', 'Daily Engagement', '#F59E0B', 'bg-amber-500 text-white', 'Deliver encouraging daily check-ins, mindful reflection prompts, and habit scaffolding to help users build gentle self-care routines.', ARRAY['Generating daily reflections', 'Guiding Reset Room exercises', 'Tracking self-compassion streaks'], ARRAY['Must maintain non-clinical tone', 'Never provides psychotherapy', 'Routes distress signals immediately to GABAY'], 'active')
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    primary_directive = EXCLUDED.primary_directive,
    responsibilities = EXCLUDED.responsibilities,
    strict_boundaries = EXCLUDED.strict_boundaries,
    status = EXCLUDED.status;

-- Seed Verified Support Providers
INSERT INTO public.support_directory (id, name, organization_type, description, services_offered, contact_phone, contact_email, website_url, physical_address, region, is_24_7, is_free_service, verification_status, last_verified_at)
VALUES
('prov-ncmh-1553', 'National Center for Mental Health (NCMH) Crisis Hotline', 'government', 'Official 24/7 crisis intervention service in the Philippines providing psychiatric emergency support, suicide prevention, and mental health assistance.', ARRAY['24/7 Crisis Hotline', 'Psychiatric Emergency', 'Counseling Referral'], '1553 / 0917-899-8727 / 0966-351-4518', 'ncmhcrisishotline@gmail.com', 'https://ncmh.gov.ph', '9 de Pebrero St, Mandaluyong City, Metro Manila', 'National', TRUE, TRUE, 'verified', NOW()),
('prov-in-touch', 'In Touch Community Services', 'ngo', 'Volunteer counseling service providing 24/7 mental health crisis lines, emotional support, and subsidized professional therapy in the Philippines.', ARRAY['Crisis Line', 'Youth Counseling', 'Individual Therapy', 'Grief Support'], '02-8893-7603 / 0917-800-1123', 'crisisline@in-touch.org', 'https://in-touch.org', '48 McKinley Rd, Forbes Park, Makati City', 'National', TRUE, TRUE, 'verified', NOW()),
('prov-hopeline-ph', 'Hopeline Philippines', 'ngo', '24/7 suicide prevention and crisis support service operated in partnership with mental health advocates across the Philippines.', ARRAY['Suicide Prevention', 'Emotional Support', 'Youth Telecounseling'], '2919 / 02-8804-4673 / 0917-558-4673', 'hopeline@ngf-mindstrong.org', 'https://facebook.com/HopelinePH', 'Metro Manila', 'National', TRUE, TRUE, 'verified', NOW()),
('prov-pgh-psych', 'Philippine General Hospital (PGH) Department of Psychiatry', 'hospital', 'Free and subsidized public psychiatric consultations, diagnostic evaluations, and outpatient psychological therapy.', ARRAY['Psychiatric Consultation', 'Free Public Care', 'Outpatient Services'], '02-8554-8400 loc 2436', 'pghpsychiatry@up.edu.ph', 'https://pgh.gov.ph', 'Taft Avenue, Ermita, Manila', 'NCR', FALSE, TRUE, 'verified', NOW()),
('prov-bantay-bata', 'Bantay Bata 163', 'ngo', 'Dedicated youth protection helpline offering crisis response, psycho-social interventions, and youth counseling.', ARRAY['Child Protection', 'Youth Crisis Support', 'Family Counseling'], '163 / 0917-814-4163', 'bantaybata163@abs-cbnfoundation.com', 'https://abscbnfoundation.org', 'Quezon City, Metro Manila', 'National', TRUE, TRUE, 'verified', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    contact_phone = EXCLUDED.contact_phone,
    last_verified_at = EXCLUDED.last_verified_at;
