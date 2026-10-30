'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, ChevronDown, Lock, Check } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, currentRole, switchRole, isHQAuthorized } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; hq: boolean }[] = [
    {
      role: 'super_admin',
      label: 'Super Admin',
      desc: 'Founder (Emmanuel James) — Full HQ access & controls',
      hq: true,
    },
    {
      role: 'admin',
      label: 'Platform Admin',
      desc: 'Operations (Maria Santos) — Manage all systems',
      hq: true,
    },
    {
      role: 'department_head',
      label: 'Department Head',
      desc: 'Mental Health Lead (Dr. Anton Ramos) — Dept management',
      hq: true,
    },
    {
      role: 'officer',
      label: 'TK Officer',
      desc: 'Officer (Mateo Bautista) — Workspace & task access',
      hq: true,
    },
    {
      role: 'content_reviewer',
      label: 'Content Reviewer',
      desc: 'Knowledge Officer (Janine Alcantara) — Editorial review',
      hq: true,
    },
    {
      role: 'public_user',
      label: 'Public Citizen',
      desc: 'Standard public visitor — Public services only (No HQ)',
      hq: false,
    },
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-tk-deepblue/20 bg-white/90 hover:bg-white text-xs font-semibold text-tk-deepblue shadow-sm transition"
        title="Toggle user role to test permissions"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            currentRole === 'super_admin'
              ? 'bg-amber-500'
              : isHQAuthorized
              ? 'bg-emerald-500'
              : 'bg-slate-400'
          }`}
        />
        <span className="hidden sm:inline text-slate-500">Role:</span>
        <span className="capitalize font-bold text-tk-deepblue">
          {currentRole.replace('_', ' ')}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-tk-deepblue" />
                Active Identity Switcher
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isHQAuthorized
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isHQAuthorized ? 'HQ Permitted' : 'Public Only'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Testing as: <strong className="text-slate-800">{currentUser.full_name}</strong>
            </p>
          </div>

          <div className="py-1 space-y-1">
            {roles.map(item => (
              <button
                key={item.role}
                onClick={() => {
                  switchRole(item.role);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-start justify-between gap-2 ${
                  currentRole === item.role
                    ? 'bg-tk-lightblue/40 text-tk-deepblue font-bold border border-tk-deepblue/20'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {item.hq ? (
                      <UserCheck className="w-3.5 h-3.5 text-tk-emerald" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                {currentRole === item.role && (
                  <Check className="w-4 h-4 text-tk-deepblue shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-b-lg">
            <p className="text-[10px] text-slate-500 text-center">
              Switching roles immediately recalculates server and frontend access permissions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
