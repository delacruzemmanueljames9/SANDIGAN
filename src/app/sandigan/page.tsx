'use client';

import React from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import {
  HeartHandshake,
  Activity,
  Feather,
  BookOpen,
  Search,
  PhoneCall,
  CheckCircle2,
  Users2,
  Smile,
  Moon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileText,
  MapPin,
  Bot,
  Award,
} from 'lucide-react';

export default function SandiganHomePage() {
  const { isDarkMode, session, setShowEmergencyModal, officers } = useSandigan();

  const services = [
    {
      title: 'Talk to Tinig',
      tagline: 'Listening & Guidance Modes',
      desc: '24/7 conversational support with adaptive modes, customizable tone, and gentle companion presence.',
      href: '/sandigan/talk',
      icon: HeartHandshake,
      color: 'bg-emerald-600',
      badge: 'Listening & Guidance',
    },
    {
      title: 'Mental Wellness Check',
      tagline: '7-Question Self-Check',
      desc: 'Anonymous, 5–7 question indicator to gauge burnout, sleep, anxiety, and hope scored gently by SIKLAB.',
      href: '/sandigan/wellness-check',
      icon: CheckCircle2,
      color: 'bg-amber-600',
      badge: 'Anonymous Score',
    },
    {
      title: 'Get Help Now',
      tagline: 'Emergency Crisis Triage',
      desc: 'Immediate emergency hotlines with direct access to NCMH 1553 and Mariveles Mental Wellness Hospital.',
      href: '/sandigan/get-help-now',
      icon: PhoneCall,
      color: 'bg-rose-600',
      badge: '24/7 Urgent',
    },
    {
      title: 'My Safety Plan',
      tagline: 'Personal Crisis Coping Tool',
      desc: 'Private step-by-step plan for your warning signs, coping habits, trusted contacts, and safe places.',
      href: '/sandigan/safety-plan',
      icon: FileText,
      color: 'bg-sky-600',
      badge: 'Confidential',
    },
    {
      title: 'The Reset Room',
      tagline: 'Breathing & Grounding',
      desc: 'Box breathing (4-4-4-4), 4-7-8 relaxation, 5-4-3-2-1 sensory grounding, and synthesized rain soundscapes.',
      href: '/sandigan/reset-room',
      icon: Activity,
      color: 'bg-teal-600',
      badge: 'Interactive',
    },
    {
      title: 'Inner Garden',
      tagline: 'Private Emotional Journal',
      desc: 'Local-device encrypted journaling, mood reflections, and gratitude tracking without required registration.',
      href: '/sandigan/inner-garden',
      icon: Feather,
      color: 'bg-violet-600',
      badge: 'Private Storage',
    },
    {
      title: 'Mind Library',
      tagline: 'Mental Health Education',
      desc: 'Curated by DUNONG. Youth psychoeducation, myth-busting cards, and Philippine Mental Health Act guides.',
      href: '/sandigan/mind-library',
      icon: BookOpen,
      color: 'bg-indigo-600',
      badge: 'Psychoeducation',
    },
    {
      title: 'Find Support (Bataan Focus)',
      tagline: 'Verified Clinic Directory',
      desc: 'Curated by KAWING. Verified care facilities prioritizing Bataan (MMWGH, BGHMC Balanga) and nationwide.',
      href: '/sandigan/find-support',
      icon: Search,
      color: 'bg-blue-600',
      badge: 'Bataan Priority',
    },
    {
      title: 'Sleep & Relaxation Center',
      tagline: 'Bedtime Regulation',
      desc: 'Wind-down protocols, progressive muscle relaxation, and evening affirmations managed by SINAG.',
      href: '/sandigan/sleep-relaxation',
      icon: Moon,
      color: 'bg-purple-600',
      badge: 'Night Care',
    },
    {
      title: 'Daily Wellness Companion',
      tagline: 'Gentle Habit Reflections',
      desc: 'Daily micro-reflections and hydration/rest encouragement delivered every morning by SINAG.',
      href: '/sandigan/daily-companion',
      icon: Sparkles,
      color: 'bg-emerald-600',
      badge: 'Daily Support',
    },
    {
      title: 'Personal Growth Journey',
      tagline: 'Resilience Milestones',
      desc: 'Self-paced emotional milestones, boundary-setting guides, and coping practice accompanied by SIKLAB.',
      href: '/sandigan/growth-journey',
      icon: Compass,
      color: 'bg-amber-600',
      badge: 'Self-Paced',
    },
    {
      title: 'Safe Community',
      tagline: 'Moderated Peer Sharing',
      desc: 'Voice of the Community moderated by TALA. Read uplifting reflections from fellow youth across the country.',
      href: '/sandigan/community',
      icon: Users2,
      color: 'bg-rose-500',
      badge: 'Safe Peer Space',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section
        className={`relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b ${
          isDarkMode
            ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-slate-800'
            : 'bg-gradient-to-b from-tk-softgreen/50 via-white to-slate-50 border-emerald-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>An Official Project of Tinig KaBataan (TK)</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              PROJECT SANDIGAN
            </h1>

            <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-tk-deepblue">
              "You don't have to carry it alone."
            </p>

            <p
              className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              A compassionate, digital mental health initiative providing immediate crisis triage, confidential AI companionship, evidence-based coping tools, and verified connections to psychiatric care in Bataan and across the Philippines.
            </p>

            {/* Anonymous session status pill */}
            <div className="inline-flex items-center gap-2 p-2 px-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>
                Anonymous Device Session Active: <strong className="font-mono text-sky-500">{session.anonymousId}</strong>
              </span>
              <span className="text-slate-400 hidden sm:inline">(No registration required)</span>
            </div>

            {/* Hero Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/sandigan/talk"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 hover:scale-105 transition"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Talk to Tinig Now</span>
              </Link>

              <Link
                href="/sandigan/wellness-check"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Take Wellness Check</span>
              </Link>

              <button
                onClick={() => setShowEmergencyModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-sm transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Get Help Right Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BATAAN VERIFIED CARE PRIORITY STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-md ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50/60 border-blue-200'
          }`}
        >
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Priority Healthcare Integration: Bataan Province
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Connected with Verified Bataan Hospitals & Clinics
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              PROJECT SANDIGAN initially prioritizes verified clinical partnerships in Bataan, including the <strong>Mariveles Mental Wellness and General Hospital (MMWGH)</strong> and the <strong>Bataan General Hospital and Medical Center (BGHMC Balanga)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/sandigan/find-support"
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <span>Explore Bataan Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN 12 SERVICES SUITE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Comprehensive Digital Health Suite
          </span>
          <h2 className="text-3xl font-black tracking-tight">
            Explore All Project Sandigan Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            No forced registrations. Everything is designed to be gentle, accessible, and protective of your privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`group p-6 sm:p-7 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between space-y-5 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                    : 'bg-white border-slate-200/80 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        isDarkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      {item.tagline}
                    </span>
                    <h3 className="text-lg font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Open {item.title}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* MEET THE SEVEN AI OFFICERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`p-8 sm:p-12 rounded-3xl border shadow-xl space-y-8 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Bot className="w-4 h-4" /> Seven AI Officers — Virtual Headquarters
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Autonomous Virtual Department Officers
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Project Sandigan's operations are coordinated by 7 specialized AI agents, each with assigned responsibilities, persistent memory, and strict safeguard boundaries.
              </p>
            </div>

            <Link
              href="/sandigan/command-center"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition shrink-0"
            >
              <span>Enter Founder Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {officers.map(officer => (
              <div
                key={officer.id}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{officer.avatar}</span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    {officer.department}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{officer.name}</h4>
                  <p className="text-xs text-sky-400 font-medium">{officer.role}</p>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {officer.personality}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER & DEVELOPER RECOGNITION (Section 1 & 14) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Founder & Developer Attribution
            </span>
            <h3 className="text-xl font-black">
              Conceived & Built by Emmanuel James C. Dela Cruz
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              An official flagship project under Tinig KaBataan (TK). Dedicated to ensuring every Filipino young person finds compassion, emotional safety, and a hand to hold in moments of struggle.
            </p>
          </div>

          <Link
            href="/sandigan/about"
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition shrink-0"
          >
            Read Our Official Story
          </Link>
        </div>
      </section>
    </div>
  );
}
