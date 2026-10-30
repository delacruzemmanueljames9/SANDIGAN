'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Award, BookOpen, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function LearningPage() {
  const courses = [
    {
      title: 'Youth Psychological First Aid (PFA) Certified Peer',
      duration: '4-Week Hybrid Course',
      level: 'Foundational',
      desc: 'Learn non-clinical active listening, crisis de-escalation, emotional stabilization techniques, and ethical referral protocols under Philippine psychological guidelines.',
      enrolled: '420 students certified',
    },
    {
      title: 'Grassroots Community Organizing & Civic Advocacy',
      duration: '3-Week Self-Paced',
      level: 'Intermediate',
      desc: 'Master the fundamentals of youth mobilization, coalition building, Sangguniang Kabataan engagement, and public campaign design.',
      enrolled: '315 students certified',
    },
    {
      title: 'Ethical Youth Journalism & Media Literacy',
      duration: '2-Week Intensive',
      level: 'Open Access',
      desc: 'Understanding child protection laws, reporting on trauma, investigative fact-checking, and combating digital disinformation.',
      enrolled: '560 students certified',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-tk-deepblue via-slate-800 to-tk-darkblue text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-tk-lightblue flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-tk-lavender" />
            <span>Capacity Building & Leadership</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            TK Leadership Academy
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Accessible, certified masterclasses, mentorship bootcamps, and peer facilitator toolkits designed to empower the next generation of Filipino changemakers.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              Department: Learning & Development
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              Director: Sofia Andrea Lim
            </span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-tk-deepblue" />
            <span>Featured Certified Courses & Fellowships</span>
          </h2>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            100% Free for Filipino Youth
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-tk-deepblue uppercase text-[10px] px-2 py-0.5 rounded-full bg-tk-lightblue/60">
                    {course.level}
                  </span>
                  <span className="text-slate-400">{course.duration}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{course.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{course.enrolled}</span>
                <Link
                  href="/contact"
                  className="font-bold text-tk-deepblue hover:underline inline-flex items-center gap-1"
                >
                  <span>Enroll Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
