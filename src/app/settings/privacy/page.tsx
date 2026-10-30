"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import {
  Download,
  Trash2,
  Lock,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function PrivacySettingsPage() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();

  const [isExporting, setIsExporting] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/user/export");
      if (!res.ok) throw new Error("Failed to export data.");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sandigan-user-data-${user?.id.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      alert((err as Error).message || "Export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/user/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account.");
      }
      await signOut();
      router.push("/");
    } catch (err: unknown) {
      setDeleteError((err as Error).message || "An error occurred during account deletion.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-xs text-slate-500">Loading privacy settings...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/settings/profile" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sandigan-teal">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </Link>
      </div>

      <div className="space-y-2">
        <Badge variant="navy">Data Subject Rights (RA 10173)</Badge>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-sandigan-navy dark:text-white">
          Privacy &amp; Data Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Exercise full ownership over your personal reflections, consent settings, and account data.
        </p>
      </div>

      {/* Consent Status Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sandigan-teal" />
          <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
            Active Consents &amp; Agreements
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800">
            <div>
              <strong className="block text-slate-800 dark:text-slate-200">Terms of Service (v1.0.0)</strong>
              <span className="text-[11px] text-slate-500">Agreed upon account registration</span>
            </div>
            <Badge variant="teal">Granted</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800">
            <div>
              <strong className="block text-slate-800 dark:text-slate-200">Privacy Policy (RA 10173 Compliance v1.0.0)</strong>
              <span className="text-[11px] text-slate-500">Acknowledged data minimization and RLS encryption</span>
            </div>
            <Badge variant="teal">Acknowledged</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-sandigan-navy-900 border border-slate-200/80 dark:border-sandigan-navy-800">
            <div>
              <strong className="block text-slate-800 dark:text-slate-200">Public AI Training Exemption</strong>
              <span className="text-[11px] text-slate-500">Journals and reflections are strictly excluded from public LLM training</span>
            </div>
            <Badge variant="emerald">Protected by Default</Badge>
          </div>
        </div>
      </Card>

      {/* Export Data Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-sandigan-gold" />
          <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
            Export Your Account Data (Right to Data Portability)
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Download a complete, machine-readable JSON archive of your personal records—including your profile, Inner Garden journal reflections, Safety Plan, and wellness assessment records.
        </p>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export All Personal Data (JSON)
          </Button>
        </div>
      </Card>

      {/* Delete Account Card */}
      <Card className="p-6 space-y-4 border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
          <Trash2 className="w-5 h-5" />
          <h3 className="font-heading font-bold text-base">
            Permanently Delete Account (Right to Erasure)
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Under Section 16 of the Data Privacy Act of 2012, you may permanently purge your account, journal entries, safety plans, and personal records from our database. This action is irreversible.
        </p>
        <div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete My Account Permanently
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200">
            <strong className="block text-sm font-bold">Warning: Irreversible Action</strong>
            <p className="mt-1">
              Deleting your account will permanently purge all your private journal entries, personalized safety plans, and wellness reflection records.
            </p>
          </div>

          {deleteError && (
            <Alert variant="danger">
              <p className="text-xs">{deleteError}</p>
            </Alert>
          )}

          <p>
            Are you sure you want to proceed with permanent deletion?
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
            >
              Confirm &amp; Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
