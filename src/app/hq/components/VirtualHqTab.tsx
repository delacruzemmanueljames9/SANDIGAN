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
  ExternalLink,
  Lock,
  Layers,
  Check,
  X,
  FileText,
  AlertOctagon,
} from "lucide-react";
import type { AIOfficerProfile } from "@/config/officers";
import type { AITask, AITaskAttempt } from "@/types";

interface VirtualHqTabProps {
  officers: AIOfficerProfile[];
  tasks: AITask[];
  attempts: AITaskAttempt[];
}

// Map officers to their dedicated platform services
const OFFICER_SERVICES_MAP: Record<
  string,
  Array<{ title: string; href: string; description: string }>
> = {
  AMARA: [
    { title: "Founder Command Center", href: "/hq", description: "Operational oversight & multi-agent orchestration" },
    { title: "Autonomous Queue Engine", href: "/hq?tab=queue", description: "Task worker and retry management" },
    { title: "Scheduled Jobs Manager", href: "/hq?tab=jobs", description: "Autonomous cron scheduling" },
  ],
  TALA: [
    { title: "Community Feed", href: "/community", description: "Safe peer expression and youth discussion" },
    { title: "Voice of Community", href: "/services/voice-of-community", description: "Moderated youth stories and perspectives" },
  ],
  GABAY: [
    { title: "Get Help Now", href: "/get-help-now", description: "Instant 24/7 verified crisis emergency hotlines" },
    { title: "Safety Plan Builder", href: "/services/safety-plan", description: "Personalized crisis safety planning" },
    { title: "Emergency Safeguarding", href: "/contact", description: "Escalated human crisis support routing" },
  ],
  SIKLAB: [
    { title: "Wellness Check", href: "/services/wellness-check", description: "Non-diagnostic multi-dimensional well-being assessment" },
    { title: "Growth Journey", href: "/services/growth-journey", description: "Personalized emotional habit reflection tracking" },
  ],
  DUNONG: [
    { title: "Mind Library", href: "/mind-library", description: "Curated, evidence-informed mental health articles & guides" },
    { title: "Mental Health Literacy", href: "/mental-health", description: "Youth-friendly psychoeducational guides" },
  ],
  KAWING: [
    { title: "Find Support Directory", href: "/find-support", description: "Verified nationwide hotlines, clinics, and NGOs" },
    { title: "Professional Connection", href: "/services/professional-connection", description: "Consent-based professional referral intakes" },
  ],
  SINAG: [
    { title: "Daily Companion", href: "/services/daily-companion", description: "Mindful check-ins, affirmations, and habit anchors" },
    { title: "Reset Room", href: "/services/reset-room", description: "Sensory grounding and guided breathing exercises" },
    { title: "Sleep Wind-Down", href: "/services/sleep", description: "Bedtime hygiene and restorative sleep tools" },
  ],
};

