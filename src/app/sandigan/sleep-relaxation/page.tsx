'use client';

import React from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { Moon, Sparkles, Activity, Bed, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SandiganSleepRelaxationPage() {
  const { isDarkMode } = useSandigan();

  const routines = [
    {
      step: 1,
      title: 'Digital Wind-Down (30 Mins Before Sleep)',
      desc: 'Set phones to night mode, dim overhead lights, and turn off stimulating notifications.',
    },
    {
      step: 2,
      title: 'Body Tension Release (Progressive Relaxation)',
      desc: 'Lie on your back. Starting from your toes, tense muscles for 5 seconds, then deliberately exhale and let them melt completely into the bed.',
    },
    {
      step: 3,
      title: 'The 4-7-8 Sleep Breath',
      desc: 'Inhale quietly through your nose for 4 seconds, hold gently for 7 seconds, exhale audibly through mouth for 8 seconds. Repeat 4 times.',
    },
    {
      step: 4,
      title: 'Mental Worry Box',
      desc: 'If tomorrow deadlines keep looping, write them down in the Inner Garden so your brain knows they are safely recorded for morning.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 inline-block">
          Nighttime Regulation Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Sleep & Night Relaxation
        </h1>
        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Gentle, non-pharmacological bedtime protocols to settle racing thoughts and encourage deep restorative sleep.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {routines.map(r => (
          <div
            key={r.step}
            className={`p-6 rounded-3xl border space-y-3 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-xs">
              {r.step}
            </div>
            <h3 className="font-bold text-sm">{r.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {r.desc}
            </p>
          </div>
        ))}
      </div>

      <div
        className={`p-8 rounded-3xl border text-center space-y-4 ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-purple-50/50 border-purple-200'
        }`}
      >
        <Moon className="w-8 h-8 text-purple-500 mx-auto" />
        <h3 className="text-lg font-bold">Need Ambient Sound While Falling Asleep?</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Launch continuous synthesized gentle rain or ocean waves in the Reset Room with zero external ads.
        </p>
        <Link
          href="/sandigan/reset-room"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition"
        >
          <span>Launch Night Soundscape</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
