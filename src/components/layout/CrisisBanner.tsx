import * as React from "react";
import Link from "next/link";
import { PhoneCall, ShieldAlert, ArrowRight } from "lucide-react";
import { CrisisQuickExit } from "./CrisisQuickExit";

export function CrisisBanner() {
  return (
    <div className="bg-sandigan-navy-950 text-white border-b border-sandigan-navy-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-semibold text-rose-400">Immediate Help Available 24/7:</span>
          <span className="hidden sm:inline text-slate-300">National Mental Health Hotline</span>
          <a
            href="tel:1553"
            className="inline-flex items-center gap-1 font-bold text-white hover:text-sandigan-teal-300 underline decoration-sandigan-teal underline-offset-2 transition-colors ml-1"
          >
            <PhoneCall className="w-3 h-3 shrink-0" />
            1553 (Toll-Free Nationwide)
          </a>
          <span className="hidden md:inline text-slate-400">or 0917-899-8727</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/get-help-now"
            className="inline-flex items-center gap-1 font-medium text-sandigan-gold hover:text-sandigan-gold-300 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-sandigan-gold" />
            <span>Crisis Pathways</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <CrisisQuickExit />
        </div>
      </div>
    </div>
  );
}
