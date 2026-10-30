import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-tk-deepblue to-tk-teal flex items-center justify-center text-white font-black text-xl shadow-md">
                TK
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">TINIG KABATAAN</span>
                <p className="text-xs text-emerald-400 font-medium">Your Voice Matters. Your Mind Matters.</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A united Philippine digital institution empowering youth through accessible, stigma-free mental health support, grassroots civic participation, transformative leadership development, and investigative publication.
            </p>
            <p className="text-xs text-emerald-300/90 leading-relaxed max-w-md font-medium">
              Home of <strong>PROJECT SANDIGAN</strong> — <em>"You don't have to carry it alone."</em> Founded and developed by Emmanuel James C. Dela Cruz.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Compliant with Republic Act No. 10173 (Philippine Data Privacy Act of 2012).</span>
            </div>
          </div>

          {/* Core Pages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Organization</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Tinig KaBataan</Link></li>
              <li><Link href="/departments" className="hover:text-white transition">Departments & Structure</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Youth Programs</Link></li>
              <li><Link href="/news" className="hover:text-white transition">News & Announcements</Link></li>
              <li><Link href="/campaigns" className="hover:text-white transition">Civic Campaigns</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact & Inquiries</Link></li>
            </ul>
          </div>

          {/* Autonomous Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Autonomous Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/sandigan" className="hover:text-emerald-200 transition text-emerald-400 font-bold flex items-center gap-1.5"><span>⭐ PROJECT SANDIGAN</span></Link></li>
              <li><Link href="/mental-health" className="hover:text-emerald-300 transition text-slate-300 font-medium">Mental Health Sanctuary</Link></li>
              <li><Link href="/sandigan/talk" className="hover:text-white transition">Talk to Tinig (Support)</Link></li>
              <li><Link href="/sandigan/reset-room" className="hover:text-white transition">The Reset Room</Link></li>
              <li><Link href="/publication" className="hover:text-white transition">TK Publication Gazette</Link></li>
              <li><Link href="/youth" className="hover:text-white transition">Youth Action Hub</Link></li>
              <li><Link href="/learning" className="hover:text-white transition">Leadership Academy</Link></li>
            </ul>
          </div>

          {/* Emergency Crisis Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Philippine Helplines</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="font-bold text-white block">NCMH Crisis Line (24/7)</span>
                <span className="text-emerald-400 font-mono text-sm font-bold">1553</span>
                <span className="text-slate-400 block text-[11px] mt-0.5">Toll-free nationwide</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="font-bold text-white block">Hopeline Philippines</span>
                <span className="text-slate-300 font-mono text-xs">0917-558-4673</span>
                <span className="text-slate-400 block text-[11px] mt-0.5">24/7 Mobile hotline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Tinig KaBataan (TK). Built for Filipino Youth with non-profit dedication.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-400 transition">Get Involved</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
