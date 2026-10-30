import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level");

    let query = supabase
      .from("system_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (level && ["info", "warn", "error", "critical"].includes(level)) {
      query = query.eq("event_level", level);
    }

    const { data: events, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, events: events || [] });
  } catch (error) {
    console.error("HQ Events API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
