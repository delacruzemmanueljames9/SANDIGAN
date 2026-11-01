import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  pauseScheduledJob,
  resumeScheduledJob,
  executeScheduledJob,
  seedDefaultJobsIfEmpty,
} from "@/lib/autonomous/scheduler";
import { UpdateJobStatusSchema } from "@/lib/autonomous/types";
import { z } from "zod";
import type { ScheduledJob } from "@/types";
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

    // Ensure baseline jobs are present
    await seedDefaultJobsIfEmpty();

    const { data: jobs, error } = await supabase
      .from("scheduled_jobs")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, jobs: jobs || [] });
  } catch (error) {
    console.error("HQ Jobs GET error:", error);
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { jobId, action } = UpdateJobStatusSchema.parse(body);

    if (action === "pause") {
      const ok = await pauseScheduledJob(jobId);
      return NextResponse.json({ success: ok, action: "paused" });
    }

    if (action === "resume") {
      const ok = await resumeScheduledJob(jobId);
      return NextResponse.json({ success: ok, action: "resumed" });
    }

    if (action === "trigger") {
      const { data: job } = await supabase
        .from("scheduled_jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      const execResult = await executeScheduledJob(job as ScheduledJob, true);
      return NextResponse.json({ success: execResult.success, action: "triggered", result: execResult });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("HQ Jobs POST error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
