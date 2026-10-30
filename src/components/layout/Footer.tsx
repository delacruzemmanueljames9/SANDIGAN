import * as React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { SandiganLogo } from "@/components/sandigan/SandiganLogo";
import { PhoneCall, ShieldCheck, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-sandigan-navy-950 text-slate-300 dark:border-sandigan-border-dark">
      {/* 24/7 Lifeline Callout Strip */}
      <div className="bg-sandigan-navy-900 border-b border-sandigan-navy-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sandigan-teal/20 text-sandigan-teal">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-base">In Crisis or Need Someone to Talk to?</h4>
              <p className="text-xs text-slate-400">
                You do not have to carry it alone. Free, confidential support is available 24/7 nationwide.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:1553"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Call 1553 (NCMH)
            </a>
            <Link
              href="/get-help-now"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sandigan-navy-800 hover:bg-sandigan-navy-700 text-white text-sm font-medium border border-sandigan-navy-700 transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-sandigan-gold" />
              All Verified Helplines
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <SandiganLogo size="md" showText={true} showTagline={true} />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An independent, youth-centered mental health and community support ecosystem designed to make emotional wellness resources, psychoeducation, and pathways to care accessible, safe, and dignified.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>
                <strong className="text-slate-300">Founder &amp; Developer:</strong> {SITE_CONFIG.founder}
              </p>
              <p>
                <strong className="text-slate-300">Republic Acts Compliance:</strong> RA 10173 (Data Privacy Act of 2012) &amp; RA 11036 (Mental Health Act).
              </p>
            </div>
          </div>

          {/* Core Services Links */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-sandigan-gold mb-4">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/talk" className="hover:text-white transition-colors">
                  Talk to Tinig
                </Link>
              </li>
              <li>
                <Link href="/services/wellness-check" className="hover:text-white transition-colors">
                  Wellness Check
                </Link>
              </li>
              <li>
                <Link href="/services/reset-room" className="hover:text-white transition-colors">
                  Reset Room
                </Link>
              </li>
              <li>
                <Link href="/services/safety-plan" className="hover:text-white transition-colors">
                  Safety Plan Tool
                </Link>
              </li>
              <li>
                <Link href="/services/inner-garden" className="hover:text-white transition-colors">
                  Inner Garden Journal
                </Link>
              </li>
              <li>
                <Link href="/find-support" className="hover:text-white transition-colors">
                  Find Support Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Psychoeducation & Community */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-sandigan-teal mb-4">
              Resources &amp; Hubs
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/mind-library" className="hover:text-white transition-colors">
                  Mind Library
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Safe Community
                </Link>
              </li>
              <li>
                <Link href="/services/sleep" className="hover:text-white transition-colors">
                  Sleep &amp; Wind-down
                </Link>
              </li>
              <li>
                <Link href="/services/daily-companion" className="hover:text-white transition-colors">
                  Daily Companion
                </Link>
              </li>
              <li>
                <Link href="/services/growth-journey" className="hover:text-white transition-colors">
                  Growth Journey
                </Link>
              </li>
              <li>
                <Link href="/services/voice-of-community" className="hover:text-white transition-colors">
                  Voice of Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Governance &amp; Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SITE_CONFIG.footerLegal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/hq" className="text-sandigan-gold-300 hover:text-sandigan-gold font-medium transition-colors flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Founder Command HQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer & Safeguarding Statement */}
        <div className="mt-12 pt-8 border-t border-sandigan-navy-800 text-xs text-slate-400 leading-relaxed space-y-3">
          <p className="bg-sandigan-navy-900/60 p-3.5 rounded-xl border border-sandigan-navy-800/80">
            <strong className="text-slate-200">Non-Clinical &amp; Safeguarding Disclaimer:</strong> PROJECT SANDIGAN provides educational resources, supportive digital self-reflection tools, and pathways to verified professional help. SANDIGAN and its AI systems do NOT provide medical or clinical diagnosis, psychiatric prescriptions, psychotherapy, or emergency response. In an emergency or severe crisis, please immediately contact emergency services (911) or the NCMH Crisis Hotline (1553).
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-slate-400">
            <p>© {new Date().getFullYear()} PROJECT SANDIGAN. All rights reserved.</p>
            <p className="text-center sm:text-right">
              Compassion Before Automation • Privacy By Design • Human Accountability
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
