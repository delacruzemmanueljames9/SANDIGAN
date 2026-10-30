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
  BarChart3,
  Users,
  MessageSquare,
  HeartPulse,
  Shield,
  BookOpen,
  PhoneCall,
  Activity,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Lock,
  Clock,
  Cpu,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import type { StrategicReportData } from "@/types";

export function StrategicReportsTab() {
  const [report, setReport] = React.useState<StrategicReportData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hq/reports");
      if (!res.ok) throw new Error("Failed to load strategic reports data.");
      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-sandigan-navy-500 space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-sandigan-teal-600 mx-auto" />
        <p>Synthesizing strategic platform telemetry from database aggregates...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-8 text-center text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-200">
        <p>{error || "Unable to display strategic analytics."}</p>
        <Button size="sm" variant="outline" onClick={fetchReport} className="mt-3 text-xs">
          Retry
        </Button>
      </div>
    );
  }

  const { platformUsage, moderation, referrals, safeguarding, officerPerformance, jobsSummary } = report;

  return (
    <div className="space-y-6">
      {/* 1. Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sandigan-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold font-manrope text-sandigan-navy-900">
            Strategic Operations & Telemetry Reporting
          </h2>
          <p className="text-xs text-sandigan-navy-600">
            Platform-wide utilization, community moderation health, referral pathways, and AI officer performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-sandigan-navy-300 text-sandigan-navy-700 text-xs bg-sandigan-navy-50">
            <Lock className="w-3.5 h-3.5 mr-1 text-sandigan-navy-500" />
            Privacy Preserved • Zero-Knowledge
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchReport} className="text-xs gap-1.5 h-8">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Reports
          </Button>
        </div>
      </div>

      {/* 2. Platform Usage Overview Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-manrope text-sandigan-navy-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-sandigan-teal-600" />
          Service Utilization Across Core Platform
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Registered Users */}
          <Card className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-sandigan-navy-500">
              <span>Registered Youth</span>
              <Users className="w-3.5 h-3.5 text-sandigan-teal-600" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {platformUsage.totalProfiles}
            </div>
            <p className="text-[11px] text-sandigan-navy-400">Total profiles in system</p>
          </Card>

          {/* Community Conversations */}
          <Card className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-sandigan-navy-500">
              <span>Community Stories</span>
              <MessageSquare className="w-3.5 h-3.5 text-sandigan-teal-600" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {platformUsage.totalCommunityPosts}
            </div>
            <p className="text-[11px] text-sandigan-navy-400">
              + {platformUsage.totalCommunityComments} peer comments
            </p>
          </Card>

          {/* Wellness Check Assessments */}
          <Card className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-sandigan-navy-500">
              <span>Wellness Checks</span>
              <HeartPulse className="w-3.5 h-3.5 text-sandigan-gold-600" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {platformUsage.totalWellnessAssessments}
            </div>
            <p className="text-[11px] text-sandigan-navy-400">Completed reflections</p>
          </Card>

          {/* Safety Plans Formulated */}
          <Card className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-sandigan-navy-500">
              <span>Safety Plans Built</span>
              <Shield className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {platformUsage.totalSafetyPlans}
            </div>
            <p className="text-[11px] text-sandigan-navy-400">Personal crisis safeguards</p>
          </Card>

          {/* Inner Garden Journals */}
          <Card className="p-4 space-y-1 border-sandigan-navy-200">
            <div className="flex items-center justify-between text-xs text-sandigan-navy-500">
              <span>Inner Garden Entries</span>
              <BookOpen className="w-3.5 h-3.5 text-sandigan-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {platformUsage.totalJournalEntries}
            </div>
            <p className="text-[10px] text-sandigan-teal-700 font-medium">
              🔒 Zero-Knowledge Count Only
            </p>
          </Card>

          {/* Directory Support Providers */}
          <Card className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-sandigan-navy-500">
              <span>Verified Directory</span>
              <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {platformUsage.totalSupportProviders}
            </div>
            <p className="text-[11px] text-sandigan-navy-400">Hotlines, clinics & NGOs</p>
          </Card>

          {/* Referral Requests */}
          <Card className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-sandigan-navy-500">
              <span>Referral Intakes</span>
              <Activity className="w-3.5 h-3.5 text-sandigan-teal-600" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {platformUsage.totalReferralRequests}
            </div>
            <p className="text-[11px] text-sandigan-navy-400">Consent-based submissions</p>
          </Card>

          {/* Scheduled Jobs Active */}
          <Card className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-sandigan-navy-500">
              <span>Autonomous Jobs</span>
              <Clock className="w-3.5 h-3.5 text-sandigan-navy-700" />
            </div>
            <div className="text-2xl font-bold font-manrope text-sandigan-navy-900">
              {jobsSummary.activeJobs} <span className="text-sm font-normal text-sandigan-navy-400">/ {jobsSummary.totalJobs}</span>
            </div>
            <p className="text-[11px] text-sandigan-navy-400">Recurring cron workers</p>
          </Card>
        </div>
      </div>

      {/* 3. Two-Column Operational Breakdowns: Moderation & Referrals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Community Moderation Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold font-manrope text-sandigan-navy-900 flex items-center justify-between">
              <span>Community Moderation Health (TALA)</span>
              <Badge variant="outline" className="text-xs">
                {moderation.total} Posts Reviewed
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Autonomous content moderation distribution for youth peer discussions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-700 font-medium text-[11px]">Approved</div>
                <div className="text-lg font-bold text-emerald-900 font-manrope">{moderation.approved}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-amber-700 font-medium text-[11px]">Pending</div>
                <div className="text-lg font-bold text-amber-900 font-manrope">{moderation.pending}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <div className="text-rose-700 font-medium text-[11px]">Flagged</div>
                <div className="text-lg font-bold text-rose-900 font-manrope">{moderation.flagged}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
                <div className="text-purple-700 font-medium text-[11px]">Rejected</div>
                <div className="text-lg font-bold text-purple-900 font-manrope">{moderation.rejected}</div>
              </div>
            </div>

            {/* Moderation Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-sandigan-navy-500">
                <span>Safe Approval Rate</span>
                <span className="font-semibold text-emerald-700">
                  {moderation.total > 0 ? Math.round((moderation.approved / moderation.total) * 100) : 100}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-sandigan-navy-100 overflow-hidden flex">
                <div
                  style={{
                    width: `${moderation.total > 0 ? (moderation.approved / moderation.total) * 100 : 0}%`,
                  }}
                  className="bg-emerald-500"
                />
                <div
                  style={{
                    width: `${moderation.total > 0 ? (moderation.pending / moderation.total) * 100 : 0}%`,
                  }}
                  className="bg-amber-400"
                />
                <div
                  style={{
                    width: `${moderation.total > 0 ? (moderation.flagged / moderation.total) * 100 : 0}%`,
                  }}
                  className="bg-rose-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Intake Pipeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold font-manrope text-sandigan-navy-900 flex items-center justify-between">
              <span>Referral Intake Pipeline (KAWING)</span>
              <Badge variant="outline" className="text-xs">
                {referrals.total} Total Intakes
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Lifecycle status of consent-based clinical and professional referrals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-blue-700 font-medium text-[10px]">Submitted</div>
                <div className="text-base font-bold text-blue-900 font-manrope">{referrals.submitted}</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-amber-700 font-medium text-[10px]">In Review</div>
                <div className="text-base font-bold text-amber-900 font-manrope">
                  {referrals.reviewed_by_safeguarding}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                <div className="text-purple-700 font-medium text-[10px]">Routed</div>
                <div className="text-base font-bold text-purple-900 font-manrope">{referrals.routed_to_partner}</div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-700 font-medium text-[10px]">Accepted</div>
                <div className="text-base font-bold text-emerald-900 font-manrope">{referrals.partner_accepted}</div>
              </div>
              <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-gray-700 font-medium text-[10px]">Closed</div>
                <div className="text-base font-bold text-gray-900 font-manrope">{referrals.closed}</div>
              </div>
            </div>

            <p className="text-[11px] text-sandigan-navy-500 leading-relaxed">
              Every referral strictly requires confirmed user consent (<code className="text-sandigan-teal-700">consent_to_share_granted = true</code>). Identifiable personal data is sealed.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4. Crisis Safeguarding Incident Analytics */}
      <Card className="border-rose-200 bg-rose-50/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold font-manrope text-rose-950 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-600" />
              Crisis Safeguarding Incident Analytics (GABAY)
            </span>
            <Badge variant="outline" className="border-rose-300 text-rose-800 text-xs">
              {safeguarding.totalIncidents} Total Incidents Logged
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-rose-800/80">
            Automated crisis signal detection across all user touchpoints.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-white border border-rose-200">
              <div className="text-rose-700 font-bold text-xs uppercase">Critical Risk</div>
              <div className="text-xl font-extrabold text-rose-900 font-manrope mt-1">
                {safeguarding.byRiskLevel.critical}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-200">
              <div className="text-amber-700 font-bold text-xs uppercase">High Risk</div>
              <div className="text-xl font-extrabold text-amber-900 font-manrope mt-1">
                {safeguarding.byRiskLevel.high}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-blue-200">
              <div className="text-blue-700 font-bold text-xs uppercase">Medium Risk</div>
              <div className="text-xl font-extrabold text-blue-900 font-manrope mt-1">
                {safeguarding.byRiskLevel.medium}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-gray-200">
              <div className="text-gray-700 font-bold text-xs uppercase">Low / Mild</div>
              <div className="text-xl font-extrabold text-gray-900 font-manrope mt-1">
                {safeguarding.byRiskLevel.low}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-sandigan-navy-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-sandigan-navy-800">
              Escalation Pathway Distribution:
            </span>
            <div className="flex items-center gap-3 font-mono text-[11px] text-sandigan-navy-600 flex-wrap">
              <span>Hotlines: {safeguarding.pathways.emergency_hotline}</span>
              <span>•</span>
              <span>Founder Alerts: {safeguarding.pathways.founder_alert}</span>
              <span>•</span>
              <span>Modals: {safeguarding.pathways.modal}</span>
              <span>•</span>
              <span>Banners: {safeguarding.pathways.banner}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. AI Officers Execution Performance Matrix */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold font-manrope text-sandigan-navy-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sandigan-teal-600" />
            AI Officers Task Execution Performance Matrix
          </CardTitle>
          <CardDescription className="text-xs">
            Aggregated execution metrics derived from public.ai_task_attempts telemetry logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sandigan-navy-50 text-sandigan-navy-700 border-y border-sandigan-navy-200 font-semibold font-manrope">
                <tr>
                  <th className="py-2.5 px-4">AI Officer</th>
                  <th className="py-2.5 px-4">Tasks Executed</th>
                  <th className="py-2.5 px-4">Success Rate</th>
                  <th className="py-2.5 px-4">Failed Attempts</th>
                  <th className="py-2.5 px-4">Avg Duration</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandigan-navy-100">
                {officerPerformance.map((op) => {
                  const rate =
                    op.totalTasks > 0
                      ? Math.round((op.successfulAttempts / op.totalTasks) * 100)
                      : 100;
                  return (
                    <tr key={op.officer_id} className="hover:bg-sandigan-navy-50/50">
                      <td className="py-3 px-4 font-bold text-sandigan-navy-900 font-manrope">
                        {op.officer_id}
                      </td>
                      <td className="py-3 px-4 font-mono">{op.totalTasks}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            rate >= 90 ? "text-emerald-600" : rate >= 70 ? "text-amber-600" : "text-rose-600"
                          }`}
                        >
                          {rate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-rose-600">
                        {op.failedAttempts}
                      </td>
                      <td className="py-3 px-4 font-mono text-sandigan-navy-500">
                        {op.avgDurationMs > 0 ? `${op.avgDurationMs} ms` : "Instant"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Operational
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
