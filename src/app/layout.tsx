import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';
import { EcosystemProvider } from '@/lib/store/ecosystem-context';
import { CrisisBanner } from '@/components/layout/CrisisBanner';

export const metadata: Metadata = {
  title: 'Tinig KaBataan (TK) | Home of PROJECT SANDIGAN — Digital Mental Health Ecosystem',
  description:
    'Tinig KaBataan (TK) presents PROJECT SANDIGAN — an official dedicated digital mental health ecosystem for Filipino youth. "You don\'t have to carry it alone." Founded and developed by Emmanuel James C. Dela Cruz.',
  keywords: [
    'Tinig KaBataan',
    'PROJECT SANDIGAN',
    'Mental Health Philippines',
    'Emmanuel James C. Dela Cruz',
    'Youth Empowerment',
    'Philippine Youth Organization',
    'Free Mental Health Support',
    'Bataan Mental Health',
    'NCMH 1553',
    'Peer Counseling',
    'Talk to Tinig',
  ],
  openGraph: {
    title: 'Tinig KaBataan (TK) | Home of PROJECT SANDIGAN',
    description:
      'PROJECT SANDIGAN — Digital Mental Health Ecosystem under Tinig KaBataan. "You don\'t have to carry it alone." Founded and developed by Emmanuel James C. Dela Cruz.',
    url: 'https://tinig-kabataan.vercel.app',
    siteName: 'Tinig KaBataan (TK)',
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PROJECT SANDIGAN | Tinig KaBataan',
    description:
      'A dedicated digital mental health ecosystem for Filipino youth. "You don\'t have to carry it alone."',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-tk-lavender selection:text-tk-deepblue">
        <AuthProvider>
          <EcosystemProvider>
            <CrisisBanner />
            <div className="flex-1 flex flex-col">{children}</div>
          </EcosystemProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
