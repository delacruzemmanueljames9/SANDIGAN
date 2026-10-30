"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Wind, Box, Eye, ChevronRight, RotateCcw, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Exercise = "478" | "box" | "grounding";

// ─── 4-7-8 Breathing ─────────────────────────────────────────────────────────

type Phase478 = "inhale" | "hold" | "exhale" | "rest";

const PHASES_478: { phase: Phase478; label: string; duration: number; color: string }[] = [
  { phase: "inhale", label: "Inhale", duration: 4, color: "bg-sandigan-teal" },
  { phase: "hold", label: "Hold", duration: 7, color: "bg-sandigan-gold" },
  { phase: "exhale", label: "Exhale", duration: 8, color: "bg-sandigan-emerald" },
  { phase: "rest", label: "Rest", duration: 1, color: "bg-slate-400" },
];

function Breathing478() {
  const [running, setRunning] = React.useState(false);
  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [remaining, setRemaining] = React.useState(PHASES_478[0].duration);
  const [cycles, setCycles] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      const next = (phaseIdx + 1) % PHASES_478.length;
      if (next === 0) setCycles((c) => c + 1);
      setPhaseIdx(next);
      setRemaining(PHASES_478[next].duration);
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining, phaseIdx]);

  const current = PHASES_478[phaseIdx];
  const progress = 1 - remaining / current.duration;

  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setRemaining(PHASES_478[0].duration);
    setCycles(0);
  };

  // Circle animation: scale from 0.6 → 1.0 on inhale, 1.0 on hold, 1.0 → 0.6 on exhale
  const scale =
    current.phase === "inhale"
      ? 0.6 + 0.4 * progress
      : current.phase === "exhale"
      ? 1.0 - 0.4 * progress
      : current.phase === "hold"
      ? 1.0
      : 0.6;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Animated circle */}
      <div className="relative flex items-center justify-center w-48 h-48">
        <div
          className={`absolute inset-0 rounded-full ${current.color} opacity-20 transition-all duration-1000`}
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className={`absolute inset-4 rounded-full ${current.color} opacity-40 transition-all duration-1000`}
          style={{ transform: `scale(${scale * 0.85})` }}
        />
        <div
          className={`absolute inset-8 rounded-full ${current.color} opacity-70 transition-all duration-1000`}
          style={{ transform: `scale(${scale * 0.7})` }}
        />
        <div className="relative flex flex-col items-center">
          <span className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
            {remaining}
          </span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
            {current.label}
          </span>
        </div>
      </div>

      {/* Phase dots */}
      <div className="flex gap-2">
        {PHASES_478.map((p, i) => (
          <div
            key={p.phase}
            className={`h-2 w-8 rounded-full transition-all ${
              i === phaseIdx ? current.color + " opacity-100" : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Cycles completed: <span className="font-semibold text-sandigan-teal">{cycles}</span>
      </p>

      <div className="flex gap-3">
        <Button
          onClick={() => setRunning((r) => !r)}
          variant={running ? "outline" : "teal"}
          className="w-32"
        >
          {running ? "Pause" : cycles > 0 ? "Resume" : "Begin"}
        </Button>
        {(running || cycles > 0) && (
          <Button onClick={reset} variant="ghost" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-xs text-center text-slate-400 dark:text-slate-500 max-w-xs">
        Inhale 4 sec · Hold 7 sec · Exhale 8 sec. Aim for 4 cycles.
      </p>
    </div>
  );
}

// ─── Box Breathing ────────────────────────────────────────────────────────────

type PhaseBox = "inhale" | "hold-in" | "exhale" | "hold-out";

const PHASES_BOX: { phase: PhaseBox; label: string; corner: string }[] = [
  { phase: "inhale", label: "Inhale", corner: "top-left" },
  { phase: "hold-in", label: "Hold", corner: "top-right" },
  { phase: "exhale", label: "Exhale", corner: "bottom-right" },
  { phase: "hold-out", label: "Hold", corner: "bottom-left" },
];

const BOX_DURATION = 4;

function BoxBreathing() {
  const [running, setRunning] = React.useState(false);
  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [remaining, setRemaining] = React.useState(BOX_DURATION);
  const [cycles, setCycles] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      const next = (phaseIdx + 1) % 4;
      if (next === 0) setCycles((c) => c + 1);
      setPhaseIdx(next);
      setRemaining(BOX_DURATION);
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining, phaseIdx]);

  const current = PHASES_BOX[phaseIdx];
  const progress = 1 - remaining / BOX_DURATION;

  // Dot position: travels along the box perimeter
  // top edge: 0→1 (inhale), right edge: 0→1 (hold-in), bottom: 1→0 (exhale), left: 1→0 (hold-out)
  const dotStyle = (() => {
    const p = progress;
    switch (current.phase) {
      case "inhale": return { top: 0, left: `${p * 100}%` };
      case "hold-in": return { top: `${p * 100}%`, left: "100%" };
      case "exhale": return { top: "100%", left: `${(1 - p) * 100}%` };
      case "hold-out": return { top: `${(1 - p) * 100}%`, left: 0 };
    }
  })();

  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setRemaining(BOX_DURATION);
    setCycles(0);
  };

  const sideLabel = (idx: number) => (phaseIdx === idx ? current.label : PHASES_BOX[idx].label);
  const sideActive = (idx: number) => phaseIdx === idx;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Box */}
      <div className="relative w-48 h-48">
        {/* Border */}
        <div className="absolute inset-0 rounded-xl border-4 border-sandigan-teal opacity-30" />
        {/* Active side highlight */}
        <div
          className={`absolute inset-0 rounded-xl border-4 border-sandigan-teal transition-all duration-500 ${
            sideActive(0)
              ? "border-t-sandigan-teal border-r-transparent border-b-transparent border-l-transparent"
              : sideActive(1)
              ? "border-t-transparent border-r-sandigan-teal border-b-transparent border-l-transparent"
              : sideActive(2)
              ? "border-t-transparent border-r-transparent border-b-sandigan-teal border-l-transparent"
              : "border-t-transparent border-r-transparent border-b-transparent border-l-sandigan-teal"
          }`}
        />
        {/* Dot */}
        <div
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sandigan-teal shadow-lg transition-all duration-1000"
          style={{ top: dotStyle.top, left: dotStyle.left }}
        />
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {remaining}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {current.label}
          </span>
        </div>
        {/* Corner labels */}
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-slate-400">
          {sideLabel(0)}
        </span>
        <span className="absolute top-1/2 -right-10 -translate-y-1/2 text-xs text-slate-400">
          {sideLabel(1)}
        </span>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-slate-400">
          {sideLabel(2)}
        </span>
        <span className="absolute top-1/2 -left-10 -translate-y-1/2 text-xs text-slate-400">
          {sideLabel(3)}
        </span>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Cycles completed: <span className="font-semibold text-sandigan-teal">{cycles}</span>
      </p>

      <div className="flex gap-3">
        <Button
          onClick={() => setRunning((r) => !r)}
          variant={running ? "outline" : "teal"}
          className="w-32"
        >
          {running ? "Pause" : cycles > 0 ? "Resume" : "Begin"}
        </Button>
        {(running || cycles > 0) && (
          <Button onClick={reset} variant="ghost" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-xs text-center text-slate-400 dark:text-slate-500 max-w-xs">
        Inhale 4 · Hold 4 · Exhale 4 · Hold 4. Used by Navy SEALs for stress regulation.
      </p>
    </div>
  );
}

// ─── 5-4-3-2-1 Grounding ─────────────────────────────────────────────────────

const GROUNDING_STEPS = [
  {
    count: 5,
    sense: "See",
    tagalog: "Makita",
    prompt: "Name 5 things you can see right now.",
    emoji: "👁️",
    color: "bg-sandigan-teal/10 border-sandigan-teal/30 text-sandigan-teal-700 dark:text-sandigan-teal-300",
  },
  {
    count: 4,
    sense: "Touch",
    tagalog: "Mahipo",
    prompt: "Name 4 things you can physically feel — your feet on the floor, your hands on your lap.",
    emoji: "✋",
    color: "bg-sandigan-emerald/10 border-sandigan-emerald/30 text-sandigan-emerald dark:text-emerald-300",
  },
  {
    count: 3,
    sense: "Hear",
    tagalog: "Marinig",
    prompt: "Name 3 sounds you can hear right now.",
    emoji: "👂",
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
  },
  {
    count: 2,
    sense: "Smell",
    tagalog: "Amuyin",
    prompt: "Name 2 things you can smell, or 2 you enjoy smelling.",
    emoji: "👃",
    color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
  },
  {
    count: 1,
    sense: "Taste",
    tagalog: "Tikman",
    prompt: "Name 1 thing you can taste right now.",
    emoji: "👅",
    color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
  },
];

function GroundingExercise() {
  const [step, setStep] = React.useState(0);
  const [checked, setChecked] = React.useState<boolean[]>(new Array(5).fill(false));
  const [done, setDone] = React.useState(false);

  const current = GROUNDING_STEPS[step];

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  const canAdvance = checked.slice(0, current.count).filter(Boolean).length === current.count;

  const advance = () => {
    if (step < 4) {
      setStep((s) => s + 1);
      setChecked(new Array(5).fill(false));
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setStep(0);
    setChecked(new Array(5).fill(false));
    setDone(false);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sandigan-emerald/10">
          <Check className="h-8 w-8 text-sandigan-emerald" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          You&apos;ve completed the grounding exercise.
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          Take a moment to notice how you feel. You are here. You are present.
        </p>
        <Button onClick={restart} variant="outline" className="mt-2">
          <RotateCcw className="h-4 w-4 mr-2" /> Start Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {GROUNDING_STEPS.map((s, i) => (
          <div
            key={s.sense}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              i < step
                ? "bg-sandigan-teal"
                : i === step
                ? "bg-sandigan-teal/50"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Step card */}
      <div className={`rounded-xl border p-5 ${current.color}`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{current.emoji}</span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
              Step {step + 1} of 5
            </p>
            <h3 className="text-xl font-bold mb-1">
              {current.count} things to <span className="underline">{current.sense}</span>
              <span className="font-normal text-sm ml-2 opacity-60">({current.tagalog})</span>
            </h3>
            <p className="text-sm opacity-80">{current.prompt}</p>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: current.count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-all text-left ${
              checked[i]
                ? "border-sandigan-teal bg-sandigan-teal/5 text-sandigan-teal dark:text-sandigan-teal-300"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-sandigan-teal/40"
            }`}
          >
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                checked[i]
                  ? "border-sandigan-teal bg-sandigan-teal"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            >
              {checked[i] && <Check className="h-3 w-3 text-white" />}
            </div>
            {current.sense} #{i + 1}
          </button>
        ))}
      </div>

      <Button
        onClick={advance}
        disabled={!canAdvance}
        variant="teal"
        className="w-full"
        rightIcon={step < 4 ? <ChevronRight className="h-4 w-4" /> : undefined}
      >
        {step < 4 ? "Next Sense" : "Complete Exercise"}
      </Button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const EXERCISES: {
  id: Exercise;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "478",
    label: "4-7-8 Breathing",
    tagline: "Activate your rest response",
    icon: <Wind className="h-5 w-5" />,
    description:
      "Inhale for 4 seconds, hold for 7, exhale for 8. This pattern activates the parasympathetic nervous system and reduces anxiety within minutes.",
  },
  {
    id: "box",
    label: "Box Breathing",
    tagline: "Equal-count calm",
    icon: <Box className="h-5 w-5" />,
    description:
      "Four equal phases of 4 seconds each. Used by first responders and military personnel to quickly regain focus under stress.",
  },
  {
    id: "grounding",
    label: "5-4-3-2-1 Grounding",
    tagline: "Anchor to the present",
    icon: <Eye className="h-5 w-5" />,
    description:
      "Use your senses to reconnect with the present moment. Highly effective for anxiety, panic, and dissociation.",
  },
];

