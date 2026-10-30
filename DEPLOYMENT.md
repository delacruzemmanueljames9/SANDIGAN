# TINIG KABATAAN (TK) — PRODUCTION DEPLOYMENT GUIDE

This guide provides instructions for deploying Tinig KaBataan on free, stable infrastructure using **Supabase** and **Vercel**.

---

## Part 1: Supabase Setup (Database & Authentication)

1. Create a free account at [Supabase](https://supabase.com).
2. Create a new project named `tinig-kabataan` (Select Southeast Asia / Singapore region for optimal latency).
3. In the Supabase Dashboard, navigate to **SQL Editor**.
4. Copy the entire contents of `supabase/migrations/20261030_init_tk_schema.sql` and run it.
   - This creates all 17 tables, types, foreign keys, Row Level Security (RLS) policies, and seed data.
5. Navigate to **Project Settings -> API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role secret` key (keep strictly server-side)

---

## Part 2: Google AI Studio Setup (Optional Free Gemini API)

1. Visit [Google AI Studio](https://aistudio.google.com).
2. Generate a free API key.
3. Save this key for the `GEMINI_API_KEY` environment variable.
*(If omitted, the platform automatically utilizes its built-in rule-based compassionate support engine).*

---

## Part 3: Deploying to Vercel

1. Push your code to GitHub (see GitHub setup below).
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import the `tinig-kabataan` repository.
4. Under **Environment Variables**, provide:
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (e.g. `https://tinig-kabataan.vercel.app`)
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
   - `GEMINI_API_KEY`: Your Google AI Studio Key
5. Click **Deploy**. Vercel will build the Next.js production bundle.
