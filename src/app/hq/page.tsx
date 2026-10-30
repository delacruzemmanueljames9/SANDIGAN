'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { useAuth } from '@/lib/auth/auth-context';
import { Department } from '@/types';
import {
  Building2,
  Users2,
  FolderKanban,
  CheckCircle2,
  Clock,
  Sparkles,
  Maximize2,
  Compass,
  Layers,
  ArrowRight,
  X,
  Plus,
  Radio,
  FileText,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export default function VirtualHQPage() {
  const { departments, projects, tasks, announcements } = useEcosystem();
  const { currentUser } = useAuth();

  const [selectedDeptId, setSelectedDeptId] = useState<string | null>('dept-admin');
  const [viewMode, setViewMode] = useState<'isometric' | 'blueprint' | 'grid'>('isometric');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredDeptId, setHoveredDeptId] = useState<string | null>(null);

  // Selected department details
  const activeDept = departments.find(d => d.id === selectedDeptId) || departments[0];
  const deptProjects = projects.filter(p => p.department_id === activeDept?.id);
  const deptTasks = tasks.filter(t => t.department_id === activeDept?.id);
  const deptAnnouncements = announcements.filter(a => a.department_id === activeDept?.id);

  // Isometric Coordinates for the 10 Rooms
  const isoRooms = [
    {
      id: 'dept-admin',
      name: 'Main Administration Office',
      col: 1,
      row: 0,
      width: 2,
      height: 1.5,
      color: '#31556B',
      accent: '#64B5F6',
      icon: '🏛️',
    },
    {
      id: 'dept-mh',
      name: 'Mental Health Department',
      col: 0,
      row: 1,
      width: 1.5,
      height: 1.5,
      color: '#2E7D5B',
      accent: '#81C784',
      icon: '💚',
    },
    {
      id: 'dept-pub',
      name: 'Publication Division',
      col: 1.6,
      row: 1,
      width: 1.4,
      height: 1.5,
      color: '#6C5CE7',
      accent: '#B39DDB',
      icon: '📰',
    },
    {
      id: 'dept-youth',
      name: 'Youth Engagement Department',
      col: 3.1,
      row: 1,
      width: 1.5,
      height: 1.5,
      color: '#E8985E',
      accent: '#FFB74D',
      icon: '✊',
    },
    {
      id: 'dept-lnd',
      name: 'Learning & Development',
      col: 0,
      row: 2.6,
      width: 1.5,
      height: 1.4,
      color: '#31556B',
      accent: '#4DD0E1',
      icon: '🎓',
    },
    {
      id: 'dept-res',
      name: 'Research & Policy Division',
      col: 1.6,
      row: 2.6,
      width: 1.4,
      height: 1.4,
      color: '#4A90A4',
      accent: '#80DEEA',
      icon: '📊',
    },
    {
      id: 'dept-pcr',
      name: 'Project Coordination Room',
      col: 3.1,
      row: 2.6,
      width: 1.5,
      height: 1.4,
      color: '#31556B',
      accent: '#90CAF9',
      icon: '🗂️',
    },
    {
      id: 'dept-mtg',
      name: 'Central Assembly & Meeting Room',
      col: 0,
      row: 4.1,
      width: 1.5,
      height: 1.4,
      color: '#6C5CE7',
      accent: '#CE93D8',
      icon: '🎙️',
    },
    {
      id: 'dept-kb',
      name: 'Central Knowledge Brain',
      col: 1.6,
      row: 4.1,
      width: 1.4,
      height: 1.4,
      color: '#2E7D5B',
      accent: '#A5D6A7',
      icon: '📚',
    },
    {
      id: 'dept-ws',
      name: 'Open Officer Workspace',
      col: 3.1,
      row: 4.1,
      width: 1.5,
      height: 1.4,
      color: '#E8985E',
      accent: '#FFE082',
      icon: '💻',
    },
  ];

  // Isometric projection helper
  // Transforms grid (x, y) coordinates into isometric screen coordinates (svgX, svgY)
  const toIso = (x: number, y: number) => {
    const tileW = 140;
    const tileH = 70;
    const isoX = (x - y) * (tileW / 2) + 480;
    const isoY = (x + y) * (tileH / 2) + 70;
    return { x: isoX, y: isoY };
  };

  return (
    <div className="space-y-6">
      {/* HQ Top Status & View Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/80 p-5 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>HQ Virtual Campus Live • 10 Interactive Departments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Virtual Headquarters Campus
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any department room on the isometric floor to inspect active projects, officers, and workspace actions.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('isometric')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'isometric'
                  ? 'bg-tk-deepblue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3D Isometric</span>
            </button>

            <button
              onClick={() => setViewMode('blueprint')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'blueprint'
                  ? 'bg-tk-deepblue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Floorplan</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-tk-deepblue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>
          </div>

          {viewMode === 'isometric' && (
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.75, z - 0.1))}
                className="px-2 py-1 text-slate-400 hover:text-white font-bold"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-[11px] text-slate-300 font-mono px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(1.4, z + 0.1))}
                className="px-2 py-1 text-slate-400 hover:text-white font-bold"
                title="Zoom In"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Stage & Side Workspace Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Isometric Map / Blueprint Canvas */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl relative overflow-hidden min-h-[560px] flex items-center justify-center">
          {/* Subtle Isometric Background Grid Lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#31556B_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* VIEW 1: INTERACTIVE ISOMETRIC 2.5D SVG */}
          {viewMode === 'isometric' && (
            <div
              className="w-full flex items-center justify-center overflow-auto transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <svg
                viewBox="0 0 960 580"
                className="w-full max-w-[880px] h-auto drop-shadow-2xl select-none"
              >
                <defs>
                  {/* Gradients for 3D walls and floors */}
                  <linearGradient id="isoFloorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                  </linearGradient>

                  <linearGradient id="selectedGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
                  </linearGradient>

                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Base Foundation Platform */}
                <polygon
                  points="480,40 880,240 480,440 80,240"
                  fill="#0B1320"
                  stroke="#1E3645"
                  strokeWidth="3"
                />
                {/* Platform Front Walls */}
                <polygon
                  points="80,240 480,440 480,470 80,270"
                  fill="#060C14"
                  stroke="#1E3645"
                  strokeWidth="2"
                />
                <polygon
                  points="480,440 880,240 880,270 480,470"
                  fill="#09101C"
                  stroke="#1E3645"
                  strokeWidth="2"
                />

                {/* Render Each 2.5D Department Room */}
                {isoRooms.map(room => {
                  const dept = departments.find(d => d.id === room.id);
                  const isSelected = selectedDeptId === room.id;
                  const isHovered = hoveredDeptId === room.id;

                  // Compute top polygon vertices
                  const pTop = toIso(room.col, room.row);
                  const pRight = toIso(room.col + room.width, room.row);
                  const pBottom = toIso(room.col + room.width, room.row + room.height);
                  const pLeft = toIso(room.col, room.row + room.height);

                  // Wall extrusion height in pixels
                  const wallH = 26;

                  return (
                    <g
                      key={room.id}
                      onClick={() => setSelectedDeptId(room.id)}
                      onMouseEnter={() => setHoveredDeptId(room.id)}
                      onMouseLeave={() => setHoveredDeptId(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      {/* Left Wall */}
                      <polygon
                        points={`${pLeft.x},${pLeft.y} ${pBottom.x},${pBottom.y} ${pBottom.x},${pBottom.y + wallH} ${pLeft.x},${pLeft.y + wallH}`}
                        fill={isSelected ? '#0284C7' : '#111E2E'}
                        stroke="#1E3645"
                        strokeWidth="1.5"
                      />

                      {/* Right Wall */}
                      <polygon
                        points={`${pBottom.x},${pBottom.y} ${pRight.x},${pRight.y} ${pRight.x},${pRight.y + wallH} ${pBottom.x},${pBottom.y + wallH}`}
                        fill={isSelected ? '#0369A1' : '#0B1522'}
                        stroke="#1E3645"
                        strokeWidth="1.5"
                      />

                      {/* Roof / Floor Plane */}
                      <polygon
                        points={`${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`}
                        fill={
                          isSelected
                            ? 'url(#selectedGlow)'
                            : isHovered
                            ? '#243B53'
                            : '#162638'
                        }
                        stroke={isSelected ? '#38BDF8' : '#31556B'}
                        strokeWidth={isSelected ? '3' : '1.5'}
                        filter={isSelected ? 'url(#neonGlow)' : undefined}
                      />

                      {/* Room Label & Emoji Icon */}
                      <text
                        x={(pTop.x + pBottom.x) / 2}
                        y={(pTop.y + pBottom.y) / 2 - 4}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="var(--font-inter), sans-serif"
                        className="pointer-events-none drop-shadow"
                      >
                        {room.icon} {dept?.code || room.id}
                      </text>

                      {/* Sub-label: Active count */}
                      <text
                        x={(pTop.x + pBottom.x) / 2}
                        y={(pTop.y + pBottom.y) / 2 + 13}
                        textAnchor="middle"
                        fill="#94A3B8"
                        fontSize="9"
                        fontFamily="var(--font-inter), sans-serif"
                        className="pointer-events-none"
                      >
                        {dept?.officers_count || 0} Officers • {dept?.active_projects_count || 0} Proj
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* VIEW 2: ARCHITECTURAL BLUEPRINT VIEW */}
          {viewMode === 'blueprint' && (
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
              {departments.map(dept => {
                const isSelected = selectedDeptId === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`p-4 rounded-2xl border text-left transition space-y-2 ${
                      isSelected
                        ? 'border-sky-400 bg-sky-950/40 shadow-lg'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-sky-400">{dept.code}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white leading-tight">{dept.name}</h4>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <p>Head: {dept.head_name}</p>
                      <p>{dept.active_projects_count} Projects • {dept.officers_count} Officers</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* VIEW 3: DIRECTORY GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="w-full space-y-3 p-2">
              {departments.map(dept => (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                    selectedDeptId === dept.id
                      ? 'border-sky-400 bg-sky-950/30'
                      : 'border-slate-800 bg-slate-900 hover:bg-slate-850'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-bold">
                      {dept.code}
                    </span>
                    <h4 className="text-sm font-bold text-white">{dept.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{dept.description}</p>
                  </div>
                  <div className="text-right text-xs text-slate-400 shrink-0">
                    <p className="font-semibold text-white">{dept.head_name}</p>
                    <p>{dept.active_projects_count} active projects</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIDE WORKSPACE DRAWER: INSPECTED DEPARTMENT */}
        <div className="lg:col-span-4 bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6">
          {activeDept ? (
            <>
              {/* Header */}
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-tk-deepblue text-white">
                    {activeDept.code} WORKSPACE
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Operational
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">{activeDept.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {activeDept.description}
                </p>
              </div>

              {/* Leadership & Staffing */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department Head:</span>
                  <strong className="text-white">{activeDept.head_name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Officers:</span>
                  <span className="font-bold text-tk-lavender">{activeDept.officers_count} active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pending Tasks:</span>
                  <span className="font-bold text-amber-400">{activeDept.pending_tasks_count} items</span>
                </div>
              </div>

              {/* Active Projects in this room */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-tk-teal" />
                    <span>Active Initiatives ({deptProjects.length})</span>
                  </h4>
                  <Link
                    href="/hq/projects"
                    className="text-[11px] font-bold text-sky-400 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {deptProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-900 border border-slate-800">
                    No active initiatives assigned to this room currently.
                  </p>
                ) : (
                  deptProjects.map(proj => (
                    <div
                      key={proj.id}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex justify-between font-bold text-white">
                        <span>{proj.title}</span>
                        <span className="text-sky-400 font-mono">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-400 h-full rounded-full"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action items / tasks */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pending Action Items ({deptTasks.length})</span>
                </h4>

                {deptTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No tasks pending.</p>
                ) : (
                  <div className="space-y-2">
                    {deptTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-300 truncate max-w-[180px]">{task.title}</span>
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            task.status === 'done'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Navigation into full Department Hub */}
              <div className="pt-2 border-t border-slate-800">
                <Link
                  href={`/hq/departments#${activeDept.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow-lg transition"
                >
                  <span>Enter Full {activeDept.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500">Select a department room to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
}
