'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import {
  Building2,
  BarChart3,
  Users2,
  FolderKanban,
  Library,
  Globe2,
  FileEdit,
  Bot,
  ShieldCheck,
  LogOut,
  Bell,
  Lock,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

export default function HQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, isHQAuthorized, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If public user attempts to access HQ, show strict authorization gatekeeper
  if (!isHQAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Private Virtual Headquarters</h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Access is strictly restricted to verified Tinig KaBataan officers, department heads, and platform administrators.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-left space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between text-slate-400">
              <span>Current Identity:</span>
              <span className="font-mono text-rose-400 uppercase font-bold">{currentUser.role}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              To test the Virtual Headquarters, select an authorized officer role (such as Super Admin, Admin, or Department Head) using the Role Switcher below.
            </p>
            <div className="pt-2 flex justify-center">
              <RoleSwitcher />
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              <span>Return to Public Ecosystem</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hqNavLinks = [
    { label: 'Virtual Office Map', href: '/hq', icon: Building2 },
    { label: 'Command Center', href: '/hq/command-center', icon: BarChart3 },
    { label: 'Department Hubs', href: '/hq/departments', icon: Layers },
    { label: 'Officer Directory', href: '/hq/officers', icon: Users2 },
    { label: 'Projects & Tasks', href: '/hq/projects', icon: FolderKanban },
    { label: 'Knowledge Brain', href: '/hq/knowledge', icon: Library },
    { label: 'Websites Registry', href: '/hq/websites', icon: Globe2 },
    { label: 'Content CMS', href: '/hq/cms', icon: FileEdit },
    { label: 'AI Assistants', href: '/hq/ai-assistants', icon: Bot },
    { label: 'System Audit Logs', href: '/hq/audit-logs', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      {/* Top Command Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/hq" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-tk-teal to-tk-lavender flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
              HQ
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                TINIG KABATAAN HQ
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  v2.0
                </span>
              </span>
              <span className="text-[10px] text-slate-400">
                Central Operations & Virtual Office
              </span>
            </div>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <RoleSwitcher />

          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-tk-deepblue flex items-center justify-center text-xs font-bold text-white border border-slate-700">
              {currentUser.full_name.charAt(0)}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white truncate max-w-[120px]">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main HQ Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-slate-950 border-r border-slate-800/80 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
              Command Modules
            </div>
            {hqNavLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-tk-deepblue text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Database Live State Card */}
          <div className="mt-auto p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Backend Sync
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Connected</span>
            </div>
            <p className="text-slate-500 text-[10px]">
              Supabase PostgreSQL RLS & In-Memory Store active.
            </p>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col h-full z-50">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <span className="font-bold text-sm text-white">HQ Navigation</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1 flex-1 overflow-y-auto">
                {hqNavLinks.map(link => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-tk-deepblue text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main HQ Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-900 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
