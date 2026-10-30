"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import {
  Clock,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Calendar,
} from "lucide-react";
import type { ScheduledJob } from "@/types";

interface JobsManagerTabProps {
  jobs: ScheduledJob[];
  onRefresh: () => Promise<void>;
}

export function JobsManagerTab({ jobs, onRefresh }: JobsManagerTabProps) {
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const handleJobAction = async (jobId: string, action: "pause" | "resume" | "trigger") => {
    setActionLoading(`${jobId}:${action}`);
    try {
      const res = await fetch("/api/hq/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, action }),
      });
      if (!res.ok) throw new Error("Job action failed");
      await onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error executing job action");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sandigan-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold font-manrope text-sandigan-navy-900">
            Autonomous Scheduled Jobs Manager
          </h2>
          <p className="text-xs text-sandigan-navy-600">
            Cron-driven background automation workers backed by public.scheduled_jobs. Overlap-protected with atomic locks.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onRefresh} className="text-xs gap-1.5 h-8">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Jobs
        </Button>
      </div>

      {/* 2. Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => {
          const isTriggering = actionLoading === `${job.id}:trigger`;
          const isToggling = actionLoading === `${job.id}:pause` || actionLoading === `${job.id}:resume`;

          return (
            <Card key={job.id} className="border-sandigan-navy-200 bg-white shadow-xs">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold font-manrope text-sandigan-navy-900">
                      {job.name}
                    </h3>
                    <div className="font-mono text-xs text-sandigan-teal-700 bg-sandigan-teal-50 px-2 py-0.5 rounded inline-block">
                      {job.handler}
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      job.is_active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-sandigan-navy-100 text-sandigan-navy-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        job.is_active ? "bg-emerald-500 animate-pulse" : "bg-sandigan-navy-400"
                      }`}
                    />
                    {job.is_active ? "Active" : "Paused"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-sandigan-navy-600 bg-sandigan-navy-50/70 p-3 rounded-xl border border-sandigan-navy-100">
                  <div>
                    <span className="text-[10px] text-sandigan-navy-400 block uppercase font-bold">
                      Cron Schedule
                    </span>
                    <span className="font-mono font-semibold text-sandigan-navy-900">
                      {job.cron_expression}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-sandigan-navy-400 block uppercase font-bold">
                      Next Calculated Run
                    </span>
                    <span className="font-mono text-sandigan-navy-700">
                      {job.next_run_at ? new Date(job.next_run_at).toLocaleTimeString() : "Pending"}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-sandigan-navy-200/50">
                    <span className="text-[10px] text-sandigan-navy-400 block uppercase font-bold">
                      Last Executed
                    </span>
                    <span className="font-mono text-sandigan-navy-700">
                      {job.last_run_at ? new Date(job.last_run_at).toLocaleString() : "Never (Pending first run)"}
                    </span>
                  </div>
                </div>

                {/* Founder Action Controls */}
                <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                  {job.is_active ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isToggling}
                      onClick={() => handleJobAction(job.id, "pause")}
                      className="text-xs h-8 border-sandigan-navy-200 text-sandigan-navy-700 hover:bg-sandigan-navy-100 gap-1"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause Job
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isToggling}
                      onClick={() => handleJobAction(job.id, "resume")}
                      className="text-xs h-8 border-emerald-300 text-emerald-800 hover:bg-emerald-50 gap-1"
                    >
                      <Play className="w-3.5 h-3.5" /> Resume Job
                    </Button>
                  )}

                  <Button
                    size="sm"
                    disabled={isTriggering}
                    onClick={() => handleJobAction(job.id, "trigger")}
                    className="bg-sandigan-navy-900 hover:bg-sandigan-navy-800 text-white text-xs h-8 px-3 gap-1 shadow-xs"
                  >
                    {isTriggering ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                    Run Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
