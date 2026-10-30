"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Trash2, BookOpen, BookOpenCheck, Plus, X } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { detectCrisisSignals } from "@/lib/ai/gemini";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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

const MOOD_BADGE_CLASS: Record<Mood, string> = {
  calm: "bg-sandigan-teal/20 text-sandigan-teal border-sandigan-teal/40",
  hopeful: "bg-sandigan-emerald/20 text-sandigan-emerald border-sandigan-emerald/40",
  anxious: "bg-amber-100 text-amber-700 border-amber-300",
  exhausted: "bg-sandigan-navy/20 text-sandigan-navy border-sandigan-navy/40",
  sad: "bg-blue-100 text-blue-700 border-blue-300",
  grateful: "bg-sandigan-gold/20 text-sandigan-gold border-sandigan-gold/40",
  neutral: "bg-slate-100 text-slate-600 border-slate-300",
};

const MOODS: Mood[] = ["calm", "hopeful", "anxious", "exhausted", "sad", "grateful", "neutral"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InnerGardenPage() {
  const { user, isLoading } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formMood, setFormMood] = useState<Mood>("neutral");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [crisisDetected, setCrisisDetected] = useState(false);

  // Expand/collapse state per entry
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setLoadingEntries(true);
    setFetchError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      setEntries((data as JournalEntry[]) ?? []);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : "Failed to load entries.");
    } finally {
      setLoadingEntries(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user, fetchEntries]);

  // Crisis detection on content change
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

  const resetForm = () => {
    setFormTitle("");
    setFormMood("neutral");
    setFormContent("");
    setFormTags([]);
    setTagInput("");
    setSaveError(null);
    setCrisisDetected(false);
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
      setShowForm(false);
      resetForm();
      await fetchEntries();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to save entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete entry.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Unauthenticated state
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sandigan-navy/5 to-sandigan-teal/10 p-4">
        <Card className="max-w-md w-full text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-sandigan-navy text-2xl">Inner Garden</CardTitle>
            <CardDescription>
              Your private sanctuary is waiting — please sign in to access your journal.
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
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Badge className="mb-3 bg-sandigan-teal/15 text-sandigan-teal border-sandigan-teal/30 text-xs font-medium tracking-wide">
            🌿 Private Sanctuary
          </Badge>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-sandigan-navy tracking-tight">
                Inner Garden
              </h1>
              <p className="text-slate-500 mt-1 text-sm max-w-md">
                A quiet, private space for your reflections. Only you can see what grows here.
              </p>
              {!loadingEntries && (
                <p className="text-xs text-slate-400 mt-1">
                  {entries.length} {entries.length === 1 ? "entry" : "entries"}
                </p>
              )}
            </div>
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-sandigan-teal hover:bg-sandigan-teal/90 text-white flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                New Entry
              </Button>
            )}
          </div>
        </div>

        {/* Inline Create Form */}
        {showForm && (
          <Card className="mb-8 border-sandigan-teal/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-sandigan-navy text-lg">New Journal Entry</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                This entry is private and visible only to you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  disabled={saving}
                  className="bg-sandigan-teal hover:bg-sandigan-teal/90 text-white"
                >
                  {saving ? "Saving..." : "Save Entry"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fetch Error */}
        {fetchError && (
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
        )}

        {/* Loading */}
        {loadingEntries && (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            Loading your garden...
          </div>
        )}

        {/* Empty State */}
        {!loadingEntries && entries.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🌱</span>
            <p className="text-slate-500 text-base mb-4">
              Your garden is empty — plant your first reflection.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-sandigan-teal hover:bg-sandigan-teal/90 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Write First Entry
            </Button>
          </div>
        )}

        {/* Entry List */}
        {!loadingEntries && entries.length > 0 && (
          <div className="space-y-4">
            {entries.map((entry) => {
              const isExpanded = expandedIds.has(entry.id);
              const mood = entry.mood as Mood;
              return (
                <Card
                  key={entry.id}
                  className="border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge
                            className={`text-xs border ${MOOD_BADGE_CLASS[mood] ?? MOOD_BADGE_CLASS.neutral}`}
                          >
                            {MOOD_EMOJI[mood] ?? "😐"}{" "}
                            {mood.charAt(0).toUpperCase() + mood.slice(1)}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {formatDate(entry.created_at)}
                          </span>
                        </div>
                        <CardTitle className="text-sandigan-navy text-base font-semibold leading-snug">
                          {entry.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleExpand(entry.id)}
                          title={isExpanded ? "Collapse" : "Read"}
                          className="p-1.5 rounded-md text-slate-400 hover:text-sandigan-teal hover:bg-sandigan-teal/10 transition-colors"
                        >
                          {isExpanded ? (
                            <BookOpenCheck className="w-4 h-4" />
                          ) : (
                            <BookOpen className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          title="Delete"
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {isExpanded
                        ? entry.content
                        : entry.content.length > 120
                        ? entry.content.slice(0, 120) + "..."
                        : entry.content}
                    </p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
