"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Shield,
  Activity,
  Layers,
  Cpu,
  Clock,
  MessageSquare,
  AlertOctagon,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Radio,
  Building2,
  Users,
  LogOut,
} from "lucide-react";
import type { AIOfficerProfile } from "@/config/officers";
import type {
  AITask,
  AITaskAttempt,
  AIMessage,
  FounderApproval,
  ScheduledJob,
  SystemEvent,
  CrisisSafeguardingLog,
} from "@/types";
import type { SystemHealthOverview } from "@/lib/autonomous/health";

import { CommandCenterTab } from "./components/CommandCenterTab";
import { VirtualHqTab } from "./components/VirtualHqTab";
import { ConferenceRoomTab } from "./components/ConferenceRoomTab";
import { DecisionCenterTab } from "./components/DecisionCenterTab";
import { StrategicReportsTab } from "./components/StrategicReportsTab";
import { QueueManagerTab } from "./components/QueueManagerTab";
import { JobsManagerTab } from "./components/JobsManagerTab";
import { EventAuditTab } from "./components/EventAuditTab";

type HqTab =
  | "command"
  | "virtual_hq"
  | "conference"
  | "decisions"
  | "reporting"
  | "queue"
  | "jobs"
  | "events";

export default function HqDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<HqTab>("command");
  const [officers, setOfficers] = React.useState<AIOfficerProfile[]>([]);
  const [tasks, setTasks] = React.useState<AITask[]>([]);
  const [attempts, setAttempts] = React.useState<AITaskAttempt[]>([]);
  const [messages, setMessages] = React.useState<AIMessage[]>([]);
  const [approvals, setApprovals] = React.useState<FounderApproval[]>([]);
  const [jobs, setJobs] = React.useState<ScheduledJob[]>([]);
  const [events, setEvents] = React.useState<SystemEvent[]>([]);
  const [crisisAlerts, setCrisisAlerts] = React.useState<CrisisSafeguardingLog[]>([]);
  const [taskCounts, setTaskCounts] = React.useState<{
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
    dead_letter: number;
    awaiting_approval: number;
    total: number;
  } | null>(null);
  const [health, setHealth] = React.useState<SystemHealthOverview | null>(null);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [queueProcessing, setQueueProcessing] = React.useState(false);

  // Sync with URL query parameter on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as HqTab;
      if (
        tabParam &&
        [
          "command",
          "virtual_hq",
          "conference",
          "decisions",
          "reporting",
          "queue",
          "jobs",
          "events",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, healthRes, jobsRes, eventsRes] = await Promise.all([
        fetch("/api/hq/status"),
        fetch("/api/hq/health"),
        fetch("/api/hq/jobs"),
        fetch("/api/hq/events"),
      ]);

      if (!statusRes.ok) {
        if (statusRes.status === 401 || statusRes.status === 403) {
          throw new Error("Unauthorized: Founder/Admin credentials required for Command Center access.");
        }
        throw new Error("Failed to load Founder HQ telemetry.");
      }

      const statusData = await statusRes.json();
      setOfficers(statusData.officers || []);
      setTasks(statusData.tasks || []);
      setAttempts(statusData.attempts || []);
      setMessages(statusData.messages || []);
      setApprovals(statusData.approvals || []);
      setCrisisAlerts(statusData.crisisAlerts || []);
      setTaskCounts(statusData.taskCounts || null);

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHealth(healthData);
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach Founder HQ server.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Process Task Queue Batch Action
  const handleProcessQueue = async () => {
    setQueueProcessing(true);
    try {
      const res = await fetch("/api/hq/queue/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchSize: 5 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Queue batch execution failed.");
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to process queue");
    } finally {
      setQueueProcessing(false);
    }
  };

  // Acknowledge Crisis Alert
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const res = await fetch("/api/hq/safeguarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId }),
      });
      if (!res.ok) throw new Error("Failed to acknowledge safeguarding alert");
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error acknowledging alert");
    }
  };

  // Terminate Founder Session
  const handleLogout = async () => {
    try {
      await fetch("/api/hq/auth/logout", { method: "POST" });
    } catch {
      // Ignored
    }
    window.location.href = "/hq/login";
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === "pending").length;
  const unacknowledgedCrisisCount = crisisAlerts.filter((a) => !a.user_acknowledged).length;

  if (loading && !health && officers.length === 0) {
    return (
      <div className="min-h-screen bg-sandigan-navy-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-sandigan-navy-200 shadow-xl max-w-sm w-full text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-sandigan-teal-600 mx-auto" />
          <h2 className="text-base font-bold font-manrope text-sandigan-navy-900">
            Establishing Secure Command Center Session...
          </h2>
          <p className="text-xs text-sandigan-navy-500 font-inter">
            Authenticating founder authorization, initializing multi-agent telemetry, and verifying database security boundaries.
          </p>
        </div>
      </div>
    );
  }

  if (error && officers.length === 0) {
    return (
      <div className="min-h-screen bg-sandigan-navy-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-rose-200 shadow-xl max-w-md w-full text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
          <h2 className="text-lg font-bold font-manrope text-sandigan-navy-900">
            Command Center Access Blocked
          </h2>
          <p className="text-xs text-rose-700 font-inter bg-rose-50 p-3 rounded-lg border border-rose-100">
            {error}
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Button size="sm" onClick={() => fetchData()} className="text-xs">
              Retry Connection
            </Button>
            <Link href="/hq/login">
              <Button size="sm" variant="outline" className="text-xs">
                Log In as Founder
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sandigan-navy-50/50 pb-16">
      {/* Top Founder Navigation Bar */}
      <header className="sticky top-0 z-40 bg-sandigan-navy-900 text-white border-b border-sandigan-navy-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sandigan-teal-600 flex items-center justify-center font-extrabold text-white text-base shadow-sm">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold font-manrope text-sm tracking-tight text-white leading-none">
                    SANDIGAN
                  </span>
                  <span className="text-[10px] text-sandigan-teal-300 font-mono tracking-wider">
                    EXECUTIVE OPERATIONS
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sandigan-navy-800 text-sandigan-teal-300 border border-sandigan-navy-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                FOUNDER LEVEL
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={fetchData}
                disabled={loading}
                className="text-xs text-sandigan-navy-200 hover:text-white hover:bg-sandigan-navy-800 gap-1.5 h-8 px-2.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="text-xs text-rose-300 hover:text-white hover:bg-rose-950/60 border border-rose-900/40 gap-1.5 h-8 px-2.5"
                title="Lock HQ and terminate session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Lock HQ</span>
              </Button>
            </div>
          </div>

          {/* 8 Executive Tabs Bar */}
          <div className="flex space-x-1 overflow-x-auto py-2 border-t border-sandigan-navy-800/80 no-scrollbar text-xs font-medium">
            {/* Tab 1: Command Center */}
            <button
              onClick={() => setActiveTab("command")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === "command"
                  ? "bg-sandigan-teal-600 text-white font-bold shadow-sm"
                  : "text-sandigan-navy-300 hover:text-white hover:bg-sandigan-navy-800"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Command Center</span>
              {unacknowledgedCrisisCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse ml-0.5" />
              )}
            </button>

            {/* Tab 2: Virtual HQ */}
            <button
              onClick={() => setActiveTab("virtual_hq")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === "virtual_hq"
                  ? "bg-sandigan-teal-600 text-white font-bold shadow-sm"
                  : "text-sandigan-navy-300 hover:text-white hover:bg-sandigan-navy-800"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Virtual HQ</span>
              <span className="text-[10px] bg-sandigan-navy-800 px-1.5 py-0.2 rounded text-sandigan-teal-200">
                7 Divisions
              </span>
            </button>

            {/* Tab 3: Conference Room */}
            <button
              onClick={() => setActiveTab("conference")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === "conference"
                  ? "bg-sandigan-teal-600 text-white font-bold shadow-sm"
                  : "text-sandigan-navy-300 hover:text-white hover:bg-sandigan-navy-800"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Conference Room</span>
            </button>

            {/* Tab 4: Decision Center */}
            <button
              onClick={() => setActiveTab("decisions")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === "decisions"
                  ? "bg-sandigan-teal-600 text-white font-bold shadow-sm"
                  : "text-sandigan-navy-300 hover:text-white hover:bg-sandigan-navy-800"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Decision Center</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-400 text-sandigan-navy-900">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {/* Tab 5: Strategic Reports */}
            <button
              onClick={() => setActiveTab("reporting")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === "reporting"
                  ? "bg-sandigan-teal-600 text-white font-bold shadow-sm"
                  : "text-sandigan-navy-300 hover:text-white hover:bg-sandigan-navy-800"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Strategic Reports</span>
            </button>

            {/* Tab 6: Queue Manager */}
            <button
              onClick={() => setActiveTab("queue")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === "queue"
                  ? "bg-sandigan-teal-600 text-white font-bold shadow-sm"
                  : "text-sandigan-navy-300 hover:text-white hover:bg-sandigan-navy-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Task Queue</span>
              {taskCounts?.pending ? (
                <span className="text-[10px] bg-sandigan-navy-800 px-1.5 py-0.2 rounded text-sandigan-navy-300">
                  {taskCounts.pending}
                </span>
              ) : null}
            </button>

            {/* Tab 7: Scheduled Jobs */}
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === "jobs"
                  ? "bg-sandigan-teal-600 text-white font-bold shadow-sm"
                  : "text-sandigan-navy-300 hover:text-white hover:bg-sandigan-navy-800"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Scheduled Jobs</span>
            </button>

            {/* Tab 8: Event Audit */}
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === "events"
                  ? "bg-sandigan-teal-600 text-white font-bold shadow-sm"
                  : "text-sandigan-navy-300 hover:text-white hover:bg-sandigan-navy-800"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Event Audit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "command" && (
          <CommandCenterTab
            health={health}
            officers={officers}
            approvals={approvals}
            taskCounts={taskCounts}
            jobs={jobs}
            events={events}
            crisisAlerts={crisisAlerts}
            queueProcessing={queueProcessing}
            onProcessQueue={handleProcessQueue}
            onRefresh={fetchData}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "virtual_hq" && (
          <VirtualHqTab officers={officers} tasks={tasks} attempts={attempts} />
        )}

        {activeTab === "conference" && (
          <ConferenceRoomTab
            messages={messages}
            tasks={tasks}
            officers={officers}
            onRefresh={fetchData}
          />
        )}

        {activeTab === "decisions" && (
          <DecisionCenterTab
            approvals={approvals}
            officers={officers}
            onRefresh={fetchData}
          />
        )}

        {activeTab === "reporting" && <StrategicReportsTab />}

        {activeTab === "queue" && (
          <QueueManagerTab
            tasks={tasks}
            attempts={attempts}
            taskCounts={taskCounts}
            queueProcessing={queueProcessing}
            onProcessQueue={handleProcessQueue}
            onRefresh={fetchData}
          />
        )}

        {activeTab === "jobs" && (
          <JobsManagerTab jobs={jobs} onRefresh={fetchData} />
        )}

        {activeTab === "events" && (
          <EventAuditTab events={events} onRefresh={fetchData} />
        )}
      </main>
    </div>
  );
}
