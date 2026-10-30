import { getSupabaseServerClient } from "@/lib/supabase/server";
import { executeOfficerTask } from "@/lib/ai/orchestrator";
import {
  EnqueueTaskSchema,
  type EnqueueTaskInput,
} from "@/lib/autonomous/types";
import { requiresFounderApproval, type OfficerName } from "@/lib/ai/officers/definitions";
import type { TaskPriority, TaskStatus, AITask } from "@/types";

/**
 * Sanitizes text to prevent PII, raw journal reflections, or safety plan contents
 * from ever leaking into operational task logs or telemetry.
 */
export function sanitizeLogOutput(text: string): string {
  if (!text) return "";
  let sanitized = text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]")
    .replace(/(?:\+63|0)9(?:\d{9}|(?:[-\s]?\d{3}){2}[-\s]?\d{3,4}|\d{2}[-\s]?\d{3}[-\s]?\d{4}|[-\s\d]{9,13}\d)/g, "[REDACTED_PHONE]")
    .replace(/\b(?:1553|2919|02-8893-7603)\b/g, "$&"); // keep known emergency numbers

  if (sanitized.length > 500) {
    sanitized = sanitized.slice(0, 500) + "... [truncated]";
  }
  return sanitized;
}

/**
 * Enqueue a new AI Task with Zod validation and priority scheduling.
 */
