"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { SandiganLogo } from "@/components/sandigan/SandiganLogo";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await resetPassword(email);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error);
    } else {
      setIsSuccess(true);
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
            Reset Password
          </CardTitle>
          <CardDescription className="text-xs">
            Enter your email address and we will send you a secure link to reset your password.
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
                Check Your Email
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a password reset link has been dispatched.
              </p>
              <div className="pt-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="juan@example.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="teal"
                size="md"
                className="w-full mt-2"
                isLoading={isSubmitting}
                rightIcon={<Mail className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="pt-4 border-t border-slate-100 dark:border-sandigan-navy-800 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sandigan-teal transition-colors mx-auto font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
