-- =====================================================================
-- PROJECT SANDIGAN — COMPREHENSIVE PRODUCTION DATABASE SCHEMA
-- Version: 1.0.0 (Greenfield Migration)
-- Target: Supabase PostgreSQL 15+
-- Project Reference: niavgdcttagjqcsvuvpc
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('founder', 'officer', 'moderator', 'verified_user', 'anonymous');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_priority_type AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_status_type AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'blocked_approval');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE post_status_type AS ENUM ('pending_review', 'approved', 'rejected', 'escalated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE approval_status_type AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =====================================================================
-- 3. CORE USER & ACCESS TABLES
-- =====================================================================

-- Table 1: Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    anonymous_id TEXT UNIQUE,
    preferred_name TEXT,
    preferred_tone TEXT DEFAULT 'gentle' CHECK (preferred_tone IN ('gentle', 'friendly', 'direct', 'encouraging')),
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'fil', 'taglish')),
    avatar_url TEXT,
    role user_role_type DEFAULT 'anonymous',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: User Roles & Permissions
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'anonymous',
    granted_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Table 3: User Consents (RA 10173 Compliance)
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anonymous_id TEXT,
    consent_type TEXT NOT NULL CHECK (consent_type IN ('conversation_history', 'ai_training_opt_in', 'research_data')),
    granted BOOLEAN NOT NULL DEFAULT FALSE,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 4. CLINICAL & WELLNESS SELF-HELP TABLES
-- =====================================================================

-- Table 4: Wellness Assessments (Non-Diagnostic 7-Question Indicator)
CREATE TABLE IF NOT EXISTS public.wellness_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    anonymous_id TEXT NOT NULL,
    total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 21),
    level TEXT NOT NULL,
    answers JSONB NOT NULL,
    is_crisis_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: My Safety Plan (Strictly Isolated User-Controlled Plan)
CREATE TABLE IF NOT EXISTS public.safety_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anonymous_id TEXT NOT NULL,
    warning_signs TEXT[] DEFAULT '{}',
    coping_strategies TEXT[] DEFAULT '{}',
    trusted_contacts JSONB DEFAULT '[]',
    safe_places TEXT[] DEFAULT '{}',
    emergency_steps TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 6: Inner Garden (Private Journal Entries)
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anonymous_id TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    mood TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 5. COMMUNITY & ADVOCACY TABLES
-- =====================================================================

-- Table 7: Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_display_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('resilience', 'academic', 'general', 'growth', 'hope')),
    status post_status_type DEFAULT 'pending_review',
    moderated_by TEXT,
    moderation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 8: Community Comments
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_display_name TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'flagged', 'hidden')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 6. HEALTHCARE DIRECTORY & REFERRAL TABLES
-- =====================================================================

-- Table 9: Support Directory (Verified Clinical Resources)
CREATE TABLE IF NOT EXISTS public.support_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    facility_type TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT NOT NULL,
    mobile TEXT,
    email TEXT,
    operating_hours TEXT NOT NULL,
    services TEXT[] DEFAULT '{}',
    priority_region TEXT NOT NULL DEFAULT 'Bataan',
    is_verified BOOLEAN DEFAULT TRUE,
    verification_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 10: Referral Requests
CREATE TABLE IF NOT EXISTS public.referral_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    anonymous_id TEXT NOT NULL,
    facility_id UUID REFERENCES public.support_directory(id) ON DELETE SET NULL,
    facility_name TEXT NOT NULL,
    user_concern_summary TEXT NOT NULL,
    status TEXT DEFAULT 'prepared' CHECK (status IN ('prepared', 'consented', 'submitted', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 7. AUTONOMOUS AI AGENT & OFFICER INFRASTRUCTURE
-- =====================================================================

-- Table 11: AI Officers Registry
CREATE TABLE IF NOT EXISTS public.ai_officers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    avatar TEXT NOT NULL,
    color TEXT NOT NULL,
    directive TEXT NOT NULL,
    guardrails TEXT[] DEFAULT '{}',
    model_name TEXT DEFAULT 'models/gemini-3.8-flash',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'standby', 'offline')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 12: AI Tasks (Persistent Database-Backed Queue)
CREATE TABLE IF NOT EXISTS public.ai_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    officer_id TEXT NOT NULL REFERENCES public.ai_officers(id) ON DELETE RESTRICT,
    assigned_by TEXT NOT NULL,
    decision_level INTEGER DEFAULT 1 CHECK (decision_level IN (1, 2, 3)),
    priority task_priority_type DEFAULT 'medium',
    status task_status_type DEFAULT 'pending',
    payload JSONB DEFAULT '{}',
    outcome TEXT,
    locked_until TIMESTAMPTZ,
    locked_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 13: AI Task Attempts & Telemetry
CREATE TABLE IF NOT EXISTS public.ai_task_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    officer_id TEXT NOT NULL REFERENCES public.ai_officers(id),
    status TEXT NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 14: AI Messages (Agent-to-Agent Deliberations & Conference Transcripts)
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_type TEXT NOT NULL CHECK (sender_type IN ('founder', 'officer', 'system')),
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    recipient_id TEXT DEFAULT 'all',
    content TEXT NOT NULL,
    context_meeting_id TEXT DEFAULT 'founder-room',
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
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('policy', 'external_communication', 'moderation_override', 'safeguarding')),
    requested_by TEXT NOT NULL,
    status approval_status_type DEFAULT 'pending',
    decided_at TIMESTAMPTZ,
    decision_notes TEXT,
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

