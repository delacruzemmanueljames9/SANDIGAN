'use client';

import React, { useState, useEffect } from 'react';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import {
  Feather,
  Smile,
  Calendar,
  Lock,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SandiganJournalEntry {
  id: string;
  date: string;
  mood: string;
  gratitude: string;
  reflection: string;
}

export default function SandiganInnerGardenPage() {
  const { session, isDarkMode } = useSandigan();

  const [entries, setEntries] = useState<SandiganJournalEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sandigan_garden_journal');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return [
      {
        id: 'init-garden-1',
        date: '2026-10-30',
        mood: 'Grateful & Grounded 🌱',
        gratitude: 'A quiet morning with hot coffee and knowing I have a safe space to vent.',
        reflection: 'Midterms were heavy this week, but remembering that I do not have to carry everything by myself helped lower my anxiety.',
      },
    ];
  });

  const [mood, setMood] = useState('Hopeful 🌱');
  const [gratitude, setGratitude] = useState('');
  const [reflection, setReflection] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sandigan_garden_journal', JSON.stringify(entries));
    }
  }, [entries]);

  const moods = [
    'Peaceful 🌿',
    'Hopeful 🌱',
    'Tired ⛅',
    'Anxious 🌧️',
    'Overwhelmed ⛈️',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection.trim() && !gratitude.trim()) return;

    const newEntry: SandiganJournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood,
      gratitude: gratitude.trim(),
      reflection: reflection.trim(),
    };

    setEntries([newEntry, ...entries]);
    setGratitude('');
    setReflection('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 px-3 py-1 rounded-full bg-violet-500/10 inline-block">
            Private Journal Sanctuary
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
            The Inner Garden
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Confidential daily reflections and gratitude practices stored locally on your device under anonymous ID <strong className="font-mono text-violet-500">{session.anonymousId}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-violet-500" />
          <span>Device Encrypted</span>
        </div>
      </div>

      {/* New Entry Form */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-md space-y-6 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <h2 className="text-base font-black flex items-center gap-2">
          <Feather className="w-4 h-4 text-violet-500" />
          <span>Plant a Reflection</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div>
            <label className="block font-bold mb-2">How is your heart feeling today?</label>
            <div className="flex flex-wrap gap-2">
              {moods.map(m => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMood(m)}
                  className={`px-3.5 py-1.5 rounded-xl border font-semibold transition ${
                    mood === m
                      ? 'bg-violet-600 text-white border-violet-600 font-bold'
                      : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">One thing I am grateful for today:</label>
            <input
              type="text"
              value={gratitude}
              onChange={e => setGratitude(e.target.value)}
              placeholder="e.g. A kind message, clean air, completing my assignment..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Freeform Reflection / Emotional Release:</label>
            <textarea
              rows={4}
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Write whatever is on your mind. Nobody has access to this but you."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Entry planted in garden!
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={!reflection.trim() && !gratitude.trim()}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold shadow transition"
            >
              Save Reflection
            </button>
          </div>
        </form>
      </div>

      {/* Past Entries */}
      <div className="space-y-4">
        <h3 className="text-base font-bold">Past Garden Entries</h3>
        {entries.map(entry => (
          <div
            key={entry.id}
            className={`p-6 rounded-2xl border space-y-3 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-violet-500">{entry.mood}</span>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5" /> {entry.date}
                </span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="hover:text-rose-500 transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {entry.gratitude && (
              <div className="text-xs p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 font-medium">
                🌱 <strong>Grateful for:</strong> {entry.gratitude}
              </div>
            )}

            {entry.reflection && (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {entry.reflection}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
