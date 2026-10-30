"use client";

import * as React from "react";
import { LogOut } from "lucide-react";

export function CrisisQuickExit() {
  const handleQuickExit = () => {
    // Overwrite history and immediately redirect to an innocuous site
    window.location.replace("https://www.google.com");
  };

  return (
    <button
      onClick={handleQuickExit}
      title="Quick Exit: Immediately leave this page and redirect to Google"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-900 transition-colors shadow-sm"
      aria-label="Quick Exit to safe page"
    >
      <LogOut className="w-3.5 h-3.5 shrink-0" />
      <span>Quick Exit</span>
    </button>
  );
}
