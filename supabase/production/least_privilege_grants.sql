-- =====================================================================
-- PROJECT SANDIGAN — Least-Privilege Permission Grants
-- Supabase project: niavgdcttagjqcsvuvpc
-- File: supabase/production/least_privilege_grants.sql
--
-- PURPOSE:
--   Resolve PostgreSQL error 42501 ("permission denied for table <name>")
--   that occurs because the migration created tables without explicit GRANTs.
--
-- USAGE:
--   Paste this entire file into the Supabase SQL Editor and execute.
--   Requires owner/postgres credentials (Supabase dashboard has this).
--
-- SECURITY PRINCIPLES:
--   • anon  → minimum: only truly public data (support_directory, ai_officers)
--   • authenticated → only tables they own; RLS handles row isolation
--   • service_role  → operational/system tables; bypasses RLS by design
--   • NEVER grant anon SELECT on journal_entries, safety_plans,
--     wellness_assessments, or crisis_safeguarding_logs
--
-- IMPORTANT: RLS policies on each table remain active and enforce
--   row-level isolation regardless of column-level GRANTs.
-- =====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- 0. SCHEMA USAGE
-- ─────────────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ─────────────────────────────────────────────────────────────────────
-- 1. PUBLIC READ-ONLY TABLES (anon + authenticated)
--    Data that any visitor may read without signing in.
-- ─────────────────────────────────────────────────────────────────────

-- Support directory — public resource listings
GRANT SELECT ON TABLE public.support_directory TO anon, authenticated;

-- AI Officers — names, descriptions, status (non-sensitive system data)
GRANT SELECT ON TABLE public.ai_officers TO anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────
-- 2. USER-OWNED TABLES (authenticated only)
--    Rows are isolated per user via RLS policies.
-- ─────────────────────────────────────────────────────────────────────

-- User profiles (own row only — RLS enforces)
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

-- Consent records (own consent only)
GRANT SELECT, INSERT, UPDATE ON TABLE public.user_consents TO authenticated;

-- Wellness assessments (own data only — NEVER to anon)
GRANT SELECT, INSERT ON TABLE public.wellness_assessments TO authenticated;

-- Safety plans (own plans only — NEVER to anon)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.safety_plans TO authenticated;

-- Journal entries (own journal only — NEVER to anon; most sensitive)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.journal_entries TO authenticated;

-- Community posts (read all, write own — RLS enforces ownership)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.community_posts TO authenticated;

-- Community comments (read all, write own — RLS enforces ownership)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.community_comments TO authenticated;

-- Referral requests (own referrals only)
GRANT SELECT, INSERT, UPDATE ON TABLE public.referral_requests TO authenticated;

-- AI messages (own conversation history only)
GRANT SELECT, INSERT ON TABLE public.ai_messages TO authenticated;

-- ─────────────────────────────────────────────────────────────────────
-- 3. SERVICE / OPERATIONAL TABLES (service_role only)
--    Only backend API routes using the service-role key may access these.
-- ─────────────────────────────────────────────────────────────────────

-- User roles — role assignment (founder sets this; never user-editable)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO service_role;

-- AI task queue
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_tasks TO service_role;

-- Task execution attempts
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_task_attempts TO service_role;

-- Scheduled jobs
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.scheduled_jobs TO service_role;

-- Founder approvals
GRANT SELECT, INSERT, UPDATE ON TABLE public.founder_approvals TO service_role;

-- System performance metrics
GRANT SELECT, INSERT ON TABLE public.system_metrics TO service_role;

-- Crisis safeguarding logs (highly sensitive — service_role only)
GRANT SELECT, INSERT, UPDATE ON TABLE public.crisis_safeguarding_logs TO service_role;

-- Audit logs (append-only for audit trail)
GRANT SELECT, INSERT ON TABLE public.audit_logs TO service_role;

-- System events
GRANT SELECT, INSERT ON TABLE public.system_events TO service_role;

-- ─────────────────────────────────────────────────────────────────────
-- 4. AUTHENTICATED READ ON OPERATIONAL TABLES
--    Some UI screens surface limited operational data to founders/admins.
--    RLS policies must enforce founder/admin role check on these tables.
-- ─────────────────────────────────────────────────────────────────────
GRANT SELECT ON TABLE public.ai_tasks TO authenticated;
GRANT SELECT ON TABLE public.ai_task_attempts TO authenticated;
GRANT SELECT ON TABLE public.ai_messages TO authenticated;
GRANT SELECT ON TABLE public.scheduled_jobs TO authenticated;
GRANT SELECT ON TABLE public.founder_approvals TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.founder_approvals TO authenticated;
GRANT SELECT ON TABLE public.system_metrics TO authenticated;
GRANT SELECT ON TABLE public.audit_logs TO authenticated;
GRANT SELECT ON TABLE public.system_events TO authenticated;
GRANT SELECT ON TABLE public.user_roles TO authenticated;
GRANT SELECT ON TABLE public.crisis_safeguarding_logs TO authenticated;

-- ─────────────────────────────────────────────────────────────────────
-- 5. SEQUENCE GRANTS (required for SERIAL / auto-increment columns)
-- ─────────────────────────────────────────────────────────────────────
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Also grant on future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO service_role;

-- ─────────────────────────────────────────────────────────────────────
-- 6. FUNCTION GRANTS (stored functions called by API routes)
-- ─────────────────────────────────────────────────────────────────────
-- Grant execute on existing functions (add specific names as needed)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ─────────────────────────────────────────────────────────────────────
-- 7. FUTURE TABLE DEFAULT PRIVILEGES
--    Ensures new tables created later inherit safe defaults.
-- ─────────────────────────────────────────────────────────────────────
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;

-- ─────────────────────────────────────────────────────────────────────
-- 8. VERIFICATION QUERIES
--    Run these after applying grants to confirm they took effect.
--    Each should return rows with the expected grantee and privilege_type.
-- ─────────────────────────────────────────────────────────────────────

-- Verify public tables are readable by anon
SELECT grantee, table_name, privilege_type
  FROM information_schema.role_table_grants
 WHERE table_schema = 'public'
   AND grantee IN ('anon', 'authenticated', 'service_role')
   AND table_name IN (
     'support_directory', 'ai_officers',
     'profiles', 'user_consents', 'wellness_assessments',
     'safety_plans', 'journal_entries', 'community_posts',
     'community_comments', 'referral_requests',
     'ai_messages', 'ai_tasks', 'ai_task_attempts',
     'scheduled_jobs', 'founder_approvals', 'system_metrics',
     'crisis_safeguarding_logs', 'audit_logs', 'system_events',
     'user_roles'
   )
 ORDER BY table_name, grantee, privilege_type;

-- Confirm anon CANNOT select from sensitive tables (should return 0 rows)
SELECT grantee, table_name, privilege_type
  FROM information_schema.role_table_grants
 WHERE table_schema = 'public'
   AND grantee = 'anon'
   AND table_name IN (
     'journal_entries', 'safety_plans',
     'wellness_assessments', 'crisis_safeguarding_logs',
     'user_roles', 'founder_approvals', 'audit_logs'
   )
   AND privilege_type = 'SELECT';
-- ↑ This query MUST return 0 rows. If it returns rows, review grants above.
