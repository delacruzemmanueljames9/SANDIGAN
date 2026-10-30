import React from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Activity,
  BookOpen,
  Users,
  GraduationCap,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: 'Talk to Tinig (Peer Support)',
      desc: '24/7 guided conversational support offering empathetic active listening, emotional de-escalation, and safe next-step recommendations.',
      category: 'Mental Health',
      icon: HeartHandshake,
      color: 'bg-emerald-500',
      href: '/mental-health/talk',
      cta: 'Start Support Chat',
    },
    {
      title: 'The Reset Room',
      desc: 'Interactive guided breathing animations (4-7-8 and Box Breathing), 5-4-3-2-1 sensory grounding, and ambient soundscapes.',
      category: 'Emotional Regulation',
      icon: Activity,
      color: 'bg-teal-500',
      href: '/mental-health/reset-room',
      cta: 'Enter Reset Room',
    },
    {
      title: 'Verified Philippine Helplines Directory',
      desc: 'Free, search-and-filter database of verified Philippine crisis hotlines, hospital psychiatric units, and subsidized youth teleconsultations.',
      category: 'Crisis & Safety',
      icon: Search,
      color: 'bg-rose-500',
      href: '/mental-health/support-directory',
      cta: 'Search Hotlines',
    },
    {
      title: 'TK Publications & Gazette',
      desc: 'Digital publishing platform amplifying authentic student journalism, creative poetry, investigative reports, and youth essays.',
      category: 'Youth Media',
      icon: BookOpen,
      color: 'bg-violet-500',
      href: '/publication',
      cta: 'Read Gazette',
    },
    {
      title: 'Youth Action & Volunteer Brigades',
      desc: 'Join campus chapters, participate in community volunteer projects, and mobilize civic campaigns for education and health.',
      category: 'Civic Engagement',
      icon: Users,
      color: 'bg-amber-500',
      href: '/youth',
      cta: 'Join Action Hub',
    },
    {
      title: 'TK Leadership Academy',
      desc: 'Certified masterclasses in project management, trauma-informed peer leadership, and public policy advocacy.',
      category: 'Capacity Building',
      icon: GraduationCap,
      color: 'bg-sky-500',
      href: '/learning',
      cta: 'Explore Academy',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tk-emerald bg-tk-softgreen/50 px-3 py-1 rounded-full">
          Public Programs & Portals
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Services Designed for Filipino Youth
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          All our public services are 100% free, confidential, open-source, and dedicated to youth empowerment and emotional well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={item.href}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 hover:bg-tk-deepblue text-slate-700 hover:text-white font-bold text-xs transition duration-200"
                >
                  <span>{item.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
