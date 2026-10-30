'use client';

import React from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import {
  PhoneCall,
  AlertTriangle,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Activity,
  FileText,
  Clock,
} from 'lucide-react';

export default function SandiganGetHelpNowPage() {
  const { isDarkMode } = useSandigan();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Critical Callout */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-rose-600 to-red-800 text-white shadow-xl space-y-4">
        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white inline-block">
          Immediate Emergency Intervention
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">
          You don't have to carry it alone.
        </h1>
        <p className="text-xs sm:text-sm text-rose-100 max-w-xl leading-relaxed">
          If you are having thoughts of suicide, feeling unable to keep yourself safe, or experiencing an overwhelming emotional crisis, compassionate licensed professionals are waiting to help you right now.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <a
            href="tel:1553"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-rose-700 font-black text-sm shadow-lg hover:bg-rose-50 transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call NCMH Crisis Hotline (1553)</span>
          </a>
          <a
            href="tel:0479354661"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-950/80 text-rose-100 border border-white/20 font-bold text-sm hover:bg-rose-900 transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call MMWGH Bataan ((047) 935-4661)</span>
          </a>
        </div>
      </div>

      {/* Immediate Triage Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight">4 Immediate Grounding Steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center">1</span>
            <h3 className="font-bold text-sm">Physical Safety First</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Step into a safe, well-lit room. Put away any sharp objects or harmful items immediately.
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <span className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-600 font-bold flex items-center justify-center">2</span>
            <h3 className="font-bold text-sm">Regulate Your Nervous System</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Take 4 slow breaths in through your nose, hold for 4 seconds, and exhale for 6 seconds.
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-600 font-bold flex items-center justify-center">3</span>
            <h3 className="font-bold text-sm">Connect with a Human</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Call a trusted friend, family member, or dial the NCMH hotline at 1553.
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <span className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-600 font-bold flex items-center justify-center">4</span>
            <h3 className="font-bold text-sm">Open Your Safety Plan</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Review your customized coping anchors prepared in Project Sandigan.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/sandigan/safety-plan"
          className="px-5 py-3 rounded-xl bg-tk-deepblue text-white font-bold text-xs flex items-center gap-1.5 shadow"
        >
          <FileText className="w-4 h-4" />
          <span>Open My Safety Plan</span>
        </Link>
        <Link
          href="/sandigan/reset-room"
          className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
        >
          <Activity className="w-4 h-4" />
          <span>Launch Reset Room</span>
        </Link>
        <Link
          href="/sandigan/talk"
          className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Talk to Tinig</span>
        </Link>
      </div>
    </div>
  );
}
