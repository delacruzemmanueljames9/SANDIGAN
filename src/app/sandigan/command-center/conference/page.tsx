'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { AIOfficerId } from '@/types/sandigan';
import {
  Video,
  Send,
  Users2,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ArrowLeft,
  Bot,
  User,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function FounderConferenceRoomPage() {
  const { officers, conferenceMessages, sendConferenceMessage, isDarkMode } = useSandigan();

  const [inputMessage, setInputMessage] = useState('');
  const [targetOfficer, setTargetOfficer] = useState<'all' | AIOfficerId>('all');
  const [meetingMinutes, setMeetingMinutes] = useState<string | null>(null);

  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sandigan_founder_auth') === 'verified';
    }
    return false;
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const handleFounderAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'sandigan2026' || passcode.trim() === 'founder') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sandigan_founder_auth', 'verified');
      }
      setIsAuthorized(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conferenceMessages]);

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className={`p-8 rounded-3xl border shadow-2xl text-center space-y-5 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Restricted Boardroom Enclave
            </span>
            <h2 className="text-xl font-black mt-1">Conference Room Authorization</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Founder &amp; Developer <strong>Emmanuel James C. Dela Cruz</strong> executive quorum.
            </p>
          </div>

          <form onSubmit={handleFounderAuth} className="space-y-3">
            <input
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              placeholder="Enter Founder Passcode (default: sandigan2026)"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            {authError && (
              <p className="text-rose-500 text-[11px] font-semibold">
                Invalid executive passcode. Try: sandigan2026
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs shadow-lg hover:from-emerald-700 hover:to-teal-800 transition"
            >
              Verify &amp; Enter Conference Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    let formatted = inputMessage.trim();
    if (targetOfficer !== 'all') {
      formatted = `[@${targetOfficer.toUpperCase()}] ${formatted}`;
    }

    sendConferenceMessage(formatted, 'Founder');
    setInputMessage('');
  };

  const handleGenerateMinutes = () => {
    const minutes = `OFFICIAL MINUTES OF THE FOUNDER CONFERENCES (PROJECT SANDIGAN)\n===============================================================\nPresiding Officer: Emmanuel James C. Dela Cruz (Founder & Developer)\nAttending Officers: AMARA, TALA, GABAY, SIKLAB, DUNONG, KAWING, SINAG\nDate: ${new Date().toLocaleDateString()}\nStatus: Quorum Present (7/7 AI Officers in Attendance)\n\nKEY DELIBERATIONS & TRANSCRIPTS:\n${conferenceMessages
      .map(m => `[${m.timestamp}] ${m.senderName}: ${m.content}`)
      .join('\n\n')}\n\nACTION ITEMS:\n1. Maintain zero-PII data boundary in all Talk to Tinig interactions.\n2. Confirm Bataan emergency hotline accessibility (MMWGH and BGHMC).\n3. Prepare scheduled 5:00 PM and 7:00 PM PHT automated executive summaries.\n\nCertified Accurate by AMARA (Chief Supervisor).`;

    setMeetingMinutes(minutes);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/sandigan/command-center"
            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Return to Command Center"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black">
                Founder Conference Room
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Presided by Founder Emmanuel James C. Dela Cruz • In Session with All 7 Virtual AI Officers
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateMinutes}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Generate Meeting Minutes</span>
        </button>
      </div>

      {/* Conference Table Grid: 7 AI Officers Attendance Visualizer */}
      <div
        className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-emerald-400">
            Attendance Roster • Full Quorum Active
          </span>
          <span>7 of 7 Officers Seated</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          {/* Founder Seat */}
          <div className="p-3 rounded-2xl bg-slate-800 border-2 border-amber-400/80 space-y-1">
            <span className="text-2xl">👤</span>
            <div className="font-black text-xs text-white">Founder</div>
            <span className="text-[10px] text-amber-300 font-bold block">Emmanuel James</span>
          </div>

          {/* 7 AI Officers Seats */}
          {officers.map(o => (
            <div
              key={o.id}
              onClick={() => setTargetOfficer(o.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition space-y-1 ${
                targetOfficer === o.id
                  ? 'bg-slate-800 border-emerald-400 scale-105'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl">{o.avatar}</span>
              <div className="font-black text-xs text-white">{o.name}</div>
              <span className="text-[9px] text-slate-400 block line-clamp-1">{o.department}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Conference Feed & Minutes Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Conference Room Discussion Feed */}
        <div
          className={`lg:col-span-8 rounded-3xl border shadow-xl flex flex-col h-[540px] overflow-hidden ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Live Meeting Session Transcript</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Directing: <strong className="text-emerald-400 uppercase">{targetOfficer}</strong>
            </span>
          </div>

          {/* Messages */}
          <div
            className={`flex-1 overflow-y-auto p-5 space-y-3.5 ${
              isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50/70'
            }`}
          >
            {conferenceMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                  msg.sender === 'Founder'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100 ml-8'
                    : isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-200 mr-8'
                    : 'bg-white border-slate-200 text-slate-800 mr-8'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {msg.senderName}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Founder Input Bar */}
          <div
            className={`p-4 border-t ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <form onSubmit={handleSend} className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Address:</span>
                <select
                  value={targetOfficer}
                  onChange={e => setTargetOfficer(e.target.value as any)}
                  className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-transparent font-bold"
                >
                  <option value="all">Entire Conference (All 7 Officers)</option>
                  {officers.map(o => (
                    <option key={o.id} value={o.id}>{o.name} ({o.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Address the conference or issue a direct command..."
                  className="flex-1 p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Speak</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Meeting Minutes & Directives Rail */}
        <div
          className={`lg:col-span-4 p-6 rounded-3xl border shadow-xl space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Minutes & Directives</span>
            </h3>
            {meetingMinutes && (
              <button
                onClick={() => setMeetingMinutes(null)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {meetingMinutes ? (
            <div className="space-y-3">
              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96">
                {meetingMinutes}
              </pre>
              <button
                onClick={() => {
                  const blob = new Blob([meetingMinutes], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Sandigan-Conference-Minutes-${Date.now()}.txt`;
                  a.click();
                }}
                className="w-full py-2.5 rounded-xl bg-tk-deepblue text-white font-bold text-xs shadow"
              >
                Download Official Minutes
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <p>
                Click <strong>"Generate Meeting Minutes"</strong> above at any time to compile the live transcript, attendee records, and action items into an official record certified by AMARA.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
