"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Megaphone,
  CheckCircle,
  Send,
  Loader2,
  Lightbulb,
  Heart,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

type FeedbackType = "suggestion" | "appreciation" | "concern" | "question";

const FEEDBACK_TYPES: { id: FeedbackType; label: string; icon: React.ReactNode; desc: string }[] =
  [
    {
      id: "suggestion",
      label: "Feature Suggestion",
      icon: <Lightbulb className="h-4 w-4 text-sandigan-gold" />,
      desc: "Ideas for new tools, content, or improvements to SANDIGAN.",
    },
    {
      id: "appreciation",
      label: "Story & Gratitude",
      icon: <Heart className="h-4 w-4 text-rose-500" />,
      desc: "How SANDIGAN has helped you or someone you care about.",
    },
    {
      id: "concern",
      label: "Safety or UX Concern",
      icon: <MessageCircle className="h-4 w-4 text-sandigan-teal" />,
      desc: "Feedback on usability, accessibility, or community safety.",
    },
    {
      id: "question",
      label: "General Question",
      icon: <HelpCircle className="h-4 w-4 text-indigo-500" />,
      desc: "Inquiries about our mission, privacy, or officer guidelines.",
    },
  ];

export default function VoiceOfCommunityPage() {
  const { user } = useAuth();

  const [feedbackType, setFeedbackType] = React.useState<FeedbackType>("suggestion");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isAnonymous, setIsAnonymous] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Please fill out both the subject and message.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Map feedback to community post in 'general' category with feedback prefix
      const title = `[Voice of Community: ${feedbackType.toUpperCase()}] ${subject.trim()}`;
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: message.trim(),
          category: "general",
          is_anonymous: isAnonymous,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to submit feedback.");
      }

      setSubmitted(true);
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="teal">TALA</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Voice of Community · Direct Feedback
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Voice of Community
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          PROJECT SANDIGAN is shaped by the community it serves. Share your ideas, concerns, or
          stories directly with our safeguarding and development team.
        </p>
      </div>

      {submitted ? (
        <Card className="shadow-md border-sandigan-emerald/40 text-center py-8">
          <CardContent className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sandigan-emerald/10 mx-auto">
              <CheckCircle className="h-8 w-8 text-sandigan-emerald" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Thank You for Your Voice!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Your feedback has been received and routed to our team for review. Every insight helps
              make SANDIGAN safer and more supportive for Filipino youth.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">
                Submit Another Message
              </Button>
              <Link
                href="/community"
                className="inline-flex items-center justify-center font-medium transition-colors rounded-xl bg-sandigan-teal text-white hover:bg-sandigan-teal-600 shadow-sm h-9 px-3 text-xs"
              >
                Back to Community
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-sandigan-teal" />
              Submit Your Input
            </CardTitle>
            <CardDescription className="text-xs">
              All submissions are read by human moderators and logged under strict privacy
              standards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type Selection */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Feedback Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FEEDBACK_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFeedbackType(t.id)}
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                        feedbackType === t.id
                          ? "border-sandigan-teal bg-sandigan-teal/5 shadow-sm"
                          : "border-slate-200 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-cardDark hover:border-slate-300"
                      }`}
                    >
                      <div className="mt-0.5">{t.icon}</div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {t.label}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {t.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                  Subject / Summary
                </label>
                <Input
                  placeholder="e.g. Add dark mode preference, Feedback on 4-7-8 breathing..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="text-sm"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                  Your Message
                </label>
                <Textarea
                  placeholder="Share details, context, or any suggestions you have..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="text-sm min-h-[140px]"
                  required
                />
              </div>

              {/* Anonymity */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymousFeedback"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-300 text-sandigan-teal focus:ring-sandigan-teal"
                />
                <label
                  htmlFor="anonymousFeedback"
                  className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Submit anonymously (omit my profile alias)
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-3">
                  <p className="text-xs text-rose-700 dark:text-rose-300">{error}</p>
                </div>
              )}

              {/* Submit */}
              {user ? (
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="teal"
                  className="w-full"
                  leftIcon={
                    submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )
                  }
                >
                  {submitting ? "Sending Feedback…" : "Submit Feedback"}
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 text-center">
                    Sign in is required to submit feedback to prevent spam.
                  </p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center font-medium transition-colors rounded-xl bg-sandigan-teal text-white hover:bg-sandigan-teal-600 shadow-sm h-11 px-5 text-sm w-full"
                  >
                    Sign In to Submit
                  </Link>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Note */}
      <p className="mt-8 text-xs text-center text-slate-400 dark:text-slate-500">
        If you are experiencing a mental health emergency, please do not use this feedback form.
        Call <strong>1553</strong> for immediate support.
      </p>
    </div>
  );
}