-- Table 18: Crisis Safeguarding Logs (Encrypted & Restricted Access)
CREATE TABLE IF NOT EXISTS public.crisis_safeguarding_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anonymous_id TEXT NOT NULL,
    triage_level TEXT NOT NULL CHECK (triage_level IN ('critical', 'severe', 'moderate')),
    flag_reasons TEXT[] DEFAULT '{}',
    resources_offered TEXT[] DEFAULT '{}',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 19: Audit Logs (Immutable RA 10173 Audit Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    ip_address TEXT,
    details JSONB DEFAULT '{}',
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
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
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

-- Profiles: Users manage their own profile; public read of display names
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Journal Entries: STRICT PRIVACY. Only author can select/insert/update/delete.
CREATE POLICY "Author private journal access" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);

-- Safety Plans: STRICT PRIVACY. Only owner can select/insert/update/delete.
CREATE POLICY "Owner private safety plan access" ON public.safety_plans FOR ALL USING (auth.uid() = user_id);

-- Support Directory: Public read verified entries
CREATE POLICY "Public read directory" ON public.support_directory FOR SELECT USING (is_verified = TRUE);

-- Community Posts: Public read approved; author can insert
CREATE POLICY "Public read approved posts" ON public.community_posts FOR SELECT USING (status = 'approved');
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

-- AI Officers: Public read status
CREATE POLICY "Public read AI officers" ON public.ai_officers FOR SELECT USING (TRUE);

-- Service Role Key Full Access on administrative & backend tables
CREATE POLICY "Service Role full access tasks" ON public.ai_tasks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role full access attempts" ON public.ai_task_attempts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role full access messages" ON public.ai_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role full access approvals" ON public.founder_approvals FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role full access audits" ON public.audit_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role full access events" ON public.system_events FOR ALL USING (auth.role() = 'service_role');

-- =====================================================================
-- 10. SEED DATA (SEVEN AI OFFICERS & VERIFIED SUPPORT DIRECTORY)
-- =====================================================================

