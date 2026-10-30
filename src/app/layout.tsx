import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CrisisBanner } from "@/components/layout/CrisisBanner";
import { SITE_CONFIG } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PROJECT SANDIGAN | Youth Mental Health & Community Support",
    template: "%s | PROJECT SANDIGAN",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "mental health Philippines",
    "youth mental health",
    "crisis hotline 1553",
    "wellness check",
    "safety plan",
    "Tinig KaBataan",
    "emotional wellness",
    "Project Sandigan",
  ],
  authors: [{ name: SITE_CONFIG.founder }],
  creator: SITE_CONFIG.founder,
  publisher: SITE_CONFIG.organization,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "PROJECT SANDIGAN — You don't have to carry it alone.",
    description: SITE_CONFIG.description,
    type: "website",
    locale: "en_PH",
    siteName: "PROJECT SANDIGAN",
  },
};

export const viewport: Viewport = {
  themeColor: "#101B35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <CrisisBanner />
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
