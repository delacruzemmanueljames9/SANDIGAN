import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSystemHealthOverview } from "@/lib/autonomous/health";

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

    const { data: roleRecord } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["founder", "admin"])
      .maybeSingle();

    if (!roleRecord) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const health = await getSystemHealthOverview();
    return NextResponse.json({ success: true, ...health });
  } catch (error) {
    console.error("HQ Health API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
