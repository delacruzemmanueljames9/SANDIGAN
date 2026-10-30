'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { wellnessCheckQuestions } from '@/lib/sandigan/store';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Activity,
  HeartHandshake,
  FileText,
  PhoneCall,
} from 'lucide-react';

export default function MentalWellnessCheckPage() {
  const { session, isDarkMode, setShowEmergencyModal } = useSandigan();

  const [answers, setAnswers] = useState<{ [qId: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const totalQuestions = wellnessCheckQuestions.length;
  const currentQ = wellnessCheckQuestions[currentStep - 1];

  const scaleOptions = [
    { value: 0, labelEn: 'Not at all', labelFil: 'Hindi kailanman', labelTaglish: 'Not at all / Hindi naman' },
    { value: 1, labelEn: 'Several days', labelFil: 'Ilang araw', labelTaglish: 'Several days / Minsan' },
    { value: 2, labelEn: 'More than half the days', labelFil: 'Kalahati ng mga araw', labelTaglish: 'Madalas / More than half' },
    { value: 3, labelEn: 'Nearly every day', labelFil: 'Halos araw-araw', labelTaglish: 'Nearly every day / Palagi' },
  ];

  const handleSelectOption = (val: number) => {
    const updated = { ...answers, [currentQ.id]: val };
    setAnswers(updated);

    if (currentStep < totalQuestions) {
      setCurrentStep(s => s + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Calculate score with clinically calibrated reverse scoring for positive resilience Question 7
  const totalScore = Object.entries(answers).reduce((acc, [qIdStr, val]) => {
    const qId = Number(qIdStr);
    // Question 7 is a positive hope item: value 3 ("Nearly every day") reflects strong resilience (0 distress points),
    // whereas value 0 ("Not at all") reflects severe absence of hope (3 distress points).
    if (qId === 7) {
      return acc + (3 - val);
    }
    return acc + val;
  }, 0);

  const getAssessmentResult = (score: number) => {
    if (score <= 5) {
      return {
        level: 'Mild / Balanced',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
        summary: 'Your emotional indicators reflect steady balance right now. Continue practicing gentle daily habits with our Daily Companion.',
        recommendations: ['Daily Wellness Companion', 'Inner Garden Gratitude', 'Mind Library Literacy'],
      };
    } else if (score <= 10) {
      return {
        level: 'Moderate Tension / Strain',
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
        summary: 'You are carrying a noticeable load of situational stress or academic fatigue. Taking intentional pauses can help prevent burnout.',
        recommendations: ['Reset Room (Box Breathing)', 'Talk to Tinig (Listening Mode)', 'My Safety Plan'],
      };
    } else if (score <= 15) {
      return {
        level: 'Elevated Emotional Stress',
        color: 'text-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800',
        summary: 'Your stress and anxiety indicators are heightened. It is important to step back, relieve yourself of non-essential pressure, and talk to someone.',
        recommendations: ['Talk to Tinig (Guidance Mode)', 'My Safety Plan Builder', 'Reset Room 5-4-3-2-1 Grounding'],
      };
    } else {
      return {
        level: 'High Distress / Critical Care',
        color: 'text-rose-500',
        bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800',
        summary: 'You appear to be carrying deep distress. Please remember: you do not have to endure this alone. We encourage speaking with verified human professionals.',
        recommendations: ['Connect to Bataan Clinics (MMWGH / BGHMC)', 'National Crisis Hotline (1553)', 'Talk to Tinig'],
      };
    }
  };

  const result = getAssessmentResult(totalScore);

  const restartCheck = () => {
    setAnswers({});
    setCurrentStep(1);
    setIsCompleted(false);
  };

  const getQuestionText = (q: typeof currentQ) => {
    if (session.preferredLanguage === 'fil') return q.questionFil;
    if (session.preferredLanguage === 'en') return q.questionEn;
    return q.questionTaglish;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 inline-block">
          Evaluated by SIKLAB (Wellness Assessment Lead)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Mental Wellness Check
        </h1>
        <p
          className={`text-xs sm:text-sm max-w-xl mx-auto ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          An anonymous, non-clinical 7-question indicator to help you reflect on your stress, sleep, anxiety, and hope over the past two weeks.
        </p>

        {/* Ethical Non-Diagnostic Disclaimer */}
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Anonymous self-reflection only. Does NOT provide psychiatric or medical diagnoses.</span>
        </div>
      </div>

      {!isCompleted ? (
        /* Question Card */
        <div
          className={`p-6 sm:p-10 rounded-3xl border shadow-xl space-y-8 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Question {currentStep} of {totalQuestions}</span>
              <span className="font-mono text-amber-500">{Math.round((currentStep / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2 py-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Category: {currentQ.category.toUpperCase()}
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-snug">
              {getQuestionText(currentQ)}
            </h3>
          </div>

          {/* Scale Options */}
          <div className="space-y-3">
            {scaleOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between group ${
                  answers[currentQ.id] === opt.value
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm font-semibold block">
                    {session.preferredLanguage === 'fil'
                      ? opt.labelFil
                      : session.preferredLanguage === 'en'
                      ? opt.labelEn
                      : opt.labelTaglish}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:border-amber-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-amber-500 transition" />
                </div>
              </button>
            ))}
          </div>

          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(s => s - 1)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white font-semibold"
            >
              ← Previous question
            </button>
          )}
        </div>
      ) : (
        /* Results View */
        <div
          className={`p-8 sm:p-10 rounded-3xl border shadow-xl space-y-8 animate-in fade-in ${result.bg}`}
        >
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assessment Summary by SIKLAB
            </span>
            <h2 className={`text-2xl sm:text-3xl font-black ${result.color}`}>
              {result.level}
            </h2>
            <p className="text-xs font-mono text-slate-500">
              Wellness Check Score: <strong>{totalScore}</strong> / 21
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
            }`}
          >
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
              {result.summary}
            </p>
          </div>

          {/* Recommended Action Pathways */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Recommended Next Steps for You:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/sandigan/reset-room"
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition flex items-center gap-3 text-xs font-bold"
              >
                <Activity className="w-5 h-5 text-emerald-500" />
                <span>The Reset Room (Breathing)</span>
              </Link>

              <Link
                href="/sandigan/talk"
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition flex items-center gap-3 text-xs font-bold"
              >
                <HeartHandshake className="w-5 h-5 text-tk-deepblue dark:text-sky-400" />
                <span>Talk to Tinig Support</span>
              </Link>

              <Link
                href="/sandigan/safety-plan"
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition flex items-center gap-3 text-xs font-bold"
              >
                <FileText className="w-5 h-5 text-sky-500" />
                <span>My Safety Plan Builder</span>
              </Link>

              <Link
                href="/sandigan/find-support"
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition flex items-center gap-3 text-xs font-bold"
              >
                <PhoneCall className="w-5 h-5 text-rose-500" />
                <span>Bataan Clinic Connections</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={restartCheck}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Check</span>
            </button>

            <button
              onClick={() => setShowEmergencyModal(true)}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 underline"
            >
              Need immediate help? Launch crisis lines
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
