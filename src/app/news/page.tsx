import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Tag, ShieldCheck, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "News & System Updates — PROJECT SANDIGAN",
  description:
    "Official releases, architecture disclosures, safeguarding announcements, and milestone updates for PROJECT SANDIGAN.",
};

export default function NewsPage() {
  const updates = [
    {
      id: "ann-greenfield-launch",
      title: "PROJECT SANDIGAN Greenfield Ecosystem Architecture Finalized",
      date: "October 30, 2026",
      category: "Architecture",
      badgeVariant: "teal" as const,
      summary:
        "Full technical foundation launched using Next.js App Router, Supabase PostgreSQL, and Google Gemini API, establishing 14 integrated services and 7 bounded AI Officers.",
      details: [
        "Established zero-latency 24/7 crisis escalation pathway integrating verified hotlines (NCMH 1553, In Touch, Hopeline).",
        "Defined granular system permission matrices separating all seven AI officers under human founder oversight.",
        "Implemented strict non-diagnostic system prompts prohibiting clinical psychiatry claims or pathology labels.",
      ],
      author: SITE_CONFIG.founder,
    },
    {
      id: "ann-safeguarding-framework",
      title: "Safeguarding Protocol Alignment with Republic Act No. 11036 and RA 10173",
      date: "October 2026",
      category: "Governance & Safety",
      badgeVariant: "navy" as const,
      summary:
        "Comprehensive architectural review aligning user privacy, data minimization, and consent policies with the Philippine Data Privacy Act of 2012 and the Mental Health Act.",
      details: [
        "Client and server-side credential isolation preventing exposure of secret keys to browser runtimes.",
        "Private-by-default personal reflection records in the Inner Garden with zero public exposure.",
        "Formalized disclaimer specifying that legal policies require ongoing review by licensed Philippine legal counsel prior to public scaling.",
      ],
      author: "Safeguarding & Governance Lead",
    },
    {
      id: "ann-support-directory-verification",
      title: "Initial Philippine Mental Health Resource Directory Verified",
      date: "October 2026",
      category: "Community & Partners",
      badgeVariant: "emerald" as const,
      summary:
        "Our team concluded primary verification of national crisis hotlines, government psychiatric hospital emergency units, and accredited NGO support providers.",
      details: [
        "Verified toll-free landline and mobile hotline numbers for the National Center for Mental Health (1553 / 0917-899-8727).",
        "Documented walk-in emergency protocols for PGH Psychiatry and NCMH Mandaluyong.",
        "Committed to quarterly re-verification cycles to prevent stale or disconnected contact listings.",
      ],
      author: "KAWING (Partnerships Coordinator)",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="navy">System Disclosures &amp; Milestones</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          News &amp; Ecosystem Updates
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Official development logs, security disclosures, and architectural milestones. We publish only verified technical and operational updates.
        </p>
      </div>

      {/* Disclosures Note */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 dark:border-sandigan-border-dark dark:bg-sandigan-surface-cardDark flex items-center justify-between">
        <span>Editorial Policy: No fabricated news, marketing spin, or artificial user numbers.</span>
        <span className="font-semibold text-sandigan-teal">Verified Real Development Logs</span>
      </div>

      {/* Updates Feed */}
      <div className="space-y-8">
        {updates.map((item) => (
          <Card key={item.id} className="p-6 sm:p-8 space-y-4 hover:border-sandigan-teal/40 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-sandigan-navy-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant={item.badgeVariant}>{item.category}</Badge>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </span>
              </div>
              <span className="text-xs text-slate-400">Published by: <strong className="text-slate-600 dark:text-slate-300">{item.author}</strong></span>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-sandigan-navy dark:text-white">
                {item.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Technical &amp; Operational Highlights:
              </span>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                {item.details.map((detail, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
