import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  checkAdminLoginRateLimit,
  recordFailedAdminLogin,
  recordSuccessfulAdminLogin,
} from "@/lib/auth/rate-limiter";
import {
  isFounderUsername,
  getFounderEmail,
  verifyFounderOrAdmin,
} from "@/lib/auth/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Extract client IP for rate limiting
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  // 1. Check Rate Limiter
  const rateLimitStatus = checkAdminLoginRateLimit(clientIp);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Account locked for security. Please try again in ${Math.ceil(
          (rateLimitStatus.retryAfterSeconds || 900) / 60
        )} minutes.`,
        remainingAttempts: 0,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitStatus.retryAfterSeconds || 900),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || typeof username !== "string" || !username.trim()) {
      return NextResponse.json({ error: "Administrator username is required." }, { status: 400 });
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      return NextResponse.json({ error: "Administrator password is required." }, { status: 400 });
    }

    // 2. Validate Username Identity
    if (!isFounderUsername(username)) {
      // Artificial delay to prevent timing discrepancy
      await new Promise((resolve) => setTimeout(resolve, 400));
      const failInfo = recordFailedAdminLogin(clientIp);
      return NextResponse.json(
        {
          error: "Invalid administrator credentials.",
          remainingAttempts: failInfo.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Prepare response object early so cookies can be set directly on it
    let response = NextResponse.json({
      success: true,
      redirectUrl: "/hq",
      message: "Founder credentials authenticated successfully.",
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://niavgdcttagjqcsvuvpc.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            httpOnly: options.httpOnly ?? true,
            secure: process.env.NODE_ENV === "production",
            sameSite: (options.sameSite as "lax" | "strict" | "none") ?? "lax",
            path: options.path ?? "/",
            maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // 7 days
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: "",
            path: options.path ?? "/",
            maxAge: 0,
          });
        },
      },
    });

    // 3. Authenticate with Supabase Auth (server-side bcrypt verification)
    const targetEmail = getFounderEmail();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: password.trim(),
    });

    if (authError || !authData.user) {
      const failInfo = recordFailedAdminLogin(clientIp);
      return NextResponse.json(
        {
          error: "Invalid administrator credentials.",
          remainingAttempts: failInfo.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 4. Verify Founder / Admin Clearance (fail-closed check)
    const isAuthorized = await verifyFounderOrAdmin(authData.user, supabase);
    if (!isAuthorized) {
      await supabase.auth.signOut();
      const failInfo = recordFailedAdminLogin(clientIp);
      return NextResponse.json(
        {
          error: "Access denied: Account lacks authorized Founder or Administrator clearance.",
          remainingAttempts: failInfo.remainingAttempts,
        },
        { status: 403 }
      );
    }

    // 5. Successful Authentication
    recordSuccessfulAdminLogin(clientIp);

    // Return response with auth cookies attached
    return response;
  } catch (err: unknown) {
    console.error("Founder HQ Login API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during administrator authentication." },
      { status: 500 }
    );
  }
}
