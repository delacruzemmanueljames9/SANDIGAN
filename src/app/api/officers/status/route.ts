import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AI_OFFICERS } from "@/config/officers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    // Query active database officer records
    const { data: dbOfficers } = await supabase
      .from("ai_officers")
      .select("id, name, callsign, role, division, status, updated_at");

    // Query recent task counts
    const { count: pendingTasksCount } = await supabase
      .from("ai_tasks")
      .select("id", { count: "exact" })
      .eq("status", "pending");

    const { count: completedTasksCount } = await supabase
      .from("ai_tasks")
      .select("id", { count: "exact" })
      .eq("status", "completed");

    // Query unread inter-officer messages
    const { count: unreadMessagesCount } = await supabase
      .from("ai_messages")
      .select("id", { count: "exact" })
      .eq("is_read", false);

    // Query pending founder approvals
    const { count: pendingApprovalsCount } = await supabase
      .from("founder_approvals")
      .select("id", { count: "exact" })
      .eq("status", "pending");

    // Merge static profiles with database telemetry
    const officers = Object.values(AI_OFFICERS).map((officer) => {
      const dbMatch = dbOfficers?.find((dbo) => dbo.name === officer.name);
      return {
        ...officer,
        status: dbMatch?.status || "active",
        lastActive: dbMatch?.updated_at || new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      orchestrator: "AMARA (ORCHESTRATOR-01)",
      officers,
      telemetry: {
        totalOfficers: officers.length,
        activeOfficers: officers.filter((o) => o.status === "active").length,
        pendingTasks: pendingTasksCount || 0,
        completedTasks: completedTasksCount || 0,
        unreadMessages: unreadMessagesCount || 0,
        pendingFounderApprovals: pendingApprovalsCount || 0,
      },
    });
  } catch (error) {
    console.error("Officer status API error:", error);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      orchestrator: "AMARA (ORCHESTRATOR-01)",
      officers: Object.values(AI_OFFICERS),
      telemetry: {
        totalOfficers: 7,
        activeOfficers: 7,
        pendingTasks: 0,
        completedTasks: 0,
        unreadMessages: 0,
        pendingFounderApprovals: 0,
      },
    });
  }
}
