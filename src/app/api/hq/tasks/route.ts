import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const TaskActionSchema = z.object({
  taskId: z.string().uuid("Invalid task ID"),
  action: z.enum(["retry", "cancel"]),
});

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
    const status = searchParams.get("status");
    const officerId = searchParams.get("officerId");
    const priority = searchParams.get("priority");

    let query = supabase
      .from("ai_tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (status) query = query.eq("status", status);
    if (officerId) query = query.eq("officer_id", officerId);
    if (priority) query = query.eq("priority", priority);

    const { data: tasks, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, tasks: tasks || [] });
  } catch (error) {
    console.error("HQ Tasks GET error:", error);
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { taskId, action } = TaskActionSchema.parse(body);

    const now = new Date().toISOString();

    if (action === "retry") {
      const { data: updated, error } = await supabase
        .from("ai_tasks")
        .update({
          status: "pending",
          scheduled_for: now,
          error_log: null,
          updated_at: now,
        })
        .eq("id", taskId)
        .select("*")
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, action: "retried", task: updated });
    }

    if (action === "cancel") {
      const { data: updated, error } = await supabase
        .from("ai_tasks")
        .update({
          status: "dead_letter",
          error_log: `Manually canceled by founder (${user.email})`,
          updated_at: now,
        })
        .eq("id", taskId)
        .select("*")
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, action: "canceled", task: updated });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    console.error("HQ Tasks POST error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
