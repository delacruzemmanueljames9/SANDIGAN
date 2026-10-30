'use client';

import React, { useState } from 'react';
import { BookOpen, HelpCircle, CheckCircle, XCircle, ChevronDown, Sparkles } from 'lucide-react';

export default function MindLabPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const modules = [
    {
      title: 'Stress vs. Clinical Anxiety: Spotting the Difference',
      tag: 'Emotional Literacy',
      desc: 'Stress is an external response to a known threat (like an upcoming thesis defense); anxiety persists even when the stressor is gone. Learn how to recognize when situational stress crosses into an anxiety disorder.',
      readTime: '5 min read',
    },
    {
      title: 'Breaking Imposter Syndrome in Filipino Academia',
      tag: 'Self-Worth',
      desc: 'Many high-achieving youth feel like frauds secretly waiting to be exposed. Discover how perfectionism and cultural expectations feed imposter feelings, and how self-compassion dissolves them.',
      readTime: '6 min read',
    },
    {
      title: 'Setting Healthy Boundaries with Family & Barkada',
      tag: 'Relationships',
      desc: 'Saying "no" without guilt is a skill. Practical scripts in Taglish for communicating emotional limits while respecting Filipino familial harmony.',
      readTime: '4 min read',
    },
  ];

  const myths = [
    {
      myth: 'Myth: Going to therapy or calling a hotline means you are "weak" or "crazy."',
      fact: 'Fact: Seeking help is an act of high emotional intelligence and courage. Mental well-being is health, just like visiting a dentist for a toothache.',
    },
    {
      myth: 'Myth: Mental health issues are just "kaartehan" or lack of prayer.',
      fact: 'Fact: Depression and anxiety involve neurochemical, psychological, and systemic social factors. Clinical support and medical science save lives.',
    },
    {
      myth: 'Myth: If I tell someone I am feeling overwhelmed, I will be a burden.',
      fact: 'Fact: Research proves that people who care about you deeply prefer hearing your struggle rather than losing you. You are worthy of support.',
    },
  ];

  const faqs = [
    {
      q: 'Does PhilHealth cover mental health consultations in the Philippines?',
      a: 'Yes. Under the Mental Health Act (RA 11036), PhilHealth provides the Mental Health Benefit Package covering outpatient consultations, psychological evaluations, and medication subsidies at accredited government healthcare facilities.',
    },
    {
      q: 'Are peer counseling conversations confidential?',
      a: 'Yes. Tinig KaBataan adheres to strict confidentiality standards. Information shared is never disclosed except when there is an immediate, life-threatening risk of physical harm to oneself or others, which triggers emergency referral procedures.',
    },
    {
      q: 'What is the National Center for Mental Health Crisis Hotline?',
      a: 'The NCMH Hotline (1553) is a 24/7, toll-free nationwide emergency helpline operated by the Department of Health (DOH). It provides free psychological first aid and hospital triage.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tk-teal bg-tk-lightblue/60 px-3 py-1 rounded-full">
          Psychoeducation Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          MindLab Knowledge Base
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Demystifying mental health, breaking generational stigmas, and providing evidence-informed psychoeducation for young Filipinos.
        </p>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-tk-teal" />
          <span>Educational Learning Guides</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {m.tag}
                  </span>
                  <span className="text-slate-400">{m.readTime}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">{m.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Myth vs Fact */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Myth vs. Reality in Philippine Culture</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myths.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 text-xs"
            >
              <div className="space-y-1">
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4 shrink-0" /> Common Stigma
                </span>
                <p className="text-slate-700 font-medium">{item.myth}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-1">
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 shrink-0" /> Evidence-Based Fact
                </span>
                <p className="text-slate-600 leading-relaxed">{item.fact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-tk-deepblue" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
