"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { detectCrisisSignals } from "@/lib/ai/gemini";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import type { JournalEntry } from "@/types";

type Mood = JournalEntry["mood"];

const MOOD_EMOJI: Record<Mood, string> = {
  calm: "😌",
  hopeful: "🌱",
  anxious: "😰",
  exhausted: "😴",
  sad: "😢",
  grateful: "🙏",
  neutral: "😐",
};

const MOODS: Mood[] = ["calm", "hopeful", "anxious", "exhausted", "sad", "grateful", "neutral"];

function NewJournalEntryForm() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formTitle, setFormTitle] = useState("");
  const [formMood, setFormMood] = useState<Mood>("neutral");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [crisisDetected, setCrisisDetected] = useState(false);

  // Pre-fill from URL param
  useEffect(() => {
    const reflection = searchParams.get("reflection");
    if (reflection) {
      setFormContent(decodeURIComponent(reflection));
    }
  }, [searchParams]);

  // Crisis detection
  useEffect(() => {
    if (formContent.trim().length < 10) {
      setCrisisDetected(false);
      return;
    }
    const result = detectCrisisSignals(formContent);
    setCrisisDetected(result.isCrisis);
  }, [formContent]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,$/, "");
      if (tag && !formTags.includes(tag)) {
        setFormTags((prev) => [...prev, tag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!user) return;
    if (!formContent.trim()) {
      setSaveError("Content cannot be empty.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        title: formTitle.trim() || "Untitled",
        content: formContent.trim(),
        mood: formMood,
        tags: formTags,
      });
      if (error) throw error;
      router.push("/services/inner-garden");
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to save entry.");
      setSaving(false);
    }
  };

  // Unauthenticated state
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sandigan-navy/5 to-sandigan-teal/10 p-4">
        <Card className="max-w-md w-full text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-sandigan-navy text-2xl">Inner Garden</CardTitle>
            <CardDescription>
              Please sign in to write a journal entry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              <Button className="bg-sandigan-teal hover:bg-sandigan-teal/90 text-white w-full">
                Sign In to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sandigan-navy/5 via-white to-sandigan-teal/10">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sandigan-navy tracking-tight">
            New Journal Entry
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            This entry is private and encrypted to your account.
          </p>
        </div>

        <Card className="border-sandigan-teal/30 shadow-md">
          <CardContent className="pt-6 space-y-5">
            {/* Crisis Banner */}
            {crisisDetected && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-red-700 font-semibold text-sm mb-1">
                  💛 We noticed some difficult words in your entry.
                </p>
                <p className="text-red-600 text-xs">
                  If you&apos;re in distress, please reach out:
                </p>
                <ul className="mt-2 text-xs text-red-700 space-y-0.5 font-medium">
                  <li>📞 NCMH Crisis Hotline: <strong>1553</strong></li>
                  <li>📞 Hopeline PH: <strong>2919</strong></li>
                </ul>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Title</label>
              <Input
                placeholder="Give your entry a title..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="border-slate-200 focus:border-sandigan-teal"
              />
            </div>

            {/* Mood Selector */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 block">
                How are you feeling?
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setFormMood(mood)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      formMood === mood
                        ? "bg-sandigan-teal text-white border-sandigan-teal shadow-sm scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:border-sandigan-teal/50"
                    }`}
                  >
                    {MOOD_EMOJI[mood]} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Your reflection
              </label>
              <Textarea
                placeholder="Write freely — this space is yours..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="min-h-[160px] border-slate-200 focus:border-sandigan-teal resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Tags{" "}
                <span className="text-slate-400 font-normal">(press Enter or comma to add)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-sandigan-navy/10 text-sandigan-navy text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                placeholder="e.g. gratitude, work, family"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="border-slate-200 focus:border-sandigan-teal"
              />
            </div>

            {/* Save Error */}
            {saveError && (
              <p className="text-red-500 text-sm">{saveError}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                onClick={handleSave}
                disabled={saving || isLoading}
                className="bg-sandigan-teal hover:bg-sandigan-teal/90 text-white"
              >
                {saving ? "Saving..." : "Save Entry"}
              </Button>
              <Link href="/services/inner-garden">
                <Button variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewJournalEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sandigan-teal border-t-transparent" />
        </div>
      }
    >
      <NewJournalEntryForm />
    </Suspense>
  );
}
