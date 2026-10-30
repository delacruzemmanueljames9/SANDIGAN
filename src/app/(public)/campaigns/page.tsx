'use client';

import React from 'react';
import Link from 'next/link';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { Target, Calendar, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CampaignsPage() {
  const { projects } = useEcosystem();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tk-emerald bg-tk-softgreen/50 px-3 py-1 rounded-full">
          Civic & Well-being Action
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Active Nationwide Campaigns
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          From campus mental health desks to youth policy consultations, explore our ongoing grassroots initiatives and find out how you can participate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map(proj => (
          <div
            key={proj.id}
            className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg transition space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-tk-lightblue/60 text-tk-deepblue">
                  {proj.code}
                </span>
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    proj.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {proj.status}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">{proj.title}</h3>
                <p className="text-xs font-semibold text-tk-deepblue mt-0.5">
                  Lead: {proj.lead_name} • {proj.department_name}
                </p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Initiative Progress</span>
                  <span className="text-tk-deepblue font-mono">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-tk-teal to-tk-emerald h-full rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Due {proj.due_date}
              </span>
              <Link
                href="/contact"
                className="font-bold text-tk-deepblue hover:underline inline-flex items-center gap-1"
              >
                <span>Join Volunteer Squad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
