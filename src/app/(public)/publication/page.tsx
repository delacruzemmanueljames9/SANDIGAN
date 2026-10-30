'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, PenSquare, Feather, Calendar, ArrowRight, User, Sparkles } from 'lucide-react';

export default function PublicationPage() {
  const articles = [
    {
      id: 'art-1',
      title: 'Beyond the Grades: The Unspoken Mental Toll of College Midterms',
      author: 'Bea Nicole Reyes (Editor-in-Chief)',
      category: 'Investigative Feature',
      date: 'Oct 26, 2026',
      readTime: '6 min read',
      excerpt: 'Across Metro Manila and regional state universities, students are pushing past physical exhaustion. We investigate the structural drivers of academic burnout and explore how campus peer counseling desks are saving lives.',
    },
    {
      id: 'art-2',
      title: 'Mga Awit ng Pag-asa: Youth Poetry from the Visayan Islands',
      author: 'Carlos Mendoza (Literary Fellow)',
      category: 'Creative Literature',
      date: 'Oct 20, 2026',
      readTime: '4 min read',
      excerpt: 'A curated selection of poems written in Cebuano and Tagalog reflecting on island life, ecological anxieties, and the quiet beauty of communal solidarity.',
    },
    {
      id: 'art-3',
      title: 'Why Philippine Schools Must Enforce Republic Act 11036 (Mental Health Act)',
      author: 'Gabriel Ethan Tan (Policy Analyst)',
      category: 'Policy & Advocacy',
      date: 'Oct 14, 2026',
      readTime: '8 min read',
      excerpt: 'Eight years since the landmark passage of the Mental Health Act, how many educational institutions have established fully funded guidance counselors? An evidence-based analysis.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-tk-violet via-purple-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-200 flex items-center gap-2">
            <Feather className="w-4 h-4 text-tk-lavender" />
            <span>Official Youth Media & Gazette</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Tinig KaBataan Publications
          </h1>
          <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
            Amplifying authentic Filipino youth journalism, creative essays, investigative reporting, and thought leadership from campuses and communities across the archipelago.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              Department: Publication Division
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              Editor: Bea Nicole Reyes
            </span>
          </div>
        </div>
      </div>

      {/* Featured Editorial Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-tk-violet" />
            <span>Latest Gazette Issues & Features</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Issue No. 14 (Fall 2026)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <article
              key={article.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-tk-violet uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-purple-50">
                    {article.category}
                  </span>
                  <span className="text-slate-400">{article.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-tk-violet transition">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">{article.author}</span>
                <span className="text-slate-400">{article.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Call for Submissions */}
      <div className="p-8 rounded-3xl bg-tk-lavender/30 border border-purple-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PenSquare className="w-5 h-5 text-tk-violet" />
            <span>Call for Youth Writers & Poets</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Are you a student journalist, poet, or essayist? Submit your pitch for the upcoming Salin-Tinig Anthology. We provide certified editorial mentorship and publishing credits.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-tk-violet hover:bg-purple-700 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <span>Submit Editorial Pitch</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
