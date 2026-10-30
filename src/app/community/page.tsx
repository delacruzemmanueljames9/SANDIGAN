import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  ShieldCheck,
  Heart,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safe Community Guidelines & Peer Support — PROJECT SANDIGAN",
  description:
    "Learn how PROJECT SANDIGAN nurtures a respectful, actively moderated peer support community for Filipino youth.",
};

export default function CommunityPage() {
  const communityRules = [
    {
      title: "1. Radical Empathy & Respect",
      desc: "Treat every peer with patience, kindness, and dignity. Hate speech, discrimination, victim-blaming, and harassment have zero tolerance.",
      icon: Heart,
    },
    {
      title: "2. Zero-Tolerance for Bullying & Shaming",
      desc: "Mocking another person's emotional distress, background, or identity results in immediate removal and moderation review.",
      icon: ShieldCheck,
    },
    {
      title: "3. Responsible Sharing & Content Boundaries",
      desc: "Avoid graphic descriptions of self-harm methods, eating disorder behaviors, or explicit trauma details that could trigger vulnerable peers.",
      icon: AlertTriangle,
    },
    {
      title: "4. Anonymity & Privacy Protection",
      desc: "Never reveal private personal information (full names, home addresses, phone numbers, or social media handles) of yourself or others.",
      icon: Lock,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal">Peer Support &amp; Safeguarding</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          A Moderated Sanctuary for Real Connection
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Sharing your story takes immense courage. Our community is intentionally designed to protect emotional safety and prevent secondary trauma.
        </p>
      </section>

      {/* Community Principles */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="navy">Community Guidelines</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white">
            Rules of Our Shared Space
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Clear standards ensuring our peer spaces remain supportive, safe, and uplifting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communityRules.map((rule) => {
            const Icon = rule.icon;
            return (
              <Card key={rule.title} className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 dark:text-sandigan-teal-300 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                  {rule.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rule.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Moderation Workflow Card */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 dark:border-sandigan-border-dark dark:bg-sandigan-surface-cardDark space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sandigan-teal-100 text-sandigan-teal dark:bg-sandigan-teal-900/50">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-sandigan-navy dark:text-white">
              How Moderation Works (AI Officer TALA &amp; Human Review)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dual-layer safeguarding to catch harmful content without stifling genuine emotion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800">
            <strong className="text-sandigan-teal font-bold block text-sm">Step 1: Automated Safety Scan</strong>
            <p>
              AI Officer TALA screens submitted posts for hate speech, harassment, self-harm keywords, and exposed personal contact details in real-time.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800">
            <strong className="text-sandigan-gold font-bold block text-sm">Step 2: Immediate Crisis Escalation</strong>
            <p>
              If a post indicates imminent self-harm, TALA immediately flags GABAY and surfaces verified emergency hotlines to the user without delay.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800">
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold block text-sm">Step 3: Human Oversight</strong>
            <p>
              Flagged content is routed to our founder and human safeguarding team for final moderation decisions. No AI has sole banning authority.
            </p>
          </div>
        </div>
      </section>

      {/* Voice of Community Link */}
      <div className="rounded-2xl border border-sandigan-navy-200 bg-sandigan-navy-50/60 p-6 dark:border-sandigan-navy-800 dark:bg-sandigan-navy-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
            Have Feedback or Ideas for SANDIGAN?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
            We value community input. Share your thoughts anonymously or with your alias through Voice of Community.
          </p>
        </div>
        <Link href="/services/voice-of-community">
          <Button variant="teal" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Submit Feedback
          </Button>
        </Link>
      </div>
    </div>
  );
}
