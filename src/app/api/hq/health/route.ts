import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSystemHealthOverview } from "@/lib/autonomous/health";
import { verifyFounderOrAdmin } from "@/lib/auth/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAuthorized = await verifyFounderOrAdmin(user, supabase);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const health = await getSystemHealthOverview();
    return NextResponse.json({ success: true, ...health });
  } catch (error) {
    console.error("HQ Health API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
