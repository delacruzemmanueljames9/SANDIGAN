import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { processTaskQueueBatch } from "@/lib/autonomous/task-queue";
import { processDueScheduledJobs } from "@/lib/autonomous/scheduler";
import { ProcessQueueBatchSchema } from "@/lib/autonomous/types";
import { verifyFounderOrAdmin } from "@/lib/auth/admin-auth";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────
// Authentication helpers
// This endpoint accepts two valid caller types:
//   1. Vercel Cron / autonomous worker — via CRON_SECRET in Authorization header
//   2. Founder / admin — via Supabase session cookie (browser HQ dashboard)
// ─────────────────────────────────────────────────────────────────────

function isCronRequest(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization") ?? "";
  if (authHeader === `Bearer ${cronSecret}`) return true;

  // Alternate header used by autonomous-worker.ts
  const cronHeader = req.headers.get("x-cron-secret") ?? "";
  return cronHeader === cronSecret;
}

async function handleQueueProcess(req: Request) {
  try {
    // ── Path 1: Machine caller authenticated via CRON_SECRET ──────────
    if (isCronRequest(req)) {
      let batchSize = 5;
      let officerId: string | undefined;

      if (req.method === "POST") {
        try {
          const body = await req.json();
          const validated = ProcessQueueBatchSchema.parse(body);
          batchSize = validated.batchSize;
          officerId = validated.officerId;
        } catch {
          // Use defaults if body is empty or invalid
        }
      } else if (req.method === "GET") {
        const url = new URL(req.url);
        const queryBatchSize = url.searchParams.get("batchSize");
        const queryOfficerId = url.searchParams.get("officerId");
        if (queryBatchSize) {
          const parsed = parseInt(queryBatchSize, 10);
          if (!isNaN(parsed) && parsed > 0 && parsed <= 50) batchSize = parsed;
        }
        if (queryOfficerId) {
          officerId = queryOfficerId;
        }
      }

      const queueResult = await processTaskQueueBatch(batchSize, officerId);
      const jobsResult = await processDueScheduledJobs();

      return NextResponse.json({
        success: true,
        caller: "cron",
        method: req.method,
        timestamp: new Date().toISOString(),
        queue: queueResult,
        scheduledJobs: jobsResult,
      });
    }

    // ── Path 2: Human caller authenticated via Supabase session ───────
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

    let batchSize = 5;
    let officerId: string | undefined;

    if (req.method === "POST") {
      try {
        const body = await req.json();
        const validated = ProcessQueueBatchSchema.parse(body);
        batchSize = validated.batchSize;
        officerId = validated.officerId;
      } catch {
        // Use defaults if empty body
      }
    } else if (req.method === "GET") {
      const url = new URL(req.url);
      const queryBatchSize = url.searchParams.get("batchSize");
      const queryOfficerId = url.searchParams.get("officerId");
      if (queryBatchSize) {
        const parsed = parseInt(queryBatchSize, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 50) batchSize = parsed;
      }
      if (queryOfficerId) {
        officerId = queryOfficerId;
      }
    }

    // 1. Process pending task batch
    const queueResult = await processTaskQueueBatch(batchSize, officerId);

    // 2. Process any due scheduled jobs
    const jobsResult = await processDueScheduledJobs();

    return NextResponse.json({
      success: true,
      caller: "founder",
      method: req.method,
      timestamp: new Date().toISOString(),
      queue: queueResult,
      scheduledJobs: jobsResult,
    });
  } catch (error) {
    console.error("Queue process API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Vercel Cron triggers GET requests; manual and automated workers use POST or GET
export async function GET(req: Request) {
  return handleQueueProcess(req);
}

export async function POST(req: Request) {
  return handleQueueProcess(req);
}