export default function ResetRoomPage() {
  const [active, setActive] = React.useState<Exercise | null>(null);

  const activeExercise = EXERCISES.find((e) => e.id === active);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="teal">SINAG</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            COMPANION-07 · Reset Room
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Reset Room
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          A private space to pause, breathe, and ground yourself. No account needed — just choose an
          exercise and begin.
        </p>
      </div>

      {/* Exercise picker */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => setActive(active === ex.id ? null : ex.id)}
            className={`rounded-xl border p-4 text-left transition-all ${
              active === ex.id
                ? "border-sandigan-teal bg-sandigan-teal/5 shadow-sm"
                : "border-slate-200 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-cardDark hover:border-sandigan-teal/40"
            }`}
          >
            <div
              className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${
                active === ex.id
                  ? "bg-sandigan-teal text-white"
                  : "bg-sandigan-teal/10 text-sandigan-teal"
              }`}
            >
              {ex.icon}
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{ex.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ex.tagline}</p>
          </button>
        ))}
      </div>

      {/* Active exercise panel */}
      {active && activeExercise && (
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">{activeExercise.label}</CardTitle>
                <CardDescription className="mt-1 text-sm leading-relaxed">
                  {activeExercise.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {active === "478" && <Breathing478 />}
            {active === "box" && <BoxBreathing />}
            {active === "grounding" && <GroundingExercise />}
          </CardContent>
        </Card>
      )}

      {!active && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-400 dark:text-slate-500">
          <Wind className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Choose an exercise above to begin your reset.</p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-center text-slate-400 dark:text-slate-500">
        These exercises support emotional regulation but are not a substitute for professional care.
        If you are in crisis, call <strong>1553</strong> (NCMH).
      </p>
    </div>
  );
}
