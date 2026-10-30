'use client';

import React from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { Compass, CheckCircle2, Award, ArrowRight, Sparkles } from 'lucide-react';

export default function SandiganGrowthJourneyPage() {
  const { isDarkMode } = useSandigan();

  const milestones = [
    {
      level: 1,
      title: 'Foundation: Emotional Self-Awareness',
      desc: 'Recognizing personal physical and emotional cues before burnout reaches a breaking point.',
      action: 'Complete your first Mental Wellness Check',
      path: '/sandigan/wellness-check',
      done: true,
    },
    {
      level: 2,
      title: 'Safety Anchor: Building Your Safety Plan',
      desc: 'Cataloging your personal warning signs, internal coping tools, safe places, and emergency contacts.',
      action: 'Set up My Safety Plan',
      path: '/sandigan/safety-plan',
      done: true,
    },
    {
      level: 3,
      title: 'Nervous Regulation: Habitual Grounding',
      desc: 'Mastering Box Breathing and 5-4-3-2-1 sensory awareness when panic attacks flare up.',
      action: 'Practice in the Reset Room',
      path: '/sandigan/reset-room',
      done: false,
    },
    {
      level: 4,
      title: 'Healthy Boundaries & Asking for Help',
      desc: 'Learning to say "no" without guilt, and understanding clinical referral pathways in Bataan.',
      action: 'Explore Bataan Services',
      path: '/sandigan/find-support',
      done: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 inline-block">
          Accompanied by SIKLAB (Growth & Resilience Lead)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Personal Growth Journey
        </h1>
        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          A self-paced, non-judgmental path toward emotional self-regulation, boundary building, and sustainable resilience.
        </p>
      </div>

      <div className="space-y-4">
        {milestones.map(m => (
          <div
            key={m.level}
            className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  m.done
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {m.done ? <CheckCircle2 className="w-5 h-5" /> : m.level}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm">{m.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  {m.desc}
                </p>
              </div>
            </div>

            <Link
              href={m.path}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition shrink-0 self-end sm:self-auto"
            >
              <span>{m.action}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
