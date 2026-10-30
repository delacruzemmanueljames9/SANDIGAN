import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { CheckCircle2, Eye, Keyboard, Volume2, Globe, Heart } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Accessibility Statement — PROJECT SANDIGAN",
  description:
    "Accessibility commitments, WCAG 2.1 AA standards, and inclusive digital design at PROJECT SANDIGAN.",
};

export default function AccessibilityStatementPage() {
  const accessibilityFeatures = [
    {
      title: "Keyboard Operability",
      desc: "All interactive elements, buttons, inputs, modal dialogs, and navigation drawers can be fully operated using standard keyboard controls (Tab, Shift+Tab, Enter, Space, and Escape).",
      icon: Keyboard,
    },
    {
      title: "Accessible Color Contrast",
      desc: "All text and interactive controls are tested to meet or exceed WCAG 2.1 AA contrast ratios (minimum 4.5:1 for normal body text and 3:1 for large headings) in both Light and Dark themes.",
      icon: Eye,
    },
    {
      title: "Screen Reader Compatibility",
      desc: "Semantic HTML5 tags, ARIA attributes, descriptive button titles, and structured document heading hierarchies ensure smooth navigation with NVDA, VoiceOver, and JAWS.",
      icon: Volume2,
    },
    {
      title: "Bilingual Language Access",
      desc: "Native English and Filipino language toggling ensures that language barriers do not obstruct access to vital crisis hotlines and emotional wellness resources.",
      icon: Globe,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="teal">Inclusive Digital Design</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Accessibility Statement
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Mental health support must be accessible to everyone, regardless of ability, sensory impairment, device constraints, or background.
        </p>
      </div>

      {/* Standards Baseline */}
      <div className="rounded-2xl border border-sandigan-teal-200 bg-sandigan-teal-50/60 p-6 dark:border-sandigan-teal-900 dark:bg-sandigan-teal-950/30 space-y-3">
        <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
          Our Standard: Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          PROJECT SANDIGAN actively designs, tests, and updates this platform to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. These guidelines explain how to make web content more accessible for people with cognitive disabilities, visual impairments, motor challenges, and hearing limitations.
        </p>
      </div>

      {/* Grid of Implemented Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {accessibilityFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <Card key={feat.title} className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 dark:text-sandigan-teal-300 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                {feat.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {feat.desc}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Additional Design Considerations */}
      <section className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <h3 className="font-heading font-bold text-xl text-sandigan-navy dark:text-white">
          Cognitive &amp; Emotional Accessibility
        </h3>
        <p className="text-xs leading-relaxed">
          Mental health platforms require specialized cognitive sensitivity:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li><strong>Clear, Jargon-Free Language:</strong> We avoid dense psychiatric clinical jargon in user-facing utilities.</li>
          <li><strong>Zero Forced Traps:</strong> Users can exit modal dialogues with one keystroke (Escape) or tap outside.</li>
          <li><strong>Reduced Motion Support:</strong> Breathing animations and transitions respect user system preferences for reduced motion.</li>
          <li><strong>Zero Sudden Distractions:</strong> No auto-playing loud audio, flashing animations, or aggressive popups.</li>
        </ul>
      </section>

      {/* Feedback & Contact */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-sandigan-border-dark dark:bg-sandigan-surface-cardDark space-y-3">
        <h4 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
          Encountering Accessibility Barriers?
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          We welcome feedback from users navigating with assistive technologies. If you encounter any barriers on this website, please report them to:{" "}
          <a href={`mailto:${SITE_CONFIG.links.contactEmail}`} className="text-sandigan-teal font-semibold underline">
            {SITE_CONFIG.links.contactEmail}
          </a>. We treat accessibility bug reports with top priority.
        </p>
      </section>
    </div>
  );
}
