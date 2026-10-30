"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  BarChart2,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  key: string;
  text: string;
  lowLabel: string;
  highLabel: string;
}

interface Domain {
  id: string;
  label: string;
  questions: Question[];
}

interface ApiScores {
  sleep: number;
  stress: number;
  emotion: number;
  social: number;
}

interface WellnessApiResponse {
  scores?: ApiScores;
  reflection?: string;
  recommendations?: Array<{ label: string; href: string }>;
  error?: string;
}

interface PastAssessment {
  id: string;
  created_at: string;
  scores: ApiScores;
}

// ─── Domain definitions ───────────────────────────────────────────────────────

const DOMAINS: Domain[] = [
  {
    id: "sleep",
    label: "Sleep",
    questions: [
      {
        key: "q_sleep_1",
        text: "How many hours of sleep did you get last night?",
        lowLabel: "Less than 4hrs",
        highLabel: "More than 8hrs",
      },
      {
        key: "q_sleep_2",
        text: "How rested did you feel when you woke up?",
        lowLabel: "Not rested at all",
        highLabel: "Fully rested",
      },
      {
        key: "q_sleep_3",
        text: "How often did you wake up during the night?",
        lowLabel: "Many times",
        highLabel: "Not at all",
      },
      {
        key: "q_sleep_4",
        text: "How consistent was your sleep schedule this week?",
        lowLabel: "Very irregular",
        highLabel: "Very consistent",
      },
    ],
  },
  {
    id: "stress",
    label: "Stress Management",
    questions: [
      {
        key: "q_stress_1",
        text: "How overwhelming did your responsibilities feel today?",
        lowLabel: "Very overwhelming",
        highLabel: "Not overwhelming",
      },
      {
        key: "q_stress_2",
        text: "Were you able to manage unexpected challenges calmly?",
        lowLabel: "Not at all",
        highLabel: "Very well",
      },
      {
        key: "q_stress_3",
        text: "How often did you feel physically tense or anxious?",
        lowLabel: "All day",
        highLabel: "Not at all",
      },
      {
        key: "q_stress_4",
        text: "Did you have time to decompress and recover today?",
        lowLabel: "No time at all",
        highLabel: "Plenty of time",
      },
    ],
  },
  {
    id: "emotion",
    label: "Emotional Energy",
    questions: [
      {
        key: "q_emotion_1",
        text: "How would you describe your overall mood today?",
        lowLabel: "Very low",
        highLabel: "Very positive",
      },
      {
        key: "q_emotion_2",
        text: "Did you feel connected to things that give you meaning?",
        lowLabel: "Not at all",
        highLabel: "Strongly connected",
      },
      {
        key: "q_emotion_3",
        text: "How well were you able to regulate difficult emotions?",
        lowLabel: "Struggled greatly",
        highLabel: "Managed very well",
      },
      {
        key: "q_emotion_4",
        text: "Did you experience moments of joy or lightness today?",
        lowLabel: "None at all",
        highLabel: "Several moments",
      },
    ],
  },
  {
    id: "social",
    label: "Social Connection",
    questions: [
      {
        key: "q_social_1",
        text: "Did you feel a sense of belonging with people around you?",
        lowLabel: "Very isolated",
        highLabel: "Strongly connected",
      },
      {
        key: "q_social_2",
        text: "Were you able to express yourself authentically with someone?",
        lowLabel: "Not at all",
        highLabel: "Very openly",
      },
      {
        key: "q_social_3",
        text: "How supported did you feel by those in your life today?",
        lowLabel: "Very unsupported",
        highLabel: "Very supported",
      },
    ],
  },
];

// ─── Score colour helper ──────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

function scoreBadgeVariant(score: number): "teal" | "gold" | "rose" {
  if (score >= 70) return "teal";
  if (score >= 40) return "gold";
  return "rose";
}

function scoreLabel(score: number): string {
  if (score >= 70) return "Good";
  if (score >= 40) return "Fair";
  return "Needs attention";
}

// ─── Sign-in prompt ───────────────────────────────────────────────────────────

