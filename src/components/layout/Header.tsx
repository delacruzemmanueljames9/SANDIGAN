"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/config/site";
import { SandiganLogo } from "@/components/sandigan/SandiganLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { Menu, X, ShieldAlert, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-sandigan-border-dark dark:bg-sandigan-navy-950/90 dark:supports-[backdrop-filter]:bg-sandigan-navy-950/80 transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="PROJECT SANDIGAN Home">
          <SandiganLogo size="sm" showText={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {SITE_CONFIG.navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.highlight) {
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ml-2 bg-rose-600 hover:bg-rose-700 shadow-sm"
                    leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-sandigan-teal font-semibold dark:text-sandigan-teal-300 bg-sandigan-teal-50 dark:bg-sandigan-teal-950/40"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-sandigan-navy-800"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          <Link href="/hq" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-sandigan-navy-200 dark:border-sandigan-navy-700 text-sandigan-navy dark:text-sandigan-gold"
              leftIcon={<Shield className="w-3.5 h-3.5" />}
            >
              Command HQ
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-sandigan-navy-800"
            aria-label={mobileMenuOpen ? "Close main navigation menu" : "Open main navigation menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 shadow-xl dark:border-sandigan-border-dark dark:bg-sandigan-navy-900">
          <nav className="flex flex-col space-y-1">
            {SITE_CONFIG.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sandigan-teal-50 text-sandigan-teal-700 font-semibold dark:bg-sandigan-teal-950/50 dark:text-sandigan-teal-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-sandigan-navy-800",
                    item.highlight && "text-rose-600 dark:text-rose-400 font-bold"
                  )}
                >
                  <span>{item.label}</span>
                  {item.highlight && <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-200 dark:border-sandigan-navy-800 mt-2">
              <Link href="/hq" className="w-full">
                <Button variant="outline" size="sm" className="w-full justify-center" leftIcon={<Shield className="w-4 h-4" />}>
                  Founder Command HQ
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
