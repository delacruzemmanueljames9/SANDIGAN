"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  HeartHandshake,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  Loader2,
  Building,
} from "lucide-react";

// ─── Seeded known providers for selection ────────────────────────────────────

interface ProviderOption {
  id: string;
  name: string;
  type: string;
  phone: string;
  is247: boolean;
}

const KNOWN_PROVIDERS: ProviderOption[] = [
  {
    id: "prov-ncmh-1553",
    name: "National Center for Mental Health (NCMH) Crisis Hotline",
    type: "Government / 24/7 Crisis",
    phone: "1553",
    is247: true,
  },
  {
    id: "prov-in-touch",
    name: "In Touch Community Services",
    type: "NGO / Subsidized Therapy",
    phone: "02-8893-7603",
    is247: true,
  },
  {
    id: "prov-hopeline-ph",
    name: "Hopeline Philippines",
    type: "NGO / Telecounseling",
    phone: "2919",
    is247: true,
  },
  {
    id: "prov-pgh-psych",
    name: "PGH Department of Psychiatry",
    type: "Public Hospital / Free Outpatient",
    phone: "02-8554-8400 loc 2436",
    is247: false,
  },
  {
    id: "prov-bantay-bata",
    name: "Bantay Bata 163",
    type: "NGO / Youth Support",
    phone: "163",
    is247: true,
  },
];

interface ReferralHistoryItem {
  id: string;
  provider_id: string;
  preferred_contact_method: string;
  status: string;
  created_at: string;
}

