/**
 * PROJECT SANDIGAN — Founder HQ Admin Rate Limiter
 * 
 * In-memory sliding-window rate limiter for administrator authentication.
 * Prevents brute-force credential stuffing against the Founder HQ endpoint.
 */

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();

// Maximum permitted failed attempts before lockout
const MAX_FAILED_ATTEMPTS = 5;
// Lockout duration: 15 minutes (in milliseconds)
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
// Stale entry cleanup threshold: 1 hour
const STALE_THRESHOLD_MS = 60 * 60 * 1000;

let lastCleanup = Date.now();

function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < STALE_THRESHOLD_MS) return;
  lastCleanup = now;

  loginAttempts.forEach((entry, key) => {
    if (now - entry.lastAttempt > STALE_THRESHOLD_MS) {
      loginAttempts.delete(key);
    }
  });
}

/**
 * Checks whether an identifier (e.g. IP + username) is currently allowed to attempt login.
 */
export function checkAdminLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  cleanupStaleEntries();
  const now = Date.now();
  const entry = loginAttempts.get(identifier);

  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Active lockout in effect
  if (entry.blockedUntil && entry.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Reset counter if previous attempt was beyond lockout window
  if (now - entry.lastAttempt > LOCKOUT_DURATION_MS) {
    loginAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - entry.attempts);
  return {
    allowed: entry.attempts < MAX_FAILED_ATTEMPTS,
    remainingAttempts: remaining,
  };
}

/**
 * Records a failed login attempt. If threshold is reached, triggers a 15-minute lockout.
 */
export function recordFailedAdminLogin(identifier: string): {
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = loginAttempts.get(identifier) || { attempts: 0, lastAttempt: now };

  entry.attempts += 1;
  entry.lastAttempt = now;

  if (entry.attempts >= MAX_FAILED_ATTEMPTS) {
    entry.blockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(identifier, entry);
    return {
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  loginAttempts.set(identifier, entry);
  return {
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - entry.attempts),
  };
}

/**
 * Clears rate-limit counters upon successful authentication.
 */
export function recordSuccessfulAdminLogin(identifier: string) {
  loginAttempts.delete(identifier);
}
