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
      return NextResponse.json(
        { error: "Forbidden: Founder access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const riskFilter = searchParams.get("risk");

    let query = supabase
      .from("crisis_safeguarding_logs")
      .select("id, risk_level, trigger_keywords, officer_responder, escalation_pathway, user_acknowledged, created_at")
      .order("created_at", { ascending: false });

    if (riskFilter && ["low", "medium", "high", "critical"].includes(riskFilter)) {
      query = query.eq("risk_level", riskFilter);
    }

    const { data: logs, error: fetchError } = await query.limit(50);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      logs: logs || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("HQ Safeguarding API GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
      return NextResponse.json(
        { error: "Forbidden: Founder access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { alertId } = body;

    if (!alertId) {
      return NextResponse.json({ error: "alertId is required" }, { status: 400 });
    }

    const { data: updatedLog, error: updateError } = await supabase
      .from("crisis_safeguarding_logs")
      .update({ user_acknowledged: true })
      .eq("id", alertId)
      .select("id, risk_level, user_acknowledged")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, log: updatedLog });
  } catch (error) {
    console.error("HQ Safeguarding API POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
