'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  PhoneCall,
  Activity,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Compass,
  Sparkles,
} from 'lucide-react';

export default function HelpMeRightNowPage() {
  const [selectedPathway, setSelectedPathway] = useState<string>('panic');

  const pathways = [
    {
      id: 'panic',
      title: 'Panic Attack / Chest Tightness',
      icon: Activity,
      color: 'bg-rose-500',
      immediateSteps: [
        'Notice your feet firmly resting against the floor. Press down slightly.',
        'Inhale through your nose for 4 counts, pause, and exhale slowly through your mouth like blowing through a straw for 6 counts.',
        'Find 3 things in your room that are blue or green. Name them out loud.',
        'Remember: A panic attack is an adrenaline surge. It is temporary and cannot harm you.',
      ],
      quickTool: '/mental-health/reset-room',
      toolLabel: 'Launch Interactive Breathing Sphere',
    },
    {
      id: 'burnout',
      title: 'Academic Overwhelm & Exhaustion',
      icon: Compass,
      color: 'bg-amber-500',
      immediateSteps: [
        'Step away from your screen or study desk for the next 5 minutes.',
        'Drink a glass of cold water slowly, noticing the temperature and sensation.',
        'Pick the single smallest task (e.g. reading 1 page or writing 1 sentence) and set everything else aside for now.',
        'Remind yourself: Your grades reflect your current assignment, not your human worth.',
      ],
      quickTool: '/mental-health/inner-garden',
      toolLabel: 'Write in Private Inner Garden',
    },
    {
      id: 'loneliness',
      title: 'Intense Loneliness & Isolation',
      icon: HeartHandshake,
      color: 'bg-violet-500',
      immediateSteps: [
        'Wrap a warm blanket around your shoulders or place a gentle hand over your heart.',
        'Listen to our soothing rain or wave soundscapes in the Reset Room.',
        'Read messages left by Filipino youth who felt the same way on our Youth Voice Wall.',
        'Consider sending a simple "thinking of you" message to one friend or peer counselor.',
      ],
      quickTool: '/youth-voices',
      toolLabel: 'Read Youth Voice Wall',
    },
    {
      id: 'family',
      title: 'Family Conflict & Emotional Tension',
      icon: AlertTriangle,
      color: 'bg-sky-500',
      immediateSteps: [
        'Physically step into a neutral, quiet room or outdoor space to regulate your nervous system.',
        'Write out your anger or hurt on paper without censoring; you do not have to show anyone.',
        'Remind yourself: You cannot control others\' emotional reactions, only your own boundaries.',
        'If home feels physically unsafe, reach out to trusted barangay, campus, or crisis helplines immediately.',
      ],
      quickTool: '/mental-health/support-directory',
      toolLabel: 'View Verified Referral Helplines',
    },
  ];

  const current = pathways.find(p => p.id === selectedPathway) || pathways[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Urgent Emergency Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-600 to-red-800 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white inline-block">
              Immediate Safety Intervention
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">In Crisis Right Now?</h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
              If you are in danger of harming yourself, feeling suicidal, or cannot stay safe, free and confidential licensed counselors are ready to speak with you 24/7 in the Philippines.
            </p>
          </div>
          <a
            href="tel:1553"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-rose-700 font-black text-sm shadow-lg hover:bg-rose-50 transition shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call NCMH 1553 (Toll-Free)</span>
          </a>
        </div>
      </div>

      {/* Guided Distress Pathways Triage */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tk-emerald">
            Guided Relief Steps
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            What are you feeling right now?
          </h2>
          <p className="text-xs text-slate-500">
            Select what best matches your emotional distress to receive immediate step-by-step stabilization guidance.
          </p>
        </div>

        {/* Pathway Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pathways.map(p => {
            const Icon = p.icon;
            const isSelected = p.id === selectedPathway;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPathway(p.id)}
                className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
                  isSelected
                    ? 'border-tk-deepblue bg-tk-lightblue/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${p.color} text-white flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{p.title}</h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Pathway Checklist */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b pb-4">
            <h3 className="text-xl font-black text-slate-900">{current.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow these immediate grounding steps in order. Take as long as you need.
            </p>
          </div>

          <div className="space-y-4">
            {current.immediateSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-tk-deepblue text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href={current.quickTool}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition"
            >
              <span>{current.toolLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/mental-health/talk"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Prefer to talk to someone? Start Talk to Tinig</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
