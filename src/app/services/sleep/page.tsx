"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Moon, Wind, Check, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

// ─── Sleep Hygiene Tips ───────────────────────────────────────────────────────

const SLEEP_TIPS = [
  {
    category: "Environment",
    emoji: "🌙",
    tips: [
      "Keep your room cool (18–20°C / 64–68°F).",
      "Use blackout curtains or a sleep mask to block light.",
      "Use white noise or earplugs if noise is a problem.",
      "Reserve your bed for sleep — avoid working or scrolling in bed.",
    ],
  },
  {
    category: "Routine",
    emoji: "⏰",
    tips: [
      "Go to bed and wake at the same time every day, even weekends.",
      "Start a wind-down routine 30–60 minutes before bed.",
      "Avoid screens (phones, TV) 1 hour before sleep, or use night mode.",
      "Dim lights in the evening to signal your body it is time to rest.",
    ],
  },
  {
    category: "Lifestyle",
    emoji: "🥗",
    tips: [
      "Avoid caffeine after 2 PM (coffee, tea, energy drinks, sodas).",
      "Avoid heavy meals within 2–3 hours of bedtime.",
      "Regular physical activity helps — but not within 2 hours of sleep.",
      "Limit alcohol — it disrupts sleep quality even if it helps you fall asleep.",
    ],
  },
  {
    category: "Mental",
    emoji: "🧘",
    tips: [
      "Write a brief tomorrow's to-do list before bed to clear mental clutter.",
      "If anxious, try journaling or the 4-7-8 breathing below.",
      "Practice gratitude: name 3 good things from your day.",
      "If you cannot sleep after 20 minutes, leave bed and do something calm.",
    ],
  },
];