function SignInPrompt() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sandigan-gold-50 dark:bg-sandigan-gold-900/30">
            <BarChart2 className="h-8 w-8 text-sandigan-gold-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
              Sign in for Wellness Check
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your reflections are private and secure. Please sign in to
              continue.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-xl select-none bg-sandigan-navy text-white hover:bg-sandigan-navy-700 focus-visible:ring-sandigan-navy shadow-sm h-13 px-7 text-base gap-2.5 w-full mt-2"
          >
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function StepProgressBar({ step }: { step: number }) {
  const total = 4;
  const pct = ((step - 1) / (total - 1)) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Domain {step} of {total}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {DOMAINS[step - 1]?.label}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-sandigan-teal transition-all duration-500"
          style={{ width: `${Math.max(pct, 10)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {DOMAINS.map((d, i) => (
          <span
            key={d.id}
            className={`text-[10px] font-medium transition-colors ${
              i + 1 <= step
                ? "text-sandigan-teal-600 dark:text-sandigan-teal-400"
                : "text-slate-400 dark:text-slate-600"
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Scale pill ───────────────────────────────────────────────────────────────

function ScalePills({
  questionKey,
  selected,
  onSelect,
}: {
  questionKey: string;
  selected: number | undefined;
  onSelect: (key: string, value: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((v) => {
        const isSelected = selected === v;
        return (
          <button
            key={v}
            onClick={() => onSelect(questionKey, v)}
            aria-label={`Rate ${v} out of 5`}
            className={`h-11 w-11 rounded-full text-sm font-semibold border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sandigan-teal focus-visible:ring-offset-2 ${
              isSelected
                ? "bg-sandigan-teal text-white border-sandigan-teal scale-110 shadow-md"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-sandigan-teal hover:text-sandigan-teal dark:hover:border-sandigan-teal dark:hover:text-sandigan-teal-400"
            }`}
          >
            {isSelected ? <Check className="h-4 w-4 mx-auto" /> : v}
          </button>
        );
      })}
    </div>
  );
}

// ─── Domain question step ─────────────────────────────────────────────────────

function DomainStep({
  domain,
  responses,
  onAnswer,
}: {
  domain: Domain;
  responses: Record<string, number>;
  onAnswer: (key: string, value: number) => void;
}) {
  return (
    <div className="space-y-6">
      {domain.questions.map((q) => (
        <Card key={q.key} className="p-4">
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-4 leading-relaxed">
            {q.text}
          </p>
          <div className="flex flex-col gap-3">
            <ScalePills
              questionKey={q.key}
              selected={responses[q.key]}
              onSelect={onAnswer}
            />
            <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
              <span>1 — {q.lowLabel}</span>
              <span>{q.highLabel} — 5</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Results step ─────────────────────────────────────────────────────────────

function ResultsStep({
  scores,
  reflection,
  recommendations,
  onReset,
}: {
  scores: ApiScores;
  reflection: string;
  recommendations: Array<{ label: string; href: string }>;
  onReset: () => void;
}) {
  const categories: Array<{ key: keyof ApiScores; label: string }> = [
    { key: "sleep", label: "Sleep" },
    { key: "stress", label: "Stress Management" },
    { key: "emotion", label: "Emotional Energy" },
    { key: "social", label: "Social Connection" },
  ];

  return (
    <div className="space-y-6">
      {/* SIKLAB badge */}
      <div className="flex items-center gap-2">
        <Badge variant="gold">SIKLAB</Badge>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ANALYST-04 · Wellness Assessment Officer
        </span>
      </div>

      {/* Score bars */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="h-5 w-5 text-sandigan-gold-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Your Wellness Snapshot
          </h3>
        </div>
        <div className="space-y-4">
          {categories.map(({ key, label }) => {
            const score = scores[key] ?? 0;
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={scoreBadgeVariant(score)}>
                      {scoreLabel(score)}
                    </Badge>
                    <span className="text-sm font-bold text-slate-900 dark:text-white w-10 text-right">
                      {score}%
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${scoreColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reflection */}
      {reflection && (
        <Card className="bg-sandigan-teal-50 dark:bg-sandigan-teal-900/20 border-sandigan-teal-100 dark:border-sandigan-teal-800">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-sandigan-teal-600 dark:text-sandigan-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-sandigan-teal-700 dark:text-sandigan-teal-400 mb-1 uppercase tracking-wide">
                SIKLAB&apos;s Reflection
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {reflection}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Recommended for you
          </p>
          <div className="flex flex-wrap gap-2">
            {recommendations.slice(0, 2).map((rec) => (
              <Link
                key={rec.href}
                href={rec.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-sandigan-teal text-sandigan-teal dark:text-sandigan-teal-400 dark:border-sandigan-teal-600 px-4 py-1.5 text-sm font-medium hover:bg-sandigan-teal hover:text-white dark:hover:bg-sandigan-teal-700 dark:hover:text-white transition-colors"
              >
                {rec.label}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onReset} variant="outline" className="flex-1">
          Take Another Check-In
        </Button>
        <Link
          href="/services/inner-garden/new"
          className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-xl select-none bg-sandigan-teal text-white hover:bg-sandigan-teal-600 focus-visible:ring-sandigan-teal shadow-sm h-11 px-5 text-sm gap-2 flex-1"
        >
          Save to Journal
        </Link>
      </div>
    </div>
  );
}

// ─── Past assessment card ─────────────────────────────────────────────────────

function PastAssessmentCard({ assessment }: { assessment: PastAssessment }) {
  const date = new Date(assessment.created_at).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const categories: Array<{ key: keyof ApiScores; label: string }> = [
    { key: "sleep", label: "Sleep" },
    { key: "stress", label: "Stress" },
    { key: "emotion", label: "Emotional" },
    { key: "social", label: "Social" },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {date}
        </span>
        <Badge variant="neutral">Past check-in</Badge>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {categories.map(({ key, label }) => {
          const score = assessment.scores[key] ?? 0;
          return (
            <div key={key} className="text-center">
              <div
                className={`text-base font-bold ${
                  score >= 70
                    ? "text-emerald-600 dark:text-emerald-400"
                    : score >= 40
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {score}%
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function WellnessCheckPage() {
  const { user, isLoading } = useAuth();

  // step: 0=intro, 1-4=domains, 5=results
  const [step, setStep] = React.useState(0);
  const [responses, setResponses] = React.useState<Record<string, number>>({});

  // Results state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [results, setResults] = React.useState<{
    scores: ApiScores;
    reflection: string;
    recommendations: Array<{ label: string; href: string }>;
  } | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Past assessments
  const [pastAssessments, setPastAssessments] = React.useState<
    PastAssessment[]
  >([]);
  const [loadingPast, setLoadingPast] = React.useState(false);

  // Load past assessments on mount when user is logged in
  React.useEffect(() => {
    if (!user) return;
    setLoadingPast(true);
    fetch("/api/wellness-check")
      .then((r) => r.json())
      .then((data) => {
        const rawList = Array.isArray(data) ? data : data.assessments || [];
        const parsed: PastAssessment[] = rawList.map((item: any) => ({
          id: item.id,
          created_at: item.created_at,
          scores: item.scores || {
            sleep: item.category_scores?.sleep ?? 0,
            stress: item.category_scores?.stress ?? 0,
            emotion: item.category_scores?.emotional_energy ?? 0,
            social: item.category_scores?.social_connection ?? 0,
          },
        }));
        setPastAssessments(parsed.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoadingPast(false));
  }, [user]);

  const handleAnswer = (key: string, value: number) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  };

  const currentDomain = step >= 1 && step <= 4 ? DOMAINS[step - 1] : null;

  const isCurrentStepComplete = (): boolean => {
    if (!currentDomain) return false;
    return currentDomain.questions.every((q) => responses[q.key] !== undefined);
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }
    // step 4 → submit → step 5
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/wellness-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });
      const data: WellnessApiResponse = await res.json();
      if (!res.ok || data.error) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }
      setResults({
        scores: data.scores || { sleep: 0, stress: 0, emotion: 0, social: 0 },
        reflection: data.reflection || "",
        recommendations: data.recommendations || [
          { label: "Talk to Tinig", href: "/services/talk" },
          { label: "Mind Library", href: "/mind-library" },
        ],
      });
      setStep(5);
    } catch {
      setSubmitError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleReset = () => {
    setStep(0);
    setResponses({});
    setResults(null);
    setSubmitError(null);
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sandigan-teal border-t-transparent" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Auth gate ──
  if (!user && !isLoading) {
    return <SignInPrompt />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
      {/* ── Page header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BarChart2 className="h-6 w-6 text-sandigan-gold-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Wellness Check-In
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          A gentle self-reflection across four areas of your well-being.
        </p>

        {/* Disclaimer */}
        <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3 py-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Note:</strong> This is a personal self-reflection tool, not
            a clinical or diagnostic assessment.
          </p>
        </div>
      </div>

      {/* ── Step 0: Intro ── */}
      {step === 0 && (
        <div className="space-y-6">
          <Card className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-sandigan-gold-50 dark:bg-sandigan-gold-900/30">
                <Sparkles className="h-8 w-8 text-sandigan-gold-500" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Ready to check in?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
              This 15-question reflection covers{" "}
              <strong>Sleep, Stress Management, Emotional Energy,</strong> and{" "}
              <strong>Social Connection</strong>. It takes about 3–5 minutes.
            </p>
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="primary"
                size="lg"
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                Start Check-In
              </Button>
              <Badge variant="gold">SIKLAB · ANALYST-04</Badge>
            </div>
          </Card>

          {/* Past assessments */}
          {(loadingPast || pastAssessments.length > 0) && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Recent Check-Ins
              </h3>
              {loadingPast ? (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
                  Loading…
                </div>
              ) : (
                <div className="space-y-3">
                  {pastAssessments.map((a) => (
                    <PastAssessmentCard key={a.id} assessment={a} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Steps 1–4: Domain questions ── */}
      {step >= 1 && step <= 4 && currentDomain && (
        <div>
          <StepProgressBar step={step} />

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {currentDomain.label}
          </h2>

          <DomainStep
            domain={currentDomain}
            responses={responses}
            onAnswer={handleAnswer}
          />

          {submitError && (
            <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 px-3 py-2 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 dark:text-rose-300">
                {submitError}
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleBack}
              variant="outline"
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              variant="primary"
              disabled={!isCurrentStepComplete() || isSubmitting}
              isLoading={isSubmitting && step === 4}
              rightIcon={
                step < 4 ? <ChevronRight className="h-4 w-4" /> : undefined
              }
              className="flex-1"
            >
              {step < 4
                ? "Next"
                : isSubmitting
                ? "Analyzing…"
                : "See My Results"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 5: Results ── */}
      {step === 5 && results && (
        <ResultsStep
          scores={results.scores}
          reflection={results.reflection}
          recommendations={results.recommendations}
          onReset={handleReset}
        />
      )}

      {/* Submitting overlay (edge case) */}
      {isSubmitting && step === 5 && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sandigan-gold-400 border-t-transparent" />
          <p className="text-sm text-slate-500">
            SIKLAB is analyzing your responses…
          </p>
        </div>
      )}
    </div>
  );
}
