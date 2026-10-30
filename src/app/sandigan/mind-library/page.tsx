'use client';

import React, { useState } from 'react';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import {
  BookOpen,
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export default function SandiganMindLibraryPage() {
  const { isDarkMode } = useSandigan();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const guides = [
    {
      title: 'Academic Perfectionism & Burnout in Philippine Schools',
      readTime: '5 min read',
      tag: 'Academic Health',
      summary: 'Why tying your human worth exclusively to grades causes acute nervous exhaustion, and practical frameworks to separate your dignity from academic metrics.',
    },
    {
      title: 'Navigating Family Expectations & Cultural Guilt (Utang na Loob)',
      readTime: '6 min read',
      tag: 'Family & Boundaries',
      summary: 'Practical communication scripts in Taglish for setting healthy emotional boundaries with parents and elders while honoring familial respect.',
    },
    {
      title: 'Anatomy of a Panic Attack: What is Happening to Your Body?',
      readTime: '4 min read',
      tag: 'Biological Psychoeducation',
      summary: 'Understanding the sympathetic nervous system, adrenaline surges, and why a rapid heart rate during panic is harmless and will naturally peak and recede.',
    },
  ];

  const myths = [
    {
      myth: 'Myth: "Nasa isip mo lang yan, kulang ka lang sa dasal o lakas ng loob."',
      fact: 'Fact: Mental health conditions involve physiological, genetic, and environmental stress factors. Faith and clinical care can harmoniously coexist; getting medical help is an act of bravery.',
    },
    {
      myth: 'Myth: "Only crazy or wealthy people go to psychiatrists in Bataan."',
      fact: 'Fact: Therapy and psychiatric check-ups are routine healthcare. In Bataan, facilities like Mariveles Mental Wellness Hospital and BGHMC provide accessible, PhilHealth-subsidized outpatient services.',
    },
    {
      myth: 'Myth: "Taking psychiatric medication will change who I am forever."',
      fact: 'Fact: Modern psychiatric medications, prescribed and monitored by certified physicians, help stabilize neurotransmitters so you can regain your natural clarity and emotional agency.',
    },
  ];

  const faqs = [
    {
      q: 'What free mental health services are available in Bataan?',
      a: 'Bataan is home to the Mariveles Mental Wellness and General Hospital (MMWGH), which provides 24/7 psychiatric emergency services, a free crisis hotline ((047) 935-4661), and outpatient psychotherapy. Bataan General Hospital and Medical Center (BGHMC Balanga) also provides psychiatric consultations covered by PhilHealth.',
    },
    {
      q: 'What are my legal rights under the Philippine Mental Health Act (RA 11036)?',
      a: 'Under RA 11036, all Filipinos have the right to accessible mental healthcare without discrimination, the right to confidentiality of health records, and educational institutions are legally mandated to establish guidance counseling and psychosocial support systems.',
    },
    {
      q: 'Does Project Sandigan record or share my private conversations?',
      a: 'Never. In strict adherence to Republic Act 10173 (Data Privacy Act of 2012), your interactions with Talk to Tinig are anonymous, non-monetized, and not used for public model training without explicit consent.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full bg-teal-500/10 inline-block">
          Curated by DUNONG (Research & Knowledge Librarian)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Mind Library & Psychoeducation
        </h1>
        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Evidence-informed psychoeducation, myth-busting resources, and youth mental health literacy written specifically for young Filipinos.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <span>Curated Learning Guides</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((g, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border shadow-sm space-y-3 flex flex-col justify-between ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400">
                    {g.tag}
                  </span>
                  <span>{g.readTime}</span>
                </div>
                <h3 className="font-bold text-sm leading-snug">{g.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {g.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Myth vs Fact */}
      <div className="space-y-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Dismantling Stigma in Philippine Culture</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myths.map((m, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border space-y-4 text-xs ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <span className="font-bold text-rose-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4 shrink-0" /> Local Misconception
                </span>
                <p className="font-medium text-slate-700 dark:text-slate-200">{m.myth}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 shrink-0" /> Scientific Fact
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{m.fact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <h2 className="text-xl font-black flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-tk-deepblue dark:text-sky-400" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border overflow-hidden ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-4"
              >
                <span>{f.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
