import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { SandiganLogo } from "@/components/sandigan/SandiganLogo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Heart,
  ShieldCheck,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  Lock,
  Eye,
  Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About SANDIGAN — Our Story, Vision & Commitment",
  description:
    "Learn about PROJECT SANDIGAN, an independent, youth-centered mental health and community support ecosystem founded by Emmanuel James C. Dela Cruz.",
};

export default function AboutPage() {
  const pillars = [
    {
      title: "Compassion Before Automation",
      description:
        "Every line of code and algorithm serves human emotional dignity. Automation supports logistics, psychoeducation, and routing—never replacing genuine human connection.",
      icon: Heart,
    },
    {
      title: "Privacy By Design",
      description:
        "Personal reflections and journal entries remain strictly private by default. We never sell user data, train public models on user journals, or share referral information without explicit consent.",
      icon: Lock,
    },
    {
      title: "Human Oversight & Accountability",
      description:
        "AI systems operate within defined bounds under human supervision. High-stakes actions, content escalations, and referral workflows require founder and clinician review.",
      icon: Eye,
    },
    {
      title: "Non-Diagnostic Safety First",
      description:
        "SANDIGAN never diagnoses psychiatric conditions, prescribes medications, or simulates a licensed clinician. Verified emergency hotlines remain accessible at zero latency.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="navy">About PROJECT SANDIGAN</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Built on Empathy, Guarded by Safety.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          PROJECT SANDIGAN was created to ensure that no Filipino youth has to carry the weight of mental distress, isolation, or overwhelming anxiety completely on their own.
        </p>
      </section>

      {/* Origin & Story Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <Badge variant="teal">The Origin Story</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white leading-snug">
            Bridging the Gap Between Isolation and Professional Support
          </h2>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              In the Philippines, millions of young people experience overwhelming academic pressure, financial anxiety, family distress, and psychological isolation. While the enactment of the Philippine Mental Health Act (Republic Act No. 11036) marked an essential milestone, deep systemic gaps remain: social stigma, geographic disparities, and shortages of accessible adolescent mental health practitioners.
            </p>
            <p>
              Founded and developed by <strong>{SITE_CONFIG.founder}</strong>, PROJECT SANDIGAN was conceived not as a replacement for clinical care, but as an accessible digital bridge. It combines modern software engineering, evidence-informed psychoeducation, private self-regulation utilities, and community safeguarding to meet youth wherever they are.
            </p>
            <p>
              The name <em>SANDIGAN</em> represents a steadfast pillar—someone or something to lean on when the world feels unsteady.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/mission-vision">
              <Button variant="teal" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Read Mission &amp; Vision
              </Button>
            </Link>
            <Link href="/our-approach">
              <Button variant="outline" size="sm">
                Explore Our Approach
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual Brand Philosophy Card */}
        <div className="rounded-3xl border border-sandigan-navy-200 bg-sandigan-navy-950 text-white p-8 sm:p-10 shadow-soft-lg space-y-6 relative overflow-hidden">
          <div className="space-y-2">
            <SandiganLogo size="lg" showText={true} />
            <p className="text-sm text-sandigan-gold-300 font-medium italic pt-2">
              “You don&apos;t have to carry it alone.”
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our visual and technical identity reflects protective shelter, gentle clarity, and human warmth. The deep Midnight Navy evokes steady nighttime calm; the vibrant Teal brings renewed vitality; the Emerald represents grounded growth; and the Gold serves as a gentle beacon of hope.
          </p>

          <div className="pt-4 border-t border-sandigan-navy-800 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Founder &amp; Developer</span>
              <strong className="text-white font-semibold">{SITE_CONFIG.founder}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Governing Standard</span>
              <strong className="text-sandigan-teal font-semibold">RA 10173 &amp; RA 11036</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold">Our Foundation</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white">
            Ethical Principles Guiding Every Feature
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We hold ourselves to rigorous ethical, privacy, and clinical safeguarding standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="p-6 space-y-3 hover:border-sandigan-teal/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 dark:text-sandigan-teal-300 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pillar.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Scope and Boundary Disclaimer */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-sandigan-border-dark dark:bg-sandigan-surface-cardDark space-y-4">
        <h3 className="font-heading font-bold text-lg text-sandigan-navy dark:text-white">
          Clear Scope of Services &amp; Boundaries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-xs">
              What SANDIGAN Is
            </h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>A safe, private digital reflection and self-regulation sanctuary.</li>
              <li>A curated library of verified psychoeducational guides.</li>
              <li>A directory of verified Philippine clinics, hotlines, and hospitals.</li>
              <li>An empowering companion encouraging personal growth and daily wellness.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-xs">
              What SANDIGAN Is NOT
            </h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>NOT a licensed psychiatric hospital or emergency clinic.</li>
              <li>NOT a diagnostic tool (we never assign clinical disorder labels).</li>
              <li>NOT an emergency dispatch service (call 1553 or 911 for crises).</li>
              <li>NOT a substitute for face-to-face consultation with a doctor or psychologist.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <Link href="/services">
          <Button variant="teal" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore the 14 Integrated Services
          </Button>
        </Link>
      </div>
    </div>
  );
}
