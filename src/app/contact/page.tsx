"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Github,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

interface ContactFormData {
  fullName: string;
  email: string;
  category: "general" | "partnership" | "feedback" | "technical" | "press";
  subject: string;
  message: string;
  emergencyConsent: boolean;
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      category: "general",
      emergencyConsent: false,
    },
  });

  const onSubmit = async (_data: ContactFormData) => {
    // Processing inquiry
    await new Promise((res) => setTimeout(res, 600));
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal">Get in Touch</Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Contact PROJECT SANDIGAN
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Reach out for general inquiries, organization partnerships, psychoeducation research collaboration, or technical feedback.
        </p>
      </div>

      {/* Critical Emergency Warning Alert */}
      <Alert variant="danger" title="EMERGENCY NOTICE: DO NOT USE THIS FORM FOR CRISIS INTERVENTION">
        <p className="text-xs leading-relaxed">
          This contact form is monitored for administrative and partnership inquiries only. If you are experiencing suicidal thoughts, acute distress, or an emergency, please <strong>immediately dial 1553</strong> (NCMH National Hotline) or visit our{" "}
          <Link href="/get-help-now" className="underline font-bold hover:text-white">
            Get Help Now
          </Link>{" "}
          page.
        </p>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Info Column */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-sandigan-navy dark:text-white">
              Official Communication
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We welcome dialogue with schools, youth councils (SK), psychological clinics, NGOs, and open-source contributors.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-sandigan-teal shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Official Inquiries:</span>
                  <a href={`mailto:${SITE_CONFIG.links.contactEmail}`} className="text-sandigan-teal hover:underline font-mono">
                    {SITE_CONFIG.links.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Github className="w-4 h-4 text-sandigan-teal shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">GitHub Repository:</span>
                  <a
                    href={SITE_CONFIG.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sandigan-teal hover:underline font-mono text-[11px]"
                  >
                    delacruzemmanueljames9/SANDIGAN
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sandigan-teal shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Location:</span>
                  <span>Metro Manila, Philippines</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-2 bg-sandigan-navy-50/50 dark:bg-sandigan-navy-900/40 border-sandigan-navy-200 dark:border-sandigan-navy-800">
            <h4 className="font-heading font-semibold text-sm text-sandigan-navy dark:text-sandigan-gold">
              Project Developer
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong>{SITE_CONFIG.founder}</strong>
              <br />
              Founder &amp; Systems Architect
            </p>
          </Card>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-sandigan-navy dark:text-white">
                  Message Sent Successfully
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. A human team member will review your inquiry and respond within 2-3 business days.
                </p>
                <Button size="sm" variant="outline" onClick={() => setIsSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Juan Dela Cruz"
                    error={errors.fullName?.message}
                    {...register("fullName", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="juan@example.ph"
                    error={errors.email?.message}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Inquiry Category
                  </label>
                  <select
                    className="w-full h-11 rounded-xl border border-slate-300 dark:border-sandigan-border-dark bg-white dark:bg-sandigan-surface-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sandigan-teal"
                    {...register("category")}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Clinical Partnership / Directory Listing</option>
                    <option value="feedback">Youth Feedback &amp; Suggestions</option>
                    <option value="technical">Technical Bug / Security Vulnerability</option>
                    <option value="press">Media &amp; Academic Collaboration</option>
                  </select>
                </div>

                <Input
                  label="Subject"
                  placeholder="How can we collaborate?"
                  error={errors.subject?.message}
                  {...register("subject", {
                    required: "Subject is required",
                    minLength: { value: 5, message: "Subject must be at least 5 characters" },
                  })}
                />

                <Textarea
                  label="Your Message"
                  placeholder="Share details of your inquiry or suggestion..."
                  rows={5}
                  error={errors.message?.message}
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 20, message: "Message must be at least 20 characters" },
                  })}
                />

                {/* Emergency Consent Checkbox */}
                <div className="space-y-1 pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      {...register("emergencyConsent", {
                        required: "You must acknowledge that this form is not for emergency crisis response.",
                      })}
                    />
                    <span>
                      I understand that this form is <strong>not for emergency response</strong>, crisis intervention, or urgent psychological counseling.
                    </span>
                  </label>
                  {errors.emergencyConsent && (
                    <p className="text-xs text-rose-500">{errors.emergencyConsent.message}</p>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    variant="teal"
                    size="md"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Inquiry
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
