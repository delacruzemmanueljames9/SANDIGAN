'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { Calendar, Tag, User, ArrowRight, Bell, Sparkles } from 'lucide-react';

export default function NewsPage() {
  const { announcements } = useEcosystem();
  const [filter, setFilter] = useState<'all' | 'announcements' | 'updates'>('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tk-violet bg-tk-lavender/50 px-3 py-1 rounded-full">
          Official Dispatches
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          News & Organization Announcements
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Stay informed on national initiatives, program launches, policy recommendations, and student opportunities.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {announcements.map(ann => (
          <div
            key={ann.id}
            className={`p-6 sm:p-8 rounded-3xl bg-white border transition shadow-sm hover:shadow-md ${
              ann.is_pinned ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {ann.is_pinned && (
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Pinned
                </span>
              )}
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  ann.priority === 'urgent'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {ann.priority}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(ann.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {ann.department_name && (
                <span className="text-xs text-tk-deepblue font-semibold">
                  • {ann.department_name}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{ann.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
              {ann.content}
            </p>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <User className="w-3.5 h-3.5 text-slate-400" />
                By {ann.created_by_name}
              </span>
              <span className="capitalize text-slate-400 font-mono text-[11px]">
                Audience: {ann.target_audience.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
