'use client';

import React from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { ShieldCheck, PhoneCall, Heart, MapPin, ExternalLink, Award } from 'lucide-react';

export const SandiganFooter: React.FC = () => {
  const { isDarkMode, setShowEmergencyModal } = useSandigan();

  return (
    <footer
      className={`pt-16 pb-12 border-t transition-colors ${
        isDarkMode
          ? 'bg-slate-950 text-slate-400 border-slate-800'
          : 'bg-slate-900 text-slate-300 border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Identity & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-tk-emerald via-teal-600 to-tk-deepblue flex items-center justify-center text-white font-black text-xl shadow-md">
                PS
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">PROJECT SANDIGAN</span>
                <p className="text-xs text-emerald-400 font-medium">An Official Project of Tinig KaBataan</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              <em>"You don't have to carry it alone."</em> A dedicated digital mental health initiative providing free, safe, confidential peer support, psychological first aid, and direct connections to verified care in Bataan and nationwide.
            </p>

            {/* Founder Credit (Section 1 & 14) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Founder & Developer:</span>
                <strong className="text-white">Emmanuel James C. Dela Cruz</strong>
              </div>
              <p className="text-[11px] text-slate-400">
                Architected with deep dedication to Filipino youth well-being and community empowerment.
              </p>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Support Services</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/sandigan/talk" className="hover:text-emerald-300 transition">Talk to Tinig (Chat)</Link></li>
              <li><Link href="/sandigan/wellness-check" className="hover:text-emerald-300 transition">Mental Wellness Check</Link></li>
              <li><Link href="/sandigan/reset-room" className="hover:text-emerald-300 transition">The Reset Room</Link></li>
              <li><Link href="/sandigan/inner-garden" className="hover:text-emerald-300 transition">Inner Garden (Journal)</Link></li>
              <li><Link href="/sandigan/safety-plan" className="hover:text-emerald-300 transition">My Safety Plan</Link></li>
              <li><Link href="/sandigan/mind-library" className="hover:text-emerald-300 transition">Mind Library</Link></li>
            </ul>
          </div>

          {/* Bataan Clinical Priority */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Bataan Care Priority</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-white block">Mariveles Mental Hospital</span>
                <span className="text-emerald-400 font-mono text-xs">(047) 935-4661</span>
                <span className="text-slate-400 block text-[10px] mt-0.5">24/7 Crisis Triage</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-white block">BGHMC Psychiatry Unit</span>
                <span className="text-slate-300 font-mono text-xs">(047) 237-9770</span>
                <span className="text-slate-400 block text-[10px] mt-0.5">Balanga City, Bataan</span>
              </div>
            </div>
          </div>

          {/* Crisis Hotlines & Parent Connection */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency 24/7</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-900/60 text-rose-200">
                <strong className="block text-white">NCMH Crisis Line: 1553</strong>
                <span className="text-[11px] text-rose-300">Toll-free via landline 24/7</span>
              </div>
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Launch Get Help Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Privacy & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Compliant with Republic Act No. 10173 (Philippine Data Privacy Act). Zero user monetization.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/sandigan/about" className="hover:text-slate-300 transition">About Sandigan</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy Pledge</Link>
            <Link href="/terms" className="hover:text-slate-300 transition">Clinical Disclaimer</Link>
            <Link href="/" className="hover:text-slate-300 transition">Tinig KaBataan Central</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
