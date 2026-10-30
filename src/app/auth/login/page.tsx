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
import { LogIn, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, isLoading } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both your email and password.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-soft-lg border-slate-200 dark:border-sandigan-border-dark">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="flex justify-center">
            <SandiganLogo size="md" showText={false} />
          </div>
          <CardTitle className="text-2xl font-extrabold text-sandigan-navy dark:text-white">
            Welcome Back to SANDIGAN
          </CardTitle>
          <CardDescription className="text-xs">
            Sign in to access your private Inner Garden, personal Safety Plan, and wellness journey.
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
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="juan@example.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-sandigan-teal hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              rightIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-4 border-t border-slate-100 dark:border-sandigan-navy-800 text-center text-xs">
          <p className="text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/auth/register" className="font-semibold text-sandigan-teal hover:underline">
              Create an account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted with Row Level Security (RLS)</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
