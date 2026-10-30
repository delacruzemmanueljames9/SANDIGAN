-- =====================================================================
-- PROJECT SANDIGAN — ROLLBACK SCRIPT
-- Script: 20261030000000_sandigan_ecosystem_rollback.sql
-- Target: Supabase PostgreSQL Project niavgdcttagjqcsvuvpc
-- Purpose: Complete, clean rollback plan if migration requires reversal
-- =====================================================================

-- 1. DROP TRIGGERS & TRIGGER FUNCTIONS
DROP TRIGGER IF EXISTS trg_prevent_author_moderation_update ON public.community_posts;
DROP FUNCTION IF EXISTS public.prevent_author_moderation_field_update();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. DROP TABLES IN REVERSE DEPENDENCY ORDER
DROP TABLE IF EXISTS public.system_events CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.crisis_safeguarding_logs CASCADE;
DROP TABLE IF EXISTS public.system_metrics CASCADE;
DROP TABLE IF EXISTS public.founder_approvals CASCADE;
DROP TABLE IF EXISTS public.scheduled_jobs CASCADE;
DROP TABLE IF EXISTS public.ai_messages CASCADE;
DROP TABLE IF EXISTS public.ai_task_attempts CASCADE;
DROP TABLE IF EXISTS public.ai_tasks CASCADE;
DROP TABLE IF EXISTS public.ai_officers CASCADE;
DROP TABLE IF EXISTS public.referral_requests CASCADE;
DROP TABLE IF EXISTS public.support_directory CASCADE;
DROP TABLE IF EXISTS public.community_comments CASCADE;
DROP TABLE IF EXISTS public.community_posts CASCADE;
DROP TABLE IF EXISTS public.journal_entries CASCADE;
DROP TABLE IF EXISTS public.safety_plans CASCADE;
DROP TABLE IF EXISTS public.wellness_assessments CASCADE;
DROP TABLE IF EXISTS public.user_consents CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. DROP RLS HELPER FUNCTIONS
DROP FUNCTION IF EXISTS public.is_moderator();
DROP FUNCTION IF EXISTS public.is_founder_or_admin();

-- 4. DROP CUSTOM TYPES
DROP TYPE IF EXISTS referral_status_type;
DROP TYPE IF EXISTS approval_status_type;
DROP TYPE IF EXISTS task_status_type;
DROP TYPE IF EXISTS task_priority_type;
DROP TYPE IF EXISTS moderation_status_type;
DROP TYPE IF EXISTS crisis_severity_type;
DROP TYPE IF EXISTS user_role_type;
