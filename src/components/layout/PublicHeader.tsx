'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Building,
  HeartHandshake,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  Lock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';

export const PublicHeader: React.FC = () => {
  const pathname = usePathname();
  const { isHQAuthorized, currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Departments', href: '/departments' },
    { label: 'Services', href: '/services' },
    { label: 'News', href: '/news' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Youth Voices', href: '/youth-voices' },
    { label: 'Contact', href: '/contact' },
  ];

  const servicePortals = [
    {
      title: 'PROJECT SANDIGAN',
      desc: 'You don\'t have to carry it alone • Flagship Digital Mental Health Initiative',
      href: '/sandigan',
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950 font-bold',
    },
    {
      title: 'Mental Health Platform',
      desc: 'Talk to Tinig, Reset Room, and Crisis Support',
      href: '/mental-health',
      icon: HeartHandshake,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Publication Division',
      desc: 'Youth essays, journalism, and creative literature',
      href: '/publication',
      icon: BookOpen,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      title: 'Youth Action Hub',
      desc: 'Grassroots mobilizations and volunteer chapters',
      href: '/youth',
      icon: Users,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Leadership Academy',
      desc: 'Certified workshops and mentorship programs',
      href: '/learning',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-tk-deepblue to-tk-teal flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition transform">
                TK
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-tk-deepblue leading-tight">
                  TINIG KABATAAN
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                  Your Voice Matters. Your Mind Matters.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                href="/sandigan"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition mr-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>PROJECT SANDIGAN</span>
              </Link>

              {navLinks.slice(0, 4).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname === link.href
                      ? 'text-tk-deepblue bg-tk-lightblue/60 font-semibold'
                      : 'text-slate-600 hover:text-tk-deepblue hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Service Portals Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                  onBlur={() => setTimeout(() => setServiceDropdownOpen(false), 200)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-tk-deepblue hover:bg-slate-50 transition"
                >
                  <span>Services & Portals</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {serviceDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-slate-200/80 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Autonomous Service Portals
                    </div>
                    <div className="space-y-1">
                      {servicePortals.map(portal => {
                        const Icon = portal.icon;
                        return (
                          <Link
                            key={portal.href}
                            href={portal.href}
                            onClick={() => setServiceDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group"
                          >
                            <div className={`p-2 rounded-lg ${portal.color} shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 group-hover:text-tk-deepblue">
                                {portal.title}
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">
                                {portal.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {navLinks.slice(4).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname === link.href
                      ? 'text-tk-deepblue bg-tk-lightblue/60 font-semibold'
                      : 'text-slate-600 hover:text-tk-deepblue hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions: Role Switcher & Virtual HQ Entry */}
            <div className="hidden sm:flex items-center gap-3">
              <RoleSwitcher />

              {isHQAuthorized ? (
                <Link
                  href="/hq"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-tk-deepblue to-slate-900 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition border border-white/20"
                >
                  <Building className="w-4 h-4 text-tk-lavender" />
                  <span>Virtual HQ</span>
                  <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-400/40">
                    Live
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowAccessDeniedModal(true)}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 transition"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Virtual HQ (Officers Only)</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center gap-2">
              <RoleSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/sandigan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>PROJECT SANDIGAN — Digital Mental Health</span>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-200" />
            </Link>

            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Specialized Service Portals
              </span>
              <div className="grid grid-cols-1 gap-2">
                {servicePortals.map(p => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-xs font-semibold text-slate-800"
                  >
                    <p.icon className="w-4 h-4 text-tk-deepblue" />
                    <span>{p.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              {isHQAuthorized ? (
                <Link
                  href="/hq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-tk-deepblue text-white py-2.5 rounded-xl font-bold text-sm shadow-md"
                >
                  <Building className="w-4 h-4 text-tk-lavender" />
                  <span>Enter Virtual HQ</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowAccessDeniedModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-medium text-sm border border-slate-200"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>Virtual HQ (Officers Only)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Security Access Denied Modal for Public Users attempting to enter HQ */}
      {showAccessDeniedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Restricted Officer Headquarters
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              The Virtual Headquarters is a private, protected operational workspace restricted to
              authorized Tinig KaBataan officers, department heads, and platform administrators.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-4 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Testing evaluation mode:</p>
              <p>
                To evaluate the Virtual HQ right now, select any authorized officer role (such as{' '}
                <strong>Super Admin</strong> or <strong>Department Head</strong>) using the Role
                Switcher in the navigation bar.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAccessDeniedModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
