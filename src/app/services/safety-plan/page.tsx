"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import {
  Shield,
  Plus,
  X,
  Save,
  Download,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactEntry {
  name: string;
  phone: string;
  relationship?: string;
}

interface SafetyPlanData {
  warning_signs: string[];
  internal_coping_strategies: string[];
  distraction_places_people: string[];
  trusted_contacts: ContactEntry[];
  professional_contacts: ContactEntry[];
  safe_environment_steps: string[];
  reasons_to_live: string[];
}

const DEFAULT_PLAN: SafetyPlanData = {
  warning_signs: [],
  internal_coping_strategies: [],
  distraction_places_people: [],
  trusted_contacts: [],
  professional_contacts: [],
  safe_environment_steps: [],
  reasons_to_live: [],
};

// ─── Section helpers ──────────────────────────────────────────────────────────

function TagList({
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  const [input, setInput] = React.useState("");

  const handleAdd = () => {
    const v = input.trim();
    if (v && !items.includes(v)) {
      onAdd(v);
      setInput("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full bg-sandigan-teal/10 border border-sandigan-teal/30 text-sandigan-teal dark:text-sandigan-teal-300 text-sm px-3 py-1"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`Remove ${item}`}
              className="hover:text-rose-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500 italic">None added yet.</span>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 text-sm"
        />
        <Button type="button" onClick={handleAdd} variant="outline" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ContactList({
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: ContactEntry[];
  onAdd: (c: ContactEntry) => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [rel, setRel] = React.useState("");

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) return;
    onAdd({ name: name.trim(), phone: phone.trim(), relationship: rel.trim() || undefined });
    setName("");
    setPhone("");
    setRel("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        {items.map((c, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 dark:border-sandigan-border-dark bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{c.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {c.phone}
                {c.relationship && ` · ${c.relationship}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-slate-400 hover:text-rose-500 transition-colors mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500 italic">{placeholder}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="text-sm"
        />
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="text-sm"
        />
        <Input
          value={rel}
          onChange={(e) => setRel(e.target.value)}
          placeholder="Relationship (optional)"
          className="text-sm col-span-2"
        />
        <Button
          type="button"
          onClick={handleAdd}
          variant="outline"
          size="sm"
          className="col-span-2"
          disabled={!name.trim() || !phone.trim()}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Contact
        </Button>
      </div>
    </div>
  );
}

// ─── Export helper ────────────────────────────────────────────────────────────

function exportAsText(plan: SafetyPlanData, displayName: string) {
  const lines = [
    `SAFETY PLAN — ${displayName}`,
    `Generated: ${new Date().toLocaleDateString("en-PH", { dateStyle: "long" })}`,
    "",
    "━━━ WARNING SIGNS ━━━",
    ...plan.warning_signs.map((s) => `• ${s}`),
    "",
    "━━━ INTERNAL COPING STRATEGIES ━━━",
    ...plan.internal_coping_strategies.map((s) => `• ${s}`),
    "",
    "━━━ DISTRACTION — PLACES & PEOPLE ━━━",
    ...plan.distraction_places_people.map((s) => `• ${s}`),
    "",
    "━━━ TRUSTED CONTACTS ━━━",
    ...plan.trusted_contacts.map((c) => `• ${c.name} — ${c.phone}${c.relationship ? ` (${c.relationship})` : ""}`),
    "",
    "━━━ PROFESSIONAL CONTACTS ━━━",
    ...plan.professional_contacts.map((c) => `• ${c.name} — ${c.phone}${c.relationship ? ` (${c.relationship})` : ""}`),
    "",
    "━━━ SAFE ENVIRONMENT STEPS ━━━",
    ...plan.safe_environment_steps.map((s) => `• ${s}`),
    "",
    "━━━ REASONS TO LIVE ━━━",
    ...plan.reasons_to_live.map((s) => `• ${s}`),
    "",
    "─────────────────────────────────────",
    "NCMH Crisis Hotline: 1553 | Hopeline: 2919 | In Touch: 02-8893-7603",
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-safety-plan.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Sign-in prompt ───────────────────────────────────────────────────────────

function SignInPrompt() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sandigan-teal/10">
            <Shield className="h-8 w-8 text-sandigan-teal" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
              Sign in for Safety Plan
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your safety plan is securely stored and only visible to you.
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

// ─── Section configs ──────────────────────────────────────────────────────────

const SECTIONS = [
  {
    key: "warning_signs" as const,
    title: "Warning Signs",
    description:
      "What thoughts, feelings, or behaviors signal that a crisis may be coming? List personal early warning signs.",
    placeholder: "e.g. Withdrawing from friends",
    type: "tags",
  },
  {
    key: "internal_coping_strategies" as const,
    title: "Internal Coping Strategies",
    description:
      "Things you can do on your own to distract from urges and improve your state of mind.",
    placeholder: "e.g. Deep breathing, journaling",
    type: "tags",
  },
  {
    key: "distraction_places_people" as const,
    title: "Distraction — Places & People",
    description:
      "People you can spend time with, or places you can go to take your mind off things.",
    placeholder: "e.g. Visit the park, call a sibling",
    type: "tags",
  },
  {
    key: "trusted_contacts" as const,
    title: "Trusted Personal Contacts",
    description: "People you trust to reach out to during a crisis.",
    placeholder: "No trusted contacts added yet.",
    type: "contacts",
  },
  {
    key: "professional_contacts" as const,
    title: "Professional & Crisis Contacts",
    description: "Mental health professionals, counselors, or crisis lines you can contact.",
    placeholder: "No professional contacts added yet.",
    type: "contacts",
  },
  {
    key: "safe_environment_steps" as const,
    title: "Safe Environment Steps",
    description:
      "Steps to make your environment safer. For example, removing access to harmful items or asking someone to stay with you.",
    placeholder: "e.g. Store medications in a locked cabinet",
    type: "tags",
  },
  {
    key: "reasons_to_live" as const,
    title: "Reasons to Live",
    description:
      "The most important reasons — people, places, goals, beliefs — that motivate you to stay safe.",
    placeholder: "e.g. My family, my dog, my dreams",
    type: "tags",
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SafetyPlanPage() {
  const { user, isLoading, profile } = useAuth();
  const [plan, setPlan] = React.useState<SafetyPlanData>(DEFAULT_PLAN);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch existing plan
  React.useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: err } = await supabase
          .from("safety_plans")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (err) throw err;
        if (data) {
          setPlan({
            warning_signs: data.warning_signs ?? [],
            internal_coping_strategies: data.internal_coping_strategies ?? [],
            distraction_places_people: data.distraction_places_people ?? [],
            trusted_contacts: (data.trusted_contacts as ContactEntry[]) ?? [],
            professional_contacts: (data.professional_contacts as ContactEntry[]) ?? [],
            safe_environment_steps: data.safe_environment_steps ?? [],
            reasons_to_live: data.reasons_to_live ?? [],
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase.from("safety_plans").upsert(
        { user_id: user.id, ...plan, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
      if (err) throw err;
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Helpers to update individual sections
  const addTag = (key: keyof Pick<SafetyPlanData, "warning_signs" | "internal_coping_strategies" | "distraction_places_people" | "safe_environment_steps" | "reasons_to_live">) =>
    (value: string) => setPlan((p) => ({ ...p, [key]: [...p[key], value] }));

  const removeTag = (key: keyof Pick<SafetyPlanData, "warning_signs" | "internal_coping_strategies" | "distraction_places_people" | "safe_environment_steps" | "reasons_to_live">) =>
    (idx: number) => setPlan((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  const addContact = (key: "trusted_contacts" | "professional_contacts") =>
    (c: ContactEntry) => setPlan((p) => ({ ...p, [key]: [...p[key], c] }));

  const removeContact = (key: "trusted_contacts" | "professional_contacts") =>
    (idx: number) => setPlan((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sandigan-teal" />
      </div>
    );
  }

  if (!user) return <SignInPrompt />;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sandigan-teal" />
      </div>
    );
  }

  const displayName = profile?.display_name ?? user.email ?? "User";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="teal">GABAY</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Safety Plan · Private to you
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          My Safety Plan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          A personal safety plan helps you recognize warning signs and know what to do in a
          difficult moment. It is stored privately and only you can see it.
        </p>
      </div>

      {/* Crisis reminder */}
      <div className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>If you are in immediate danger:</strong> Call{" "}
          <a href="tel:1553" className="font-bold underline">
            1553
          </a>{" "}
          (NCMH) ·{" "}
          <a href="tel:2919" className="font-bold underline">
            2919
          </a>{" "}
          (Hopeline) ·{" "}
          <a href="tel:+63288937603" className="font-bold underline">
            02-8893-7603
          </a>{" "}
          (In Touch)
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {SECTIONS.map((sec) => (
          <Card key={sec.key} className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{sec.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {sec.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sec.type === "tags" ? (
                <TagList
                  items={plan[sec.key as keyof Pick<SafetyPlanData, "warning_signs" | "internal_coping_strategies" | "distraction_places_people" | "safe_environment_steps" | "reasons_to_live">] as string[]}
                  onAdd={addTag(sec.key as keyof Pick<SafetyPlanData, "warning_signs" | "internal_coping_strategies" | "distraction_places_people" | "safe_environment_steps" | "reasons_to_live">)}
                  onRemove={removeTag(sec.key as keyof Pick<SafetyPlanData, "warning_signs" | "internal_coping_strategies" | "distraction_places_people" | "safe_environment_steps" | "reasons_to_live">)}
                  placeholder={sec.placeholder}
                />
              ) : (
                <ContactList
                  items={plan[sec.key as "trusted_contacts" | "professional_contacts"] as ContactEntry[]}
                  onAdd={addContact(sec.key as "trusted_contacts" | "professional_contacts")}
                  onRemove={removeContact(sec.key as "trusted_contacts" | "professional_contacts")}
                  placeholder={sec.placeholder}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="teal"
          className="flex-1"
          leftIcon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        >
          {saving ? "Saving…" : "Save Plan"}
        </Button>
        <Button
          onClick={() => exportAsText(plan, displayName)}
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
        >
          Export as Text
        </Button>
      </div>

      {/* Save feedback */}
      {saved && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5">
          <CheckCircle className="h-4 w-4 text-sandigan-emerald" />
          <p className="text-sm text-sandigan-emerald font-medium">Safety plan saved successfully.</p>
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 px-4 py-2.5">
          <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
        </div>
      )}

      <p className="mt-8 text-xs text-center text-slate-400 dark:text-slate-500">
        Your safety plan is encrypted and private. It is not shared with anyone without your
        consent.
      </p>
    </div>
  );
}