export default function ProfessionalConnectionPage() {
  const { user, isLoading } = useAuth();

  const [selectedProvider, setSelectedProvider] = React.useState(KNOWN_PROVIDERS[0].id);
  const [contactMethod, setContactMethod] = React.useState<"phone" | "email">("phone");
  const [contactValue, setContactValue] = React.useState("");
  const [intakeNotes, setIntakeNotes] = React.useState("");
  const [consent, setConsent] = React.useState(false);

  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [referrals, setReferrals] = React.useState<ReferralHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = React.useState(false);

  // Load existing referral requests
  const loadHistory = React.useCallback(async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/referrals");
      const json = await res.json();
      if (json.referrals) {
        setReferrals(json.referrals);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  }, [user]);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!contactValue.trim()) {
      setError("Please provide your phone number or email address.");
      return;
    }

    if (!intakeNotes.trim()) {
      setError("Please describe what kind of support you are seeking.");
      return;
    }

    if (!consent) {
      setError("You must provide explicit consent before submitting a referral request.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_id: selectedProvider,
          preferred_contact_method: contactMethod,
          contact_value: contactValue.trim(),
          intake_notes: intakeNotes.trim(),
          consent_to_share_granted: true,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to submit referral request.");
      }

      setSubmitted(true);
      setIntakeNotes("");
      setConsent(false);
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getProviderName = (id: string) => {
    const p = KNOWN_PROVIDERS.find((kp) => kp.id === id);
    return p ? p.name : id;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge variant="outline">Submitted</Badge>;
      case "contacted":
        return <Badge variant="gold">Contacted</Badge>;
      case "in_progress":
        return <Badge variant="teal">In Progress</Badge>;
      case "closed":
        return <Badge variant="emerald">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
              <HeartHandshake className="h-8 w-8 text-sandigan-teal" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Professional Connection
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sign in to securely request a referral and connect with verified mental health
                professionals.
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
          <Badge variant="teal">GABAY</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Professional Connection · Referral Intake
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Connect with a Professional
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          Request a guided connection with verified mental health support services across the
          Philippines. Your consent is required before any information is shared.
        </p>
      </div>

      {/* Immediate crisis banner */}
      <div className="mb-6 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">
            In immediate danger or emotional crisis?
          </p>
          <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
            Do not wait for a referral. Call <strong>1553</strong> (NCMH 24/7) or{" "}
            <strong>2919</strong> (Hopeline) immediately.
          </p>
        </div>
      </div>

      {/* Success notification */}
      {submitted && (
        <div className="mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-sandigan-emerald shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-sandigan-emerald">
                Referral Request Submitted
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Your request has been securely recorded. The provider will reach out via your
                preferred contact method. You can view the status below.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-medium text-sandigan-emerald underline mt-2"
              >
                Submit another request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intake Form */}
      {!submitted && (
        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Referral Intake Form</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Fill out this confidential form. All information is encrypted and only shared with your
              explicit permission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Provider Selection */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Select Support Provider
                </label>
                <div className="space-y-2">
                  {KNOWN_PROVIDERS.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                        selectedProvider === p.id
                          ? "border-sandigan-teal bg-sandigan-teal/5"
                          : "border-slate-200 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-cardDark hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="provider"
                        value={p.id}
                        checked={selectedProvider === p.id}
                        onChange={() => setSelectedProvider(p.id)}
                        className="mt-1 text-sandigan-teal focus:ring-sandigan-teal"
                      />
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                          {p.type} · Hotlines: {p.phone}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="phone"
                      checked={contactMethod === "phone"}
                      onChange={() => setContactMethod("phone")}
                      className="text-sandigan-teal focus:ring-sandigan-teal"
                    />
                    Phone / SMS
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={contactMethod === "email"}
                      onChange={() => setContactMethod("email")}
                      className="text-sandigan-teal focus:ring-sandigan-teal"
                    />
                    Email
                  </label>
                </div>
              </div>

              {/* Contact Value */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                  {contactMethod === "phone" ? "Mobile / Phone Number" : "Email Address"}
                </label>
                <Input
                  type={contactMethod === "phone" ? "tel" : "email"}
                  placeholder={
                    contactMethod === "phone" ? "e.g. 0917-123-4567" : "e.g. name@example.com"
                  }
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  className="text-sm"
                  required
                />
              </div>

              {/* Intake Notes */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                  Intake Notes / What kind of support are you seeking?
                </label>
                <Textarea
                  placeholder="Share a brief summary of what you are experiencing and what you hope to receive (e.g. anxiety support, grief counseling, psychiatric evaluation)..."
                  value={intakeNotes}
                  onChange={(e) => setIntakeNotes(e.target.value)}
                  className="text-sm min-h-[110px]"
                  required
                />
              </div>

              {/* Explicit Consent Checkbox (Enforced by RLS) */}
              <div className="rounded-xl border border-sandigan-teal/30 bg-sandigan-teal/5 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-sandigan-teal focus:ring-sandigan-teal"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>Explicit Consent (Required):</strong> I give consent for SANDIGAN to
                    securely record my contact details and intake summary for the purpose of this
                    referral request. I understand this information will only be shared with the
                    selected provider.
                  </span>
                </label>
              </div>

              {/* Error display */}
              {error && (
                <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-3">
                  <p className="text-xs text-rose-700 dark:text-rose-300">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting || !consent}
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
                {submitting ? "Submitting Request…" : "Submit Referral Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Referral History */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            Your Referral Requests
          </CardTitle>
          <CardDescription className="text-xs">
            History of referral requests submitted from your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="py-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-sandigan-teal" />
            </div>
          ) : referrals.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">
              No referral requests submitted yet.
            </p>
          ) : (
            <div className="space-y-3">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-sandigan-border-dark p-3.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {getProviderName(ref.provider_id)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Contact via {ref.preferred_contact_method} · Submitted on{" "}
                      {new Date(ref.created_at).toLocaleDateString("en-PH", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                  <div>{getStatusBadge(ref.status)}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy note */}
      <p className="mt-8 text-xs text-center text-slate-400 dark:text-slate-500">
        SANDIGAN is an ecosystem initiative, not a clinical provider. Referrals facilitate contact
        with verified third-party mental health organizations.
      </p>
    </div>
  );
}
