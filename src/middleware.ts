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

  const isHqApiRoute = pathname.startsWith("/api/hq");
  const isHqPageRoute = pathname === "/hq" || pathname.startsWith("/hq/");
  const isSettingsRoute = pathname.startsWith("/settings");

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

    try {
      const { data: roleRecord, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["founder", "admin"])
        .maybeSingle();

      if (roleError || !roleRecord) {
        return NextResponse.json(
          { error: "Forbidden: Founder or Administrator access required." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Forbidden: Authorization verification failed." },
        { status: 403 }
      );
    }
  }

  // 3. HQ Page Routes: Require server-side founder/admin authorization (Fail closed)
  if (isHqPageRoute) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      const { data: roleRecord, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["founder", "admin"])
        .maybeSingle();

      if (roleError || !roleRecord) {
        // Fail closed: Redirect unauthorized user away from HQ
        const deniedUrl = request.nextUrl.clone();
        deniedUrl.pathname = "/";
        deniedUrl.searchParams.set("error", "unauthorized_hq_access");
        return NextResponse.redirect(deniedUrl);
      }
    } catch {
      // Fail closed on error
      const deniedUrl = request.nextUrl.clone();
      deniedUrl.pathname = "/";
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
    "/api/hq/:path*",
  ],
};
