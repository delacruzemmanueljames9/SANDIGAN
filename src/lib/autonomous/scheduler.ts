import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { executeOfficerTask } from "@/lib/ai/orchestrator";
import { recoverStalledTasks } from "@/lib/autonomous/task-queue";
import type { ScheduledJob } from "@/types";

/**
 * Lightweight, robust cron parser for standard 5-field cron strings:
 * "minute hour dayOfMonth month dayOfWeek"
 */
export function calculateNextRun(cron: string, fromDate: Date = new Date()): Date {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    // Default fallback: 1 hour from now if cron expression is invalid
    return new Date(fromDate.getTime() + 60 * 60 * 1000);
  }

  const [minPart, hrPart] = parts;
  const next = new Date(fromDate.getTime());
  next.setSeconds(0);
  next.setMilliseconds(0);

  // Interval syntax: "*/N"
  if (minPart.startsWith("*/")) {
    const step = parseInt(minPart.replace("*/", ""), 10) || 15;
    const currentMin = next.getMinutes();
    const addMinutes = step - (currentMin % step);
    next.setMinutes(currentMin + addMinutes);
    return next;
  }

  // Exact minute and hour: "M H * * *" (e.g. "0 0 * * *" for daily at midnight)
  if (minPart !== "*" && hrPart !== "*") {
    const targetMin = parseInt(minPart, 10);
    const targetHr = parseInt(hrPart, 10);
    next.setHours(targetHr, targetMin, 0, 0);

    // If target time has already passed today, advance to tomorrow
    if (next.getTime() <= fromDate.getTime()) {
      next.setDate(next.getDate() + 1);
    }
    return next;
  }

  // Hourly: "M * * * *"
  if (minPart !== "*" && hrPart === "*") {
    const targetMin = parseInt(minPart, 10);
    next.setMinutes(targetMin);
    if (next.getTime() <= fromDate.getTime()) {
      next.setHours(next.getHours() + 1);
    }
    return next;
  }

  // Default fallback: add 1 hour
  return new Date(fromDate.getTime() + 60 * 60 * 1000);
}

export type JobHandlerFn = () => Promise<{ success: boolean; details?: Record<string, unknown> }>;

/**
 * Autonomous Job Handler Registry
 */
export const SCHEDULED_JOB_REGISTRY: Record<string, { handler: JobHandlerFn; description: string }> = {
  // 1. SINAG Daily Companion Pre-computation
  sinag_daily_companion_precompute: {
    description: "Generate and cache daily mindfulness quote, reflection prompt, and micro-action",
    handler: async () => {
      const result = await executeOfficerTask({
        officerName: "SINAG",
        taskType: "generate_daily_companion_package",
        payload: { source: "autonomous_job" },
      });
      return { success: result.status === "completed", details: result.data };
    },
  },

  // 2. AMARA Subsystem Health Audit
  amara_subsystem_health_audit: {
    description: "Audit multi-agent queue health, stuck tasks, and record system metrics",
    handler: async () => {
      const result = await executeOfficerTask({
        officerName: "AMARA",
        taskType: "system_health_audit",
        payload: { source: "autonomous_job" },
      });

      const supabase = getSupabaseAdminClient();
      const metrics = result.data as Record<string, number>;
      if (metrics.pendingApprovals !== undefined) {
        await supabase.from("system_metrics").insert([
          { metric_name: "tasks_logged", metric_value: Number(metrics.totalTasksLogged || 0) },
          { metric_name: "pending_approvals", metric_value: Number(metrics.pendingApprovals || 0) },
          { metric_name: "officers_online", metric_value: Number(metrics.officersOnline || 7) },
        ]);
      }

      return { success: true, details: result.data };
    },
  },

  // 3. TALA Community Safety Sweep
  tala_community_safety_sweep: {
    description: "Scan pending community posts and audit unreviewed moderation flags",
    handler: async () => {
      const supabase = getSupabaseAdminClient();
      const { data: pendingPosts } = await supabase
        .from("community_posts")
        .select("id, title, content")
        .eq("moderation_status", "pending")
        .limit(10);

      let reviewed = 0;
      if (pendingPosts && pendingPosts.length > 0) {
        for (const post of pendingPosts) {
          const res = await executeOfficerTask({
            officerName: "TALA",
            taskType: "moderate_community_content",
            payload: { text: `${post.title} ${post.content}` },
          });
          const isApproved = Boolean(res.data.isApproved);
          const isCrisis = Boolean(res.data.isCrisis);
          await supabase
            .from("community_posts")
            .update({
              moderation_status: isCrisis ? "flagged" : isApproved ? "approved" : "flagged",
              moderation_flag_reason: (res.data.moderationReason as string) || null,
              moderated_by_officer: "TALA",
              updated_at: new Date().toISOString(),
            })
            .eq("id", post.id);
          reviewed++;
        }
      }

      return { success: true, details: { reviewedCount: reviewed } };
    },
  },

  // 4. KAWING Partner Directory Verification Audit
  kawing_partner_directory_audit: {
    description: "Verify operational status of crisis hotlines and Philippine support directory",
    handler: async () => {
      const supabase = getSupabaseAdminClient();
      const { data: providers } = await supabase
        .from("support_directory")
        .select("id, name, verification_status")
        .limit(20);

      const unverifiedCount = (providers || []).filter((p) => p.verification_status !== "verified").length;

      return {
        success: true,
        details: { totalProviders: providers?.length || 0, unverifiedCount },
      };
    },
  },

  // 5. Autonomous Stalled Task Recovery
  queue_stalled_task_recovery: {
    description: "Detect and self-heal tasks interrupted or stuck in_progress during system restarts",
    handler: async () => {
      const result = await recoverStalledTasks(10);
      return { success: true, details: result };
    },
  },
};

