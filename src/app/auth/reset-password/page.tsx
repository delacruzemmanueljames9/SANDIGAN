"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { SandiganLogo } from "@/components/sandigan/SandiganLogo";
import { KeyRound, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const supabase = React.useMemo(() => getSupabaseBrowserClient(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-soft-lg border-slate-200 dark:border-sandigan-border-dark">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="flex justify-center">
            <SandiganLogo size="md" showText={false} />
          </div>
          <CardTitle className="text-2xl font-extrabold text-sandigan-navy dark:text-white">
            Set New Password
          </CardTitle>
          <CardDescription className="text-xs">
            Create a strong, unique password to safeguard your personal SANDIGAN sanctuary.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMsg && (
            <Alert variant="danger">
              <p className="text-xs">{errorMsg}</p>
            </Alert>
          )}

          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                Password Updated!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Your password has been securely reset. Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sandigan-teal dark:border-sandigan-border-dark dark:bg-sandigan-surface-dark dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sandigan-teal dark:border-sandigan-border-dark dark:bg-sandigan-surface-dark dark:text-slate-100"
                />
              </div>

              <Button
                type="submit"
                variant="teal"
                size="md"
                className="w-full mt-2"
                isLoading={isSubmitting}
                rightIcon={<KeyRound className="w-4 h-4" />}
              >
                Update Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
