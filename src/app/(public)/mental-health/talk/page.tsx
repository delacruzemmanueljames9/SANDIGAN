'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  Activity,
  Feather,
  RefreshCw,
  Info,
  User,
  Bot,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tinig';
  text: string;
  time: string;
  isAiLive?: boolean;
  provider?: string;
  suggestedActions?: { label: string; action: string; path?: string }[];
}

export default function TalkToTinigPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tinig',
      text: "Hello, and welcome to Talk to Tinig. 💙 I am your supportive companion from Tinig KaBataan.\n\nTake a slow, gentle breath. This is a non-judgmental space where your feelings are honored. Whatever you're navigating today—whether it's school stress, family expectations, loneliness, or emotional exhaustion—I am here with you.\n\n*How are you feeling right now?*",
      time: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState<{ isCrisis: boolean; message: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    'I feel completely burnt out from school deadlines.',
    'My anxiety is making my chest feel tight right now.',
    'I feel really alone and like nobody understands me.',
    'Can you guide me through a 2-minute breathing exercise?',
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          consentGranted: hasConsent,
          history: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data;

        if (data.crisisInfo && data.crisisInfo.isCrisis) {
          setCrisisAlert({
            isCrisis: true,
            message: data.crisisInfo.safetyMessage,
          });
        }

        const botMsg: ChatMessage = {
          id: `tinig-${Date.now()}`,
          sender: 'tinig',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAiLive: data.isAiLive,
          provider: data.provider,
          suggestedActions: data.suggestedActions,
        };

        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Support service response was not ok');
      }
    } catch (err) {
      console.warn('API error, using client-side fallback:', err);
      // Gentle local fallback
      const fallbackMsg: ChatMessage = {
        id: `tinig-${Date.now()}`,
        sender: 'tinig',
        text: "Thank you for sharing that with me. It takes courage to open up. Remember to exhale completely. If you are experiencing heavy distress, remember the Philippine National Center for Mental Health is available 24/7 at 1553.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Try Reset Room', action: 'navigate', path: '/mental-health/reset-room' },
          { label: 'View Helplines', action: 'navigate', path: '/mental-health/support-directory' },
        ],
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Non-clinical ethical disclaimer banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Peer Support Space:</span> Talk to Tinig offers supportive, compassionate listening. It is not psychiatric therapy or medical diagnosis. For life-threatening emergencies, call <strong className="text-emerald-800 underline">NCMH 1553</strong>.
          </div>
        </div>

        {/* Optional AI consent toggle */}
        <label className="flex items-center gap-1.5 shrink-0 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasConsent}
            onChange={e => setHasConsent(e.target.checked)}
            className="w-3.5 h-3.5 text-emerald-600 rounded"
          />
          <span className="text-[11px] font-medium text-emerald-800 hidden sm:inline">
            Informed AI processing consent
          </span>
        </label>
      </div>

      {/* Emergency Crisis Detection Banner (if triggered) */}
      {crisisAlert && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Emergency Support Pathways Activated</span>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed font-medium">
            {crisisAlert.message}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="tel:1553"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow hover:bg-rose-700 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call NCMH Hotline 1553</span>
            </a>
            <Link
              href="/mental-health/support-directory"
              className="text-xs font-bold text-rose-700 underline"
            >
              View Free 24/7 Helplines
            </Link>
          </div>
        </div>
      )}

      {/* Chat Window Container */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xl overflow-hidden flex flex-col h-[580px]">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-tk-emerald to-[#23684B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide flex items-center gap-2">
                <span>Talk to Tinig</span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              </h2>
              <p className="text-[11px] text-emerald-100">
                Safe, Compassionate, Youth-Centered Support Flow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/mental-health/reset-room"
              className="hidden sm:inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-emerald-100 text-xs transition"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Reset Room</span>
            </Link>
            <Link
              href="/mental-health/inner-garden"
              className="hidden sm:inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-emerald-100 text-xs transition"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Inner Garden</span>
            </Link>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
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
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                {msg.text}

                {/* Suggested Navigation Actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((act, i) => (
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
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-[11px] hover:bg-emerald-100 transition inline-flex items-center gap-1 border border-emerald-200"
                        >
                          <span>{act.label}</span>
                        </Link>
                      )
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                    msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.time}</span>
                  {msg.provider && (
                    <span className="font-mono text-[9px] uppercase px-1 rounded bg-slate-100 text-slate-600">
                      {msg.provider}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Tinig is listening and preparing a compassionate response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Prompts:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-xs shrink-0 transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
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
              placeholder="Share what is on your mind... You are safe here."
              className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition"
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
