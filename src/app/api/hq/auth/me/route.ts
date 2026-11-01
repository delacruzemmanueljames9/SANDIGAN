import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { verifyFounderOrAdmin } from "@/lib/auth/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://niavgdcttagjqcsvuvpc.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set() {},
      remove() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ authenticated: false, isFounder: false }, { status: 401 });
  }

  const isFounder = await verifyFounderOrAdmin(user, supabase);

  return NextResponse.json({
    authenticated: true,
    isFounder,
    user: {
      id: user.id,
      email: user.email,
      role: isFounder ? "founder" : (user.app_metadata?.role || "user"),
    },
  });
}
