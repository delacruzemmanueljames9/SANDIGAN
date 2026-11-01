import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { routeInterOfficerMessage } from "@/lib/autonomous/coordination";
import { type OfficerName } from "@/lib/ai/officers/definitions";
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
    const search = searchParams.get("q");
    const fromOfficer = searchParams.get("from");
    const toOfficer = searchParams.get("to");
    const messageType = searchParams.get("type");

    let query = supabase
      .from("ai_messages")
      .select("id, from_officer, to_officer, message_type, subject, body, payload, is_read, created_at")
      .order("created_at", { ascending: false });

    if (fromOfficer && fromOfficer !== "all") {
      query = query.eq("from_officer", fromOfficer);
    }
    if (toOfficer && toOfficer !== "all") {
      query = query.eq("to_officer", toOfficer);
    }
    if (messageType && messageType !== "all") {
      query = query.eq("message_type", messageType);
    }
    if (search && search.trim().length > 0) {
      query = query.or(`subject.ilike.%${search.trim()}%,body.ilike.%${search.trim()}%`);
    }

    const { data: messages, error: fetchError } = await query.limit(60);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Compute officer participation matrix
    const participation: Record<string, { sent: number; received: number; lastActive: string | null }> = {
      AMARA: { sent: 0, received: 0, lastActive: null },
      TALA: { sent: 0, received: 0, lastActive: null },
      GABAY: { sent: 0, received: 0, lastActive: null },
      SIKLAB: { sent: 0, received: 0, lastActive: null },
      DUNONG: { sent: 0, received: 0, lastActive: null },
      KAWING: { sent: 0, received: 0, lastActive: null },
      SINAG: { sent: 0, received: 0, lastActive: null },
    };

    (messages || []).forEach((msg) => {
      if (participation[msg.from_officer]) {
        participation[msg.from_officer].sent += 1;
        if (!participation[msg.from_officer].lastActive) {
          participation[msg.from_officer].lastActive = msg.created_at;
        }
      }
      if (participation[msg.to_officer]) {
        participation[msg.to_officer].received += 1;
        if (!participation[msg.to_officer].lastActive) {
          participation[msg.to_officer].lastActive = msg.created_at;
        }
      }
    });

    return NextResponse.json({
      success: true,
      messages: messages || [],
      participation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("HQ Messages GET error:", error);
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
    const { action, messageId, fromOfficer, toOfficer, messageType, subject, messageBody, payload } = body;

    // Action 1: Mark message as read
    if (action === "mark_read") {
      if (!messageId) {
        return NextResponse.json({ error: "messageId required" }, { status: 400 });
      }
      const { error } = await supabase
        .from("ai_messages")
        .update({ is_read: true })
        .eq("id", messageId);
      if (error) throw error;
      return NextResponse.json({ success: true, messageId });
    }

    // Action 2: Route inter-officer message
    if (!fromOfficer || !toOfficer || !subject || !messageBody) {
      return NextResponse.json(
        { error: "fromOfficer, toOfficer, subject, and messageBody are required" },
        { status: 400 }
      );
    }

    const result = await routeInterOfficerMessage({
      fromOfficer: fromOfficer as OfficerName,
      toOfficer: toOfficer as OfficerName,
      messageType: messageType || "coordination",
      subject,
      body: messageBody,
      payload: payload || {},
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Message routing failed", quarantined: result.quarantined },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error("HQ Messages POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
