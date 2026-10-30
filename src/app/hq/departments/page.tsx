'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Building2,
  Users2,
  FolderKanban,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';

export default function DepartmentHubsPage() {
  const { departments, projects, tasks, announcements } = useEcosystem();
  const { currentUser } = useAuth();

  const [selectedDeptSlug, setSelectedDeptSlug] = useState<string>(departments[0]?.slug || 'main-admin');

  const activeDept = departments.find(d => d.slug === selectedDeptSlug) || departments[0];
  const deptProjects = projects.filter(p => p.department_id === activeDept?.id);
  const deptTasks = tasks.filter(t => t.department_id === activeDept?.id);
  const deptAnnouncements = announcements.filter(a => a.department_id === activeDept?.id || a.target_audience === 'all_hq');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tk-lavender">
            Autonomous Workspaces
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Departmental Workspaces
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dedicated operational quarters for each of Tinig KaBataan's 10 organizational wings.
          </p>
        </div>

        <Link
          href="/hq"
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition inline-flex items-center gap-1.5"
        >
          <Building2 className="w-4 h-4 text-sky-400" />
          <span>Switch to 3D Isometric View</span>
        </Link>
      </div>

      {/* Department Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {departments.map(dept => {
          const isSelected = dept.slug === selectedDeptSlug;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptSlug(dept.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition flex items-center gap-2 ${
                isSelected
                  ? 'bg-tk-deepblue text-white shadow-md border border-slate-600'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="text-sm font-mono">{dept.code}</span>
              <span>{dept.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Department Workspace Grid */}
      {activeDept && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Workspace Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview Banner */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-sky-400 border border-slate-800">
                  {activeDept.code} CORE QUARTERS
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  Active Sprint
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">{activeDept.name}</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {activeDept.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-900 text-center">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80">
                  <div className="text-lg font-black text-white">{activeDept.officers_count}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Officers</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80">
                  <div className="text-lg font-black text-sky-400">{deptProjects.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Initiatives</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80">
                  <div className="text-lg font-black text-amber-400">{deptTasks.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Pending Tasks</div>
                </div>
              </div>
            </div>

            {/* Department Initiatives */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-sky-400" />
                  <span>Assigned Projects & Initiatives</span>
                </h3>
                <Link href="/hq/projects" className="text-xs font-bold text-sky-400 hover:underline">
                  Manage in Kanban
                </Link>
              </div>

              {deptProjects.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No current projects registered.</p>
              ) : (
                <div className="space-y-3">
                  {deptProjects.map(p => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex justify-between font-bold text-white">
                        <span>{p.title}</span>
                        <span className="text-sky-400 font-mono">{p.progress}%</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{p.description}</p>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="bg-sky-400 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Rail: Leadership & Announcements */}
          <div className="lg:col-span-4 space-y-6">
            {/* Leadership Box */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Department Leadership
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-tk-deepblue flex items-center justify-center font-bold text-white">
                  {activeDept.head_name?.charAt(0) || 'H'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{activeDept.head_name}</h4>
                  <p className="text-slate-400 text-[11px]">{activeDept.head_title || 'Department Head'}</p>
                </div>
              </div>
            </div>

            {/* Department Dispatches */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Internal Dispatches</span>
              </h4>

              <div className="space-y-3">
                {deptAnnouncements.slice(0, 3).map(ann => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs"
                  >
                    <span className="font-bold text-white block text-[11px]">{ann.title}</span>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
