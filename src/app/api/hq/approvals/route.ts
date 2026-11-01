import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { verifyFounderOrAdmin } from "@/lib/auth/admin-auth";

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

    const isAuthorized = await verifyFounderOrAdmin(user, supabase);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden: Founder access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") || "all";

    let query = supabase
      .from("founder_approvals")
      .select("id, task_id, officer_requesting, action_summary, risk_level, action_payload, status, decision_notes, decided_at, created_at")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all" && ["pending", "approved", "rejected"].includes(statusFilter)) {
      query = query.eq("status", statusFilter);
    }

    const { data: approvals, error: fetchError } = await query.limit(50);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      approvals: approvals || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("HQ Approvals GET error:", error);
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

    const isAuthorized = await verifyFounderOrAdmin(user, supabase);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden: Founder access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { approvalId, decision, decisionNotes } = body;

    if (!approvalId || !["approved", "rejected"].includes(decision)) {
      return NextResponse.json(
        { error: "approvalId and valid decision ('approved' | 'rejected') required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // 1. Update founder_approvals
    const { data: updatedApproval, error: updateError } = await supabase
      .from("founder_approvals")
      .update({
        status: decision,
        decision_notes: decisionNotes || `Decision made by ${user.email}`,
        decided_at: now,
      })
      .eq("id", approvalId)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 2. If approval had an associated task_id, update task status
    if (updatedApproval?.task_id) {
      await supabase
        .from("ai_tasks")
        .update({
          status: decision === "approved" ? "pending" : "failed",
          error_log: decision === "rejected" ? "Rejected by founder approval." : null,
          updated_at: now,
        })
        .eq("id", updatedApproval.task_id);
    }

    return NextResponse.json({ success: true, approval: updatedApproval });
  } catch (error) {
    console.error("HQ Approvals API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
