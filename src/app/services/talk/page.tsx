"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Send,
  AlertTriangle,
  PhoneCall,
  X,
  MessageSquareHeart,
  Bot,
  User,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TalkApiResponse {
  reply?: string;
  response?: string;
  isCrisis?: boolean;
  error?: string;
}

// ─── Welcome message ─────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Kumusta? I'm SINAG, your wellness companion. This is a safe space to share what's on your mind. How are you feeling today?",
};

// ─── Animated dots loader ─────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sandigan-teal-100 dark:bg-sandigan-teal-900/40 shrink-0">
        <Bot className="h-4 w-4 text-sandigan-teal-700 dark:text-sandigan-teal-300" />
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-sandigan-teal-50 dark:bg-sandigan-teal-900/30 px-4 py-3 border border-sandigan-teal-100 dark:border-sandigan-teal-800">
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full bg-sandigan-teal-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-sandigan-teal-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-sandigan-teal-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Crisis banner ────────────────────────────────────────────────────────────

function CrisisBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative rounded-xl bg-rose-600 text-white px-4 py-3 shadow-md mb-4 flex flex-col sm:flex-row sm:items-start gap-3">
      <div className="flex items-start gap-2 flex-1">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">
            It sounds like you may be going through something very difficult.
            You are not alone.
          </p>
          <p className="text-xs mt-1 text-rose-100">
            If you or someone you know is in crisis, please reach out now:
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <li className="flex items-center gap-1.5 text-sm font-medium">
              <PhoneCall className="h-3.5 w-3.5" />
              NCMH Hopeline:{" "}
              <a href="tel:1553" className="underline underline-offset-2">
                1553
              </a>
            </li>
            <li className="flex items-center gap-1.5 text-sm font-medium">
              <PhoneCall className="h-3.5 w-3.5" />
              In Touch:{" "}
              <a
                href="tel:+63288937603"
                className="underline underline-offset-2"
              >
                02-8893-7603
              </a>
            </li>
            <li className="flex items-center gap-1.5 text-sm font-medium">
              <PhoneCall className="h-3.5 w-3.5" />
              Hopeline:{" "}
              <a href="tel:2919" className="underline underline-offset-2">
                2919
              </a>
            </li>
          </ul>
        </div>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss crisis alert"
        className="absolute top-2 right-2 rounded-full p-1 hover:bg-rose-500 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Sign-in prompt ───────────────────────────────────────────────────────────

function SignInPrompt() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sandigan-teal-50 dark:bg-sandigan-teal-900/30">
            <MessageSquareHeart className="h-8 w-8 text-sandigan-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
              Sign in to Talk to Tinig
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your conversations are private and secure. Please sign in to
              continue.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-xl select-none bg-sandigan-teal text-white hover:bg-sandigan-teal-600 focus-visible:ring-sandigan-teal shadow-sm h-13 px-7 text-base gap-2.5 w-full mt-2"
          >
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-end gap-2 max-w-[80%]">
          <div className="rounded-2xl rounded-br-sm bg-sandigan-navy px-4 py-3 text-white shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sandigan-navy shrink-0">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sandigan-teal-100 dark:bg-sandigan-teal-900/40 shrink-0">
        <Bot className="h-4 w-4 text-sandigan-teal-700 dark:text-sandigan-teal-300" />
      </div>
      <div className="max-w-[80%]">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="teal" className="text-xs">
            SINAG
          </Badge>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            COMPANION-07 · Wellness Companion
          </span>
        </div>
        <div className="rounded-2xl rounded-bl-sm bg-sandigan-teal-50 dark:bg-sandigan-teal-900/30 px-4 py-3 border border-sandigan-teal-100 dark:border-sandigan-teal-800 shadow-sm">
          <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TalkPage() {
  const { user, isLoading } = useAuth();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [showCrisis, setShowCrisis] = React.useState(false);

  const bottomRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Push welcome message on mount
  React.useEffect(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending && input.trim()) {
        handleSend();
      }
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const history = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      text: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsSending(true);

    try {
      const res = await fetch("/api/talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data: TalkApiResponse = await res.json();

      if (!res.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error ||
              "I'm sorry, something went wrong. Please try again.",
          },
        ]);
      } else {
        if (data.isCrisis) {
          setShowCrisis(true);
        }
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply || data.response || "I'm here. Please continue.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please check your internet connection and try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sandigan-teal border-t-transparent" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  // Auth gate
  if (!user && !isLoading) {
    return <SignInPrompt />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto px-4">
      {/* ── Header ── */}
      <div className="py-4 border-b border-slate-200 dark:border-sandigan-border-dark shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sandigan-teal-100 dark:bg-sandigan-teal-900/40">
            <MessageSquareHeart className="h-5 w-5 text-sandigan-teal-600 dark:text-sandigan-teal-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
              Talk to Tinig
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by SINAG &amp; GABAY · AI wellness companion
            </p>
          </div>
          <Badge variant="teal" className="ml-auto">
            SINAG
          </Badge>
        </div>

        {/* Disclaimer */}
        <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>Important:</strong> Tinig is a compassionate AI companion —
            not a therapist, doctor, or crisis service. If you are in immediate
            danger,{" "}
            <a
              href="tel:1553"
              className="font-bold underline underline-offset-2"
            >
              call 1553 now
            </a>
            .
          </p>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto py-4 space-y-0">
        {/* Crisis banner */}
        {showCrisis && (
          <CrisisBanner onDismiss={() => setShowCrisis(false)} />
        )}

        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}

        {isSending && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 border-t border-slate-200 dark:border-sandigan-border-dark py-3">
        <div className="flex items-end gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 focus-within:ring-2 focus-within:ring-sandigan-teal focus-within:border-transparent transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none leading-relaxed max-h-[200px] overflow-y-auto"
            style={{ minHeight: "24px" }}
            disabled={isSending}
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            variant="teal"
            size="sm"
            className="shrink-0 rounded-lg px-3"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
          Conversations are stored securely. For emergencies, call{" "}
          <a href="tel:1553" className="underline">
            1553
          </a>
          .
        </p>
      </div>
    </div>
  );
}
