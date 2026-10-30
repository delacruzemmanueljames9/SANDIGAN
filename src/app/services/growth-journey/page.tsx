"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import {
  TrendingUp,
  Award,
  BookOpen,
  Activity,
  Calendar,
  Lock,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  icon: string;
}

export default function GrowthJourneyPage() {
  const { user, isLoading } = useAuth();
  const [journalCount, setJournalCount] = React.useState(0);
  const [assessmentCount, setAssessmentCount] = React.useState(0);
  const [firstEntryDate, setFirstEntryDate] = React.useState<string | null>(null);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    const loadStats = async () => {
      setFetching(true);
      try {
        const supabase = getSupabaseBrowserClient();

        // Count journal entries
        const { count: jCount, data: jData } = await supabase
          .from("journal_entries")
          .select("created_at", { count: "exact" })
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1);

        // Count wellness assessments
        const { count: aCount } = await supabase
          .from("wellness_assessments")
          .select("id", { count: "exact" })
          .eq("user_id", user.id);

        setJournalCount(jCount ?? 0);
        setAssessmentCount(aCount ?? 0);
        if (jData && jData.length > 0) {
          setFirstEntryDate(jData[0].created_at);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    loadStats();
  }, [user]);

  const milestones: Milestone[] = [
    {
      id: "first_step",
      title: "First Step",
      description: "Complete your first wellness assessment",
      earned: assessmentCount >= 1,
      icon: "🌱",
    },
    {
      id: "storyteller",
      title: "Inner Voice",
      description: "Write your first journal entry",
      earned: journalCount >= 1,
      icon: "📖",
    },
    {
      id: "consistent",
      title: "Self-Reflection",
      description: "Write 3 journal entries",
      earned: journalCount >= 3,
      icon: "✍️",
    },
    {
      id: "mindful",
      title: "Mindful Tracker",
      description: "Complete 3 wellness check-ins",
      earned: assessmentCount >= 3,
      icon: "🎯",
    },
    {
      id: "dedicated",
      title: "Dedicated Journey",
      description: "Write 7 journal entries",
      earned: journalCount >= 7,
      icon: "🌟",
    },
    {
      id: "master",
      title: "Pillar of Strength",
      description: "Complete 10 check-ins and 10 journal entries",
      earned: assessmentCount >= 10 && journalCount >= 10,
      icon: "🏆",
    },
  ];

  const earnedCount = milestones.filter((m) => m.earned).length;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sandigan-teal" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sandigan-teal/10">
              <TrendingUp className="h-8 w-8 text-sandigan-teal" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Sign in to view your journey
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Track your wellness progress, check-in history, and earned milestones.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center font-medium transition-colors rounded-xl bg-sandigan-teal text-white hover:bg-sandigan-teal-600 shadow-sm h-11 px-5 text-sm w-full mt-2"
            >
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="teal">TALA</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Growth Journey · Personal Stats
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Your Growth Journey
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          Every small step matters. Here is a look at your consistency and progress across SANDIGAN.
        </p>
      </div>

      {fetching ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-sandigan-teal" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card className="shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-sandigan-teal" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Journal Entries</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{journalCount}</p>
                <p className="text-xs text-slate-400 mt-0.5">entries written</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-sandigan-emerald" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Check-Ins</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {assessmentCount}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">completed</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm col-span-2 sm:col-span-1">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-sandigan-gold" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Milestones</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {earnedCount}/{milestones.length}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">unlocked</p>
              </CardContent>
            </Card>
          </div>

          {/* First entry banner */}
          {firstEntryDate && (
            <div className="flex items-center gap-3 rounded-xl bg-sandigan-teal/5 border border-sandigan-teal/20 px-4 py-3">
              <Calendar className="h-4 w-4 text-sandigan-teal shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You started your journey on{" "}
                <strong>
                  {new Date(firstEntryDate).toLocaleDateString("en-PH", {
                    dateStyle: "long",
                  })}
                </strong>
                . Thank you for showing up for yourself.
              </p>
            </div>
          )}

          {/* Milestones */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Milestone Badges</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Recognizing your steps toward self-discovery and well-being.
                  </CardDescription>
                </div>
                <span className="text-xs font-semibold text-sandigan-teal">
                  {earnedCount} of {milestones.length} unlocked
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all ${
                      m.earned
                        ? "border-sandigan-teal/30 bg-sandigan-teal/5"
                        : "border-slate-200 dark:border-sandigan-border-dark bg-slate-50 dark:bg-slate-800/40 opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {m.title}
                        </p>
                        {!m.earned && <Lock className="h-3 w-3 text-slate-400" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {m.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fast actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/services/wellness-check"
              className="inline-flex items-center justify-center font-medium transition-colors rounded-xl bg-sandigan-teal text-white hover:bg-sandigan-teal-600 shadow-sm h-11 px-5 text-sm gap-2 flex-1"
            >
              Take a Check-In
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services/inner-garden/new"
              className="inline-flex items-center justify-center font-medium transition-colors rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 h-11 px-5 text-sm gap-2 flex-1"
            >
              Write in Journal
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-8 text-xs text-center text-slate-400 dark:text-slate-500">
        All progress is private to your account. Celebrate small steps — every entry is a victory.
      </p>
    </div>
  );
}
