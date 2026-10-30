'use client';

import React from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import {
  PhoneCall,
  AlertTriangle,
  X,
  ShieldCheck,
  MapPin,
  HeartHandshake,
  Activity,
  FileText,
} from 'lucide-react';

export const GetHelpNowModal: React.FC = () => {
  const { showEmergencyModal, setShowEmergencyModal, isDarkMode } = useSandigan();

  if (!showEmergencyModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={`rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border space-y-6 relative max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? 'bg-slate-900 border-rose-500/40 text-slate-100'
            : 'bg-white border-rose-200 text-slate-900'
        }`}
      >
        <button
          onClick={() => setShowEmergencyModal(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          aria-label="Close crisis window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              Immediate Safety & Human Assistance
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">Get Help Right Now</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              You are safe here. If you are experiencing intense distress, please connect with real human help immediately.
            </p>
          </div>
        </div>

        {/* Priority Bataan Emergency Helplines */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Priority Bataan Clinical Emergency Hotlines</span>
          </div>

          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkMode
                ? 'bg-slate-950 border-rose-900/50'
                : 'bg-rose-50/50 border-rose-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Mariveles Mental Wellness and General Hospital (MMWGH)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mariveles, Bataan • 24/7 Crisis Intervention & Triage
                </p>
              </div>
              <a
                href="tel:0479354661"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow hover:bg-rose-700 transition self-start sm:self-auto shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call (047) 935-4661</span>
              </a>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>Mobile Hotline:</span>
              <strong className="text-slate-800 dark:text-slate-200">0968-854-3858</strong>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bataan General Hospital and Medical Center (BGHMC Balanga)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Balanga City, Bataan • 24/7 Emergency Room & Psychiatry Unit
                </p>
              </div>
              <a
                href="tel:0472379770"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow transition self-start sm:self-auto shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call (047) 237-9770</span>
              </a>
            </div>
          </div>
        </div>

        {/* National 24/7 Hotline Strip */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-white block">
              National Center for Mental Health (NCMH) 24/7 Crisis Hotline
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Free psychological first aid nationwide via landline
            </span>
          </div>
          <a
            href="tel:1553"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition self-start sm:self-auto shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Dial 1553</span>
          </a>
        </div>

        {/* Quick Self-Care Links */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/sandigan/safety-plan"
            onClick={() => setShowEmergencyModal(false)}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-center text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-sky-500" />
            <span>Open My Safety Plan</span>
          </Link>
          <Link
            href="/sandigan/reset-room"
            onClick={() => setShowEmergencyModal(false)}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-center text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Reset Room Breathing</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
