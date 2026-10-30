import React from 'react';
import { AlertTriangle, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tk-deepblue bg-tk-lightblue/60 px-3 py-1 rounded-full">
          Institutional Terms
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms of Service & Clinical Disclaimers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last Updated: October 30, 2026 • Tinig KaBataan Digital Ecosystem
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6">
        {/* Crucial Non-Clinical Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium space-y-1.5">
          <p className="font-bold flex items-center gap-1.5 text-sm text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            CRITICAL MEDICAL & PSYCHIATRIC DISCLAIMER
          </p>
          <p>
            Tinig KaBataan (TK) is a youth peer-support, educational, and civic ecosystem. <strong>Our digital services, conversational interfaces, and educational modules DO NOT provide medical advice, clinical psychiatric diagnosis, or professional psychotherapy.</strong> If you or someone you know is in imminent physical danger or contemplating self-harm, immediately dial the Philippine National Center for Mental Health Crisis Hotline at <strong>1553</strong> (Toll-Free) or proceed to the nearest emergency room.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p className="text-slate-600">
            By accessing any portal within the Tinig KaBataan ecosystem—including the Central Site, Mental Health Platform, Gazette, Youth Action Hub, or Virtual Headquarters—you agree to abide by these terms and maintain a safe, respectful environment for all participants.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Safe Community Standards</h2>
          <p className="text-slate-600">
            Tinig KaBataan strictly prohibits cyberbullying, hate speech, harassment, doxxing, or the publication of sexually explicit or abusive content. Submissions to the Youth Voice Wall and editorial articles are reviewed by certified youth moderators.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Virtual Headquarters Access</h2>
          <p className="text-slate-600">
            The private Virtual Headquarters (/hq) is strictly reserved for verified TK officers, department heads, and platform administrators. Unauthorized access, credential spoofing, or attempts to bypass role-based security are logged and prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
