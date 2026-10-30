'use client';

import React, { useState } from 'react';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { useAuth } from '@/lib/auth/auth-context';
import { Task, Project } from '@/types';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  Calendar,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Trash2,
  User,
  Filter,
} from 'lucide-react';

export default function ProjectsAndTasksPage() {
  const { projects, tasks, departments, addProject, addTask, updateTaskStatus, deleteTask } = useEcosystem();
  const { currentUser, hasPermission } = useAuth();

  const [activeTab, setActiveTab] = useState<'kanban' | 'projects'>('kanban');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // New Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProjectId, setTaskProjectId] = useState(projects[0]?.id || '');
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');

  // New Project form state
  const [projTitle, setProjTitle] = useState('');
  const [projCode, setProjCode] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projDeptId, setProjDeptId] = useState(departments[0]?.id || '');
  const [projPriority, setProjPriority] = useState<Project['priority']>('medium');
  const [projDueDate, setProjDueDate] = useState('');

  const filteredTasks = selectedDeptFilter === 'all'
    ? tasks
    : tasks.filter(t => t.department_id === selectedDeptFilter);

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const inReviewTasks = filteredTasks.filter(t => t.status === 'in_review');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const proj = projects.find(p => p.id === taskProjectId);

    addTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      project_id: taskProjectId,
      project_title: proj?.title || 'General Initiative',
      department_id: proj?.department_id || 'dept-admin',
      priority: taskPriority,
      due_date: taskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assigned_to: currentUser.id,
      assignee_name: currentUser.full_name,
    });

    setTaskTitle('');
    setTaskDesc('');
    setShowNewTaskModal(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const dept = departments.find(d => d.id === projDeptId);

    addProject({
      title: projTitle.trim(),
      code: projCode.trim() || `TK-${Math.floor(100 + Math.random() * 900)}`,
      description: projDesc.trim(),
      department_id: projDeptId,
      department_name: dept?.name,
      priority: projPriority,
      due_date: projDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });

    setProjTitle('');
    setProjCode('');
    setProjDesc('');
    setShowNewProjectModal(false);
  };

  const advanceTask = (task: Task) => {
    if (task.status === 'todo') updateTaskStatus(task.id, 'in_progress');
    else if (task.status === 'in_progress') updateTaskStatus(task.id, 'in_review');
    else if (task.status === 'in_review') updateTaskStatus(task.id, 'done');
  };

  const regressTask = (task: Task) => {
    if (task.status === 'done') updateTaskStatus(task.id, 'in_review');
    else if (task.status === 'in_review') updateTaskStatus(task.id, 'in_progress');
    else if (task.status === 'in_progress') updateTaskStatus(task.id, 'todo');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tk-teal">
            Project Operations & Sprints
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Projects & Task Workflows
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-departmental Kanban tracking, sprint goals, and initiative milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg font-bold ${
                activeTab === 'kanban' ? 'bg-tk-deepblue text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-lg font-bold ${
                activeTab === 'projects' ? 'bg-tk-deepblue text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Projects List
            </button>
          </div>

          <button
            onClick={() => setShowNewTaskModal(true)}
            className="px-4 py-2 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>

          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>New Initiative</span>
          </button>
        </div>
      </div>

      {/* Department Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Department:
        </span>
        <button
          onClick={() => setSelectedDeptFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition ${
            selectedDeptFilter === 'all'
              ? 'bg-white text-slate-950 font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Departments
        </button>
        {departments.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDeptFilter(d.id)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedDeptFilter === d.id
                ? 'bg-white text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {d.code}
          </button>
        ))}
      </div>

      {/* TAB 1: KANBAN BOARD */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* TO DO COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                To Do
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{todoTasks.length}</span>
            </div>

            <div className="space-y-3">
              {todoTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-900 text-sky-400">
                      {task.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-600 hover:text-rose-400 transition"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Due {task.due_date}</span>
                    <button
                      onClick={() => advanceTask(task)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-0.5"
                    >
                      <span>Start</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold uppercase text-sky-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                In Progress
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">{inProgressTasks.length}</span>
            </div>

            <div className="space-y-3">
              {inProgressTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-sky-900/40 space-y-3 hover:border-sky-500/60 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-sky-950 text-sky-300">
                      {task.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-600 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                    <button
                      onClick={() => regressTask(task)}
                      className="text-slate-400 hover:text-white flex items-center gap-0.5"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => advanceTask(task)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-0.5"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IN REVIEW COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                In Review
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">{inReviewTasks.length}</span>
            </div>

            <div className="space-y-3">
              {inReviewTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-amber-900/40 space-y-3 hover:border-amber-500/60 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">
                      {task.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-600 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                    <button
                      onClick={() => regressTask(task)}
                      className="text-slate-400 hover:text-white flex items-center gap-0.5"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => advanceTask(task)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5"
                    >
                      <span>Approve</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPLETED COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Done
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">{doneTasks.length}</span>
            </div>

            <div className="space-y-3">
              {doneTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-950 space-y-3 opacity-90"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400">
                      Completed
                    </span>
                    <button
                      onClick={() => regressTask(task)}
                      className="text-slate-600 hover:text-amber-400 text-[10px]"
                    >
                      Reopen
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-slate-300 line-through leading-snug">{task.title}</h4>
                  <div className="text-[10px] text-slate-500">Assigned: {task.assignee_name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS LIST */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(proj => (
            <div
              key={proj.id}
              className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-sky-400">
                    {proj.code}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{proj.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                </div>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    proj.status === 'active'
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {proj.status}
                </span>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Completion</span>
                  <span className="text-sky-400 font-mono">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: `${proj.progress}%` }} />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
                <span>Lead: {proj.lead_name}</span>
                <span>Due {proj.due_date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Task</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Draft Visayas Summit Delegate Guide"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Parent Project</label>
                <select
                  value={taskProjectId}
                  onChange={e => setTaskProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as Task['priority'])}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Specific requirements or resources..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition mt-2"
              >
                Add to Sprint Board
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Launch New Initiative</h3>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Initiative Title</label>
                <input
                  type="text"
                  value={projTitle}
                  onChange={e => setProjTitle(e.target.value)}
                  placeholder="e.g. Project Silong: Campus Mental Health Desks"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Project Code</label>
                  <input
                    type="text"
                    value={projCode}
                    onChange={e => setProjCode(e.target.value)}
                    placeholder="e.g. PS-2026"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Department</label>
                  <select
                    value={projDeptId}
                    onChange={e => setProjDeptId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={projDueDate}
                  onChange={e => setProjDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Summary / Objective</label>
                <textarea
                  rows={3}
                  value={projDesc}
                  onChange={e => setProjDesc(e.target.value)}
                  placeholder="Scope, partner organizations, key outputs..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition mt-2"
              >
                Register Initiative
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
