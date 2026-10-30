"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Sparkles, Sun, CheckCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react";

interface DailyPackage {
  quote: string;
  author: string;
  reflection_prompt: string;
  micro_action: string;
  date: string;
}

export default function DailyCompanionPage() {
  const [data, setData] = React.useState<DailyPackage | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [actionDone, setActionDone] = React.useState(false);

  const fetchDaily = async (force = false) => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `sandigan_daily_${today}`;

    if (!force) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {}
      }
    }

    try {
      const res = await fetch("/api/daily-companion");
      const json = await res.json();
      setData(json);
      localStorage.setItem(cacheKey, JSON.stringify(json));
    } catch {
      setData({
        quote: "Habang may buhay, may pag-asa. (While there is life, there is hope.)",
        author: "Filipino Proverb",
        reflection_prompt: "What is one thing that grounded you today?",
        micro_action: "Take three deep breaths before responding to your next message.",
        date: today,
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDaily();
  }, []);

  const todayFormatted = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="teal">SINAG</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            COMPANION-07 · Daily Companion
          </span>
          <button
            onClick={() => fetchDaily(true)}
            className="ml-auto text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
            title="Refresh prompt"
          >
            <RefreshCw className="h-3 w-3" /> New Prompt
          </button>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Daily Companion
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{todayFormatted}</p>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-sandigan-teal" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Daily Quote Card */}
          <Card className="border-sandigan-gold/40 bg-gradient-to-br from-sandigan-gold/5 via-white to-sandigan-teal/5 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-sandigan-gold" />
                <span className="text-xs font-semibold uppercase tracking-wider text-sandigan-gold">
                  Today&apos;s Wisdom
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed">
                &ldquo;{data.quote}&rdquo;
              </blockquote>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right">
                — {data.author}
              </p>
            </CardContent>
          </Card>

          {/* Micro Action Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sandigan-teal" />
                Micro-Action for Today
              </CardTitle>
              <CardDescription className="text-xs">
                One small, achievable action to ground yourself.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {data.micro_action}
              </p>
              <Button
                onClick={() => setActionDone((d) => !d)}
                variant={actionDone ? "outline" : "teal"}
                size="sm"
                className="w-full sm:w-auto"
              >
                {actionDone ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-sandigan-emerald mr-1.5" />
                    Completed for Today
                  </>
                ) : (
                  "Mark as Done"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Reflection Prompt Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Reflection Prompt</CardTitle>
              <CardDescription className="text-xs">
                Take a few minutes to think about this or write it in your journal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-sandigan-border-dark">
                &ldquo;{data.reflection_prompt}&rdquo;
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/services/inner-garden/new?reflection=${encodeURIComponent(
                    data.reflection_prompt
                  )}`}
                  className="inline-flex items-center justify-center font-medium transition-colors rounded-xl bg-sandigan-teal text-white hover:bg-sandigan-teal-600 shadow-sm h-11 px-5 text-sm gap-2 flex-1"
                >
                  Write in Inner Garden
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services/talk"
                  className="inline-flex items-center justify-center font-medium transition-colors rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 h-11 px-5 text-sm gap-2"
                >
                  Discuss with Tinig
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Footer */}
      <p className="mt-8 text-xs text-center text-slate-400 dark:text-slate-500">
        New daily prompt generated every day at midnight (PHT). Powered by SINAG.
      </p>
    </div>
  );
}
