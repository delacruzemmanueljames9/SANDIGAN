'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PhoneCall, HeartHandshake, X } from 'lucide-react';

export const CrisisBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-tk-deepblue via-[#234356] to-tk-emerald text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <HeartHandshake className="w-4 h-4 text-emerald-300 shrink-0 hidden sm:inline" />
          <span className="truncate">
            <strong className="text-emerald-300 font-semibold">Immediate Support in the Philippines:</strong>{' '}
            Need someone to talk to right now? The National Center for Mental Health Crisis Hotline is available 24/7.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:1553"
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-full text-xs transition shadow-sm"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Call 1553</span>
          </a>
          <Link
            href="/mental-health/help-now"
            className="hidden md:inline-flex underline text-xs text-tk-lightblue hover:text-white transition"
          >
            Emergency Guide & Hotlines
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="text-white/60 hover:text-white p-0.5 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
