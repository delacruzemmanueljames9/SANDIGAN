import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://niavgdcttagjqcsvuvpc.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  const isHqAuthApi = pathname.startsWith("/api/hq/auth");
  const isHqApiRoute = pathname.startsWith("/api/hq") && !isHqAuthApi;
  const isHqLogin = pathname === "/hq/login";
  const isHqPageRoute = (pathname === "/hq" || pathname.startsWith("/hq/")) && !isHqLogin;
  const isSettingsRoute = pathname.startsWith("/settings");

  // Helper for verified founder / admin clearance
  const checkClearance = async (): Promise<boolean> => {
    if (!user) return false;
    // 1. Cryptographically signed Supabase Auth JWT app_metadata
    if (
      user.app_metadata?.role === "founder" ||
      user.app_metadata?.role === "admin" ||
      user.app_metadata?.is_founder === true
    ) {
      return true;
    }
    // 2. Identity match for designated founder
    const founderEmail = (process.env.FOUNDER_EMAIL || "delacruzemmanueljames9@gmail.com").toLowerCase();
    if ((user.email || "").toLowerCase() === founderEmail) {
      return true;
    }
    // 3. Database public.user_roles row
    try {
      const { data: roleRecord } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["founder", "admin"])
        .maybeSingle();
      if (roleRecord) return true;
    } catch {
      // Handled fail-closed below
    }
    return false;
  };

  // 1. Settings Routes: Require authentication
  if (isSettingsRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. HQ API Endpoints: Require server-side founder/admin authorization (Fail closed)
  if (isHqApiRoute) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAuthorized = await checkClearance();
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden: Founder or Administrator access required." },
        { status: 403 }
      );
    }
  }

  // 3. HQ Page Routes: Require server-side founder/admin authorization (Fail closed)
  if (isHqPageRoute) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/hq/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const isAuthorized = await checkClearance();
    if (!isAuthorized) {
      // Fail closed: Redirect unauthorized user away from HQ
      const deniedUrl = request.nextUrl.clone();
      deniedUrl.pathname = "/";
      deniedUrl.searchParams.set("error", "unauthorized_hq_access");
      return NextResponse.redirect(deniedUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/settings/:path*",
    "/hq/:path*",
    "/hq",
    "/api/hq",
    "/api/hq/:path*",
  ],
};
