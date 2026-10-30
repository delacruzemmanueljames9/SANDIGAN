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
  Layers,
  RefreshCw,
  Play,
  RotateCcw,
  XCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
} from "lucide-react";
import type { AITask, AITaskAttempt } from "@/types";

interface QueueManagerTabProps {
  tasks: AITask[];
  attempts: AITaskAttempt[];
  taskCounts: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
    dead_letter: number;
    awaiting_approval: number;
    total: number;
  } | null;
  queueProcessing: boolean;
  onProcessQueue: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function QueueManagerTab({
  tasks,
  attempts,
  taskCounts,
  queueProcessing,
  onProcessQueue,
  onRefresh,
}: QueueManagerTabProps) {
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [expandedPayloads, setExpandedPayloads] = React.useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "all") return true;
    return t.status === filterStatus;
  });

  const togglePayload = (id: string) => {
    setExpandedPayloads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTaskAction = async (taskId: string, action: "retry" | "cancel") => {
    setActionLoading(taskId);
    try {
      const res = await fetch("/api/hq/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, action }),
      });
      if (!res.ok) throw new Error("Failed to execute task action");
      await onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error executing task action");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Run Batch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sandigan-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold font-manrope text-sandigan-navy-900">
            Autonomous Task Queue Engine
          </h2>
          <p className="text-xs text-sandigan-navy-600">
            Priority-based queue worker with optimistic concurrency locks, exponential backoff, and stalled task recovery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onRefresh} className="text-xs gap-1.5 h-9">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>

          <Button
            size="sm"
            onClick={onProcessQueue}
            disabled={queueProcessing}
            className="bg-sandigan-teal-600 hover:bg-sandigan-teal-500 text-white text-xs font-semibold h-9 px-4 shadow-sm gap-1.5"
          >
            {queueProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing Queue...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Process Queue Batch
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 2. Queue Distribution Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-center text-xs">
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <div className="text-amber-700 font-semibold text-[11px]">Pending</div>
          <div className="text-xl font-bold text-amber-900 font-manrope mt-1">
            {taskCounts?.pending || 0}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
          <div className="text-blue-700 font-semibold text-[11px]">In Progress</div>
          <div className="text-xl font-bold text-blue-900 font-manrope mt-1">
            {taskCounts?.in_progress || 0}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="text-emerald-700 font-semibold text-[11px]">Completed</div>
          <div className="text-xl font-bold text-emerald-900 font-manrope mt-1">
            {taskCounts?.completed || 0}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
          <div className="text-rose-700 font-semibold text-[11px]">Failed</div>
          <div className="text-xl font-bold text-rose-900 font-manrope mt-1">
            {taskCounts?.failed || 0}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
          <div className="text-purple-700 font-semibold text-[11px]">Dead Letter</div>
          <div className="text-xl font-bold text-purple-900 font-manrope mt-1">
            {taskCounts?.dead_letter || 0}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200">
          <div className="text-yellow-700 font-semibold text-[11px]">Awaiting Approval</div>
          <div className="text-xl font-bold text-yellow-900 font-manrope mt-1">
            {taskCounts?.awaiting_approval || 0}
          </div>
        </div>
      </div>

      {/* 3. Task Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-sandigan-navy-200 bg-white text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sandigan-navy-700">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-8 rounded-lg border border-sandigan-navy-200 bg-white px-2.5 text-xs text-sandigan-navy-900 font-mono"
          >
            <option value="all">All Statuses ({tasks.length})</option>
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="completed">completed</option>
            <option value="failed">failed</option>
            <option value="dead_letter">dead_letter</option>
            <option value="awaiting_approval">awaiting_approval</option>
          </select>
        </div>

        <span className="text-sandigan-navy-500 font-mono text-[11px]">
          Showing {filteredTasks.length} tasks
        </span>
      </div>

      {/* 4. Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center border rounded-xl bg-white text-xs text-sandigan-navy-400">
            No tasks found matching current filter.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = !!expandedPayloads[task.id];
            const isLoading = actionLoading === task.id;

            return (
              <Card key={task.id} className="border-sandigan-navy-200 bg-white shadow-xs">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sandigan-navy-100 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-sandigan-navy-900 font-manrope text-xs">
                        {task.task_type}
                      </span>
                      <Badge
                        variant="neutral"
                        className={`text-[10px] uppercase font-mono font-bold ${
                          task.status === "completed"
                            ? "bg-emerald-600 text-white"
                            : task.status === "failed" || task.status === "dead_letter"
                            ? "bg-rose-600 text-white"
                            : task.status === "in_progress"
                            ? "bg-blue-600 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {task.status}
                      </Badge>
                      <span className="text-sandigan-navy-400">•</span>
                      <span className="font-mono text-sandigan-navy-600 text-[11px]">
                        Officer: {task.officer_id}
                      </span>
                      <span className="text-sandigan-navy-400">•</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        Priority: {task.priority}
                      </Badge>
                    </div>

                    <div className="text-[11px] text-sandigan-navy-400 font-mono">
                      Attempts: {task.current_attempts}/{task.max_attempts} • Created:{" "}
                      {new Date(task.created_at).toLocaleString()}
                    </div>
                  </div>

                  {/* Error Log if Present */}
                  {task.status === "failed" && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono">
                      <span className="font-bold">Error Log: </span>
                      {(task as any).error_log || "Task failed execution."}
                    </div>
                  )}

                  {/* Payload toggle & actions */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePayload(task.id)}
                      className="text-[11px] text-sandigan-navy-500 h-6 px-2 gap-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3" /> Hide Payload
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" /> View Payload
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-2">
                      {["failed", "dead_letter"].includes(task.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => handleTaskAction(task.id, "retry")}
                          className="text-xs h-7 border-amber-300 text-amber-800 hover:bg-amber-50 gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Retry Task
                        </Button>
                      )}

                      {["pending", "in_progress", "awaiting_approval"].includes(task.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => handleTaskAction(task.id, "cancel")}
                          className="text-xs h-7 border-rose-300 text-rose-700 hover:bg-rose-50 gap-1"
                        >
                          <XCircle className="w-3 h-3" /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Payload Viewer */}
                  {isExpanded && task.payload && (
                    <div className="p-3 rounded-lg bg-sandigan-navy-900 text-sandigan-teal-300 font-mono text-[11px] overflow-x-auto">
                      <pre>{JSON.stringify(task.payload, null, 2)}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
