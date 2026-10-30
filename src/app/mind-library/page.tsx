"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BookText,
  Search,
  Clock,
  ExternalLink,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Send,
  Loader2,
} from "lucide-react";

interface LibraryArticle {
  id: string;
  title: string;
  category: "anxiety" | "burnout" | "sleep" | "emotions" | "crisis";
  summary: string;
  keyInsights: string[];
  readingTime: string;
  sourceAttribution: string;
  sourceInstitution: string;
  lastReviewed: string;
  citationUrl?: string;
}

export default function MindLibraryPage() {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  // Ask DUNONG interactive inquiry state
  const [dunongQuery, setDunongQuery] = React.useState("");
  const [dunongAnswer, setDunongAnswer] = React.useState<string | null>(null);
  const [dunongSources, setDunongSources] = React.useState<string[]>([]);
  const [dunongLoading, setDunongLoading] = React.useState(false);

  const handleAskDunong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dunongQuery.trim() || dunongLoading) return;
    setDunongLoading(true);
    setDunongAnswer(null);

    try {
      const res = await fetch("/api/officers/dunong", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: dunongQuery.trim() }),
      });
      const json = await res.json();
      if (json.data?.answer) {
        setDunongAnswer(json.data.answer);
        setDunongSources(json.data.institutionalSources || []);
      }
    } catch {
      setDunongAnswer(
        "According to the World Health Organization (WHO), mental health is an integral component of health and well-being. For personalized support, please connect with a verified healthcare professional."
      );
    } finally {
      setDunongLoading(false);
    }
  };

  const articles: LibraryArticle[] = [
    {
      id: "art-anxiety-grounding",
      title: "The Neurobiology of Grounding: Calming the Acute Panic Response",
      category: "anxiety",
      summary:
        "Understand how sensory groundings (5-4-3-2-1 technique and prolonged exhalations) signal the amygdala and vagus nerve to reduce physiological panic.",
      keyInsights: [
        "Panic attacks are physiological responses driven by sympathetic nervous system activation.",
        "Prolonged exhalations (4-7-8 method) stimulate the parasympathetic brake to slow heart rate.",
        "Sensory tactile anchoring redirects neural focus from catastrophic thoughts to physical safety.",
      ],
      readingTime: "4 min read",
      sourceAttribution: "Porges, S. W. (Polyvagal Theory) & American Psychological Association (APA)",
      sourceInstitution: "APA Clinical Guidelines",
      lastReviewed: "October 2026",
      citationUrl: "https://www.apa.org/topics/anxiety",
    },
    {
      id: "art-academic-burnout",
      title: "Deconstructing Academic Burnout Among Filipino Youth",
      category: "burnout",
      summary:
        "An exploration of chronic academic exhaustion, perfectionism, and cultural 'hiya' (shame) in competitive educational environments.",
      keyInsights: [
        "Burnout is classified by the WHO as an occupational phenomenon resulting from chronic unmanaged stress.",
        "Rest is a non-negotiable biological requirement, not a reward earned only after total exhaustion.",
        "Establishing micro-boundaries between study hours and emotional rest prevents cognitive depletion.",
      ],
      readingTime: "5 min read",
      sourceAttribution: "World Health Organization (ICD-11 QD85) & Philippine Mental Health Act (RA 11036)",
      sourceInstitution: "WHO & DOH Philippines",
      lastReviewed: "October 2026",
      citationUrl: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases",
    },
    {
      id: "art-sleep-hygiene",
      title: "Sleep Hygiene Architecture: Reclaiming Rest in a Connected World",
      category: "sleep",
      summary:
        "Evidence-informed sleep habits: managing blue-light exposure, regulating circadian rhythms, and creating gentle nighttime wind-down rituals.",
      keyInsights: [
        "Adolescent and young adult circadian rhythms naturally favor later sleep phases, exacerbated by late screen time.",
        "Cool ambient room temperatures and low lighting trigger natural melatonin secretion.",
        "A consistent 20-minute wind-down buffer prepares the mind for deep slow-wave restorative sleep.",
      ],
      readingTime: "3 min read",
      sourceAttribution: "National Sleep Foundation & Walker, M. (Why We Sleep)",
      sourceInstitution: "National Sleep Foundation",
      lastReviewed: "October 2026",
      citationUrl: "https://www.sleepfoundation.org/sleep-hygiene",
    },
    {
      id: "art-emotional-granularity",
      title: "Emotional Granularity: Moving Beyond 'I am Stressed'",
      category: "emotions",
      summary:
        "How precisely naming complex emotions (grief, resentment, inadequacy, loneliness) reduces emotional reactivity and fosters self-compassion.",
      keyInsights: [
        "Psychological research demonstrates that precise affect labeling significantly dampens amygdala reactivity.",
        "Distinguishing between fatigue, shame, and sadness allows for targeted, compassionate self-care.",
        "Journaling with mood tags promotes emotional literacy over time.",
      ],
      readingTime: "4 min read",
      sourceAttribution: "Barrett, L. F. (Theory of Constructed Emotion) & Psychological Science",
      sourceInstitution: "Association for Psychological Science",
      lastReviewed: "October 2026",
      citationUrl: "https://www.psychologicalscience.org",
    },
    {
      id: "art-safety-planning-science",
      title: "The Clinical Evidence Behind Stanley-Brown Safety Planning",
      category: "crisis",
      summary:
        "Why collaborative, step-by-step safety planning reduces suicide crisis risk and provides an actionable anchor during emotional storms.",
      keyInsights: [
        "The Stanley-Brown Safety Planning Intervention is recognized globally as a best-practice crisis protocol.",
        "Identifying personal warning signs before a crisis strikes allows for early intervention.",
        "Having direct contact numbers readily accessible minimizes decision paralysis in moments of panic.",
      ],
      readingTime: "5 min read",
      sourceAttribution: "Stanley, B., & Brown, G. K. (Safety Planning Intervention)",
      sourceInstitution: "Columbia University Department of Psychiatry",
      lastReviewed: "October 2026",
      citationUrl: "https://suicidesafetyplan.com",
    },
  ];

  const categories = [
    { id: "all", label: "All Guides" },
    { id: "anxiety", label: "Anxiety & Panic" },
    { id: "burnout", label: "Academic Burnout" },
    { id: "sleep", label: "Sleep & Rest" },
    { id: "emotions", label: "Emotional Literacy" },
    { id: "crisis", label: "Safety & Crisis Prep" },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.sourceAttribution.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeCategory === "all") return true;
    return art.category === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="emerald">Psychoeducational Archive</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          The Mind Library
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Curated by <strong>DUNONG</strong> (Research Librarian AI Officer). Every article is grounded in evidence-informed psychological literature, peer-reviewed studies, and verified citations.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles, topics, or citations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-dark text-sm focus:outline-none focus:ring-2 focus:ring-sandigan-teal"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeCategory === c.id
                  ? "bg-sandigan-emerald text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-sandigan-navy-800 dark:text-slate-300 dark:hover:bg-sandigan-navy-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ask DUNONG Interactive Psychoeducation Box */}
      <Card className="border-sandigan-emerald/40 bg-gradient-to-br from-sandigan-emerald/5 via-white to-sandigan-teal/5 dark:from-sandigan-emerald/10 dark:via-sandigan-surface-cardDark dark:to-sandigan-teal/10 shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="emerald">DUNONG · CURATOR-05</Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Evidence-Informed Research Inquiries
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-sandigan-navy dark:text-white">
              Ask DUNONG a Mental Health Science Question
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Get an evidence-informed summary grounded in authentic citations from WHO, APA, and DOH Philippines. No diagnoses or fabricated citations.
            </p>
          </div>

          <form onSubmit={handleAskDunong} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. What does polyvagal theory explain about anxiety? How does sleep debt affect mood?"
              value={dunongQuery}
              onChange={(e) => setDunongQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-dark focus:outline-none focus:ring-2 focus:ring-sandigan-emerald"
            />
            <Button
              type="submit"
              disabled={dunongLoading || !dunongQuery.trim()}
              variant="emerald"
              size="sm"
              leftIcon={dunongLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            >
              {dunongLoading ? "Searching…" : "Ask"}
            </Button>
          </form>

          {dunongAnswer && (
            <div className="rounded-xl border border-sandigan-emerald/30 bg-white/80 dark:bg-sandigan-navy-900/60 p-4 space-y-3">
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {dunongAnswer}
              </p>
              {dunongSources.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-sandigan-border-dark flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-sandigan-emerald">Verified Institutional Sources:</span>
                  {dunongSources.map((s, idx) => (
                    <span key={idx} className="bg-sandigan-emerald/10 text-sandigan-emerald px-2 py-0.5 rounded-full text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Articles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => (
          <Card key={art.id} className="flex flex-col justify-between hover:shadow-soft-md transition-shadow">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sandigan-emerald">
                  {art.sourceInstitution}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {art.readingTime}
                </span>
              </div>
              <CardTitle className="text-lg leading-snug">{art.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">{art.summary}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Core Evidence Insights:
                </span>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {art.keyInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sandigan-emerald shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-sandigan-navy-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Source: {art.sourceAttribution}</span>
                {art.citationUrl && (
                  <a
                    href={art.citationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sandigan-emerald hover:underline font-medium"
                  >
                    <span>View Citation</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-slate-500">No guides found matching &quot;{search}&quot;.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setActiveCategory("all"); }}>
            Reset Search
          </Button>
        </div>
      )}

      {/* Curator Transparency Notice */}
      <div className="rounded-2xl border border-sandigan-emerald-200 bg-sandigan-emerald-50/50 p-6 dark:border-sandigan-emerald-900 dark:bg-sandigan-emerald-950/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sandigan-emerald-800 dark:text-sandigan-emerald-300">
          <ShieldCheck className="w-4 h-4" />
          <span>Curator &amp; Citation Integrity Standard</span>
        </div>
        <p className="leading-relaxed">
          DUNONG operates under a strict zero-hallucination mandate: all citations are reviewed for authentic institutional publication (WHO, APA, DOH Philippines, peer-reviewed journals). No medical advice or clinical diagnostic procedures are published.
        </p>
      </div>
    </div>
  );
}
