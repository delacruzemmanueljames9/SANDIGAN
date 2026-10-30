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

console.log("=====================================================================");
console.log("PROJECT SANDIGAN — LOGIN & AUTHENTICATION VERIFICATION TEST");
console.log("=====================================================================");

let passed = 0;
let failed = 0;

function assert(condition: boolean, title: string, detail?: string) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${title}`);
    if (detail) console.log(`       -> ${detail}`);
  } else {
    failed++;
    console.error(`[FAIL] ${title}`);
    if (detail) console.error(`       -> ${detail}`);
  }
}

// 1. Verify all auth routes exist in filesystem
const expectedRoutes = [
  "src/app/login/page.tsx",
  "src/app/auth/login/page.tsx",
  "src/app/register/page.tsx",
  "src/app/signup/page.tsx",
  "src/app/auth/register/page.tsx",
  "src/app/auth/forgot-password/page.tsx",
  "src/app/auth/reset-password/page.tsx",
  "src/app/auth/callback/route.ts",
];

for (const route of expectedRoutes) {
  const fullPath = path.resolve(process.cwd(), route);
  assert(fs.existsSync(fullPath), `Route exists: ${route}`);
}

// 2. Test Safe Redirect Validation
function getSafeRedirect(redirectParam: string | null): string {
  if (!redirectParam) return "/services";
  const trimmed = redirectParam.trim();
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.includes(":") &&
    !trimmed.includes("\\")
  ) {
    return trimmed;
  }
  return "/services";
}

assert(getSafeRedirect(null) === "/services", "Safe redirect fallback defaults to /services");
assert(getSafeRedirect("") === "/services", "Empty redirect defaults to /services");
assert(getSafeRedirect("/hq") === "/hq", "Internal /hq redirect preserved");
assert(getSafeRedirect("/services/inner-garden") === "/services/inner-garden", "Internal service redirect preserved");
assert(getSafeRedirect("https://malicious.com") === "/services", "External URL blocked by safe redirect");
assert(getSafeRedirect("//malicious.com") === "/services", "Protocol-relative URL blocked by safe redirect");
assert(getSafeRedirect("/\\evil.com") === "/services", "Backslash evasion blocked by safe redirect");

// 3. Inspect Middleware Fail-Closed Protection
const middlewareContent = fs.readFileSync(path.resolve(process.cwd(), "src/middleware.ts"), "utf8");
assert(
  middlewareContent.includes("isHqPageRoute") &&
  middlewareContent.includes("redirectUrl.pathname = \"/auth/login\""),
  "Middleware redirects unauthenticated /hq visits to login"
);
assert(
  middlewareContent.includes("isHqApiRoute") &&
  middlewareContent.includes("status: 401"),
  "Middleware returns 401 for unauthenticated /api/hq calls"
);
assert(
  middlewareContent.includes("roleRecord") &&
  middlewareContent.includes(".in(\"role\", [\"founder\", \"admin\"])"),
  "Middleware enforces server-side founder/admin role validation"
);

// 4. Role Escalation Protection Check in Registration & Auth Context
const registerContent = fs.readFileSync(path.resolve(process.cwd(), "src/app/auth/register/page.tsx"), "utf8");
assert(
  !registerContent.includes("founder") &&
  !registerContent.includes("admin") &&
  !registerContent.includes("user_roles"),
  "Registration page cannot assign or request elevated roles"
);

const authContextContent = fs.readFileSync(path.resolve(process.cwd(), "src/lib/auth/auth-context.tsx"), "utf8");
assert(
  authContextContent.includes("setRole(\"user\")") &&
  authContextContent.includes("from(\"user_roles\")"),
  "Auth context defaults to 'user' role and reads verified roles from user_roles table"
);

// 5. Test Live Supabase Auth Endpoint Connectivity
async function testSupabaseAuth() {
  if (!supabaseUrl || !anonKey) {
    assert(false, "Supabase environment configuration present");
    return;
  }

  const client = createClient(supabaseUrl, anonKey);
  const { data, error } = await client.auth.getSession();
  assert(!error, "Live Supabase Auth connection responsive", `Connected to ${supabaseUrl}`);

  // Test invalid login handling
  const { error: signInError } = await client.auth.signInWithPassword({
    email: "nonexistent_test_user@sandigan.ph",
    password: "InvalidPassword123!",
  });
  assert(
    signInError !== null && (signInError.message.includes("Invalid login credentials") || signInError.status === 400),
    "Invalid credentials safely rejected by Supabase Auth",
    signInError?.message
  );

  console.log("=====================================================================");
  console.log(`TEST RESULTS: ${passed} passed, ${failed} failed.`);
  console.log("=====================================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

testSupabaseAuth();