function SleepHygieneTips() {
  const [expanded, setExpanded] = React.useState<string | null>("Environment");

  return (
    <div className="space-y-2">
      {SLEEP_TIPS.map((section) => (
        <div
          key={section.category}
          className="rounded-xl border border-slate-200 dark:border-sandigan-border-dark overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setExpanded(expanded === section.category ? null : section.category)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-white dark:bg-sandigan-surface-cardDark hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{section.emoji}</span>
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                {section.category}
              </span>
            </div>
            {expanded === section.category ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>
          {expanded === section.category && (
            <div className="px-4 pb-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-sandigan-border-dark">
              <ul className="mt-3 space-y-2">
                {section.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sandigan-teal/10 text-sandigan-teal">
                      <Check className="h-3 w-3" />
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Wind-Down Checklist ──────────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  { id: "phone", label: "Put phone on Do Not Disturb", emoji: "📵" },
  { id: "lights", label: "Dim or turn off overhead lights", emoji: "💡" },
  { id: "temp", label: "Set room to a comfortable temperature", emoji: "🌡️" },
  { id: "water", label: "Have a glass of water nearby", emoji: "💧" },
  { id: "journal", label: "Write down anything on your mind", emoji: "✍️" },
  { id: "breath", label: "Do 2–4 minutes of slow breathing", emoji: "🌬️" },
  { id: "gratitude", label: "Name 3 things you are grateful for today", emoji: "🙏" },
  { id: "intention", label: "Set a gentle intention for tomorrow", emoji: "🌅" },
];

function WindDownChecklist() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const count = Object.values(checked).filter(Boolean).length;
  const all = count === CHECKLIST_ITEMS.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {count} of {CHECKLIST_ITEMS.length} steps completed
        </p>
        <button
          type="button"
          onClick={() => setChecked({})}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-sandigan-teal transition-all duration-500"
          style={{ width: `${(count / CHECKLIST_ITEMS.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col gap-2 mt-3">
        {CHECKLIST_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-left transition-all ${
              checked[item.id]
                ? "border-sandigan-teal bg-sandigan-teal/5 text-sandigan-teal dark:text-sandigan-teal-300 line-through opacity-70"
                : "border-slate-200 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-cardDark text-slate-700 dark:text-slate-300 hover:border-sandigan-teal/40"
            }`}
          >
            <span className="text-lg">{item.emoji}</span>
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                checked[item.id]
                  ? "border-sandigan-teal bg-sandigan-teal"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            >
              {checked[item.id] && <Check className="h-3 w-3 text-white" />}
            </div>
            {item.label}
          </button>
        ))}
      </div>

      {all && (
        <div className="mt-3 rounded-xl bg-sandigan-teal/10 border border-sandigan-teal/30 px-4 py-3 text-center">
          <p className="text-sm font-medium text-sandigan-teal dark:text-sandigan-teal-300">
            🌙 Wind-down complete. Rest well, and be gentle with yourself tonight.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 4-7-8 Breathing (simplified for sleep) ──────────────────────────────────

type SleepBreathPhase = "inhale" | "hold" | "exhale" | "rest";

const SLEEP_PHASES: { phase: SleepBreathPhase; label: string; secs: number }[] = [
  { phase: "inhale", label: "Breathe in", secs: 4 },
  { phase: "hold", label: "Hold", secs: 7 },
  { phase: "exhale", label: "Breathe out slowly", secs: 8 },
  { phase: "rest", label: "Pause", secs: 1 },
];

function SleepBreathingGuide() {
  const [running, setRunning] = React.useState(false);
  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [remaining, setRemaining] = React.useState(SLEEP_PHASES[0].secs);
  const [cycles, setCycles] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      const next = (phaseIdx + 1) % SLEEP_PHASES.length;
      if (next === 0) setCycles((c) => c + 1);
      setPhaseIdx(next);
      setRemaining(SLEEP_PHASES[next].secs);
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining, phaseIdx]);

  const current = SLEEP_PHASES[phaseIdx];
  const progress = 1 - remaining / current.secs;
  const isExhale = current.phase === "exhale";
  const scale =
    current.phase === "inhale"
      ? 0.5 + 0.5 * progress
      : isExhale
      ? 1.0 - 0.5 * progress
      : current.phase === "hold"
      ? 1.0
      : 0.5;

  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setRemaining(SLEEP_PHASES[0].secs);
    setCycles(0);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Circle */}
      <div className="relative flex items-center justify-center w-40 h-40">
        <div
          className="absolute inset-0 rounded-full bg-indigo-200 dark:bg-indigo-900/40 transition-all duration-1000"
          style={{ transform: `scale(${scale})`, opacity: 0.3 }}
        />
        <div
          className="absolute inset-4 rounded-full bg-indigo-400 dark:bg-indigo-600/60 transition-all duration-1000"
          style={{ transform: `scale(${scale * 0.8})`, opacity: 0.5 }}
        />
        <div className="relative flex flex-col items-center">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {remaining}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium text-center px-2">
            {current.label}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Cycles: <span className="font-semibold text-indigo-500 dark:text-indigo-300">{cycles}</span>
      </p>

      <div className="flex gap-3">
        <Button
          onClick={() => setRunning((r) => !r)}
          variant={running ? "outline" : "primary"}
          className="w-32"
        >
          {running ? "Pause" : cycles > 0 ? "Resume" : "Start"}
        </Button>
        {(running || cycles > 0) && (
          <Button onClick={reset} variant="ghost" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-xs text-center text-slate-400 dark:text-slate-500 max-w-xs">
        4 sec in · 7 sec hold · 8 sec out. Aim for 4 cycles before sleep.
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "checklist" | "breathing" | "tips";

export default function SleepPage() {
  const [tab, setTab] = React.useState<Tab>("checklist");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "checklist", label: "Wind-Down", icon: <Moon className="h-4 w-4" /> },
    { id: "breathing", label: "Breathing", icon: <Wind className="h-4 w-4" /> },
    { id: "tips", label: "Sleep Tips", icon: <Check className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="teal">SINAG</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Sleep & Relaxation · No sign-in required
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Sleep & Relaxation
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          Build healthy sleep habits and wind down with guided breathing. Rest is a form of
          self-care.
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-white dark:bg-slate-700 text-sandigan-navy dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "checklist" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Bedtime Wind-Down Checklist</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Check off each step to build a consistent wind-down routine. Tap any item to mark it
              done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WindDownChecklist />
          </CardContent>
        </Card>
      )}

      {tab === "breathing" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">4-7-8 Breathing for Sleep</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              This breathing technique activates your parasympathetic nervous system, naturally
              reducing anxiety and making it easier to fall asleep.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <SleepBreathingGuide />
          </CardContent>
        </Card>
      )}

      {tab === "tips" && (
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Evidence-based sleep hygiene tips. Tap each category to expand.
          </p>
          <SleepHygieneTips />
        </div>
      )}

      {/* Footer */}
      <p className="mt-8 text-xs text-center text-slate-400 dark:text-slate-500">
        Persistent sleep difficulties may need professional support. Contact your doctor or call{" "}
        <strong>1553</strong> if sleep problems are affecting your mental health.
      </p>
    </div>
  );
}