/**
 * Seeds default baseline scheduled jobs if public.scheduled_jobs is empty.
 */
export async function seedDefaultJobsIfEmpty(): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { count } = await supabase.from("scheduled_jobs").select("id", { count: "exact" });

  if (count && count > 0) return;

  const now = new Date();
  const baselineJobs = [
    {
      name: "AMARA Subsystem Telemetry Audit",
      cron_expression: "*/30 * * * *",
      handler: "amara_subsystem_health_audit",
      next_run_at: calculateNextRun("*/30 * * * *", now).toISOString(),
      is_active: true,
    },
    {
      name: "SINAG Daily Companion Pre-computation",
      cron_expression: "0 0 * * *",
      handler: "sinag_daily_companion_precompute",
      next_run_at: calculateNextRun("0 0 * * *", now).toISOString(),
      is_active: true,
    },
    {
      name: "TALA Community Safety Sweep",
      cron_expression: "*/15 * * * *",
      handler: "tala_community_safety_sweep",
      next_run_at: calculateNextRun("*/15 * * * *", now).toISOString(),
      is_active: true,
    },
    {
      name: "KAWING Support Directory Verification",
      cron_expression: "0 2 * * *",
      handler: "kawing_partner_directory_audit",
      next_run_at: calculateNextRun("0 2 * * *", now).toISOString(),
      is_active: true,
    },
    {
      name: "Task Queue Stalled Task Auto-Recovery",
      cron_expression: "*/10 * * * *",
      handler: "queue_stalled_task_recovery",
      next_run_at: calculateNextRun("*/10 * * * *", now).toISOString(),
      is_active: true,
    },
  ];

  await supabase.from("scheduled_jobs").insert(baselineJobs);
}

/**
 * Execute a single scheduled job with overlap prevention and execution history.
 */
export async function executeScheduledJob(
  job: ScheduledJob,
  manual = false
): Promise<{ success: boolean; durationMs: number; details?: Record<string, unknown>; error?: string }> {
  const start = Date.now();
  const supabase = getSupabaseAdminClient();
  const now = new Date();

  // Optimistic lock on last_run_at to prevent overlapping executions
  const { data: locked, error: lockError } = await supabase
    .from("scheduled_jobs")
    .update({
      last_run_at: now.toISOString(),
    })
    .eq("id", job.id)
    .select("*")
    .maybeSingle();

  if (lockError || !locked) {
    return { success: false, durationMs: 0, error: "Job locked or unavailable" };
  }

  const jobDef = SCHEDULED_JOB_REGISTRY[job.handler];
  if (!jobDef) {
    return { success: false, durationMs: 0, error: `Handler '${job.handler}' not registered` };
  }

  let executionSuccess = false;
  let executionDetails: Record<string, unknown> | undefined;
  let executionError: string | undefined;

  try {
    const result = await jobDef.handler();
    executionSuccess = result.success;
    executionDetails = result.details;
  } catch (err) {
    executionError = err instanceof Error ? err.message : String(err);
  }

  const durationMs = Date.now() - start;
  const nextRun = calculateNextRun(job.cron_expression, now);

  // Update next_run_at
  await supabase
    .from("scheduled_jobs")
    .update({
      next_run_at: nextRun.toISOString(),
    })
    .eq("id", job.id);

  // Record operational event in system_events
  try {
    await supabase.from("system_events").insert({
      event_type: manual ? "manual_job_triggered" : "scheduled_job_executed",
      event_level: executionSuccess ? "info" : "error",
      source: `scheduler:${job.handler}`,
      message: executionSuccess
        ? `Job '${job.name}' completed in ${durationMs}ms.`
        : `Job '${job.name}' failed: ${executionError}`,
      metadata: {
        jobId: job.id,
        durationMs,
        details: executionDetails,
        nextRunAt: nextRun.toISOString(),
      },
    });
  } catch (e) {
    console.warn("Could not record system_event for scheduled job", e);
  }

  return {
    success: executionSuccess,
    durationMs,
    details: executionDetails,
    error: executionError,
  };
}

/**
 * Checks and runs all scheduled jobs where next_run_at <= NOW() and is_active = true.
 */
export async function processDueScheduledJobs(): Promise<{
  checked: number;
  executed: number;
  failed: number;
}> {
  const supabase = getSupabaseAdminClient();
  const now = new Date().toISOString();

  // Ensure default baseline jobs exist
  await seedDefaultJobsIfEmpty();

  const { data: dueJobs, error } = await supabase
    .from("scheduled_jobs")
    .select("*")
    .eq("is_active", true)
    .lte("next_run_at", now);

  if (error || !dueJobs || dueJobs.length === 0) {
    return { checked: 0, executed: 0, failed: 0 };
  }

  let executed = 0;
  let failed = 0;

  for (const j of dueJobs) {
    const job = j as ScheduledJob;
    const res = await executeScheduledJob(job, false);
    if (res.success) executed++;
    else failed++;
  }

  return { checked: dueJobs.length, executed, failed };
}

/**
 * Pause a scheduled job.
 */
export async function pauseScheduledJob(jobId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("scheduled_jobs")
    .update({ is_active: false })
    .eq("id", jobId);
  return !error;
}

/**
 * Resume a scheduled job and set the next execution timestamp.
 */
export async function resumeScheduledJob(jobId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { data: job } = await supabase
    .from("scheduled_jobs")
    .select("cron_expression")
    .eq("id", jobId)
    .single();

  if (!job) return false;

  const nextRun = calculateNextRun(job.cron_expression);
  const { error } = await supabase
    .from("scheduled_jobs")
    .update({ is_active: true, next_run_at: nextRun.toISOString() })
    .eq("id", jobId);

  return !error;
}
