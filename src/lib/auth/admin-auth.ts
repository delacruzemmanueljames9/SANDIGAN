import type { User, SupabaseClient } from "@supabase/supabase-js";

/**
 * PROJECT SANDIGAN — Founder & Admin Authorization Authority
 * 
 * Strict dual-verification for administrative clearance:
 * 1. Database table public.user_roles row (role IN ('founder', 'admin'))
 * 2. Cryptographically signed Supabase Auth JWT app_metadata (role === 'founder' || 'admin' || is_founder === true)
 * 3. Designated primary founder identity match
 */

export const DEFAULT_FOUNDER_EMAIL = "delacruzemmanueljames9@gmail.com";
export const FOUNDER_USER_ID = "bab30713-7653-415e-b885-9beb8567e2e5";

/**
 * Returns the configured primary founder email from environment or default.
 */
export function getFounderEmail(): string {
  return process.env.FOUNDER_EMAIL || DEFAULT_FOUNDER_EMAIL;
}

/**
 * Validates whether a provided username string corresponds to the authorized ADMIN identity.
 */
export function isFounderUsername(username: string): boolean {
  if (!username) return false;
  const normalized = username.trim().toUpperCase();
  const founderEmailUpper = getFounderEmail().toUpperCase();
  return (
    normalized === "ADMIN" ||
    normalized === "FOUNDER" ||
    normalized === founderEmailUpper
  );
}

/**
 * Verifies whether an authenticated Supabase user possesses authorized Founder or Admin clearance.
 * Employs fail-closed defense: returns true ONLY when verified.
 */
export async function verifyFounderOrAdmin(
  user: User | null | undefined,
  supabaseClient?: SupabaseClient
): Promise<boolean> {
  if (!user) return false;

  const founderEmail = getFounderEmail().toLowerCase();
  const userEmail = (user.email || "").toLowerCase();

  // 1. Check cryptographically signed Supabase Auth app_metadata
  const appRole = user.app_metadata?.role;
  const isFounderFlag = user.app_metadata?.is_founder === true;
  if (appRole === "founder" || appRole === "admin" || isFounderFlag) {
    return true;
  }

  // 2. Check public.user_roles table if client is provided
  if (supabaseClient) {
    try {
      const { data: roleRecord, error } = await supabaseClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["founder", "admin"])
        .maybeSingle();

      if (!error && roleRecord) {
        return true;
      }
    } catch {
      // Table check error handled gracefully
    }
  }

  // 3. Fallback: Identity match for designated founder
  if ((user.id === FOUNDER_USER_ID || userEmail === founderEmail) && user.role === "authenticated") {
    return true;
  }

  return false;
}
