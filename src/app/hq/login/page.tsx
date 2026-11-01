"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, User, Eye, EyeOff, AlertTriangle, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import { SandiganLogo } from "@/components/sandigan/SandiganLogo";
import { Button } from "@/components/ui/Button";

function FounderHqLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/hq";

  const [username, setUsername] = React.useState("ADMIN");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [remainingAttempts, setRemainingAttempts] = React.useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setError("Please enter the administrator username.");
      return;
    }

    if (!cleanPassword) {
      setError("Please enter the administrator password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/hq/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        setError(data.error || "Authentication failed. Please verify credentials.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      // Brief pause to display verified badge before redirection
      setTimeout(() => {
        router.push(redirectTarget);
        router.refresh();
      }, 700);
    } catch {
      setError("Unable to connect to Founder HQ authentication authority. Check network connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sandigan-navy-950 flex flex-col justify-between text-slate-100 relative overflow-hidden">
      {/* Background Ambience Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sandigan-navy-800/40 via-sandigan-navy-950 to-sandigan-navy-950 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sandigan-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sandigan-gold-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <SandiganLogo size="sm" showText={true} />
        </Link>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-sandigan-gold transition-colors flex items-center gap-1.5"
        >
          <span>← Back to Community</span>
        </Link>
      </header>

      {/* Main Login Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-md">
          {/* Clearance Header Badge */}
          <div className="text-center mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sandigan-navy-900 border border-sandigan-navy-700/80 text-sandigan-gold shadow-sm">
              <Shield className="w-4 h-4 text-sandigan-gold" />
              <span className="text-[11px] font-bold tracking-widest uppercase font-mono">
                Executive Clearance Required
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Founder HQ Admin Login
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Restricted portal for autonomous AI fleet supervision, safeguarding escalations, and system governance.
            </p>
          </div>

          {/* Secure Form Card */}
          <div className="bg-sandigan-navy-900/90 border border-sandigan-navy-700 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {error && (
              <div
                className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn"
                role="alert"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{error}</p>
                  {remainingAttempts !== null && remainingAttempts > 0 && (
                    <p className="text-[11px] text-rose-300/80">
                      Remaining attempts before temporary lockout: {remainingAttempts}
                    </p>
                  )}
                </div>
              </div>
            )}

            {success && (
              <div
                className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn"
                role="status"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="font-semibold">Clearance confirmed. Initializing Founder Command Center...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-username"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono"
                >
                  Administrator Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading || success}
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-sandigan-navy-950/80 border border-sandigan-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sandigan-gold focus:border-sandigan-gold transition-colors font-mono"
                    placeholder="ADMIN"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Maps to the authorized Supabase Founder Account.
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono"
                >
                  Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || success}
                    className="w-full h-11 pl-10 pr-11 rounded-xl bg-sandigan-navy-950/80 border border-sandigan-navy-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sandigan-gold focus:border-sandigan-gold transition-colors"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Safeguard Note */}
              <div className="pt-1 pb-2">
                <div className="p-2.5 rounded-lg bg-sandigan-navy-950/50 border border-sandigan-navy-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sandigan-teal" />
                    Fail-Closed RLS Enforcement
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">RA 10173 Audit</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading || success}
                className="w-full font-bold shadow-lg"
                leftIcon={!isLoading && <Shield className="w-4 h-4 text-sandigan-navy-950" />}
                rightIcon={!isLoading && !success && <ArrowRight className="w-4 h-4 text-sandigan-navy-950" />}
              >
                {isLoading ? "Verifying Credentials..." : success ? "Authorized — Opening HQ..." : "Authorize Founder Access"}
              </Button>
            </form>
          </div>

          {/* Legal Warning Footer */}
          <div className="mt-6 text-center space-y-1 text-[11px] text-slate-400">
            <p>
              PROJECT SANDIGAN Founder Operations &bull; Restricted to Executive Leadership
            </p>
            <p className="text-[10px] text-slate-400">
              Session tokens are HTTP-only and protected by SameSite encryption.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-400 border-t border-sandigan-navy-900">
        <p>© {new Date().getFullYear()} PROJECT SANDIGAN &bull; Human Accountability &bull; Privacy by Design</p>
      </footer>
    </div>
  );
}

export default function FounderHqLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-sandigan-navy-950 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-sandigan-gold border-t-transparent animate-spin" />
        </div>
      }
    >
      <FounderHqLoginForm />
    </React.Suspense>
  );
}
