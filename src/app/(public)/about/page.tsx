import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Target, Eye, Users, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-tk-teal px-3 py-1 rounded-full bg-tk-lightblue/60 inline-block">
          About Tinig KaBataan
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Empowering the Voices and Minds of Filipino Youth
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Tinig KaBataan (TK) is a youth-led, multi-service digital institution founded to address two of the most critical challenges facing young Filipinos: mental health accessibility and meaningful civic participation.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-tk-lightblue/40 to-white border border-tk-deepblue/20 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-tk-deepblue text-white flex items-center justify-center font-bold">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Our Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            A Philippines where every young person is heard, emotionally supported, and empowered to lead positive transformation in their schools, communities, and nation without stigma or barriers.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-tk-softgreen/40 to-white border border-tk-emerald/20 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-tk-emerald text-white flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Create an integrated digital ecosystem providing safe peer mental health support, grassroots leadership fellowships, investigative publication, and nationwide community mobilizations.
          </p>
        </div>
      </div>

      {/* Founding Principles & Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900">Our Core Principles</h2>
          <p className="text-sm text-slate-500 mt-1">
            Built upon youth-centered empathy, institutional integrity, and grassroots action.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <Heart className="w-8 h-8 text-rose-500" />
            <h3 className="font-bold text-slate-900">Compassion First</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every interaction is rooted in non-judgmental listening, empathy, and active emotional safety.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <ShieldCheck className="w-8 h-8 text-tk-emerald" />
            <h3 className="font-bold text-slate-900">Privacy & Data Integrity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero monetization of student data. Strict adherence to the Philippine Data Privacy Act (RA 10173).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <Users className="w-8 h-8 text-tk-violet" />
            <h3 className="font-bold text-slate-900">Grassroots Inclusion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Active chapters across Luzon, Visayas, and Mindanao, giving equal voice to provincial youth.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <Award className="w-8 h-8 text-amber-500" />
            <h3 className="font-bold text-slate-900">Transformative Leadership</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipping youth with real governance, research, and project execution capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* PROJECT SANDIGAN SPOTLIGHT & ORGANIZATIONAL HIERARCHY */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white space-y-6 border border-emerald-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/20 inline-block border border-emerald-500/30">
              Flagship Digital Mental Health Initiative
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              PROJECT SANDIGAN
            </h2>
            <p className="text-emerald-300 font-semibold text-base italic">
              &quot;You don&apos;t have to carry it alone.&quot;
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Founded and developed by <strong>Emmanuel James C. Dela Cruz</strong>, PROJECT SANDIGAN is the specialized digital mental health sanctuary of Tinig KaBataan. Designed to dismantle stigma and bridge urgent psychological support to Filipino students, it integrates 14 core services—including 24/7 conversational support, breathing rooms, private safety plans, and direct linkages to verified Bataan clinical facilities (MMWGH and BGHMC).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-xs font-mono space-y-2 shrink-0 md:w-80">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Organizational Hierarchy
            </div>
            <div className="text-slate-300 leading-relaxed whitespace-pre font-mono text-[11px]">
              {`Tinig KaBataan (TK)\n└── PROJECT SANDIGAN\n    └── Dedicated Digital Mental\n        Health Ecosystem`}
            </div>
            <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800">
              Founder &amp; Developer: Emmanuel James C. Dela Cruz
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            href="/sandigan"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg transition"
          >
            <span>Explore PROJECT SANDIGAN</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/sandigan/about"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20"
          >
            <span>Read the Sandigan Story</span>
          </Link>
        </div>
      </div>

      {/* Institutional Leadership */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-black">Institutional Governance & Accountability</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Tinig KaBataan functions through 10 autonomous departments coordinated via our central Virtual Headquarters. Our executive leadership works hand-in-hand with registered clinical psychologists, youth educators, and student council leaders.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition"
          >
            <span>View All 10 Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium text-xs hover:bg-slate-700 transition"
          >
            <span>Partner With Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
