import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Target, Compass, Sparkles, Heart, Shield, ArrowRight, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Mission & Vision — PROJECT SANDIGAN",
  description:
    "Discover the mission, vision, and long-term commitments driving PROJECT SANDIGAN's youth-centered mental health ecosystem in the Philippines.",
};

export default function MissionVisionPage() {
  const strategicObjectives = [
    {
      title: "Universal Mental Health Literacy",
      desc: "Demystify emotional challenges, dismantle deeply rooted cultural shame, and replace stigma with evidence-informed, youth-friendly psychoeducation.",
      icon: Lightbulb,
    },
    {
      title: "Zero-Barrier Crisis Navigation",
      desc: "Guarantee that any young Filipino in acute distress can instantly discover and reach verified emergency helplines without logins or delays.",
      icon: Shield,
    },
    {
      title: "Empowering Self-Advocacy",
      desc: "Equip young people with private grounding utilities, emotional tracking, and personalized safety plans to navigate daily emotional distress safely.",
      icon: Heart,
    },
    {
      title: "Community Without Harm",
      desc: "Foster peer support environments anchored in moderation, anti-bullying safeguards, and mutual respect, free from toxic comparisons.",
      icon: Users,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal">Mission &amp; Vision</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          A Compassionate Future for Filipino Youth
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Our vision is a society where seeking emotional support is recognized as an act of profound strength rather than shame.
        </p>
      </section>

      {/* Mission & Vision Dual Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className="rounded-3xl border-2 border-sandigan-teal-500/40 bg-white p-8 sm:p-10 shadow-soft-md dark:bg-sandigan-surface-cardDark space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 dark:text-sandigan-teal-300 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <Badge variant="teal">Our Mission</Badge>
          <h2 className="font-heading text-2xl font-bold text-sandigan-navy dark:text-white">
            Democratize Compassionate Mental Health Support
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            To provide every Filipino youth with a secure, private, and dignified digital environment where they can access verified mental health psychoeducation, reflect through non-diagnostic self-care tools, develop resilient emotional habits, and seamlessly connect to verified professional help—grounded always in compassion before automation.
          </p>
        </div>

        {/* Vision Card */}
        <div className="rounded-3xl border-2 border-sandigan-gold-500/40 bg-sandigan-navy-950 text-white p-8 sm:p-10 shadow-soft-md space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-sandigan-navy-800 text-sandigan-gold flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <Badge variant="gold">Our Vision</Badge>
          <h2 className="font-heading text-2xl font-bold text-white">
            An Unshakeable Pillar of Mental Wellness
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            A resilient Philippine youth ecosystem where no young person feels isolated in their emotional struggles; where mental health care is equitable, culturally attuned, and free from stigma; and where technology serves as a protective sanctuary upholding human dignity, privacy, and hope.
          </p>
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="navy">Strategic Commitments</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white">
            Four Core Pillars Driving Our Work
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Actionable, measurable pathways guiding the development of PROJECT SANDIGAN.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {strategicObjectives.map((obj) => {
            const Icon = obj.icon;
            return (
              <Card key={obj.title} className="p-6 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sandigan-navy-50 text-sandigan-navy dark:bg-sandigan-navy-800 dark:text-sandigan-gold flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                    {obj.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {obj.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <Link href="/our-approach">
          <Button variant="teal" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Learn About Our Tiered Approach
          </Button>
        </Link>
      </div>
    </div>
  );
}
