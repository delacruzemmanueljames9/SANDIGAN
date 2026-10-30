'use client';

import React from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Activity,
  BookOpen,
  Feather,
  PhoneCall,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smile,
  Compass,
} from 'lucide-react';

export default function MentalHealthHome() {
  const tools = [
    {
      title: 'Talk to Tinig',
      tagline: 'Conversational Emotional Support',
      desc: 'A compassionate, non-judgmental space to express what is on your mind, receive grounding suggestions, and explore next steps.',
      href: '/mental-health/talk',
      icon: HeartHandshake,
      color: 'bg-emerald-600',
      badge: '24/7 Available',
    },
    {
      title: 'Help Me Right Now',
      tagline: 'Immediate Distress Pathways',
      desc: 'Step-by-step calming triage for panic attacks, overwhelming academic stress, intense loneliness, or family friction.',
      href: '/mental-health/help-now',
      icon: Compass,
      color: 'bg-rose-500',
      badge: 'Priority Support',
    },
    {
      title: 'The Reset Room',
      tagline: 'Interactive Regulation & Grounding',
      desc: 'Guided breathing animations (Box & 4-7-8), interactive 5-4-3-2-1 sensory grounding, and soothing ambient audio generator.',
      href: '/mental-health/reset-room',
      icon: Activity,
      color: 'bg-teal-600',
      badge: 'Interactive',
    },
    {
      title: 'Inner Garden',
      tagline: 'Private Journaling & Mood Tracker',
      desc: 'A confidential digital sanctuary to track daily emotional states, record personal reflections, and cultivate gratitude.',
      href: '/mental-health/inner-garden',
      icon: Feather,
      color: 'bg-violet-600',
      badge: 'Private & Secure',
    },
    {
      title: 'MindLab',
      tagline: 'Mental Health Psychoeducation',
      desc: 'Youth-centered learning modules, myth-busting interactive cards, evidence-based coping guides, and psychiatric literacy FAQs.',
      href: '/mental-health/mindlab',
      icon: BookOpen,
      color: 'bg-sky-600',
      badge: 'Educational',
    },
    {
      title: 'Find Support Directory',
      tagline: 'Verified Philippine Helplines & Clinics',
      desc: 'Direct access to verified Philippine 24/7 crisis hotlines (NCMH 1553, Hopeline), free youth teleconsultations, and hospitals.',
      href: '/mental-health/support-directory',
      icon: Search,
      color: 'bg-amber-600',
      badge: 'Verified Directory',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Calming Sanctuary Hero */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-tk-softgreen/50 via-white to-slate-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold tracking-wide uppercase shadow-sm">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
              <span>A Safe, Compassionate Digital Sanctuary</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Bawat Hininga,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tk-emerald via-teal-600 to-tk-deepblue">
                May Halaga.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
              Welcome to Tinig KaBataan's dedicated Mental Health Platform. Whether you need immediate grounding, a non-judgmental space to vent, or verified Philippine helpline referrals, you belong here.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/mental-health/talk"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 hover:scale-105 transition"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Talk to Tinig Now</span>
              </Link>
              <Link
                href="/mental-health/help-now"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-sm transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Help Me Right Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Your Mental Wellness Suite</h2>
          <p className="text-sm text-slate-500">
            Select a pathway designed to meet you wherever you are emotionally today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link
                key={idx}
                href={tool.href}
                className="group p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${tool.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-emerald-700 block mb-0.5">
                      {tool.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Enter {tool.title}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Verified Philippine Hotlines Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> 24/7 Philippine Emergency Triage
            </span>
            <h3 className="text-2xl font-black">Need Immediate Crisis Help?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you are in danger of hurting yourself or others, please call the National Center for Mental Health (NCMH) 24/7 Crisis Hotline directly. It is completely free via landline.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="tel:1553"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call NCMH 1553</span>
            </a>
            <Link
              href="/mental-health/support-directory"
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            >
              View Full Hotline Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