export function VirtualHqTab({ officers, tasks, attempts }: VirtualHqTabProps) {
  const [selectedOfficerName, setSelectedOfficerName] = React.useState<string>("AMARA");

  const currentOfficer =
    officers.find((o) => o.name.toUpperCase() === selectedOfficerName.toUpperCase()) ||
    officers[0];

  if (!currentOfficer) {
    return <div className="p-8 text-center text-sm text-sandigan-navy-400">Loading AI Officers...</div>;
  }

  // Filter tasks belonging to current officer
  const officerTasks = tasks.filter(
    (t) =>
      t.officer_id.toUpperCase().includes(currentOfficer.name.toUpperCase()) ||
      t.officer_id.toLowerCase().includes(currentOfficer.name.toLowerCase()) ||
      t.officer_id === currentOfficer.id
  );

  const assignedServices = OFFICER_SERVICES_MAP[currentOfficer.name] || [];

  return (
    <div className="space-y-6">
      {/* 1. Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sandigan-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold font-manrope text-sandigan-navy-900">
            Virtual Headquarters — Organizational Structure
          </h2>
          <p className="text-xs text-sandigan-navy-600">
            Official operational divisions of PROJECT SANDIGAN. Each division is governed by an AI Officer with designated boundaries and assigned platform services.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sandigan-navy-100 text-sandigan-navy-800 border border-sandigan-navy-200">
          <Shield className="w-3.5 h-3.5 text-sandigan-teal-600" />
          7 Autonomous Divisions Active
        </div>
      </div>

      {/* 2. Division Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {officers.map((officer) => {
          const isSelected = officer.name === currentOfficer.name;
          return (
            <button
              key={officer.id}
              onClick={() => setSelectedOfficerName(officer.name)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? "bg-sandigan-navy-900 border-sandigan-navy-900 text-white shadow-md"
                  : "bg-white border-sandigan-navy-200 text-sandigan-navy-800 hover:border-sandigan-teal-300 hover:bg-sandigan-navy-50/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] text-white"
                  style={{ backgroundColor: officer.avatarColor }}
                >
                  {officer.name.substring(0, 2)}
                </div>
                <span className="font-bold font-manrope text-xs truncate">{officer.name}</span>
              </div>
              <div
                className={`text-[10px] font-mono truncate ${
                  isSelected ? "text-sandigan-teal-300" : "text-sandigan-navy-500"
                }`}
              >
                {officer.callsign}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Selected Division Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Profile, Mission, Responsibilities, Boundaries */}
        <div className="lg:col-span-2 space-y-6">
          {/* Officer Hero Card */}
          <Card className="border-sandigan-navy-200 overflow-hidden shadow-sm">
            <div className="bg-sandigan-navy-900 text-white p-6 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl text-white shadow-lg border-2 border-white/20"
                    style={{ backgroundColor: currentOfficer.avatarColor }}
                  >
                    {currentOfficer.name.substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-extrabold font-manrope text-white tracking-tight">
                        {currentOfficer.name}
                      </h3>
                      <Badge variant="outline" className="text-sandigan-teal-300 border-sandigan-teal-400/40 text-xs font-mono">
                        {currentOfficer.callsign}
                      </Badge>
                    </div>
                    <p className="text-xs text-sandigan-navy-300 mt-0.5">
                      {currentOfficer.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Status: Active
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-sandigan-navy-800 flex items-center justify-between text-xs text-sandigan-navy-300">
                <span>
                  <strong className="text-white">Division: </strong>
                  {currentOfficer.division}
                </span>
                <span className="font-mono text-[11px] text-sandigan-teal-300">
                  ID: {currentOfficer.id}
                </span>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Primary Directive */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-sandigan-navy-500 uppercase tracking-wider">
                  Primary Directive
                </h4>
                <p className="text-sm text-sandigan-navy-800 leading-relaxed font-inter bg-sandigan-navy-50 p-3.5 rounded-xl border border-sandigan-navy-200">
                  {currentOfficer.primaryDirective}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-sandigan-navy-500 uppercase tracking-wider">
                  Operational Responsibilities
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-sandigan-navy-700">
                  {currentOfficer.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-sandigan-navy-100">
                      <CheckCircle className="w-4 h-4 text-sandigan-teal-600 mt-0.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strict Safeguarding Boundaries */}
              <div className="space-y-2 p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                    Non-Negotiable Safeguarding Boundaries
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-rose-900">
                  {currentOfficer.strictBoundaries.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recent Officer Tasks Stream */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-manrope text-sandigan-navy-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sandigan-teal-600" />
                Recent Tasks Executed by {currentOfficer.name}
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time task records logged in public.ai_tasks assigned to this division.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {officerTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-sandigan-navy-400">
                  No recent execution records logged for {currentOfficer.name}. Division ready on queue standby.
                </div>
              ) : (
                <div className="divide-y divide-sandigan-navy-100 max-h-72 overflow-y-auto">
                  {officerTasks.map((t) => (
                    <div key={t.id} className="p-3.5 text-xs flex items-center justify-between gap-3 hover:bg-sandigan-navy-50/50">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sandigan-navy-900 font-mono text-xs truncate">
                            {t.task_type}
                          </span>
                          <Badge
                            variant="neutral"
                            className={`text-[10px] uppercase ${
                              t.status === "completed"
                                ? "bg-emerald-600 text-white"
                                : t.status === "failed"
                                ? "bg-rose-600 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {t.status}
                          </Badge>
                          <span className="text-[10px] text-sandigan-navy-400 font-mono">
                            Pri: {t.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-sandigan-navy-400">
                          ID: <span className="font-mono">{t.id.substring(0, 8)}...</span> • {new Date(t.created_at).toLocaleString()}
                        </div>
                      </div>

                      {t.requires_approval && (
                        <Badge variant="outline" className="border-amber-300 text-amber-800 text-[10px]">
                          Approval Gate
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 col): Assigned Services & Security Permissions */}
        <div className="space-y-6">
          {/* Assigned Services Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-manrope text-sandigan-navy-900">
                Assigned Platform Services
              </CardTitle>
              <CardDescription className="text-xs">
                Direct functional links to services powered or safeguarded by this division.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {assignedServices.map((svc, i) => (
                <Link
                  key={i}
                  href={svc.href}
                  className="block p-3 rounded-xl border border-sandigan-navy-200 hover:border-sandigan-teal-500 hover:bg-sandigan-teal-50/30 transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-sandigan-navy-900 group-hover:text-sandigan-teal-700">
                    <span>{svc.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-sandigan-navy-400 group-hover:text-sandigan-teal-600" />
                  </div>
                  <p className="text-[11px] text-sandigan-navy-500 mt-1 leading-relaxed">
                    {svc.description}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Autonomous Permissions Matrix */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-manrope text-sandigan-navy-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-sandigan-navy-700" />
                Security & Role Permissions
              </CardTitle>
              <CardDescription className="text-xs">
                Database-enforced privilege boundaries for {currentOfficer.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-sandigan-navy-50">
                <span className="text-sandigan-navy-700">Autonomous Tasks</span>
                {currentOfficer.permissions.canExecuteAutonomousTasks ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Allowed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sandigan-navy-400 font-semibold">
                    <X className="w-3.5 h-3.5" /> Blocked
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-sandigan-navy-50">
                <span className="text-sandigan-navy-700">Crisis Escalation</span>
                {currentOfficer.permissions.canEscalateCrisis ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Allowed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sandigan-navy-400 font-semibold">
                    <X className="w-3.5 h-3.5" /> Blocked
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-sandigan-navy-50">
                <span className="text-sandigan-navy-700">Content Moderation</span>
                {currentOfficer.permissions.canModerateContent ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Allowed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sandigan-navy-400 font-semibold">
                    <X className="w-3.5 h-3.5" /> Blocked
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-sandigan-navy-50 border border-sandigan-navy-200">
                <span className="text-sandigan-navy-700">Private Journals Access</span>
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <X className="w-3.5 h-3.5" /> Strict Deny
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-sandigan-navy-50 border border-sandigan-navy-200">
                <span className="text-sandigan-navy-700">Clinical Diagnosis</span>
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <X className="w-3.5 h-3.5" /> Strict Deny
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-sandigan-navy-50 border border-sandigan-navy-200">
                <span className="text-sandigan-navy-700">Founder Approvals</span>
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <X className="w-3.5 h-3.5" /> Strict Deny
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
