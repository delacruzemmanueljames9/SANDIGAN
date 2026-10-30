"use client";

import * as React from "react";
import Link from "next/link";
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
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  AlertOctagon,
  Play,
  ArrowRight,
  ShieldAlert,
  Flame,
  Check,
} from "lucide-react";
import type { AIOfficerProfile } from "@/config/officers";
import type { FounderApproval, ScheduledJob, SystemEvent, CrisisSafeguardingLog } from "@/types";
import type { SystemHealthOverview } from "@/lib/autonomous/health";

interface CommandCenterTabProps {
  health: SystemHealthOverview | null;
  officers: AIOfficerProfile[];
  approvals: FounderApproval[];
  taskCounts: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
    dead_letter: number;
    awaiting_approval: number;
    total: number;
  } | null;
  jobs: ScheduledJob[];
  events: SystemEvent[];
  crisisAlerts: CrisisSafeguardingLog[];
  queueProcessing: boolean;
  onProcessQueue: () => Promise<void>;
  onRefresh: () => Promise<void>;
  onAcknowledgeAlert: (alertId: string) => Promise<void>;
  onNavigateTab: (
    tab: "command" | "virtual_hq" | "conference" | "decisions" | "reporting" | "queue" | "jobs" | "events"
  ) => void;
}

export function CommandCenterTab({
  health,
  officers,
  approvals,
  taskCounts,
  jobs,
  events,
  crisisAlerts,
  queueProcessing,
  onProcessQueue,
  onRefresh,
  onAcknowledgeAlert,
  onNavigateTab,
}: CommandCenterTabProps) {
  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const unacknowledgedCrisisAlerts = crisisAlerts.filter((a) => !a.user_acknowledged);
  const activeJobs = jobs.filter((j) => j.is_active);

  const isSystemHealthy =
    health?.subsystems?.database === "connected" &&
    health?.subsystems?.geminiAi === "configured";

  return (
    <div className="space-y-6">
      {/* 1. Executive Operations Header Banner */}
      <div className="bg-sandigan-navy-900 border border-sandigan-navy-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sandigan-teal-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                EXECUTIVE AUTONOMOUS ENGINE
              </span>
              <span className="text-xs text-sandigan-navy-300 font-mono">
                AMARA ORCHESTRATION LAYER v7.0
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-manrope text-white tracking-tight">
              Founder Command Center
            </h1>
            <p className="text-sm text-sandigan-navy-300 max-w-2xl font-inter">
              System-wide oversight for PROJECT SANDIGAN. Real-time telemetry, 7 AI Officer divisions, human-in-the-loop governance, and crisis safeguarding monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="border-sandigan-navy-700 hover:bg-sandigan-navy-800 text-sandigan-navy-200 text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Telemetry
            </Button>
            <Button
              size="sm"
              onClick={onProcessQueue}
              disabled={queueProcessing}
              className="bg-sandigan-teal-600 hover:bg-sandigan-teal-500 text-white text-xs font-semibold shadow-md gap-1.5"
            >
              {queueProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Run Queue Batch
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Subsystem Health Pills */}
        <div className="mt-6 pt-5 border-t border-sandigan-navy-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sandigan-navy-800/60 border border-sandigan-navy-700/50">
            <Database className="w-4 h-4 text-sandigan-teal-400" />
            <div>
              <div className="text-sandigan-navy-400 text-[10px] uppercase font-bold tracking-wider">Database</div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health?.subsystems?.database === "connected" ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
                {health?.subsystems?.database ? health.subsystems.database.toUpperCase() : "ONLINE"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sandigan-navy-800/60 border border-sandigan-navy-700/50">
            <Cpu className="w-4 h-4 text-sandigan-gold-400" />
            <div>
              <div className="text-sandigan-navy-400 text-[10px] uppercase font-bold tracking-wider">Gemini LLM</div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health?.subsystems?.geminiAi === "configured" ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                {health?.subsystems?.geminiAi === "configured" ? "ONLINE" : "STANDBY"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sandigan-navy-800/60 border border-sandigan-navy-700/50">
            <Layers className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-sandigan-navy-400 text-[10px] uppercase font-bold tracking-wider">Queue Worker</div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health?.subsystems?.taskQueueWorker === "nominal" ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                {health?.subsystems?.taskQueueWorker ? health.subsystems.taskQueueWorker.toUpperCase() : "READY"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sandigan-navy-800/60 border border-sandigan-navy-700/50">
            <Shield className="w-4 h-4 text-sandigan-teal-300" />
            <div>
              <div className="text-sandigan-navy-400 text-[10px] uppercase font-bold tracking-wider">Access & RLS</div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                FOUNDER SECURE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pending Approvals */}
        <Card
          className={`cursor-pointer transition-all hover:border-sandigan-gold-400 ${
            pendingApprovals.length > 0 ? "border-amber-400/80 bg-amber-50/20" : ""
          }`}
          onClick={() => onNavigateTab("decisions")}
        >
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sandigan-navy-600 font-medium">Pending Approvals</span>
              <AlertOctagon
                className={`w-4 h-4 ${
                  pendingApprovals.length > 0 ? "text-amber-600 animate-bounce" : "text-sandigan-navy-400"
                }`}
              />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {pendingApprovals.length}
            </div>
            <p className="text-[11px] text-sandigan-navy-500 flex items-center gap-1">
              {pendingApprovals.length > 0 ? "Action required by Founder" : "All decisions resolved"}
              <ArrowRight className="w-3 h-3 ml-auto text-sandigan-navy-400" />
            </p>
          </CardContent>
        </Card>

        {/* Task Queue Load */}
        <Card
          className="cursor-pointer transition-all hover:border-sandigan-teal-400"
          onClick={() => onNavigateTab("queue")}
        >
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sandigan-navy-600 font-medium">Active & Pending Tasks</span>
              <Layers className="w-4 h-4 text-sandigan-teal-600" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {(taskCounts?.pending || 0) + (taskCounts?.in_progress || 0)}
            </div>
            <p className="text-[11px] text-sandigan-navy-500 flex items-center gap-1">
              <span>{taskCounts?.completed || 0} completed</span>
              <span className="text-sandigan-navy-300">•</span>
              <span className="text-rose-600">{taskCounts?.failed || 0} failed</span>
              <ArrowRight className="w-3 h-3 ml-auto text-sandigan-navy-400" />
            </p>
          </CardContent>
        </Card>

        {/* Safeguarding Alerts */}
        <Card
          className={`cursor-pointer transition-all hover:border-rose-400 ${
            unacknowledgedCrisisAlerts.length > 0 ? "border-rose-400/80 bg-rose-50/20" : ""
          }`}
          onClick={() => onNavigateTab("reporting")}
        >
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sandigan-navy-600 font-medium">Crisis Safeguarding</span>
              <ShieldAlert
                className={`w-4 h-4 ${
                  unacknowledgedCrisisAlerts.length > 0 ? "text-rose-600 animate-pulse" : "text-sandigan-navy-400"
                }`}
              />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {crisisAlerts.length}
            </div>
            <p className="text-[11px] text-sandigan-navy-500 flex items-center gap-1">
              <span className={unacknowledgedCrisisAlerts.length > 0 ? "text-rose-600 font-semibold" : ""}>
                {unacknowledgedCrisisAlerts.length} unacknowledged
              </span>
              <ArrowRight className="w-3 h-3 ml-auto text-sandigan-navy-400" />
            </p>
          </CardContent>
        </Card>

        {/* Scheduled Jobs */}
        <Card
          className="cursor-pointer transition-all hover:border-emerald-400"
          onClick={() => onNavigateTab("jobs")}
        >
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sandigan-navy-600 font-medium">Active Scheduled Jobs</span>
              <Clock className="w-4 h-4 text-sandigan-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {activeJobs.length} <span className="text-sm font-normal text-sandigan-navy-400">/ {jobs.length}</span>
            </div>
            <p className="text-[11px] text-sandigan-navy-500 flex items-center gap-1">
              <span>Next cycle scheduled</span>
              <ArrowRight className="w-3 h-3 ml-auto text-sandigan-navy-400" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Safeguarding Alerts Requiring Human Attention */}
      <Card className="border-rose-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-rose-50/50 border-b border-rose-100 py-3.5 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <div>
                <CardTitle className="text-base text-rose-950 font-manrope font-bold">
                  Safeguarding & Crisis Incident Monitor
                </CardTitle>
                <CardDescription className="text-xs text-rose-800/80">
                  Real-time distress signals detected by GABAY. Strict zero-delay emergency escalation logs.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-rose-300 text-rose-800 text-xs bg-white">
              {unacknowledgedCrisisAlerts.length} Attention Needed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {crisisAlerts.length === 0 ? (
            <div className="p-8 text-center text-sm text-sandigan-navy-500">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              No crisis safeguarding incidents logged. System operating safely.
            </div>
          ) : (
            <div className="divide-y divide-sandigan-navy-100 max-h-72 overflow-y-auto">
              {crisisAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    !alert.user_acknowledged ? "bg-rose-50/30" : "hover:bg-sandigan-navy-50/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="rose"
                        className={`text-[11px] font-bold ${
                          alert.risk_level === "critical"
                            ? "bg-rose-600 text-white"
                            : alert.risk_level === "high"
                            ? "bg-amber-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {alert.risk_level.toUpperCase()}
                      </Badge>
                      <span className="text-xs font-semibold text-sandigan-navy-900 font-mono">
                        Responder: {alert.officer_responder}
                      </span>
                      <span className="text-xs text-sandigan-navy-400">•</span>
                      <span className="text-xs text-sandigan-navy-500 font-mono">
                        Pathway: {alert.escalation_pathway}
                      </span>
                    </div>
                    <div className="text-xs text-sandigan-navy-700">
                      <span className="text-sandigan-navy-500">Trigger Keywords: </span>
                      {alert.trigger_keywords && alert.trigger_keywords.length > 0 ? (
                        <span className="font-mono bg-sandigan-navy-100 px-1.5 py-0.5 rounded text-[11px]">
                          {alert.trigger_keywords.join(", ")}
                        </span>
                      ) : (
                        <span className="text-sandigan-navy-400 italic">None logged</span>
                      )}
                    </div>
                    <div className="text-[11px] text-sandigan-navy-400">
                      Logged at {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {alert.user_acknowledged ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <Check className="w-3.5 h-3.5" /> Acknowledged
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="text-xs border-rose-300 text-rose-700 hover:bg-rose-100 gap-1 h-8"
                      >
                        <Check className="w-3.5 h-3.5" /> Acknowledge Alert
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. AI Officers Operational Status Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-manrope text-sandigan-navy-900">
              AI Officers Virtual Operational Matrix
            </h2>
            <p className="text-xs text-sandigan-navy-500">
              The 7 autonomous divisions powering PROJECT SANDIGAN operations under AMARA supervision.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab("virtual_hq")}
            className="text-xs text-sandigan-teal-600 hover:text-sandigan-teal-700 gap-1 font-semibold"
          >
            Open Virtual HQ Dossiers <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {officers.map((officer) => (
            <div
              key={officer.id}
              onClick={() => onNavigateTab("virtual_hq")}
              className="p-4 rounded-xl border border-sandigan-navy-200 bg-white hover:border-sandigan-teal-400 hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm"
                    style={{ backgroundColor: officer.avatarColor }}
                  >
                    {officer.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-sandigan-navy-900 font-manrope">{officer.name}</h3>
                    <span className="text-[10px] font-mono font-medium text-sandigan-navy-500">
                      {officer.callsign}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-sandigan-teal-700 uppercase tracking-wider">
                  {officer.division}
                </div>
                <p className="text-xs text-sandigan-navy-600 line-clamp-2 leading-relaxed">
                  {officer.role}
                </p>
              </div>

              <div className="pt-2 border-t border-sandigan-navy-100 flex items-center justify-between text-[11px] text-sandigan-navy-400">
                <span>Autonomous Tasks</span>
                <span className="font-semibold text-sandigan-navy-700">Enabled</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Bottom Two Columns: Autonomous Queue Breakdown & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue State Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold font-manrope text-sandigan-navy-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sandigan-teal-600" />
                Autonomous Task Distribution
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("queue")}
                className="text-xs text-sandigan-teal-600 h-7 px-2"
              >
                Inspect Queue
              </Button>
            </div>
            <CardDescription className="text-xs">
              Live lifecycle state across all autonomous tasks in public.ai_tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-xs text-amber-700 font-medium">Pending</div>
                <div className="text-lg font-bold text-amber-900 font-manrope">
                  {taskCounts?.pending || 0}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-xs text-blue-700 font-medium">In Progress</div>
                <div className="text-lg font-bold text-blue-900 font-manrope">
                  {taskCounts?.in_progress || 0}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-xs text-emerald-700 font-medium">Completed</div>
                <div className="text-lg font-bold text-emerald-900 font-manrope">
                  {taskCounts?.completed || 0}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <div className="text-xs text-rose-700 font-medium">Failed</div>
                <div className="text-lg font-bold text-rose-900 font-manrope">
                  {taskCounts?.failed || 0}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
                <div className="text-xs text-purple-700 font-medium">Dead Letter</div>
                <div className="text-lg font-bold text-purple-900 font-manrope">
                  {taskCounts?.dead_letter || 0}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="text-xs text-yellow-700 font-medium">Awaiting Approval</div>
                <div className="text-lg font-bold text-yellow-900 font-manrope">
                  {taskCounts?.awaiting_approval || 0}
                </div>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-sandigan-navy-500">
                <span>Total Workload</span>
                <span className="font-semibold text-sandigan-navy-800">{taskCounts?.total || 0} Tasks</span>
              </div>
              <div className="h-2 rounded-full bg-sandigan-navy-100 overflow-hidden flex">
                <div
                  style={{
                    width: `${
                      taskCounts?.total ? ((taskCounts.completed || 0) / taskCounts.total) * 100 : 0
                    }%`,
                  }}
                  className="bg-emerald-500"
                />
                <div
                  style={{
                    width: `${
                      taskCounts?.total ? ((taskCounts.in_progress || 0) / taskCounts.total) * 100 : 0
                    }%`,
                  }}
                  className="bg-blue-500"
                />
                <div
                  style={{
                    width: `${
                      taskCounts?.total ? ((taskCounts.pending || 0) / taskCounts.total) * 100 : 0
                    }%`,
                  }}
                  className="bg-amber-400"
                />
                <div
                  style={{
                    width: `${
                      taskCounts?.total ? ((taskCounts.failed || 0) / taskCounts.total) * 100 : 0
                    }%`,
                  }}
                  className="bg-rose-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Events Feed */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold font-manrope text-sandigan-navy-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-sandigan-teal-600" />
                Recent Operational Events
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("events")}
                className="text-xs text-sandigan-teal-600 h-7 px-2"
              >
                View All Events
              </Button>
            </div>
            <CardDescription className="text-xs">
              Latest security and autonomous system events logged in public.system_events.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {events.length === 0 ? (
              <div className="p-6 text-center text-xs text-sandigan-navy-400">
                No system events recorded.
              </div>
            ) : (
              <div className="divide-y divide-sandigan-navy-100 max-h-64 overflow-y-auto">
                {events.slice(0, 6).map((event) => (
                  <div key={event.id} className="p-3 text-xs flex items-start gap-2.5 hover:bg-sandigan-navy-50/50">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        event.event_level === "critical"
                          ? "bg-rose-600"
                          : event.event_level === "error"
                          ? "bg-red-500"
                          : event.event_level === "warn"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sandigan-navy-900 truncate font-mono text-[11px]">
                          {event.event_type}
                        </span>
                        <span className="text-[10px] text-sandigan-navy-400 font-mono flex-shrink-0">
                          {new Date(event.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sandigan-navy-600 truncate text-[11px]">{event.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
