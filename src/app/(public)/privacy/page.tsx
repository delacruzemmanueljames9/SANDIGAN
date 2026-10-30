import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tk-emerald bg-tk-softgreen/60 px-3 py-1 rounded-full">
          Data Governance & Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy Policy & Mental Health Data Safeguards
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last Updated: October 30, 2026 • Compliant with Republic Act No. 10173 (Philippine Data Privacy Act of 2012)
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Our Core Data Pledge to Filipino Youth
          </p>
          <p>
            Tinig KaBataan (TK) is a non-profit youth ecosystem. We do not sell user data, we do not monetize mental health check-ins, and we do not use your private emotional reflections to train third-party AI models without explicit, opt-in consent.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Data Minimization & Collection Scope</h2>
          <p className="text-slate-600">
            We collect only the minimum information necessary to deliver safe peer support, publication workflows, and civic engagement:
          </p>
          <ul className="list-disc pl-5 text-slate-600 space-y-1">
            <li><strong>Public Visitors:</strong> You can explore our articles, the Reset Room, and the Philippine Helplines Directory completely anonymously without creating an account.</li>
            <li><strong>Talk to Tinig Support:</strong> Conversations are ephemeral by default. We do not require real names, phone numbers, or government IDs to access emotional de-escalation tools.</li>
            <li><strong>Youth Voice Wall Submissions:</strong> You have full control over whether your reflection is attributed to your name or published under full anonymity. All submissions undergo child-safety moderation before publication.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. AI Support Architecture & Informed Consent</h2>
          <p className="text-slate-600">
            Our conversational support interface ("Talk to Tinig") features provider-independent AI assistance with strict safety guardrails. When interacting with the support tool:
          </p>
          <ul className="list-disc pl-5 text-slate-600 space-y-1">
            <li>Identifiable mental health records are never broadcast to public networks.</li>
            <li>If external AI providers are utilized, queries are scrubbed of personally identifiable information (PII).</li>
            <li>You may use the rule-based compassionate guided support fallback at any time without activating AI generation.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Rights Under Republic Act No. 10173</h2>
          <p className="text-slate-600">
            As a data subject under Philippine law, you maintain the Right to be Informed, Right to Access, Right to Object, Right to Erasure or Blocking, and Right to Damages. You may request immediate deletion of any submitted reflection or account record by emailing <a href="mailto:privacy@tinigkabataan.org" className="text-tk-deepblue underline">privacy@tinigkabataan.org</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
