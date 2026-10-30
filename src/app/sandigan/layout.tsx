'use client';

import React from 'react';
import { SandiganProvider, useSandigan } from '@/lib/sandigan/sandigan-context';
import { SandiganHeader } from '@/components/sandigan/SandiganHeader';
import { SandiganFooter } from '@/components/sandigan/SandiganFooter';
import { GetHelpNowModal } from '@/components/sandigan/GetHelpNowModal';

function SandiganLayoutInner({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useSandigan();

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <SandiganHeader />
      <main className="flex-1">{children}</main>
      <SandiganFooter />
      <GetHelpNowModal />
    </div>
  );
}

export default function SandiganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SandiganProvider>
      <SandiganLayoutInner>{children}</SandiganLayoutInner>
    </SandiganProvider>
  );
}
