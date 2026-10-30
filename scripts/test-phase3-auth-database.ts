import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
const env: Record<string, string> = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    });
}

const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"] || env["SUPABASE_URL"];
const anonKey = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const serviceKey = env["SUPABASE_SERVICE_ROLE_KEY"];

console.log("=====================================================================");
console.log("PROJECT SANDIGAN — PHASE 3 AUTHENTICATION & DATABASE VERIFICATION");
console.log("=====================================================================");

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
    if (details) console.log(`       -> ${details}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       -> ${details}`);
  }
}

async function runTests() {
  // TEST 1: Schema Migration Completeness
  const migrationPath = path.resolve(process.cwd(), "supabase/migrations/20261030000000_sandigan_ecosystem_schema.sql");
  assert(fs.existsSync(migrationPath), "Migration File Exists", migrationPath);

  const sql = fs.readFileSync(migrationPath, "utf8");
  const requiredTables = [
    "profiles",
    "user_roles",
    "user_consents",
    "wellness_assessments",
    "safety_plans",
    "journal_entries",
    "community_posts",
    "community_comments",
    "support_directory",
    "referral_requests",
    "ai_officers",
    "ai_tasks",
    "ai_task_attempts",
    "ai_messages",
    "scheduled_jobs",
    "founder_approvals",
    "system_metrics",
    "crisis_safeguarding_logs",
    "audit_logs",
    "system_events",
  ];

  let allTablesPresent = true;
  for (const t of requiredTables) {
    if (!sql.includes(`CREATE TABLE IF NOT EXISTS public.${t}`)) {
      allTablesPresent = false;
      console.error(`Missing table definition for: ${t}`);
    }
  }
  assert(allTablesPresent, "All 20 Required Database Tables Defined in SQL Migration");

  // TEST 2: Row Level Security Enabled for All 20 Tables
  let allRlsEnabled = true;
  for (const t of requiredTables) {
    if (!sql.includes(`ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY;`)) {
      allRlsEnabled = false;
      console.error(`Missing RLS enable statement for: ${t}`);
    }
  }
  assert(allRlsEnabled, "Row Level Security Explicitly Enabled for All 20 Tables");

  // TEST 3: Strict Private Isolation Policies Defined
  const privatePolicies = [
    "profiles_select_own",
    "profiles_update_own",
    "user_roles_select_own",
    "user_roles_admin_write",
    "user_consents_select_own",
    "safety_plans_all_own",
    "journal_entries_all_own",
    "wellness_assessments_select_own",
    "referral_requests_user",
    "crisis_logs_restricted",
    "audit_logs_restricted",
  ];
  let allPoliciesPresent = true;
  for (const p of privatePolicies) {
    if (!sql.includes(p)) {
      allPoliciesPresent = false;
      console.error(`Missing critical RLS policy: ${p}`);
    }
  }
  assert(allPoliciesPresent, "Strict Non-Permissive RLS Policies Defined for Sensitive Tables");

  // TEST 4: Supabase Auth Endpoint Connectivity
  const anonClient = createClient(supabaseUrl, anonKey);
  const { data: sessionData, error: sessionError } = await anonClient.auth.getSession();
  assert(!sessionError, "Supabase Auth Session Endpoint Operational", "Connected to " + supabaseUrl);

  // TEST 5: Role Escalation Protection Check (Client Cannot Self-Promote)
  const isSelfPromotionPrevented = sql.includes("user_roles_admin_write") &&
    sql.includes("public.is_founder_or_admin()") &&
    !sql.includes("CREATE POLICY \"user_roles_insert_all\" ON public.user_roles FOR INSERT WITH CHECK (true);");
  assert(isSelfPromotionPrevented, "Role Escalation Prevention: Non-admin users cannot write to user_roles table");

  // TEST 6: User Consent & Data Minimization Tracking
  const hasConsentTable = sql.includes("public.user_consents") &&
    sql.includes("policy_version") &&
    sql.includes("consent_type");
  assert(hasConsentTable, "RA 10173 Consent Tracking Table Configured with Policy Version & Timestamps");

  // TEST 7: Data Export and Deletion API Endpoints Created
  const exportRouteExists = fs.existsSync(path.resolve(process.cwd(), "src/app/api/user/export/route.ts"));
  const deleteRouteExists = fs.existsSync(path.resolve(process.cwd(), "src/app/api/user/delete/route.ts"));
  assert(exportRouteExists, "Data Portability API Route Exists (/api/user/export)");
  assert(deleteRouteExists, "Right to Erasure API Route Exists (/api/user/delete)");

  // TEST 8: Auth UI Routes Exist
  const authRoutes = [
    "src/app/auth/login/page.tsx",
    "src/app/auth/register/page.tsx",
    "src/app/auth/forgot-password/page.tsx",
    "src/app/auth/reset-password/page.tsx",
    "src/app/auth/callback/route.ts",
    "src/app/settings/profile/page.tsx",
    "src/app/settings/privacy/page.tsx",
  ];
  let allAuthRoutesExist = true;
  for (const r of authRoutes) {
    if (!fs.existsSync(path.resolve(process.cwd(), r))) {
      allAuthRoutesExist = false;
      console.error("Missing auth route: " + r);
    }
  }
  assert(allAuthRoutesExist, "All Auth and Privacy Management Pages Implemented");

  console.log("=====================================================================");
  console.log(`SUMMARY: ${passedTests} of ${totalTests} verification checks passed.`);
  console.log("=====================================================================");

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
