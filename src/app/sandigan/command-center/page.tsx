'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { AIOfficerId, DecisionLevel } from '@/types/sandigan';
import {
  Building2,
  Users2,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  Calendar,
  Sparkles,
  Bot,
  Video,
  FileText,
  Mail,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function SandiganCommandCenterPage() {
  const {
    officers,
    tasks,
    createTask,
    updateTaskStatus,
    referrals,
    reports,
    generateReport,
    isDarkMode,
  } = useSandigan();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'officers'
    | 'tasks'
    | 'proposals'
    | 'memos'
    | 'referrals'
    | 'reports'
    | 'analytics'
  >('overview');

  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sandigan_founder_auth') === 'verified';
    }
    return false;
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const handleFounderAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'sandigan2026' || passcode.trim() === 'founder') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sandigan_founder_auth', 'verified');
      }
      setIsAuthorized(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const [founderCommand, setFounderCommand] = useState('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  // New task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskOfficer, setTaskOfficer] = useState<AIOfficerId>('amara');
  const [taskLevel, setTaskLevel] = useState<DecisionLevel>(1);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const handleFounderCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderCommand.trim()) return;

    const cmd = founderCommand.trim();
    setFounderCommand('');

    // AMARA analyzes and coordinates task
    createTask({
      title: `Directive: ${cmd.slice(0, 60)}...`,
      description: cmd,
      officerId: 'amara',
      assignedBy: 'Founder',
      decisionLevel: 2,
      priority: 'high',
      status: 'in_progress',
    });

    setCommandFeedback(
      `AMARA: "Directive received from Founder Emmanuel James. Coordinating execution with concerned department officers."`
    );
    setTimeout(() => setCommandFeedback(null), 5000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    createTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      officerId: taskOfficer,
      assignedBy: 'Founder',
      decisionLevel: taskLevel,
      priority: taskPriority,
      status: 'pending',
    });

    setTaskTitle('');
    setTaskDesc('');
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const level3Pending = tasks.filter(t => t.decisionLevel === 3 && t.status !== 'completed').length;

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className={`p-8 rounded-3xl border shadow-2xl text-center space-y-5 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Restricted Executive Enclave
            </span>
            <h2 className="text-xl font-black mt-1">Founder Authentication</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Access restricted to Founder &amp; Developer <strong>Emmanuel James C. Dela Cruz</strong>.
            </p>
          </div>

          <form onSubmit={handleFounderAuth} className="space-y-3">
            <input
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              placeholder="Enter Founder Passcode (default: sandigan2026)"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            {authError && (
              <p className="text-rose-500 text-[11px] font-semibold">
                Invalid executive passcode. Try: sandigan2026
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs shadow-lg hover:from-emerald-700 hover:to-teal-800 transition"
            >
              Verify &amp; Enter Command Center
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Founder Identity & Conference Room Trigger */}
      <div
        className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Project Sandigan Founder Command Center • Autonomous Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Founder & Executive Control Center
          </h1>
          <p className="text-xs text-slate-400">
            Founder: <strong>Emmanuel James C. Dela Cruz</strong> • AMARA Coordinating 7 Virtual Officers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/sandigan/command-center/conference"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-tk-emerald to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-lg transition flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            <span>Founder Conference Room (7 Officers)</span>
          </Link>
        </div>
      </div>

      {/* AMARA Instant Direct Command Input (Section 10) */}
      <div
        className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5 text-tk-deepblue dark:text-sky-400">
            <Bot className="w-4 h-4 text-emerald-500" />
            <span>AMARA Executive Command Interface</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">Type directives for autonomous delegation</span>
        </div>

        <form onSubmit={handleFounderCommand} className="flex gap-2">
          <input
            type="text"
            value={founderCommand}
            onChange={e => setFounderCommand(e.target.value)}
            placeholder="Issue a direct executive instruction (e.g. 'Review MMWGH Bataan referral transmission rates')..."
            className="flex-1 text-xs p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!founderCommand.trim()}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit</span>
          </button>
        </form>

        {commandFeedback && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium animate-in fade-in">
            {commandFeedback}
          </div>
        )}
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'officers', label: '7 AI Officers' },
          { id: 'tasks', label: `Task Center (${tasks.length})` },
          { id: 'referrals', label: `Bataan Referrals (${referrals.length})` },
          { id: 'reports', label: 'Daily Reports (5PM / 7PM)' },
          { id: 'proposals', label: 'Founder Proposals' },
          { id: 'memos', label: 'Memo Center' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl shrink-0 transition ${
              activeTab === tab.id
                ? 'bg-tk-deepblue text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Officer Tasks</span>
              <div className="text-2xl font-black text-white mt-1">{totalTasks}</div>
              <span className="text-[10px] text-emerald-400">{completedTasks} completed</span>
            </div>

            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase text-slate-400">Level 3 Approvals</span>
              <div className="text-2xl font-black text-amber-400 mt-1">{level3Pending}</div>
              <span className="text-[10px] text-slate-400">Requires Founder sign-off</span>
            </div>

            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase text-slate-400">Bataan Linkages</span>
              <div className="text-2xl font-black text-sky-400 mt-1">4 Verified</div>
              <span className="text-[10px] text-slate-400">MMWGH & BGHMC Active</span>
            </div>

            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase text-slate-400">Safeguarding Status</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">Normal</div>
              <span className="text-[10px] text-emerald-400">GABAY Monitoring</span>
            </div>
          </div>

          {/* Officers Quick Glance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {officers.map(officer => (
              <div
                key={officer.id}
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{officer.avatar}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-500 font-bold uppercase">
                    {officer.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">{officer.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{officer.role}</p>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t dark:border-slate-800">
                  <span>Tasks: {officer.activeTasksCount} active</span>
                  <span>{officer.completedTasksCount} done</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SEVEN AI OFFICERS */}
      {activeTab === 'officers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officers.map(officer => (
            <div
              key={officer.id}
              className={`p-6 rounded-3xl border space-y-4 flex flex-col justify-between ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800">
                      {officer.avatar}
                    </span>
                    <div>
                      <h3 className="font-bold text-base">{officer.name}</h3>
                      <p className="text-xs text-emerald-500 font-medium">{officer.role}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {officer.biography}
                </p>

                <div className="space-y-1 pt-2 border-t dark:border-slate-800 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Key Responsibilities:
                  </span>
                  {officer.responsibilities.map((r, i) => (
                    <div key={i} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-500">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  {officer.completedTasksCount} items completed
                </span>
                <Link
                  href="/sandigan/command-center/conference"
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Converse in HQ →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TASK CENTER (Level 1, 2, and 3 Decisions) */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Create Task Bar */}
          <div
            className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h3 className="text-sm font-bold">Assign Directive / Operational Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <input
                type="text"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                placeholder="Task title (e.g. Review BGHMC Balanga psychiatric OPD operating hours)..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Assign to Officer</label>
                  <select
                    value={taskOfficer}
                    onChange={e => setTaskOfficer(e.target.value as AIOfficerId)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    {officers.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.department})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Decision Authority Level</label>
                  <select
                    value={taskLevel}
                    onChange={e => setTaskLevel(Number(e.target.value) as DecisionLevel)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <option value={1}>Level 1: Routine (Autonomous)</option>
                    <option value={2}>Level 2: Cross-Dept (AMARA Coord)</option>
                    <option value={3}>Level 3: Sensitive (Founder Approval)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={2}
                value={taskDesc}
                onChange={e => setTaskDesc(e.target.value)}
                placeholder="Specific instructions or expected deliverables..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none"
              />

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold shadow transition"
              >
                Dispatch Task
              </button>
            </form>
          </div>

          {/* Task Feed */}
          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-500">
                      Level {task.decisionLevel}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white">{task.title}</span>
                    <span className="text-slate-400 uppercase text-[9px] font-bold">({task.priority})</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">{task.description}</p>
                  {task.outcomeNotes && (
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                      Outcome: {task.outcomeNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Assigned: {task.officerId.toUpperCase()}
                  </span>
                  {task.status !== 'completed' ? (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'completed', 'Completed by Founder verification.')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px]"
                    >
                      Mark Done
                    </button>
                  ) : (
                    <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BATAAN REFERRALS */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold">Clinical Referral Intake Queue (Bataan Priority)</h3>
            <span className="text-xs text-slate-400 font-mono">{referrals.length} intake requests</span>
          </div>

          {referrals.length === 0 ? (
            <div className="p-8 text-center rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              No pending clinic referrals in queue. Referrals initiated from the "Find Support" page will appear here for KAWING tracking.
            </div>
          ) : (
            referrals.map(ref => (
              <div
                key={ref.id}
                className={`p-5 rounded-2xl border space-y-2 text-xs ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span>Target Facility: {ref.facilityName}</span>
                  <span className="font-mono text-sky-500 uppercase">{ref.anonymousId}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  User Concern: "{ref.userConcernSummary}"
                </p>
                <div className="text-[11px] text-slate-400 pt-1 border-t dark:border-slate-800 flex justify-between">
                  <span>Status: <strong className="text-amber-500 uppercase">{ref.status}</strong></span>
                  <span>Received: {new Date(ref.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: DAILY REPORTS (5PM & 7PM PHT) */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold">Automated Founder Reports (5:00 PM & 7:00 PM PHT)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scheduled dispatches delivered to: <strong>delacruzemmanueljames9@gmail.com</strong> / WhatsApp: <strong>09106230737</strong>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => generateReport('5PM_Partial')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow transition"
              >
                Simulate 5:00 PM Partial Report
              </button>
              <button
                onClick={() => generateReport('7PM_Final')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition"
              >
                Simulate 7:00 PM Final Report
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {reports.map(rep => (
              <div
                key={rep.id}
                className={`p-6 rounded-3xl border space-y-4 text-xs ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                  <span className="font-mono text-emerald-500 font-bold uppercase text-[11px]">
                    {rep.type} Dispatched • {rep.date}
                  </span>
                  <span className="text-slate-400">Status: {rep.systemHealthStatus}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950">
                    <div className="font-black text-base">{rep.totalSessionsToday}</div>
                    <span className="text-[10px] text-slate-400">Support Sessions</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950">
                    <div className="font-black text-base text-amber-500">{rep.activeReferralsCount}</div>
                    <span className="text-[10px] text-slate-400">Referrals Logged</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950">
                    <div className="font-black text-base text-rose-500">{rep.urgentFlagsCount}</div>
                    <span className="text-[10px] text-slate-400">Urgent Flags</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold block">Key Operational Highlights:</span>
                  {rep.highlights.map((h, i) => (
                    <div key={i} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-500">•</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PROPOSALS & MEMOS */}
      {(activeTab === 'proposals' || activeTab === 'memos') && (
        <div
          className={`p-8 rounded-3xl border text-center space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <FileText className="w-8 h-8 text-sky-500 mx-auto" />
          <h3 className="text-base font-bold">
            {activeTab === 'proposals' ? 'Founder Ideas & Proposals Center' : 'Organizational Memo Center'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Review internal policies, Sangguniang Kabataan partnerships, and proposed Bataan campus chapters. You can also draft directives live in the Founder Conference Room.
          </p>
          <Link
            href="/sandigan/command-center/conference"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-tk-deepblue text-white text-xs font-bold"
          >
            <span>Converse in Conference Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
