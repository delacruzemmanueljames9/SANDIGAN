import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { ShieldCheck, Lock, Eye, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Safeguards — PROJECT SANDIGAN",
  description:
    "Privacy Policy and Data Protection commitments of PROJECT SANDIGAN in accordance with the Philippine Data Privacy Act of 2012 (RA 10173).",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="navy">Data Privacy &amp; Governance</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Effective Date: October 30, 2026 • Governed under the Philippine Data Privacy Act of 2012 (Republic Act No. 10173)
        </p>
      </div>

      {/* Legal Status Disclaimer Notice */}
      <Alert variant="warning" title="LEGAL REVIEW &amp; COMPLIANCE NOTICE">
        <p className="text-xs leading-relaxed">
          This document articulates PROJECT SANDIGAN&apos;s technical data protection standards, data minimization practices, and architectural boundaries. While designed in strict alignment with RA 10173 and RA 11036, publishing this policy does not automatically constitute certified legal compliance. This document is subject to continuing formal legal review by accredited Philippine data privacy counsel prior to public deployment.
        </p>
      </Alert>

      {/* Core Privacy Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 space-y-2">
          <Lock className="w-5 h-5 text-sandigan-teal" />
          <h3 className="font-heading font-bold text-sm text-sandigan-navy dark:text-white">
            Private-by-Default
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Personal reflections and Inner Garden journals are private. They are never shared publicly or monetized.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <Eye className="w-5 h-5 text-sandigan-gold" />
          <h3 className="font-heading font-bold text-sm text-sandigan-navy dark:text-white">
            No Public AI Training
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your private journal entries and wellness check scores are never fed into public AI models for model training.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <ShieldCheck className="w-5 h-5 text-sandigan-emerald" />
          <h3 className="font-heading font-bold text-sm text-sandigan-navy dark:text-white">
            Zero Data Selling
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We never sell, rent, or broker your personal information or mental wellness records to advertisers or third parties.
          </p>
        </Card>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            1. Information We Collect
          </h2>
          <p>
            PROJECT SANDIGAN adheres strictly to the principle of <strong>Data Minimization</strong> under RA 10173. We only collect information strictly necessary to provide our support services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong>Account Data:</strong> If you register, we collect an email address and display name/alias. We encourage non-identifiable pseudonyms.
            </li>
            <li>
              <strong>Private Journal Entries (Inner Garden):</strong> Your self-authored reflections, gratitude notes, and mood tags. These are encrypted and tied strictly to your authenticated ID via Row Level Security (RLS).
            </li>
            <li>
              <strong>Wellness Assessments:</strong> Non-diagnostic self-reflection answers used solely to generate educational summaries for your personal review.
            </li>
            <li>
              <strong>Technical Audit Telemetry:</strong> Anonymized timestamps, error logs, and rate-limiting counters to maintain system stability and prevent denial-of-service attacks.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            2. What We Explicitly Do NOT Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>We do NOT track your browsing behavior across other websites or services.</li>
            <li>We do NOT collect biometric data, clinical hospital records, or government ID numbers.</li>
            <li>We do NOT deploy invasive third-party ad-tracking pixels or marketing cookies.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            3. Your Rights as a Data Subject (Republic Act No. 10173)
          </h2>
          <p>
            Under Chapter III of the Philippine Data Privacy Act of 2012, you possess the following inviolable rights:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-200 dark:border-sandigan-navy-800 p-3.5 space-y-1 text-xs">
              <strong className="text-sandigan-teal">Right to be Informed:</strong>
              <p>You have the right to know how your personal data is collected, stored, processed, and protected.</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-sandigan-navy-800 p-3.5 space-y-1 text-xs">
              <strong className="text-sandigan-teal">Right to Access:</strong>
              <p>You can view and inspect all personal data tied to your account at any time.</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-sandigan-navy-800 p-3.5 space-y-1 text-xs">
              <strong className="text-sandigan-teal">Right to Erasure (To be Forgotten):</strong>
              <p>You can delete your journal entries, assessments, or entire account permanently upon request.</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-sandigan-navy-800 p-3.5 space-y-1 text-xs">
              <strong className="text-sandigan-teal">Right to Data Portability:</strong>
              <p>You can export your personal journal notes and safety plan in a standard electronic format.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            4. Emergency Safeguarding &amp; Life-Safety Disclosures
          </h2>
          <p>
            When our systems detect acute indicators of imminent self-harm or suicidal intent through our automated crisis detector (supervised by AI Officer GABAY), our system immediately injects verified Philippine emergency resources (1553, 911, Hopeline) into your screen.
          </p>
          <p className="text-xs">
            We do not sell this information. Any incident logs maintained for safety compliance contain zero marketing identifiers and access is strictly restricted to authorized safeguarding personnel.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            5. Safeguards for Minors
          </h2>
          <p className="text-xs leading-relaxed">
            PROJECT SANDIGAN is designed for youth empowerment. If you indicate you are under 18 years of age, our ecosystem enforces stricter safeguarding thresholds: referral requests to external healthcare providers require explicit guardian or verified youth consent protocols, and high-risk distress signals are escalated with urgency to specialized child protection helplines (such as Bantay Bata 163).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            6. Contacting the Data Protection Officer (DPO)
          </h2>
          <p className="text-xs">
            To exercise your data privacy rights, request account deletion, or ask governance questions, please email:{" "}
            <a href={`mailto:${SITE_CONFIG.links.contactEmail}`} className="text-sandigan-teal font-semibold underline">
              {SITE_CONFIG.links.contactEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
