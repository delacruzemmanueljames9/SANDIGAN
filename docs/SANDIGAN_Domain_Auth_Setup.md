# PROJECT SANDIGAN — Custom Domain & Supabase Authentication Configuration

**Project Reference:** `niavgdcttagjqcsvuvpc`  
**Application Base URL:** `https://sandigan.ph` (or custom production domain)  
**Phase:** Phase 9 Launch Orchestration

---

## 1. Supabase Dashboard URL Configuration

When deploying PROJECT SANDIGAN to production with a custom domain, Supabase Auth needs exact redirect allowlists to prevent unauthorized redirect phishing attacks and authentication callback failures.

### A. Site URL Configuration
In the **Supabase Dashboard** → **Authentication** → **URL Configuration**:

- **Site URL**: `https://sandigan.ph` (Set to your exact production origin without trailing slash)
  *(During staging/preview, set to your Vercel preview domain or staging URL)*

### B. Redirect URLs Allowlist
Under **Redirect URLs**, add each of the following entries:

```
https://sandigan.ph/auth/callback
https://sandigan.ph/auth/reset-password
https://sandigan.ph/services/**
https://sandigan.ph/hq/**
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
```

> **Note on Wildcards:** Supabase supports glob patterns (e.g., `https://*.vercel.app/auth/callback`) for preview deployments if needed.

---

## 2. Authentication Flow Specifications

SANDIGAN uses Supabase Auth with Server-Side Rendering (`@supabase/ssr`) and cookie-based sessions handled via `middleware.ts` and `src/app/auth/callback/route.ts`.

### 1. User Registration / Email Confirmation
- **Sign-up endpoint:** `/auth/register`
- **Email Redirect URL:** When sending confirmation email, Supabase redirects to:  
  `https://sandigan.ph/auth/callback?next=/services`
- **Callback route:** `src/app/auth/callback/route.ts` exchanges the auth code for a session and sets the `sb-access-token` and `sb-refresh-token` cookies.

### 2. Password Recovery / Reset
- **Forgot password page:** `/auth/forgot-password`
- **Reset request:** Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://sandigan.ph/auth/reset-password' })`
- **Reset password page:** `/auth/reset-password` receives the access token, verifies session, and prompts user for new password via `supabase.auth.updateUser({ password })`.

### 3. Session Refresh & Cookie Management
- `middleware.ts` intercepts all requests, refreshes expired tokens via `@supabase/ssr`, and guards protected paths (`/services/*`, `/hq/*`, `/settings/*`).
- Unauthenticated users trying to access protected paths are safely redirected to `/auth/login?redirect=<target_path>`.

---

## 3. Custom Domain & DNS Settings (e.g., Vercel + Registrar)

### A. Domain Records (Apex & Subdomain)
At your domain registrar (e.g., Namecheap, Cloudflare, Google Domains):

| Type | Name | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` (Vercel IP) | Automatic / 300 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Automatic / 300 |

### B. Transactional Email DNS Records (Resend)
If using Resend for notifications (`resend.com`):

| Type | Host / Name | Value | Priority |
| :--- | :--- | :--- | :--- |
| **TXT** | `resend._domainkey` | *Provided by Resend Dashboard (DKIM)* | Auto |
| **TXT** | `@` | `v=spf1 include:spf.resend.com ~all` | Auto |
| **MX** | `feedback` | `feedback-smtp.resend.com` | 10 |
| **TXT** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@sandigan.ph` | Auto |

---

## 4. HTTPS & SSL Verification
- Vercel automatically provisions and renews Let's Encrypt SSL/TLS certificates once DNS records propagate.
- Verify certificate activation by navigating to `https://sandigan.ph` and confirming HTTP/2 + TLS 1.3 negotiation with no mixed-content warnings.
