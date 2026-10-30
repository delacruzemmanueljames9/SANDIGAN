'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { SupportMode, CommunicationTone } from '@/types/sandigan';
import {
  HeartHandshake,
  Send,
  PhoneCall,
  Activity,
  Feather,
  ShieldCheck,
  Settings,
  Sparkles,
  Bot,
  User,
  SlidersHorizontal,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tinig';
  text: string;
  time: string;
  mode: SupportMode;
  suggestedActions?: { label: string; action: string; path?: string }[];
}

export default function SandiganTalkPage() {
  const {
    session,
    updatePreferredName,
    updateTone,
    updateSupportMode,
    supportMode,
    isDarkMode,
    setShowEmergencyModal,
  } = useSandigan();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'tinig',
      text: `Hello ${session.preferredName ? session.preferredName : 'there'}. Welcome to Talk to Tinig. 💙\n\nI am your companion under Project Sandigan. You are currently in **${supportMode === 'listening' ? 'Listening Mode' : 'Guidance Mode'}**.\n\nTake a slow, deep breath. There is no rush, and you don't have to carry anything alone here. *How are you feeling right now?*`,
      time: 'Just now',
      mode: supportMode,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [tempName, setTempName] = useState(session.preferredName || '');
  const [crisisAlert, setCrisisAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    'I feel like I am failing everyone around me.',
    'My chest feels heavy and I need a moment to breathe.',
    'I feel so alone in this house/school.',
    'Can you give me 3 practical steps to deal with panic?',
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: supportMode,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/sandigan/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          mode: supportMode,
          tone: session.preferredTone,
          language: session.preferredLanguage,
          preferredName: session.preferredName,
          anonymousId: session.anonymousId,
          history: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data;

        if (data.isCrisis) {
          setCrisisAlert(
            'GABAY Safeguarding Alert: Concerning distress indicators detected. Emergency Bataan and National Hotlines have been brought to the foreground.'
          );
        }

        const botMsg: ChatMessage = {
          id: `tinig-${Date.now()}`,
          sender: 'tinig',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: data.activeMode,
          suggestedActions: data.suggestedActions,
        };

        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Support response was not ok');
      }
    } catch (err) {
      console.warn('API error, using local compassionate fallback:', err);
      const fallbackMsg: ChatMessage = {
        id: `tinig-${Date.now()}`,
        sender: 'tinig',
        text: "Thank you for sharing your heart with me. Even in the hardest moments, remember you matter. Take a deep breath. If you need immediate human assistance, NCMH 1553 and Mariveles Mental Wellness Hospital ((047) 935-4661) are available.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: supportMode,
        suggestedActions: [
          { label: 'Reset Room', action: 'navigate', path: '/sandigan/reset-room' },
          { label: 'Find Support', action: 'navigate', path: '/sandigan/find-support' },
        ],
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferredName(tempName.trim());
    setShowSettingsDrawer(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Controls Bar: Modes & Personalization */}
      <div
        className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Adaptive Modes Selector (Section 5) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Mode:</span>
          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 text-xs">
            <button
              onClick={() => updateSupportMode('listening')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                supportMode === 'listening'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
              }`}
            >
              👂 Listening Mode
            </button>
            <button
              onClick={() => updateSupportMode('guidance')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                supportMode === 'guidance'
                  ? 'bg-tk-deepblue text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-400'
              }`}
            >
              🧭 Guidance Mode
            </button>
          </div>
        </div>

        {/* Personalization Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tone: {session.preferredTone}</span>
            {session.preferredName && <span>({session.preferredName})</span>}
          </button>

          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Crisis</span>
          </button>
        </div>
      </div>

      {/* Personalization Drawer */}
      {showSettingsDrawer && (
        <div
          className={`p-6 rounded-3xl border shadow-lg space-y-4 animate-in fade-in ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-500" />
              <span>Talk to Tinig Personalization</span>
            </h3>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Name or Nickname (Optional):
              </label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                placeholder="e.g. Maya or CJ"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                Preferred Communication Tone:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['gentle', 'friendly', 'direct', 'encouraging'] as const).map(t => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => updateTone(t)}
                    className={`p-2.5 rounded-xl border capitalize font-semibold transition ${
                      session.preferredTone === t
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition"
            >
              Save Preferences
            </button>
          </form>
        </div>
      )}

      {/* GABAY Crisis Alert Banner (if triggered) */}
      {crisisAlert && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-800 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Safeguarding Priority Active</span>
          </div>
          <p className="text-xs text-rose-900 dark:text-rose-200 font-medium">
            {crisisAlert}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="tel:1553"
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow"
            >
              Call NCMH 1553
            </a>
            <a
              href="tel:0479354661"
              className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs shadow"
            >
              Call MMWGH Bataan ((047) 935-4661)
            </a>
          </div>
        </div>
      )}

      {/* Main Chat Feed Container */}
      <div
        className={`rounded-3xl border shadow-xl overflow-hidden flex flex-col h-[580px] ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Chat Feed Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-tk-emerald to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm flex items-center gap-2">
                <span>Talk to Tinig</span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              </h2>
              <p className="text-[11px] text-emerald-100">
                Mode: <strong className="capitalize">{supportMode}</strong> • Tone: <strong className="capitalize">{session.preferredTone}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/sandigan/reset-room"
              className="hidden sm:inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-emerald-100 text-xs transition"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Reset Room</span>
            </Link>
          </div>
        </div>

        {/* Messages Feed */}
        <div
          className={`flex-1 overflow-y-auto p-6 space-y-4 ${
            isDarkMode ? 'bg-slate-950/60' : 'bg-slate-50/50'
          }`}
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-tk-deepblue text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-tk-deepblue text-white rounded-tr-none'
                    : isDarkMode
                    ? 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                {msg.text}

                {/* Suggested Actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((act, i) =>
                      act.path?.startsWith('tel:') ? (
                        <a
                          key={i}
                          href={act.path}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold text-[11px] hover:bg-rose-100 transition inline-flex items-center gap-1 border border-rose-200"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{act.label}</span>
                        </a>
                      ) : (
                        <Link
                          key={i}
                          href={act.path || '#'}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px] hover:bg-emerald-100 transition inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                        >
                          <span>{act.label}</span>
                        </Link>
                      )
                    )}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                    msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.time}</span>
                  <span className="font-mono text-[9px] uppercase px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {msg.mode}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Tinig is listening and composing a compassionate reflection...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompts Quick Picker */}
        <div
          className={`px-4 py-2 border-t flex items-center gap-2 overflow-x-auto text-xs ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Prompts:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 text-xs shrink-0 transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div
          className={`p-4 border-t ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Write what is on your mind... You don't have to carry it alone."
              className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow transition"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
