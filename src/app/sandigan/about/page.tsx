'use client';

import React from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import {
  Heart,
  ShieldCheck,
  Award,
  Users2,
  Lock,
  ArrowRight,
  Target,
  Sparkles,
  MapPin,
} from 'lucide-react';

export default function SandiganAboutPage() {
  const { isDarkMode } = useSandigan();

  const coreValues = [
    { title: 'Compassion', desc: 'Approaching every struggle without judgment, validating the human reality of pain.' },
    { title: 'Accessibility', desc: 'No paywalls, mandatory credit cards, or forced sign-ups to access psychological first aid.' },
    { title: 'Privacy & Data Integrity', desc: 'Strict compliance with RA 10173. Zero data selling, and non-invasive anonymous identifiers.' },
    { title: 'Safety & Safeguarding', desc: 'Vigilant crisis protocols coordinated by GABAY and AMARA with instant human help pathways.' },
    { title: 'Empowerment', desc: 'Equipping youth with self-regulation, grounding tools, and personalized coping safety plans.' },
    { title: 'Accountability & Human-Centered Support', desc: 'Transparent boundaries: our AI companions support, but never replace licensed clinical clinicians.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 inline-block">
          About Project Sandigan
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          "You don't have to carry it alone."
        </h1>
        <p
          className={`text-base sm:text-lg leading-relaxed ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          PROJECT SANDIGAN is an official digital mental health initiative under <strong>Tinig KaBataan (TK)</strong>, engineered to bring free, confidential emotional triage, psychoeducation, and clinical referral linkages to young Filipinos.
        </p>
      </div>

      {/* Founder & Developer Recognition (Section 1 & 14) */}
      <div
        className={`p-8 sm:p-10 rounded-3xl border shadow-lg space-y-6 ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800'
            : 'bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-emerald-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Founder & Developer
            </span>
            <h2 className="text-2xl font-black">Emmanuel James C. Dela Cruz</h2>
          </div>
        </div>

        <p
          className={`text-sm leading-relaxed ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Project Sandigan was conceptualized, architected, and developed by <strong>Emmanuel James C. Dela Cruz</strong> to address the deep gaps in mental health access experienced by Filipino youth. Driven by the conviction that stigma should never silence a person in distress, Emmanuel James envisioned a sanctuary combining modern web technologies, responsible AI ethics, and localized grassroots care—beginning with verified clinical networks in Bataan Province.
        </p>
      </div>

      {/* Connection to Tinig KaBataan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`p-8 rounded-3xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-tk-deepblue text-white flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Our Relationship with TK</h3>
          <p
            className={`text-xs leading-relaxed ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Tinig KaBataan (TK) is the parent youth institution uniting civic engagement, journalism, and leadership fellowships. <strong>PROJECT SANDIGAN</strong> operates as TK's specialized flagship mental health support platform, retaining its own distinct visual identity, dedicated AI officers, and Bataan-priority health linkages while sharing institutional governance.
          </p>
        </div>

        <div
          className={`p-8 rounded-3xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Privacy & Non-Monetization</h3>
          <p
            className={`text-xs leading-relaxed ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            We strictly enforce Republic Act No. 10173 (Philippine Data Privacy Act). We assign non-invasive random identifiers (e.g. <code>SAN-000001</code>) stored locally. We do not sell user data, nor do we feed private support conversations into external public AI training sets.
          </p>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black">Our Guiding Pillars</h2>
          <p className="text-xs text-slate-500 mt-1">
            Built upon human-centered empathy, institutional ethics, and clinical safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border space-y-2 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {val.title}
              </h4>
              <p
                className={`text-xs leading-relaxed ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
