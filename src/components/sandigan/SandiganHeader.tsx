'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { SandiganLanguage, SandiganTheme } from '@/types/sandigan';
import {
  HeartHandshake,
  ShieldAlert,
  Moon,
  Sun,
  Laptop,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  Building2,
  FileText,
  Activity,
  Compass,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export const SandiganHeader: React.FC = () => {
  const pathname = usePathname();
  const {
    session,
    resetAnonymousId,
    theme,
    setTheme,
    isDarkMode,
    language,
    updateLanguage,
    setShowEmergencyModal,
  } = useSandigan();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/sandigan' },
    { label: 'Talk to Tinig', href: '/sandigan/talk' },
    { label: 'Wellness Check', href: '/sandigan/wellness-check' },
    { label: 'Reset Room', href: '/sandigan/reset-room' },
    { label: 'Inner Garden', href: '/sandigan/inner-garden' },
    { label: 'Mind Library', href: '/sandigan/mind-library' },
    { label: 'Find Support', href: '/sandigan/find-support' },
    { label: 'My Safety Plan', href: '/sandigan/safety-plan' },
    { label: 'About Us', href: '/sandigan/about' },
  ];

  const handleCopyId = () => {
    navigator.clipboard?.writeText(session.anonymousId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDarkMode
          ? 'bg-slate-950/90 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-900'
      }`}
    >
      {/* Top micro-bar: TK Connection & Urgent Crisis Trigger */}
      <div
        className={`px-4 py-1.5 text-[11px] font-medium border-b flex items-center justify-between gap-3 ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 text-slate-300'
            : 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Link
            href="/"
            className="font-bold underline hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Tinig KaBataan (TK)
          </Link>
          <span className="opacity-40">•</span>
          <span className="truncate">
            PROJECT SANDIGAN: <em>You don't have to carry it alone.</em>
          </span>
        </div>

        {/* Prominent Emergency Button */}
        <button
          onClick={() => setShowEmergencyModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] shadow-sm transition shrink-0"
        >
          <PhoneCall className="w-3 h-3 animate-pulse" />
          <span>Get Help Now</span>
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/sandigan" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-tk-emerald via-teal-600 to-tk-deepblue flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition transform">
              PS
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight leading-tight">
                PROJECT SANDIGAN
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                An Official Project of Tinig KaBataan
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls: Anonymous ID, Language, Theme, HQ Command */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Anonymous ID Pill (Section 3) */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-sky-400'
                  : 'bg-slate-100 border-slate-300 text-tk-deepblue'
              }`}
            >
              <button
                onClick={handleCopyId}
                title="Click to copy your private anonymous session identifier"
                className="hover:underline"
              >
                {copiedId ? 'Copied!' : session.anonymousId}
              </button>
              <button
                onClick={resetAnonymousId}
                title="Reset identifier (creates a new fresh session)"
                className="text-slate-400 hover:text-rose-500 transition ml-1"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                onBlur={() => setTimeout(() => setLangDropdownOpen(false), 200)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold uppercase transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{language}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-32 rounded-xl shadow-xl border p-1 z-50 text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                >
                  {(['en', 'fil', 'taglish'] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => {
                        updateLanguage(l);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg uppercase ${
                        language === l
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {l === 'en' ? 'English' : l === 'fil' ? 'Filipino' : 'Taglish'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Switcher (Auto, Light, Dark) */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                onBlur={() => setTimeout(() => setThemeDropdownOpen(false), 200)}
                className={`p-2 rounded-xl border text-xs transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-amber-300'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'auto' ? (
                  <Laptop className="w-4 h-4" />
                ) : isDarkMode ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </button>

              {themeDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-32 rounded-xl shadow-xl border p-1 z-50 text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => {
                      setTheme('light');
                      setThemeDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setThemeDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('auto');
                      setThemeDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Laptop className="w-3.5 h-3.5 text-slate-400" />
                    <span>Auto Device</span>
                  </button>
                </div>
              )}
            </div>

            {/* Founder Command Center Link */}
            <Link
              href="/sandigan/command-center"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition border border-white/10"
            >
              <Building2 className="w-3.5 h-3.5 text-tk-lavender" />
              <span>Founder HQ</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`xl:hidden border-t p-4 space-y-4 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="grid grid-cols-2 gap-2 text-xs">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-bold">{session.anonymousId}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                className="p-2 rounded-lg border text-xs"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                href="/sandigan/command-center"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-tk-deepblue text-white text-xs font-bold"
              >
                Founder HQ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
