import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AI_OFFICERS } from "@/config/officers";

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

    // Double check founder / admin authorization
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

    // 1. Fetch AI Officers
    const { data: dbOfficers } = await supabase
      .from("ai_officers")
      .select("*")
      .order("name", { ascending: true });

    // 2. Fetch Recent Tasks
    const { data: tasks } = await supabase
      .from("ai_tasks")
      .select("id, officer_id, task_type, priority, status, requires_approval, created_at, error_log")
      .order("created_at", { ascending: false })
      .limit(20);

    // 3. Fetch Recent Telemetry Attempts
    const { data: attempts } = await supabase
      .from("ai_task_attempts")
      .select("id, task_id, status, error_message, execution_duration_ms, output_summary, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    // 4. Fetch Inter-Officer Messages
    const { data: messages } = await supabase
      .from("ai_messages")
      .select("id, from_officer, to_officer, message_type, subject, body, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    // 5. Fetch Pending Founder Approvals
    const { data: approvals } = await supabase
      .from("founder_approvals")
      .select("id, task_id, officer_requesting, action_summary, risk_level, action_payload, status, decision_notes, created_at")
      .order("created_at", { ascending: false });

    // 6. Fetch System Metrics
    const { data: metrics } = await supabase
      .from("system_metrics")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(10);

    // 7. Fetch Recent Safeguarding Crisis Alerts (Privacy-scrubbed, no user_id/session_id)
    const { data: crisisAlerts } = await supabase
      .from("crisis_safeguarding_logs")
      .select("id, risk_level, trigger_keywords, officer_responder, escalation_pathway, user_acknowledged, created_at")
      .order("created_at", { ascending: false })
      .limit(15);

    // 8. Fetch Aggregate Task Counts
    const { count: pendingCount } = await supabase
      .from("ai_tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: inProgressCount } = await supabase
      .from("ai_tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress");

    const { count: completedCount } = await supabase
      .from("ai_tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");

    const { count: failedCount } = await supabase
      .from("ai_tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed");

    const { count: deadLetterCount } = await supabase
      .from("ai_tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "dead_letter");

    const { count: awaitingApprovalCount } = await supabase
      .from("ai_tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "awaiting_approval");

    const taskCounts = {
      pending: pendingCount || 0,
      in_progress: inProgressCount || 0,
      completed: completedCount || 0,
      failed: failedCount || 0,
      dead_letter: deadLetterCount || 0,
      awaiting_approval: awaitingApprovalCount || 0,
      total:
        (pendingCount || 0) +
        (inProgressCount || 0) +
        (completedCount || 0) +
        (failedCount || 0) +
        (deadLetterCount || 0) +
        (awaitingApprovalCount || 0),
    };

    return NextResponse.json({
      success: true,
      officers: Object.values(AI_OFFICERS).map((officer) => {
        const dbMatch = dbOfficers?.find((dbo) => dbo.name === officer.name);
        return {
          ...officer,
          status: dbMatch?.status || "active",
        };
      }),
      tasks: tasks || [],
      attempts: attempts || [],
      messages: messages || [],
      approvals: approvals || [],
      metrics: metrics || [],
      crisisAlerts: crisisAlerts || [],
      taskCounts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("HQ Status API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
