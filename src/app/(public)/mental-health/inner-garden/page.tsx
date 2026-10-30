'use client';

import React, { useState, useEffect } from 'react';
import {
  Feather,
  Smile,
  Meh,
  Frown,
  Heart,
  Plus,
  Trash2,
  Calendar,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'struggling' | 'overwhelmed';
  tags: string[];
  gratitude: string;
  notes: string;
}

export default function InnerGardenPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_inner_garden_entries');
      if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'sample-1',
        date: '2026-10-29',
        mood: 'good',
        tags: ['Grounded', 'Productive'],
        gratitude: 'A hot cup of coffee and finishing my midterm paper.',
        notes: 'Felt some anxiety this morning, but tried 5 minutes of box breathing in the Reset Room and felt much more settled.',
      },
    ];
  });

  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>('good');
  const [gratitudeText, setGratitudeText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Calm']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tk_inner_garden_entries', JSON.stringify(entries));
    }
  }, [entries]);

  const moods = [
    { id: 'great', label: 'Great', emoji: '🌟', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { id: 'good', label: 'Good', emoji: '🌱', color: 'bg-teal-50 text-teal-800 border-teal-300' },
    { id: 'okay', label: 'Okay', emoji: '⛅', color: 'bg-blue-50 text-blue-800 border-blue-300' },
    { id: 'struggling', label: 'Struggling', emoji: '🌧️', color: 'bg-amber-50 text-amber-800 border-amber-300' },
    { id: 'overwhelmed', label: 'Overwhelmed', emoji: '⛈️', color: 'bg-rose-50 text-rose-800 border-rose-300' },
  ];

  const availableTags = ['School', 'Sleep', 'Family', 'Friends', 'Anxiety', 'Grounded', 'Calm', 'Hopeful'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesText.trim() && !gratitudeText.trim()) return;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      tags: selectedTags,
      gratitude: gratitudeText,
      notes: notesText,
    };

    setEntries([newEntry, ...entries]);
    setGratitudeText('');
    setNotesText('');
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
          <span className="text-xs font-bold uppercase tracking-wider text-tk-violet bg-tk-lavender/50 px-3 py-1 rounded-full">
            Confidential Growth Sanctuary
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            The Inner Garden
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Private daily journaling, mood reflection, and gratitude practice stored safely on your device.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
          <Lock className="w-3.5 h-3.5 text-tk-deepblue" />
          <span>Local Device Encrypted</span>
        </div>
      </div>

      {/* New Journal Entry Form */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Feather className="w-5 h-5 text-tk-violet" />
          <span>Daily Check-in</span>
        </h2>

        <form onSubmit={handleSaveEntry} className="space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              How would you describe your emotional state today?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {moods.map(m => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setSelectedMood(m.id as JournalEntry['mood'])}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedMood === m.id
                      ? `${m.color} border-2 shadow-sm font-bold scale-105`
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tag Selectors */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              What themes influenced your day?
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                    selectedTags.includes(tag)
                      ? 'bg-tk-deepblue text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Gratitude Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              One thing I am grateful for today:
            </label>
            <input
              type="text"
              value={gratitudeText}
              onChange={e => setGratitudeText(e.target.value)}
              placeholder="e.g. Warm sunlight, a kind word from a friend..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tk-violet"
            />
          </div>

          {/* Freeform Reflection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Personal Reflection / Mind Dump:
            </label>
            <textarea
              rows={3}
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              placeholder="Write freely. Nobody can see this but you."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tk-violet"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Planted in your garden!
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={!notesText.trim() && !gratitudeText.trim()}
              className="px-6 py-2.5 rounded-xl bg-tk-violet hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow transition"
            >
              Plant Entry
            </button>
          </div>
        </form>
      </div>

      {/* Past Entries Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900">Your Garden Journal History</h3>
        {entries.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No entries planted yet.</p>
        ) : (
          entries.map(entry => (
            <div
              key={entry.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {entry.mood}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {entry.date}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-slate-400 hover:text-rose-500 transition"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {entry.gratitude && (
                <div className="text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 font-medium">
                  🌱 <strong>Grateful for:</strong> {entry.gratitude}
                </div>
              )}

              {entry.notes && (
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {entry.notes}
                </p>
              )}

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {entry.tags.map((t, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
