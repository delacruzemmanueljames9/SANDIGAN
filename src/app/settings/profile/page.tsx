"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { User, Shield, CheckCircle2, Lock, ArrowLeft } from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, profile, role, isLoading, refreshProfile } = useAuth();
  const supabase = React.useMemo(() => getSupabaseBrowserClient(), []);

  const [displayName, setDisplayName] = React.useState("");
  const [preferredLang, setPreferredLang] = React.useState("en");
  const [preferredTone, setPreferredTone] = React.useState("gentle");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
    if (profile) {
      setDisplayName(profile.display_name || "");
      setPreferredLang(profile.preferred_language || "en");
    }
  }, [user, profile, isLoading, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          display_name: displayName,
          preferred_language: preferredLang,
          preferred_tone: preferredTone,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSaveSuccess(true);
        await refreshProfile();
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-xs text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sandigan-teal">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/settings/privacy">
            <Button variant="outline" size="sm" className="text-xs">
              Privacy &amp; Data Rights
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <Badge variant="teal">Account Settings</Badge>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-sandigan-navy dark:text-white">
          Your Profile &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Customize how SANDIGAN addresses you and adapts to your emotional comfort.
        </p>
      </div>

      {saveSuccess && (
        <Alert variant="success" icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}>
          <p className="text-xs">Your profile settings have been successfully updated.</p>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger">
          <p className="text-xs">{errorMsg}</p>
        </Alert>
      )}

      <Card className="p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity Block */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-sm text-sandigan-navy dark:text-white pb-1 border-b border-slate-100 dark:border-sandigan-navy-800">
              Identity &amp; Account
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Display Name or Alias"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                helperText="How should our companions address you?"
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-sandigan-navy-900 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">Managed via Supabase Auth</p>
              </div>
            </div>

            {/* Read-Only Verified Role Indicator */}
            <div className="rounded-xl border border-slate-200 dark:border-sandigan-navy-800 p-4 bg-slate-50/60 dark:bg-sandigan-navy-900/40 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sandigan-navy dark:text-white">
                  <Shield className="w-4 h-4 text-sandigan-teal" />
                  <span>Verified Access Role</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Role assignment is strictly managed server-side. Users cannot self-escalate privileges.
                </p>
              </div>
              <Badge variant="navy" className="uppercase font-mono text-xs">
                {role || "user"}
              </Badge>
            </div>
          </div>

          {/* Preferences Block */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-sm text-sandigan-navy dark:text-white pb-1 border-b border-slate-100 dark:border-sandigan-navy-800">
              Interaction Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Preferred Language
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-300 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sandigan-teal"
                >
                  <option value="en">English</option>
                  <option value="tl">Filipino / Tagalog</option>
                  <option value="taglish">Taglish (Conversational)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Companionship Tone
                </label>
                <select
                  value={preferredTone}
                  onChange={(e) => setPreferredTone(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-300 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sandigan-teal"
                >
                  <option value="gentle">Gentle &amp; Soothing (Default)</option>
                  <option value="warm">Warm &amp; Encouraging</option>
                  <option value="direct">Direct &amp; Concise</option>
                  <option value="empowering">Empowering &amp; Active</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="teal" size="md" isLoading={isSaving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
