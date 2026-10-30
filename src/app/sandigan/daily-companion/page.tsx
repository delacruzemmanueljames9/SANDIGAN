'use client';

import React, { useState } from 'react';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { Sparkles, Sun, CheckCircle2, Heart, Coffee, Droplets } from 'lucide-react';

export default function SandiganDailyCompanionPage() {
  const { session, isDarkMode } = useSandigan();

  const [drankWater, setDrankWater] = useState(false);
  const [tookBreak, setTookBreak] = useState(false);
  const [breathedDeep, setBreathedDeep] = useState(false);

  const affirmations = [
    '"You don\'t have to be perfect today; showing up with kindness for yourself is enough."',
    '"Rest is not a reward you have to earn; it is basic maintenance for a human soul."',
    '"Your value does not decrease based on someone else\'s inability to see your worth."',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 inline-block">
          Delivered by SINAG (Daily Companion Lead)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Daily Wellness Companion
        </h1>
        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Gentle daily micro-habits, affirmations, and self-compassion reminders to accompany your routine.
        </p>
      </div>

      {/* Daily Affirmation Card */}
      <div
        className={`p-8 rounded-3xl border shadow-lg text-center space-y-3 ${
          isDarkMode
            ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-900/60'
            : 'bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-emerald-200'
        }`}
      >
        <span className="text-3xl">☀️</span>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
          Today's Reflection
        </span>
        <blockquote className="text-base sm:text-lg font-bold italic leading-relaxed text-slate-800 dark:text-slate-100 max-w-lg mx-auto">
          {affirmations[0]}
        </blockquote>
        <span className="text-[11px] text-slate-400 block">Accompanied by SINAG</span>
      </div>

      {/* Micro Self-Care Habit Check-in */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <h3 className="text-base font-bold flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Gentle Daily Check-in</span>
        </h3>

        <div className="space-y-3 text-xs">
          <button
            onClick={() => setDrankWater(!drankWater)}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
              drankWater
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>I drank at least one full glass of water today</span>
            </span>
            <CheckCircle2 className={`w-4 h-4 ${drankWater ? 'text-emerald-500' : 'text-slate-300'}`} />
          </button>

          <button
            onClick={() => setTookBreak(!tookBreak)}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
              tookBreak
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>I stepped away from my study desk for a 5-minute break</span>
            </span>
            <CheckCircle2 className={`w-4 h-4 ${tookBreak ? 'text-emerald-500' : 'text-slate-300'}`} />
          </button>

          <button
            onClick={() => setBreathedDeep(!breathedDeep)}
            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
              breathedDeep
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-emerald-500" />
              <span>I took 3 slow, deep breaths to reset my shoulders and jaw</span>
            </span>
            <CheckCircle2 className={`w-4 h-4 ${breathedDeep ? 'text-emerald-500' : 'text-slate-300'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
