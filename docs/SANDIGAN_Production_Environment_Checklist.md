# PROJECT SANDIGAN — Production Environment Variables Checklist

**Project Reference:** `niavgdcttagjqcsvuvpc`  
**Platform:** Next.js 14 (App Router) + Supabase PostgreSQL  
**Last Updated:** Phase 9 Launch Preparation

This document catalogues every environment variable used in PROJECT SANDIGAN, its scope, sensitivity, default values, and production provisioning requirements.

---

## 1. Environment Variable Matrix

| Variable Name | Required? | Scope / Target | Sensitivity | Description & Recommended Production Value |
| :--- | :---: | :---: | :---: | :--- |
| `NEXT_PUBLIC_APP_URL` | **YES** | Browser & Server | Public | Canonical URL of the deployment. Production: `https://sandigan.ph` (or custom domain). Used for redirects, metadata, and absolute links. |
| `NEXT_PUBLIC_SUPABASE_URL` | **YES** | Browser & Server | Public | Supabase API Gateway URL. E.g., `https://niavgdcttagjqcsvuvpc.supabase.co`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **YES** | Browser & Server | Public (Restricted by RLS) | Supabase client anon public key. Used by `@supabase/ssr` in browser/SSR client. Subject to PostgreSQL RLS policies. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Optional | Browser & Server | Public | Fallback publishable key (often same as anon key for standard Supabase setups). |
| `SUPABASE_URL` | **YES** | Server-Only | Internal | Server-side Supabase URL fallback. Same as `NEXT_PUBLIC_SUPABASE_URL`. |
| `SUPABASE_SECRET_KEY` | **YES** | Server-Only | **CRITICAL SECRET** | Supabase service role secret key. Bypasses RLS. Used by backend orchestrator, queue processor, and administrative routes. |
| `SUPABASE_SERVICE_ROLE_KEY` | **YES** | Server-Only | **CRITICAL SECRET** | Alias for `SUPABASE_SECRET_KEY`. Kept for backward compatibility across SDK calls. |
| `GEMINI_API_KEY` | **YES** | Server-Only | **CRITICAL SECRET** | Google AI Studio / Gemini API key. Powers AMARA, GABAY, TALA, SIKLAB, DUNONG, KAWING, and SINAG. |
| `GEMINI_MODEL` | Optional | Server-Only | Config | Default: `gemini-3.5-flash-lite` or `gemini-1.5-flash`. Controls AI Officer generation model. |
| `WORKER_AUTH_TOKEN` | **YES** | Server-Only | **HIGH SECRET** | Token for securing external worker webhooks or manual trigger endpoints. |
| `CRON_SECRET` | **YES** | Server-Only | **HIGH SECRET** | High-entropy shared secret used by Vercel Cron or external runners calling `POST /api/hq/queue/process`. |
| `RATE_LIMIT_MAX_REQUESTS` | Optional | Server-Only | Config | Default: `60`. Maximum requests per IP window. |
| `RATE_LIMIT_WINDOW_SECONDS` | Optional | Server-Only | Config | Default: `60`. Rate limit sliding window duration in seconds. |
| `RESEND_API_KEY` | Optional | Server-Only | **HIGH SECRET** | API key from Resend.com for sending transactional emails (referral notifications, safeguarding alerts, approval pings). App gracefully skips sending if unset. |
| `EMAIL_FROM_ADDRESS` | Optional | Server-Only | Config | Sender address. Default: `SANDIGAN <noreply@sandigan.ph>`. Must match a verified domain in Resend. |

---

## 2. Platform Secret Management Best Practices

1. **Vercel / Hosting Provider:**
   - Add all `CRITICAL SECRET` and `HIGH SECRET` variables in Project Settings → Environment Variables.
   - Restrict Service Role Keys and Gemini keys to `Production` and `Preview` environments only; do NOT expose in Development unless testing locally via `.env.local`.
   - Never prefix server-only keys with `NEXT_PUBLIC_`.

2. **Supabase Dashboard:**
   - Confirm project `niavgdcttagjqcsvuvpc` is in production tier if expected load exceeds free quotas.
   - Do NOT share or commit `.env.local` or service role keys.
   - Set up API rate limits and IP restrictions in the Supabase Dashboard if necessary.

3. **Rotating Secrets:**
   - If `GEMINI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` is ever compromised, rotate immediately via Google AI Studio and Supabase API Settings.
   - `CRON_SECRET` can be regenerated at any time using: `openssl rand -hex 32`.
