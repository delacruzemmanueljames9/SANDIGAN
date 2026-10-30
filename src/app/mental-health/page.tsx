import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Brain,
  Heart,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Smile,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mental Health Support & Psychoeducation — PROJECT SANDIGAN",
  description:
    "Evidence-informed, youth-centered mental health resources, psychoeducation, and guidance for young Filipinos.",
};

export default function MentalHealthSupportPage() {
  const continuumStages = [
    {
      stage: "Thriving",
      color: "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300",
      indicator: "Green Zone",
      desc: "Good emotional energy, restful sleep, healthy social boundaries, active engagement in daily routines.",
      action: "Maintain balanced habits, gratitude routines, and rest.",
    },
    {
      stage: "Surviving",
      color: "border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-300",
      indicator: "Blue Zone",
      desc: "Occasional fatigue, feeling stressed with school/work, temporary sadness, feeling rushed or distracted.",
      action: "Take short grounding resets, prioritize sleep hygiene, talk to friends.",
    },
    {
      stage: "Struggling",
      color: "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300",
      indicator: "Amber Zone",
      desc: "Persistent exhaustion, social withdrawal, constant worry, emotional numbness, disrupted sleep.",
      action: "Use our Safety Plan tool, seek guidance from trusted mentors, consider counseling.",
    },
    {
      stage: "In Crisis",
      color: "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300",
      indicator: "Red Zone",
      desc: "Overwhelming distress, panic attacks, thoughts of self-harm, inability to perform basic care.",
      action: "Immediately contact 1553, Hopeline, or reach the nearest emergency facility.",
    },
  ];

  const commonExperiences = [
    {
      title: "Academic Burnout & Hustle Fatigue",
      desc: "The intense pressure to excel academically in competitive Philippine school environments can lead to chronic mental and physical exhaustion.",
      tip: "Practice intentional micro-breaks and separate your self-worth from grades or exam scores.",
    },
    {
      title: "Anxiety & Racing Thoughts",
      desc: "Physical symptoms like rapid heartbeat, tight chest, or spiraling 'what-if' scenarios before social situations or future transitions.",
      tip: "Grounding techniques (like 4-7-8 breathing in the Reset Room) activate your parasympathetic nervous system to calm bodily panic.",
    },
    {
      title: "Family Dynamics & Cultural Expectations",
      desc: "Balancing personal identity with deep filial obligations, intergenerational differences, and unspoken emotional boundaries.",
      tip: "Expressing emotions respectfully without guilt is an essential life skill. Healthy boundaries are acts of care.",
    },
    {
      title: "Digital Isolation & Comparison",
      desc: "Scrolling social feeds and feeling that everyone else has life figured out, leading to acute loneliness and inadequacy.",
      tip: "Curate your digital feeds, take scheduled screen breaks, and connect through authentic peer communities.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal">Psychoeducation &amp; Understanding</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Understanding Your Mental Health
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Mental health is not a fixed destination or an all-or-nothing state. It is a fluid, human continuum shaped by life experiences, stress, biology, and environment.
        </p>
      </section>

      {/* The Mental Health Continuum */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="navy">The Wellness Continuum</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white">
            Where Are You on the Continuum Today?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Checking in on your emotional zone helps you choose the right level of support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {continuumStages.map((st) => (
            <div
              key={st.stage}
              className={`rounded-2xl border-2 p-6 flex flex-col justify-between space-y-4 ${st.color}`}
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">{st.indicator}</span>
                <h3 className="font-heading font-extrabold text-lg">{st.stage}</h3>
                <p className="text-xs leading-relaxed opacity-90">{st.desc}</p>
              </div>
              <div className="pt-2 border-t border-current/20 text-xs">
                <strong>Recommended Care:</strong>
                <p className="mt-1 opacity-90">{st.action}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Common Youth Experiences */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold">Real Youth Realities</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white">
            Common Emotional Struggles
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            What you are feeling is real, valid, and shared by thousands of young Filipinos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commonExperiences.map((exp) => (
            <Card key={exp.title} className="p-6 space-y-3">
              <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                {exp.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {exp.desc}
              </p>
              <div className="rounded-xl bg-sandigan-teal-50 p-3 dark:bg-sandigan-teal-950/40 text-xs text-sandigan-teal-800 dark:text-sandigan-teal-300 space-y-1">
                <strong>Helpful Perspective:</strong>
                <p>{exp.tip}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* When to Seek Professional Support */}
      <section className="rounded-3xl border border-sandigan-navy-200 bg-sandigan-navy-950 text-white p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-sandigan-gold" />
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            When Should You Reach Out to a Professional?
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          It is completely normal to ask for help. Consider reaching out to a licensed counselor, psychologist, or physician if you notice:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sandigan-teal shrink-0 mt-0.5" />
            <span>Emotional distress persists for more than two weeks continuously.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sandigan-teal shrink-0 mt-0.5" />
            <span>You find it hard to get out of bed, eat regularly, or attend classes.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sandigan-teal shrink-0 mt-0.5" />
            <span>Persistent feelings of hopelessness, severe panic attacks, or detachment.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sandigan-teal shrink-0 mt-0.5" />
            <span>Any thoughts of self-harm, ending your life, or extreme danger.</span>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <Link href="/find-support">
            <Button variant="teal" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Find Verified Professionals in the Philippines
            </Button>
          </Link>
          <Link href="/get-help-now">
            <Button variant="danger" size="md">
              24/7 Crisis Hotline (1553)
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
