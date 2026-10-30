"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { SandiganLogo } from "@/components/sandigan/SandiganLogo";
import { UserPlus, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, user, isLoading } = useAuth();

  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isMinor, setIsMinor] = React.useState(false);
  const [agreedTerms, setAgreedTerms] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [verificationNeeded, setVerificationNeeded] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!displayName.trim()) {
      setErrorMsg("Please choose an alias or display name.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!agreedTerms) {
      setErrorMsg("You must review and agree to the Terms of Service and Privacy Policy to create an account.");
      return;
    }

    setIsSubmitting(true);
    const { error, needsEmailVerification } = await signUp(email, password, displayName, isMinor);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error);
    } else if (needsEmailVerification) {
      setVerificationNeeded(true);
    } else {
      router.push("/");
    }
  };

  if (verificationNeeded) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-8 text-center space-y-4 shadow-soft-lg">
          <div className="w-14 h-14 rounded-full bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-sandigan-navy dark:text-white">
            Verify Your Email
          </CardTitle>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We have sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to activate your secure SANDIGAN sanctuary.
          </p>
          <div className="pt-4">
            <Link href="/auth/login">
              <Button variant="teal" size="sm">
                Proceed to Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-soft-lg border-slate-200 dark:border-sandigan-border-dark">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="flex justify-center">
            <SandiganLogo size="md" showText={false} />
          </div>
          <CardTitle className="text-2xl font-extrabold text-sandigan-navy dark:text-white">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-xs">
            Join PROJECT SANDIGAN. Your personal reflections remain private-by-default under strict Row Level Security.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMsg && (
            <Alert variant="danger" icon={<AlertCircle className="w-4 h-4 text-rose-500" />}>
              <p className="text-xs">{errorMsg}</p>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Display Name or Alias"
              placeholder="e.g. Tala_99 (Pseudonyms encouraged)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              helperText="Feel free to use an anonymous alias for privacy."
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="juan@example.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
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
                Confirm Password
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

            {/* Safeguarding: Minor Indicator */}
            <div className="rounded-xl border border-slate-200 dark:border-sandigan-navy-800 p-3 bg-slate-50/60 dark:bg-sandigan-navy-900/40">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="mt-0.5 rounded text-sandigan-teal focus:ring-sandigan-teal"
                />
                <span>
                  I am under 18 years of age. (Enables specialized youth safeguarding protocols).
                </span>
              </label>
            </div>

            {/* Mandatory Legal & Consent Agreement */}
            <div className="space-y-1.5 pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-sandigan-teal focus:ring-sandigan-teal"
                />
                <span className="leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-sandigan-teal underline font-medium">
                    Terms of Service
                  </Link>{" "}
                  and acknowledge the{" "}
                  <Link href="/privacy" className="text-sandigan-teal underline font-medium">
                    Privacy Policy
                  </Link>{" "}
                  under Republic Act No. 10173.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="teal"
              size="md"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={<UserPlus className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-4 border-t border-slate-100 dark:border-sandigan-navy-800 text-center text-xs">
          <p className="text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-sandigan-teal hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