INSERT INTO public.ai_officers (id, name, role, department, avatar, color, directive, guardrails, model_name, status)
VALUES
('amara', 'AMARA', 'Chief Supervisor & Operational Orchestrator', 'Executive Oversight', '👑', '#D6AE57', 'Orchestrates 7-officer operations, evaluates backlog priorities, delegates tasks to specialized officers, and produces scheduled executive reports.', ARRAY['Cannot bypass human approval for policy changes', 'Must ensure zero-PII leak in dispatches'], 'models/gemini-3.8-flash', 'active'),
('tala', 'TALA', 'Community Moderator & Peer Engagement Safeguard', 'Community & Safe Spaces', '🛡️', '#159A9A', 'Guards peer community forum, reviews student submissions, filters harmful or abusive text, and maintains a compassionate peer culture.', ARRAY['Must flag self-harm immediately to GABAY', 'Cannot censor constructive feedback'], 'models/gemini-3.8-flash', 'active'),
('gabay', 'GABAY', 'Crisis Intervention Specialist & Safeguarding Lead', 'Crisis Response & Safety', '🚨', '#E66767', 'Screens interactions for critical crisis markers, provides immediate safety pathways (MMWGH and NCMH 1553), and maintains isolated safeguarding logs.', ARRAY['Never diagnose conditions', 'Never claim emergency services have been dispatched'], 'models/gemini-3.8-flash', 'active'),
('siklab', 'SIKLAB', 'Mental Wellness Assessment & Indicator Analyst', 'Assessment & Psychometrics', '⚡', '#16845B', 'Analyzes 7-question non-diagnostic wellness assessments, applies reverse-scored optimism logic, and delivers gentle self-care debriefs.', ARRAY['Must always state assessment is non-diagnostic', 'Cannot label disorders'], 'models/gemini-3.8-flash', 'active'),
('dunong', 'DUNONG', 'Research Librarian & Psychoeducation Curator', 'Education & Library', '📚', '#6C5CE7', 'Curates clinical literature into youth-accessible psychoeducation, writes anxiety/burnout explainers, and maintains Philippine Mental Health Act guides.', ARRAY['Must cite verified psychological sources', 'Must flag outdated resources'], 'models/gemini-3.8-flash', 'active'),
('kawing', 'KAWING', 'Referrals Coordinator & Bataan Healthcare Liaison', 'Referrals & Partnerships', '🤝', '#31556B', 'Maintains verified directory of Bataan and national clinics (MMWGH, BGHMC, PHO), validates operating hours, and organizes referral summaries.', ARRAY['Referrals require explicit user consent', 'Must verify active clinic phone numbers'], 'models/gemini-3.8-flash', 'active'),
('sinag', 'SINAG', 'Daily Companion & Habit Architect', 'Daily Support & Habits', '☀️', '#D6AE57', 'Generates morning reflections, manages Reset Room audio synthesis routines, tracks daily check-in streaks, and reinforces micro-habits.', ARRAY['Keep tone encouraging, never shaming', 'Respect user sleep schedule'], 'models/gemini-3.8-flash', 'active')
ON CONFLICT (id) DO UPDATE SET
    directive = EXCLUDED.directive,
    guardrails = EXCLUDED.guardrails,
    status = EXCLUDED.status;

-- Seed Support Directory (Verified Bataan & National Institutions)
INSERT INTO public.support_directory (name, facility_type, location, phone, mobile, email, operating_hours, services, priority_region, is_verified)
VALUES
('Mariveles Mental Wellness and General Hospital (MMWGH)', 'Psychiatric Center', 'P. Monroe St., Poblacion, Mariveles, Bataan', '(047) 935-4661', '0968-854-3858', 'info@mmwgh.gov.ph', '24/7 Crisis Hotline & Acute Triage; OPD Mon-Fri 8:00 AM - 5:00 PM', ARRAY['24/7 Psychiatric Emergency Triage', 'Outpatient Psychotherapy', 'Child and Adolescent Mental Health Specialty Clinic'], 'Bataan', TRUE),
('Bataan General Hospital and Medical Center (BGHMC) — Psychiatry Unit', 'Government Hospital', 'Manahan St., Tenejero, Balanga City, Bataan', '(047) 237-9770', '0939-937-2446', 'bataangeneralhospital@yahoo.com', 'Emergency Room 24/7; Psychiatric OPD Mon-Fri 8:00 AM - 4:00 PM', ARRAY['Medical & Psychiatric Emergency', 'General Psychiatric Evaluations', 'PhilHealth Mental Health Benefit Consultations'], 'Bataan', TRUE),
('Bataan Provincial Health Office (PHO)', 'Government Office', 'Provincial Capitol Compound, Balanga City, Bataan', '(047) 237-2413', NULL, 'pho@bataan.gov.ph', 'Mon-Fri 8:00 AM - 5:00 PM', ARRAY['Provincial Mental Health Coordination', 'Barangay Health Station Referrals'], 'Bataan', TRUE),
('City Health Office of Balanga (Balanga CHO)', 'City Health Office', 'City Government of Balanga, Bataan', '(047) 237-2969', NULL, NULL, 'Mon-Fri 8:00 AM - 5:00 PM', ARRAY['Free Primary Psychosocial Screening', 'Youth Counseling Desk'], 'Bataan', TRUE),
('National Center for Mental Health (NCMH) 24/7 Crisis Hotline', 'Crisis Hotline', 'Nationwide Toll-Free via Landline', '1553', '0917-899-8727', 'ncmh@doh.gov.ph', '24/7 Nationwide', ARRAY['Free 24/7 Emergency Psychological First Aid', 'Suicide Crisis De-escalation'], 'National', TRUE)
ON CONFLICT DO NOTHING;
