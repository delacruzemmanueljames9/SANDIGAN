'use client';

import React from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  BookOpen,
  Users2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Compass,
  MessageCircle,
  Building,
  CheckCircle2,
  Calendar,
  Flame,
} from 'lucide-react';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { useAuth } from '@/lib/auth/auth-context';

export default function HomePage() {
  const { websites, announcements, youthVoices, projects } = useEcosystem();
  const { isHQAuthorized } = useAuth();

  const publishedPortals = websites.filter(w => w.status === 'published');
  const featuredAnnouncements = announcements.slice(0, 3);
  const featuredVoices = youthVoices.filter(v => v.status === 'published').slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-tk-lightblue/30 via-white to-slate-50 border-b border-slate-200/60">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-tk-lavender/50 to-tk-softgreen/40 blur-3xl rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>An Official Project of Tinig KaBataan: <strong>PROJECT SANDIGAN</strong></span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Your Voice Matters.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tk-deepblue via-tk-teal to-tk-emerald">
                Your Mind Matters.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
              Tinig KaBataan (TK) welcomes you to <strong>PROJECT SANDIGAN</strong> — a dedicated digital mental health ecosystem for Filipino youth. <em>&quot;You don&apos;t have to carry it alone.&quot;</em>
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/sandigan"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-700/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Enter PROJECT SANDIGAN 💙</span>
              </Link>

              <Link
                href="/sandigan/talk"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-slate-700 font-bold text-sm border border-slate-300 hover:border-emerald-600 hover:text-emerald-700 shadow-sm hover:shadow transition"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>Talk to Tinig (Support)</span>
              </Link>

              <Link
                href="/sandigan/reset-room"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-slate-700 font-bold text-sm border border-slate-300 hover:border-tk-deepblue hover:text-tk-deepblue shadow-sm hover:shadow transition"
              >
                <Activity className="w-4 h-4 text-teal-600" />
                <span>The Reset Room</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
              >
                <span>About Our Mission</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>
            </div>

            {/* Institutional Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-tk-emerald" /> Free & Confidential
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-tk-deepblue" /> Verified Philippine Hotlines
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-tk-violet" /> 10 Autonomous Departments
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-WEBSITE & AUTONOMOUS PORTALS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-tk-teal mb-2">
              Ecosystem Architecture
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Connected Autonomous Portals
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Each portal operates under its own assigned department with specialized tools, while remaining integrated into the central TK administration system.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-tk-deepblue hover:underline"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedPortals.map(portal => (
            <Link
              key={portal.id}
              href={portal.url_path}
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-tk-deepblue/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-28 h-28 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150"
                style={{ backgroundColor: portal.primary_color }}
              />

              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md"
                  style={{ backgroundColor: portal.primary_color }}
                >
                  {portal.slug === 'main' ? <Building className="w-6 h-6" /> :
                   portal.slug === 'mental-health' ? <HeartHandshake className="w-6 h-6" /> :
                   portal.slug === 'publication' ? <BookOpen className="w-6 h-6" /> :
                   portal.slug === 'youth' ? <Users2 className="w-6 h-6" /> :
                   <GraduationCap className="w-6 h-6" />}
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-block mb-1">
                    {portal.slug.toUpperCase()} PORTAL
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-tk-deepblue transition">
                    {portal.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {portal.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-tk-deepblue">
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CORE PILLARS & IMPACT METRICS */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 text-center">
            <div className="p-4 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-emerald-400">2,450+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300">
                Youth Support Sessions
              </div>
              <p className="text-[11px] text-slate-500">
                Compassionate check-ins and triage facilitated safely
              </p>
            </div>

            <div className="p-4 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-tk-lavender">30+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300">
                Partner University Chapters
              </div>
              <p className="text-[11px] text-slate-500">
                Active campus student peer counseling desks
              </p>
            </div>

            <div className="p-4 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-amber-400">100+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300">
                Youth Literary Works
              </div>
              <p className="text-[11px] text-slate-500">
                Published across the TK Gazette and anthologies
              </p>
            </div>

            <div className="p-4 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-sky-400">10</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300">
                Unified HQ Departments
              </div>
              <p className="text-[11px] text-slate-500">
                Cross-collaborative isometric virtual headquarters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT: YOUTH VOICE WALL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-tk-emerald mb-2">
              Authentic Filipino Perspectives
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              From the Youth Voice Wall
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Real reflections submitted by Filipino students on mental resilience, identity, and hope.
            </p>
          </div>
          <Link
            href="/youth-voices"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-tk-emerald hover:underline"
          >
            <span>Read All Voices & Submit Yours</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVoices.map(voice => (
            <div
              key={voice.id}
              className="p-6 rounded-3xl bg-tk-softgreen/20 border border-emerald-200/60 flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {voice.topic}
                </span>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{voice.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-200/40 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{voice.author_display_name}</span>
                <span>{voice.region}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIRTUAL HEADQUARTERS CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-tk-deepblue via-slate-900 to-tk-darkblue p-8 sm:p-12 text-white shadow-2xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-tk-lavender flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>TK Operations Sanctuary</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Explore the Private Virtual Headquarters & Operations Space
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Step into TK&apos;s interactive isometric virtual headquarters. Coordinate departmental initiatives, review live project Kanban boards, collaborate on youth welfare tasks, and access the centralized Knowledge Brain.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/hq"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-100 transition shadow-lg"
              >
                <span>Launch Isometric HQ Map</span>
                <ArrowRight className="w-4 h-4 text-tk-deepblue" />
              </Link>
              <span className="text-xs text-slate-400">
                Protected role-based workspace • Switch role in top bar
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
