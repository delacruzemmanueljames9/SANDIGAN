'use client';

import React from 'react';
import Link from 'next/link';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import {
  Building2,
  HeartHandshake,
  PenSquare,
  Users2,
  GraduationCap,
  LineChart,
  FolderKanban,
  Video,
  Library,
  Laptop,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function DepartmentsPage() {
  const { departments } = useEcosystem();

  const getIcon = (code: string) => {
    switch (code) {
      case 'ADMIN': return <Building2 className="w-6 h-6" />;
      case 'MHD': return <HeartHandshake className="w-6 h-6" />;
      case 'PUB': return <PenSquare className="w-6 h-6" />;
      case 'YED': return <Users2 className="w-6 h-6" />;
      case 'LND': return <GraduationCap className="w-6 h-6" />;
      case 'RES': return <LineChart className="w-6 h-6" />;
      case 'PCR': return <FolderKanban className="w-6 h-6" />;
      case 'MTG': return <Video className="w-6 h-6" />;
      case 'KB': return <Library className="w-6 h-6" />;
      default: return <Laptop className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tk-deepblue bg-tk-lightblue/60 px-3 py-1 rounded-full">
          Organizational Wings
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Tinig KaBataan Departments & Divisions
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Our specialized divisions work together to operate public youth services, conduct research, publish thought leadership, and mobilize grassroots communities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div
            key={dept.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md"
                  style={{ backgroundColor: dept.color }}
                >
                  {getIcon(dept.code)}
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {dept.code}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Department Head:</span>
                  <strong className="text-slate-900">{dept.head_name}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Active Officers:</span>
                  <span className="font-semibold text-slate-900">{dept.officers_count} members</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Active Projects:</span>
                  <span className="font-semibold text-tk-deepblue">{dept.active_projects_count} initiatives</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational
              </span>
              <Link
                href="/hq"
                className="text-xs font-bold text-tk-deepblue hover:underline inline-flex items-center gap-1"
              >
                <span>View in HQ Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
