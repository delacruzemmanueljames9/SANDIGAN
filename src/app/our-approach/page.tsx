import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AI_OFFICERS } from "@/config/officers";
import {
  Layers,
  ShieldAlert,
  Heart,
  Bot,
  UserCheck,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Approach — The Stepped-Care & Ethical AI Model",
  description:
    "Explore PROJECT SANDIGAN's stepped-care model, human-in-the-loop safeguards, and responsible AI architecture.",
};

export default function OurApproachPage() {
  const steppedCareTiers = [
    {
      tier: "Tier 1: Foundation & Self-Care",
      focus: "Universal Literacy & Self-Regulation",
      audience: "Every young person navigating daily stress, academic pressure, or emotional fatigue.",
      tools: ["Mind Library Psychoeducation", "Reset Room Sensory Resets", "Inner Garden Private Journaling", "Sleep Routine Scaffolding"],
      officer: "DUNONG & SINAG",
      badge: "Self-Directed",
    },
    {
      tier: "Tier 2: Guided Reflection & Peer Support",
      focus: "Non-Diagnostic Checks & Moderated Community",
      audience: "Youth seeking structure, encouraging daily routines, and safe peer connection.",
      tools: ["Wellness Check Self-Reflection", "Daily Companion Check-ins", "Safe Moderated Community", "Growth Journey Goals"],
      officer: "SIKLAB & TALA",
      badge: "Peer & Guided",
    },
    {
      tier: "Tier 3: Professional Bridge & Crisis Support",
      focus: "Immediate Life Safety & Accredited Clinical Care",
      audience: "Youth experiencing acute distress, self-harm risk, severe depression, or needing professional therapy.",
      tools: ["24/7 NCMH 1553 Crisis Lifeline", "Personal Safety Plan Tool", "Consent-First Professional Referral Intake", "Talk to Tinig De-escalation"],
      officer: "GABAY & KAWING",
      badge: "Human-Supervised",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="navy">Our Methodology</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Compassion Before Automation
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          How PROJECT SANDIGAN layers technology, evidence-informed psychology, and human accountability to safeguard young minds.
        </p>
      </section>

      {/* Stepped-Care Model */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="teal">Stepped-Care Architecture</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white">
            Meeting You at Your Level of Need
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Our framework matches resources to your emotional state without clinical gatekeeping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steppedCareTiers.map((t, idx) => (
            <Card key={t.tier} className="flex flex-col justify-between border-slate-200 dark:border-sandigan-border-dark">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-heading text-sandigan-teal tracking-wider uppercase">
                    Level 0{idx + 1}
                  </span>
                  <Badge variant="neutral">{t.badge}</Badge>
                </div>
                <CardTitle className="text-lg">{t.tier}</CardTitle>
                <CardDescription className="text-xs font-medium text-sandigan-navy dark:text-sandigan-gold">
                  {t.focus}
                </CardDescription>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  {t.audience}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Core Capabilities:
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {t.tools.map((tool) => (
                      <li key={tool} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-sandigan-teal shrink-0" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  AI Lead Officer: <strong className="text-sandigan-teal dark:text-sandigan-teal-300">{t.officer}</strong>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* The 7 AI Officers System Overview */}
      <section className="space-y-8 rounded-3xl border border-sandigan-navy-200 bg-sandigan-navy-50/50 p-8 sm:p-12 dark:border-sandigan-navy-800 dark:bg-sandigan-navy-950/60">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold">Autonomous Officer Framework</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white">
            Seven Specialized AI Officers, Strictly Bounded
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Rather than a single unpredictable chatbot, SANDIGAN operates through seven role-separated AI agents with strict permission matrices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
          {Object.entries(AI_OFFICERS).map(([key, officer]) => (
            <Card key={key} className="p-4 space-y-2 bg-white dark:bg-sandigan-surface-cardDark">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sandigan-teal">{officer.callsign}</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sandigan-navy-100 text-sandigan-navy-800 dark:bg-sandigan-navy-800 dark:text-sandigan-gold">
                  {officer.name}
                </span>
              </div>
              <h4 className="font-heading font-semibold text-sm text-slate-900 dark:text-white">
                {officer.role}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {officer.primaryDirective}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Human Accountability & Safeguarding Callout */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-sandigan-border-dark dark:bg-sandigan-surface-cardDark space-y-4">
        <div className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-heading font-bold text-lg text-sandigan-navy dark:text-white">
            Human-in-the-Loop Safeguarding
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          No AI officer has permission to ban users permanently, publish unreviewed medical advice, share user information with third parties, or bypass founder approvals on consequential actions. When acute distress or self-harm signals are detected, the system immediately surfaces verified emergency hotlines without delay or technical bottlenecks.
        </p>
      </section>

      {/* Call to Action */}
      <div className="text-center pt-2">
        <Link href="/services">
          <Button variant="teal" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Core Services
          </Button>
        </Link>
      </div>
    </div>
  );
}
