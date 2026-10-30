#!/usr/bin/env tsx
/**
 * PROJECT SANDIGAN — Autonomous Worker
 * Local / CI runner for the task queue and scheduled job engine.
 *
 * Usage:
 *   npm run worker                  # uses .env.local
 *   WORKER_ONCE=true npm run worker # run once then exit (e.g. in CI)
 *
 * The worker calls the queue-process API endpoint using CRON_SECRET so it
 * does NOT need a Supabase session. The API endpoint validates the secret.
 *
 * Environment variables required:
 *   NEXT_PUBLIC_APP_URL  — base URL of the running Next.js app
 *   CRON_SECRET          — must match the value configured on the server
 *
 * Environment variables optional:
 *   WORKER_BATCH_SIZE    — tasks per cycle (default: 5)
 *   WORKER_INTERVAL_MS   — milliseconds between cycles (default: 30000)
 *   WORKER_ONCE          — if "true", run one cycle then exit
 */

import fs from "fs";
import path from "path";

// Load environment variables from .env.local and .env
function loadEnvFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET;
const BATCH_SIZE = parseInt(process.env.WORKER_BATCH_SIZE ?? "5", 10);
const INTERVAL_MS = parseInt(process.env.WORKER_INTERVAL_MS ?? "30000", 10);
const RUN_ONCE = process.env.WORKER_ONCE === "true";

if (!CRON_SECRET) {
  console.error(
    "[Worker] FATAL: CRON_SECRET is not set. " +
      "The queue endpoint will reject unauthenticated requests. " +
      "Set CRON_SECRET in .env.local and try again."
  );
  process.exit(1);
}

const QUEUE_ENDPOINT = `${APP_URL}/api/hq/queue/process`;

interface WorkerCycleResult {
  success: boolean;
  caller?: string;
  timestamp?: string;
  queue?: {
    processed: number;
    failed: number;
    retried: number;
  };
  scheduledJobs?: {
    triggered: number;
    skipped: number;
  };
  error?: string;
}

async function runCycle(): Promise<void> {
  const cycleStart = Date.now();

  console.log(
    `[Worker] ${new Date().toISOString()} — Starting cycle (batch=${BATCH_SIZE})`
  );

  try {
    const response = await fetch(QUEUE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CRON_SECRET}`,
      },
      body: JSON.stringify({ batchSize: BATCH_SIZE }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(
        `[Worker] HTTP ${response.status} from queue endpoint: ${text}`
      );
      return;
    }

    const result: WorkerCycleResult = await response.json();

    if (!result.success) {
      console.error(`[Worker] Queue endpoint reported failure:`, result.error);
      return;
    }

    const duration = Date.now() - cycleStart;
    const q = result.queue ?? { processed: 0, failed: 0, retried: 0 };
    const j = result.scheduledJobs ?? { triggered: 0, skipped: 0 };

    console.log(
      `[Worker] Cycle complete in ${duration}ms — ` +
        `Tasks: processed=${q.processed} failed=${q.failed} retried=${q.retried} | ` +
        `Jobs: triggered=${j.triggered} skipped=${j.skipped}`
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[Worker] Network error calling ${QUEUE_ENDPOINT}: ${message}`
    );
    console.error(
      `[Worker] Is the Next.js dev server running at ${APP_URL}?`
    );
  }
}

async function main(): Promise<void> {
  console.log(`[Worker] PROJECT SANDIGAN Autonomous Worker starting…`);
  console.log(`[Worker] Target: ${QUEUE_ENDPOINT}`);
  console.log(`[Worker] Mode:   ${RUN_ONCE ? "single run" : `every ${INTERVAL_MS / 1000}s`}`);
  console.log(`[Worker] Batch:  ${BATCH_SIZE} tasks/cycle`);

  await runCycle();

  if (RUN_ONCE) {
    console.log("[Worker] WORKER_ONCE=true — exiting after single cycle.");
    process.exit(0);
  }

  // Recurring mode: run on interval until terminated
  const timer = setInterval(async () => {
    await runCycle();
  }, INTERVAL_MS);

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`\n[Worker] Received ${signal}. Shutting down…`);
    clearInterval(timer);
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("[Worker] Unhandled error:", err);
  process.exit(1);
});
