# PROJECT SANDIGAN — Founder Production Launch Checklist

**Project Name:** PROJECT SANDIGAN  
**Parent Organization:** Tinig KaBataan (TK)  
**Founder & Lead Developer:** Emmanuel James C. Dela Cruz  
**Supabase Reference:** `niavgdcttagjqcsvuvpc`  
**GitHub Repository:** `https://github.com/delacruzemmanueljames9/SANDIGAN.git`  
**Phase:** Phase 9 Launch Readiness & Production Orchestration

---

## 1. Supabase Database Permissions & Remediation (CRITICAL — Blocker Resolution)

- [ ] **Step 1.1: Open Supabase SQL Editor**  
  Log in to [Supabase Dashboard](https://supabase.com/dashboard/project/niavgdcttagjqcsvuvpc) and open the SQL Editor.
- [ ] **Step 1.2: Execute `least_privilege_grants.sql`**  
  Copy and paste the entire script from `supabase/production/least_privilege_grants.sql` and run it.  
  *This resolves PostgreSQL permission error 42501 across all 20 ecosystem tables with least-privilege role separation (`anon`, `authenticated`, `service_role`).*
- [ ] **Step 1.3: Verify Zero Forbidden Grants**  
  Run the verification queries at the bottom of the script. Verify that:
  - `anon` can ONLY read `support_directory` and `ai_officers`.
  - Sensitive tables (`journal_entries`, `safety_plans`, `wellness_assessments`, `crisis_safeguarding_logs`, `audit_logs`) return 0 rows for `anon`.

---

## 2. Supabase Auth & URL Configuration

- [ ] **Step 2.1: Configure Site URL**  
  In **Authentication** → **URL Configuration**, set **Site URL** to:  
  `https://sandigan.ph` (or custom production domain).
- [ ] **Step 2.2: Add Redirect URLs**  
  Add the following URLs to the **Redirect URLs** allowlist:
  ```
  https://sandigan.ph/auth/callback
  https://sandigan.ph/auth/reset-password
  https://sandigan.ph/services/**
  https://sandigan.ph/hq/**
  ```
- [ ] **Step 2.3: Configure SMTP / Auth Emails**  
  In **Authentication** → **Email Templates**, customize confirmation and password recovery emails with SANDIGAN branding. If using custom SMTP, enter credentials in **Settings** → **Auth**.

---

## 3. Hosting Platform & Environment Provisioning (e.g., Vercel)

- [ ] **Step 3.1: Connect GitHub Repository**  
  In the Vercel Dashboard, import `delacruzemmanueljames9/SANDIGAN` on branch `main`.
- [ ] **Step 3.2: Configure Production Environment Variables**  
  Set the following in **Project Settings** → **Environment Variables**:
  - `NEXT_PUBLIC_APP_URL` = `https://sandigan.ph`
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://niavgdcttagjqcsvuvpc.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *[Your Supabase anon key]*
  - `SUPABASE_URL` = `https://niavgdcttagjqcsvuvpc.supabase.co`
  - `SUPABASE_SECRET_KEY` = *[Your Supabase service role key]*
  - `SUPABASE_SERVICE_ROLE_KEY` = *[Your Supabase service role key]*
  - `GEMINI_API_KEY` = *[Your Google Gemini API key]*
  - `GEMINI_MODEL` = `gemini-3.5-flash-lite`
  - `WORKER_AUTH_TOKEN` = *[Generate via: `openssl rand -hex 32`]*
  - `CRON_SECRET` = *[Generate via: `openssl rand -hex 32`]*
  - *(Optional)* `RESEND_API_KEY` = *[Your Resend API key]*
  - *(Optional)* `EMAIL_FROM_ADDRESS` = `SANDIGAN <noreply@sandigan.ph>`
- [ ] **Step 3.3: Verify Cron Configuration**  
  Confirm `vercel.json` crons are active in the Vercel dashboard:
  - Route: `/api/hq/queue/process`
  - Schedule: `*/5 * * * *` (Every 5 minutes)
  - Vercel automatically sends `Authorization: Bearer <CRON_SECRET>`

---

## 4. Custom Domain & DNS Verification

- [ ] **Step 4.1: Assign Custom Domain in Vercel**  
  Add `sandigan.ph` and `www.sandigan.ph` under **Project Settings** → **Domains**.
- [ ] **Step 4.2: Add DNS Records at Registrar**  
  - `A` record: `@` → `76.76.21.21`
  - `CNAME` record: `www` → `cname.vercel-dns.com`
- [ ] **Step 4.3: Add SPF / DKIM Records for Resend (if using custom sender)**  
  Verify domain in Resend dashboard and input DNS TXT/MX records.
- [ ] **Step 4.4: SSL Certificate Issuance**  
  Wait for Vercel automatic Let's Encrypt certificate issuance. Test HTTPS response.

---

## 5. Pre-Launch Sanity & Integration Validation

- [ ] **Step 5.1: Run Local Integration Test Suite**  
  Execute:  
  `npx tsx scripts/test-phase8-integration.ts`  
  *Verify that all 14 tests pass now that least-privilege grants are applied.*
- [ ] **Step 5.2: Test Authentication End-to-End**  
  - Create a test account at `/auth/register`.
  - Confirm email verification or test login at `/auth/login`.
  - Verify redirect to `/services`.
  - Test logout.
- [ ] **Step 5.3: Test Core Service Interactions**  
  - Test `/services/talk` (Tinig crisis and companion conversation).
  - Test `/services/wellness-check` (Assessment submission and history loading).
  - Test `/services/inner-garden` (Journal creation and privacy toggling).
  - Test `/services/safety-plan` (Safety plan saving and retrieval).
- [ ] **Step 5.4: Test Founder HQ Access Control**  
  - Ensure regular users receive 403 Forbidden on `/hq`.
  - Sign in with founder account and verify all 8 tabs load real system telemetry.
  - Verify `/api/hq/health` returns healthy status.
- [ ] **Step 5.5: Test Autonomous Queue Execution**  
  - Trigger `/api/hq/queue/process` via `npm run worker:once` or curl with `CRON_SECRET`.
  - Check Founder Command Center Queue Manager for task and scheduled job execution records.

---

## 6. Official Launch Go-Live

- [ ] **Step 6.1: Announce Availability to Tinig KaBataan Community**
- [ ] **Step 6.2: Monitor Vercel Runtime Logs and Supabase API Usage**
- [ ] **Step 6.3: Monitor Founder Command Center for Safeguarding Alerts**