export async function enqueueTask(input: EnqueueTaskInput): Promise<{
  success: boolean;
  taskId?: string;
  status: TaskStatus;
  requiresApproval: boolean;
  error?: string;
}> {
  const validated = EnqueueTaskSchema.parse(input);
  const supabase = getSupabaseServerClient();

  const officerNameMap: Record<string, OfficerName> = {
    "amara-orchestrator": "AMARA",
    "tala-moderator": "TALA",
    "gabay-crisis": "GABAY",
    "siklab-analyst": "SIKLAB",
    "dunong-librarian": "DUNONG",
    "kawing-referrals": "KAWING",
    "sinag-companion": "SINAG",
    AMARA: "AMARA",
    TALA: "TALA",
    GABAY: "GABAY",
    SIKLAB: "SIKLAB",
    DUNONG: "DUNONG",
    KAWING: "KAWING",
    SINAG: "SINAG",
  };

  const canonicalOfficer = officerNameMap[validated.officerId] || "AMARA";
  const needsApproval = requiresFounderApproval(
    validated.taskType,
    (validated.payload.risk_level as string) || validated.priority
  );

  const initialStatus: TaskStatus = needsApproval ? "awaiting_approval" : "pending";

  try {
    const { data, error } = await supabase
      .from("ai_tasks")
      .insert({
        officer_id: validated.officerId,
        task_type: validated.taskType,
        payload: validated.payload,
        priority: validated.priority,
        status: initialStatus,
        max_attempts: validated.maxAttempts,
        current_attempts: 0,
        requires_approval: needsApproval,
        scheduled_for: validated.scheduledFor || new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) throw error;

    // If approval required, create approval gate
    if (needsApproval && data) {
      await supabase.from("founder_approvals").insert({
        task_id: data.id,
        officer_requesting: canonicalOfficer,
        action_summary:
          (validated.payload.summary as string) ||
          `Autonomous task: ${validated.taskType} requires founder approval`,
        risk_level: validated.priority === "critical" ? "critical" : "high",
        action_payload: validated.payload,
        status: "pending",
      });
    }

    return {
      success: true,
      taskId: data?.id,
      status: initialStatus,
      requiresApproval: needsApproval,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to enqueue task";
    return {
      success: false,
      status: "failed",
      requiresApproval: false,
      error: msg,
    };
  }
}

/**
 * Atomically acquires the next highest-priority pending task.
 * Transitions status to 'in_progress' and increments current_attempts.
 */
export async function fetchNextPendingTask(officerId?: string): Promise<AITask | null> {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  // Priority order for ordering
  let query = supabase
    .from("ai_tasks")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_for", now)
    .order("priority", { ascending: false }) // critical > high > normal > low in schema enum
    .order("created_at", { ascending: true })
    .limit(1);

  if (officerId) {
    query = query.eq("officer_id", officerId);
  }

  const { data: candidates, error } = await query;
  if (error || !candidates || candidates.length === 0) {
    return null;
  }

  const candidate = candidates[0] as AITask;

  // Atomic lock: Transition to 'in_progress'
  const { data: locked, error: lockError } = await supabase
    .from("ai_tasks")
    .update({
      status: "in_progress",
      current_attempts: candidate.current_attempts + 1,
      updated_at: now,
    })
    .eq("id", candidate.id)
    .eq("status", "pending") // Guarantees optimistic concurrency lock
    .select("*")
    .maybeSingle();

  if (lockError || !locked) {
    // Another worker acquired the task
    return null;
  }

  return locked as AITask;
}

/**
 * Process a single task through AMARA Orchestrator with execution telemetry and backoff retry.
 */
export async function processTask(task: AITask): Promise<{
  success: boolean;
  status: TaskStatus;
  durationMs: number;
  output?: Record<string, unknown>;
  error?: string;
}> {
  const start = Date.now();
  const supabase = getSupabaseServerClient();

  const officerNameMap: Record<string, OfficerName> = {
    "amara-orchestrator": "AMARA",
    "tala-moderator": "TALA",
    "gabay-crisis": "GABAY",
    "siklab-analyst": "SIKLAB",
    "dunong-librarian": "DUNONG",
    "kawing-referrals": "KAWING",
    "sinag-companion": "SINAG",
    AMARA: "AMARA",
    TALA: "TALA",
    GABAY: "GABAY",
    SIKLAB: "SIKLAB",
    DUNONG: "DUNONG",
    KAWING: "KAWING",
    SINAG: "SINAG",
  };

  const canonicalOfficer = officerNameMap[task.officer_id] || "AMARA";
  let executionOutput: Record<string, unknown> = {};
  let executionError: string | undefined;

  try {
    const result = await executeOfficerTask({
      officerName: canonicalOfficer,
      taskType: task.task_type,
      payload: (task.payload as Record<string, unknown>) || {},
    });

    if (result.status === "failed") {
      throw new Error(result.error || "Officer reported execution failure");
    }

    executionOutput = result.data || {};
  } catch (err: unknown) {
    executionError = err instanceof Error ? err.message : String(err);
  }

  const durationMs = Date.now() - start;
  const isSuccess = !executionError;

  // Record attempt in ai_task_attempts
  try {
    await supabase.from("ai_task_attempts").insert({
      task_id: task.id,
      attempt_number: task.current_attempts,
      status: isSuccess ? "success" : "failure",
      error_message: executionError ? sanitizeLogOutput(executionError) : null,
      execution_duration_ms: durationMs,
      output_summary: sanitizeLogOutput(JSON.stringify(executionOutput)),
    });
  } catch (attErr) {
    console.warn("Could not record ai_task_attempt", attErr);
  }

  // Update task status and handle retry backoff
  if (isSuccess) {
    await supabase
      .from("ai_tasks")
      .update({
        status: "completed",
        error_log: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", task.id);

    return {
      success: true,
      status: "completed",
      durationMs,
      output: executionOutput,
    };
  }

  // Handle Failure & Exponential Backoff
  const nextAttemptNum = task.current_attempts; // already incremented on lock
  const hasRetriesLeft = nextAttemptNum < task.max_attempts;

  if (hasRetriesLeft) {
    // Exponential backoff: 15s * 2^(attempt - 1), max 1 hour
    const backoffSec = Math.min(Math.pow(2, nextAttemptNum - 1) * 15, 3600);
    const nextScheduled = new Date(Date.now() + backoffSec * 1000).toISOString();

    await supabase
      .from("ai_tasks")
      .update({
        status: "pending",
        scheduled_for: nextScheduled,
        error_log: sanitizeLogOutput(`Attempt ${nextAttemptNum} failed: ${executionError}. Retrying in ${backoffSec}s.`),
        updated_at: new Date().toISOString(),
      })
      .eq("id", task.id);

    return {
      success: false,
      status: "pending",
      durationMs,
      error: executionError,
    };
  }

  // Max attempts exhausted -> mark permanently failed / dead_letter
  const finalStatus: TaskStatus = task.priority === "critical" ? "dead_letter" : "failed";

  await supabase
    .from("ai_tasks")
    .update({
      status: finalStatus,
      error_log: sanitizeLogOutput(`All ${task.max_attempts} attempts failed. Final error: ${executionError}`),
      updated_at: new Date().toISOString(),
    })
    .eq("id", task.id);

  // Log critical error in system_events
  try {
    await supabase.from("system_events").insert({
      event_type: "task_exhausted",
      event_level: task.priority === "critical" ? "critical" : "error",
      source: `queue:${canonicalOfficer}`,
      message: `Task ${task.id} (${task.task_type}) exhausted ${task.max_attempts} attempts.`,
      metadata: { taskId: task.id, officer: canonicalOfficer, finalStatus },
    });
  } catch (evErr) {
    console.warn("Could not record system_event", evErr);
  }

  return {
    success: false,
    status: finalStatus,
    durationMs,
    error: executionError,
  };
}

/**
 * Detects and recovers tasks that were interrupted while 'in_progress'.
 * Resets them to 'pending' or marks them 'failed' if max attempts reached.
 */
export async function recoverStalledTasks(stalledMinutes = 10): Promise<{
  recoveredCount: number;
  failedCount: number;
}> {
  const supabase = getSupabaseServerClient();
  const threshold = new Date(Date.now() - stalledMinutes * 60 * 1000).toISOString();

  const { data: stalled, error } = await supabase
    .from("ai_tasks")
    .select("*")
    .eq("status", "in_progress")
    .lte("updated_at", threshold);

  if (error || !stalled || stalled.length === 0) {
    return { recoveredCount: 0, failedCount: 0 };
  }

  let recoveredCount = 0;
  let failedCount = 0;

  for (const t of stalled) {
    const task = t as AITask;
    if (task.current_attempts < task.max_attempts) {
      await supabase
        .from("ai_tasks")
        .update({
          status: "pending",
          error_log: `Stalled task recovered after ${stalledMinutes}m of inactivity.`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", task.id);
      recoveredCount++;
    } else {
      await supabase
        .from("ai_tasks")
        .update({
          status: "dead_letter",
          error_log: `Stalled task timed out after exceeding ${task.max_attempts} attempts.`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", task.id);
      failedCount++;
    }
  }

  return { recoveredCount, failedCount };
}

/**
 * Worker process batch runner: grabs and processes up to `batchSize` tasks.
 */
export async function processTaskQueueBatch(batchSize = 5, officerId?: string): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
  pendingRetries: number;
}> {
  let processed = 0;
  let succeeded = 0;
  let failed = 0;
  let pendingRetries = 0;

  for (let i = 0; i < batchSize; i++) {
    const task = await fetchNextPendingTask(officerId);
    if (!task) {
      // No more tasks ready for execution
      break;
    }

    processed++;
    const result = await processTask(task);
    if (result.success) {
      succeeded++;
    } else if (result.status === "pending") {
      pendingRetries++;
    } else {
      failed++;
    }
  }

  return { processed, succeeded, failed, pendingRetries };
}
