"use client";

import * as React from "react";
import { LogOut, Info } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function CrisisQuickExit() {
  const [showInfo, setShowInfo] = React.useState(false);

  const handleQuickExit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Overwrite the current history entry and immediately redirect to Google
    window.location.replace("https://www.google.com");
  };

  return (
    <>
      <div className="inline-flex items-center gap-1">
        <button
          onClick={handleQuickExit}
          title="Quick Exit: Immediately leave this page and redirect to Google"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 transition-colors shadow-sm select-none"
          aria-label="Quick Exit to Google"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span>Quick Exit</span>
        </button>

        <button
          type="button"
          onClick={() => setShowInfo(true)}
          title="Learn about Quick Exit limitations"
          className="p-1 text-slate-400 hover:text-white transition-colors rounded"
          aria-label="Quick exit privacy limitations"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      <Modal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Quick Exit & Privacy Notice"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            The <strong>Quick Exit</strong> button immediately closes this view and replaces your current tab with Google to help protect your privacy if someone walks into the room.
          </p>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            <strong>Important Technical Limitation:</strong>
            <ul className="list-disc pl-4 mt-1.5 space-y-1">
              <li>Quick Exit does <em>not</em> automatically erase your browser history or cookies.</li>
              <li>Someone with access to your device can still check your history or keystrokes if monitoring software is installed.</li>
            </ul>
          </div>
          <p>
            For maximum privacy on shared or monitored devices, please use <strong>Private / Incognito Browsing</strong> and manually clear your browser history after your session.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="secondary" onClick={() => setShowInfo(false)}>
              Got it
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleQuickExit()}>
              Exit to Google Now
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
