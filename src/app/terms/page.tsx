import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service — PROJECT SANDIGAN",
  description:
    "Terms of Service governing the use of PROJECT SANDIGAN's digital mental health and community support ecosystem.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="navy">Terms of Service</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Terms of Service &amp; User Agreement
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last Updated: October 30, 2026 • Please read these terms carefully before accessing our ecosystem.
        </p>
      </div>

      {/* Critical Legal Disclaimer Alert */}
      <Alert variant="danger" title="CRITICAL NON-CLINICAL &amp; EMERGENCY DISCLAIMER">
        <p className="text-xs leading-relaxed">
          PROJECT SANDIGAN and its AI systems (AMARA, TALA, GABAY, SIKLAB, DUNONG, KAWING, SINAG) are educational, supportive, and self-reflection tools. <strong>SANDIGAN does NOT provide clinical psychotherapy, psychiatric diagnosis, medical prescriptions, or emergency dispatch services.</strong> If you are experiencing a life-threatening crisis, suicidal thoughts, or urgent medical danger, you must immediately contact the National Center for Mental Health (1553), Hopeline (2919), or 911.
        </p>
      </Alert>

      {/* Formal Legal Review Notice */}
      <Alert variant="warning" title="LEGAL STATUS DISCLOSURE">
        <p className="text-xs leading-relaxed">
          These Terms of Service define our operational standards, safeguarding commitments, and user rules. Like our Privacy Policy, these terms require formal certification by qualified Philippine legal counsel prior to public commercial deployment.
        </p>
      </Alert>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the PROJECT SANDIGAN platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use of the ecosystem immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            2. Scope of Educational &amp; Supportive Services
          </h2>
          <p>
            The content, tools, and conversational interactions provided by PROJECT SANDIGAN are intended solely for personal psychoeducation, stress self-regulation, daily habit scaffolding, and resource discovery. No interaction with SANDIGAN creates a doctor-patient, therapist-client, or confidential medical relationship.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            3. User Conduct &amp; Community Responsibilities
          </h2>
          <p>When participating in our safe community or submitting feedback, you agree NOT to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Harass, bully, demean, or threaten any other user or volunteer.</li>
            <li>Post graphic descriptions of self-harm, suicide methods, or violence.</li>
            <li>Impersonate licensed mental health professionals, clinicians, or administrators.</li>
            <li>Attempt to jailbreak, probe, exploit, reverse engineer, or inject malicious prompts into our AI officers.</li>
            <li>Scrape user posts or extract private data from other members.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            4. Ownership of Content &amp; Intellectual Property
          </h2>
          <p className="text-xs leading-relaxed">
            <strong>Your Content:</strong> You retain complete ownership of your personal journal entries, reflections, and thoughts. By writing in your private Inner Garden, you do NOT grant SANDIGAN any commercial license to your reflections.
          </p>
          <p className="text-xs leading-relaxed">
            <strong>Platform IP:</strong> The SANDIGAN name, logo, software architecture, UI design, AI officer configurations, and psychoeducational library materials are protected intellectual property under Philippine law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            5. Limitation of Liability
          </h2>
          <p className="text-xs leading-relaxed">
            To the maximum extent permitted under Philippine law, PROJECT SANDIGAN, its developer {SITE_CONFIG.founder}, volunteers, and partners shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use this platform, including reliance on non-diagnostic educational information or temporary downtime of third-party external hotlines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
            6. Governing Law &amp; Jurisdiction
          </h2>
          <p className="text-xs leading-relaxed">
            These Terms of Service are governed by and construed in accordance with the laws of the Republic of the Philippines, including the Cybercrime Prevention Act of 2012 (RA 10175), the Data Privacy Act of 2012 (RA 10173), and the Mental Health Act (RA 11036).
          </p>
        </section>
      </div>
    </div>
  );
}
