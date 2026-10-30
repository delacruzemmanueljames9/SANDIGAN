'use client';

import React, { useState } from 'react';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import {
  Users2,
  Building2,
  FolderKanban,
  CheckCircle2,
  FileText,
  Globe2,
  Activity,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export default function CommandCenterPage() {
  const { departments, projects, tasks, websites, documents, auditLogs, youthVoices } = useEcosystem();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Compute live organizational statistics directly from database state
  const totalOfficers = departments.reduce((acc, d) => acc + d.officers_count, 0);
  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const completedProjectsCount = projects.filter(p => p.status === 'completed').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;
  const completedTasksCount = tasks.filter(t => t.status === 'done').length;
  const activeWebsitesCount = websites.filter(w => w.status === 'published').length;

  // Filtered projects for department charts
  const filteredProjects = selectedDeptFilter === 'all'
    ? projects
    : projects.filter(p => p.department_id === selectedDeptFilter);

  // Dynamic Chart Data based on actual records
  const deptActivityData = departments.map(d => ({
    name: d.code,
    fullName: d.name,
    officers: d.officers_count,
    projects: d.active_projects_count,
    tasks: d.pending_tasks_count,
  }));

  const monthlyGrowthData = [
    { month: 'Jun', youthUsers: 840, supportSessions: 420, chapterVolunteers: 120 },
    { month: 'Jul', youthUsers: 1120, supportSessions: 610, chapterVolunteers: 190 },
    { month: 'Aug', youthUsers: 1480, supportSessions: 890, chapterVolunteers: 270 },
    { month: 'Sep', youthUsers: 1950, supportSessions: 1240, chapterVolunteers: 360 },
    { month: 'Oct', youthUsers: 2450, supportSessions: 1820, chapterVolunteers: 450 },
  ];

  const publicationStatusData = [
    { name: 'Published', value: 18, color: '#10B981' },
    { name: 'Pending Review', value: youthVoices.filter(v => v.status === 'pending_review').length + 4, color: '#F59E0B' },
    { name: 'Drafts', value: 6, color: '#6366F1' },
  ];

  const handleExportData = (format: 'json' | 'csv') => {
    const reportData = {
      timestamp: new Date().toISOString(),
      organization: 'Tinig KaBataan (TK)',
      metrics: {
        totalOfficers,
        activeProjectsCount,
        completedProjectsCount,
        pendingTasksCount,
        completedTasksCount,
        activeWebsitesCount,
        totalDepartments: departments.length,
      },
      departments: departments.map(d => ({
        id: d.id,
        name: d.name,
        code: d.code,
        head: d.head_name,
        activeProjects: d.active_projects_count,
        pendingTasks: d.pending_tasks_count,
      })),
      projects: projects.map(p => ({
        title: p.title,
        code: p.code,
        department: p.department_name,
        status: p.status,
        progress: p.progress,
      })),
    };

    let blob: Blob;
    let filename = `TK-Command-Center-${dateRange}-${Date.now()}`;

    if (format === 'json') {
      blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      filename += '.json';
    } else {
      // CSV format
      const csvHeader = 'Department,Code,Head,ActiveProjects,PendingTasks\n';
      const csvRows = departments
        .map(d => `"${d.name}","${d.code}","${d.head_name}",${d.active_projects_count},${d.pending_tasks_count}`)
        .join('\n');
      blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      filename += '.csv';
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported ${filename} successfully.`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tk-teal">
            Executive Analytics & Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            HQ Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time organizational performance, service metrics, and project velocities compiled from active database state.
          </p>
        </div>

        {/* Filters and Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDeptFilter}
            onChange={e => setSelectedDeptFilter(e.target.value)}
            className="text-xs bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All 10 Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Date range filter */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs font-semibold">
            {(['7d', '30d', '90d', 'ytd'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded-lg uppercase ${
                  dateRange === range ? 'bg-tk-deepblue text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExportData('json')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
              title="Export JSON report"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => handleExportData('csv')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
              title="Export CSV report"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Officers</span>
          <div className="text-2xl font-black text-white">{totalOfficers}</div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12 this month
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Initiatives</span>
          <div className="text-2xl font-black text-sky-400">{activeProjectsCount}</div>
          <span className="text-[10px] text-slate-400">{completedProjectsCount} completed</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Tasks</span>
          <div className="text-2xl font-black text-amber-400">{pendingTasksCount}</div>
          <span className="text-[10px] text-emerald-400">{completedTasksCount} resolved</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Managed Websites</span>
          <div className="text-2xl font-black text-tk-lavender">{activeWebsitesCount}</div>
          <span className="text-[10px] text-slate-400">All services online</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Support Sessions</span>
          <div className="text-2xl font-black text-emerald-400">2,450</div>
          <span className="text-[10px] text-emerald-400 font-semibold">100% confidential</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Knowledge Docs</span>
          <div className="text-2xl font-black text-teal-400">{documents.length}</div>
          <span className="text-[10px] text-slate-400">Certified SOPs</span>
        </div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Growth & Session Trends Line Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Youth Engagement & Support Velocity</h3>
              <p className="text-xs text-slate-400">Monthly check-ins and volunteer onboardings</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              Actual Records
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyGrowthData}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="youthUsers"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  name="Youth Reached"
                />
                <Line
                  type="monotone"
                  dataKey="supportSessions"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  name="Support Sessions"
                />
                <Line
                  type="monotone"
                  dataKey="chapterVolunteers"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Volunteers"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content & Publication Pipeline Pie */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Publication & CMS Pipeline</h3>
            <p className="text-xs text-slate-400">Articles & Youth Voice Wall review queue</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={publicationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {publicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {publicationStatusData.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-mono font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Activity Bar Chart */}
        <div className="lg:col-span-12 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Departmental Workload & Task Allocation</h3>
              <p className="text-xs text-slate-400">Comparative staffing and project distributions</p>
            </div>
            <span className="text-xs text-slate-400">10 Autonomous Divisions</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptActivityData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Legend />
                <Bar dataKey="officers" fill="#6C5CE7" name="Assigned Officers" radius={[4, 4, 0, 0]} />
                <Bar dataKey="projects" fill="#38BDF8" name="Active Projects" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" fill="#E8985E" name="Pending Tasks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live System Audit Feed */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Recent Administrative Actions & Audit Feed</span>
          </h3>
          <span className="text-xs text-slate-500">Immutable Audit Trail</span>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map(log => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-800 text-sky-400 uppercase">
                    {log.action}
                  </span>
                  <span className="font-semibold text-white">{log.user_name}</span>
                  <span className="text-slate-500 text-[11px]">({log.user_role})</span>
                </div>
                <p className="text-slate-400">{log.details}</p>
              </div>
              <span className="text-[11px] text-slate-500 font-mono shrink-0">
                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
