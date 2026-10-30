'use client';

import React from 'react';
import Link from 'next/link';
import { Users2, Compass, Flag, MapPin, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function YouthPage() {
  const chapters = [
    { region: 'NCR (Metro Manila)', chapters: '12 Campus Chapters', leads: '540+ Active Volunteers' },
    { region: 'Luzon (Cordillera & Southern)', chapters: '8 Campus Chapters', leads: '320+ Active Volunteers' },
    { region: 'Visayas (Cebu, Iloilo, Leyte)', chapters: '6 Campus Chapters', leads: '280+ Active Volunteers' },
    { region: 'Mindanao (Davao, Cagayan, Zamboanga)', chapters: '7 Campus Chapters', leads: '310+ Active Volunteers' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-200 flex items-center gap-2">
            <Flag className="w-4 h-4" />
            <span>Grassroots Mobilization</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            TK Youth Action Hub
          </h1>
          <p className="text-sm sm:text-base text-amber-100 leading-relaxed">
            Connecting student leaders, community organizers, and volunteer brigades across Luzon, Visayas, and Mindanao. We empower youth to lead local civic solutions.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              Department: Youth Engagement
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              Director: Joshua Miguel Dela Cruz
            </span>
          </div>
        </div>
      </div>

      {/* Nationwide Chapter Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span>Regional Presence & Campus Chapters</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">33 Active Chapters Nationwide</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chapters.map((ch, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg transition space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{ch.region}</h3>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-medium text-tk-deepblue">{ch.chapters}</p>
                <p className="text-slate-400">{ch.leads}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer Signup CTA */}
      <div className="p-8 rounded-3xl bg-tk-cream/60 border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl font-bold text-slate-900">
            Start a TK Chapter in Your School or Barangay
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We provide official charter accreditation, operational toolkits, peer mental health first aid training, and advocacy seed micro-grants for student councils.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <span>Apply for Chapter Charter</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
