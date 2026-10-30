import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  PhoneCall,
  ShieldAlert,
  MapPin,
  Clock,
  Heart,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { CrisisQuickExit } from "@/components/layout/CrisisQuickExit";

export const metadata: Metadata = {
  title: "Get Help Now — 24/7 Crisis & Emergency Support",
  description:
    "Immediate, verified 24/7 mental health crisis hotlines and emergency support resources across the Philippines. Free, confidential, and accessible without login.",
};

export default function GetHelpNowPage() {
  const verifiedHotlines = [
    {
      name: "National Center for Mental Health (NCMH) Crisis Hotline",
      operator: "Department of Health (DOH)",
      phonePrimary: "1553",
      phoneSecondary: "0917-899-8727 / 0966-351-4518",
      landline: "02-7989-8727",
      availability: "24/7 Nationwide",
      cost: "Free / Toll-free via landline nationwide",
      description:
        "Official government 24/7 psychiatric emergency and suicide prevention service providing immediate tele-crisis intervention and hospital referral.",
      verifiedAt: "October 30, 2026",
      sourceUrl: "https://ncmh.gov.ph",
      featured: true,
    },
    {
      name: "In Touch Community Services — Crisis Line",
      operator: "In Touch Community Services (NGO)",
      phonePrimary: "02-8893-7603",
      phoneSecondary: "0917-800-1123 / 0922-893-8944",
      availability: "24/7",
      cost: "Free emotional support line",
      description:
        "Trained crisis volunteer counseling providing compassionate emotional support, grief counseling, and subsidized professional therapy referrals.",
      verifiedAt: "October 30, 2026",
      sourceUrl: "https://in-touch.org",
      featured: true,
    },
    {
      name: "Hopeline Philippines",
      operator: "Hopeline / Natasha Goulbourn Foundation",
      phonePrimary: "2919",
      phoneSecondary: "0917-558-4673 / 02-8804-4673",
      availability: "24/7 Toll-free for Globe and TM subscribers",
      cost: "Free on Globe/TM",
      description:
        "24/7 confidential crisis line dedicated to depression support, suicide intervention, and active emotional listening.",
      verifiedAt: "October 30, 2026",
      sourceUrl: "https://facebook.com/HopelinePH",
      featured: false,
    },
    {
      name: "Bantay Bata 163 (Youth & Child Helpline)",
      operator: "ABS-CBN Foundation",
      phonePrimary: "163",
      phoneSecondary: "0917-814-4163",
      availability: "24/7 Nationwide",
      cost: "Free hotline",
      description:
        "Dedicated youth and child safeguarding helpline responding to youth distress, abuse, psychological trauma, and family crises.",
      verifiedAt: "October 30, 2026",
      sourceUrl: "https://abscbnfoundation.org",
      featured: false,
    },
    {
      name: "Philippine National Emergency Services",
      operator: "Government Emergency Dispatch",
      phonePrimary: "911",
      phoneSecondary: "Local PNP / BFP Station",
      availability: "24/7",
      cost: "Free",
      description:
        "Immediate dispatch for physical safety emergencies, acute self-harm in progress, medical crises, and life-threatening danger.",
      verifiedAt: "October 30, 2026",
      sourceUrl: "https://dilg.gov.ph",
      featured: false,
    },
  ];

  const emergencyHospitals = [
    {
      name: "National Center for Mental Health (NCMH) Emergency Room",
      location: "9 de Pebrero St, Mauway, Mandaluyong City, Metro Manila",
      contact: "02-8531-9001 to 10",
      notes: "24/7 dedicated psychiatric emergency room with admitting capacity.",
    },
    {
      name: "Philippine General Hospital (PGH) Department of Psychiatry Emergency",
      location: "Taft Avenue, Ermita, Manila",
      contact: "02-8554-8400",
      notes: "Public university hospital providing emergency psychiatric assessment.",
    },
    {
      name: "University of the East Ramon Magsaysay (UERM) Hospital",
      location: "Aurora Blvd, Quezon City",
      contact: "02-8715-0861",
      notes: "Emergency department with on-call psychiatric consultation.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Top Urgent Notice Banner */}
      <div className="rounded-3xl border-2 border-rose-600 bg-rose-600 text-white p-6 sm:p-8 shadow-soft-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-500/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white text-rose-600 shrink-0">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest uppercase text-rose-200">
                Immediate Urgent Assistance • Walang Bayad
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                You Do Not Have to Carry This Alone.
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-center">
            <CrisisQuickExit />
          </div>
        </div>

        <p className="text-sm sm:text-base text-rose-50 leading-relaxed max-w-3xl">
          If you or someone you care about is currently in danger of hurting themselves, experiencing overwhelming panic, or needs immediate human support, please contact a verified 24/7 crisis service right now.
        </p>

        {/* Primary Call Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <a
            href="tel:1553"
            className="flex items-center justify-between p-4 rounded-2xl bg-white text-rose-900 hover:bg-rose-50 font-bold transition-all shadow-md group"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-6 h-6 text-rose-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs text-rose-600 font-semibold uppercase">Dial Nationwide</p>
                <p className="text-2xl font-extrabold font-heading">1553</p>
              </div>
            </div>
            <Badge variant="rose">24/7 NCMH</Badge>
          </a>

          <a
            href="tel:09178998727"
            className="flex items-center justify-between p-4 rounded-2xl bg-sandigan-navy-950 text-white hover:bg-sandigan-navy-900 font-bold transition-all shadow-md group border border-rose-400/40"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-6 h-6 text-sandigan-teal group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs text-sandigan-teal font-semibold uppercase">Mobile / Globe / TM</p>
                <p className="text-lg font-extrabold font-heading">0917-899-8727</p>
              </div>
            </div>
            <Badge variant="teal">Mobile 24/7</Badge>
          </a>

          <a
            href="tel:911"
            className="flex items-center justify-between p-4 rounded-2xl bg-sandigan-navy-900 text-white hover:bg-sandigan-navy-800 font-bold transition-all shadow-md group border border-rose-400/40"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs text-amber-400 font-semibold uppercase">Emergency Dispatch</p>
                <p className="text-2xl font-extrabold font-heading">911</p>
              </div>
            </div>
            <Badge variant="gold">Life Danger</Badge>
          </a>
        </div>
      </div>

      {/* Grounding & Immediate Self-Regulation Box */}
      <section className="rounded-3xl border border-sandigan-teal-200 bg-sandigan-teal-50/60 p-6 sm:p-8 dark:border-sandigan-teal-900 dark:bg-sandigan-teal-950/30 space-y-4">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-sandigan-teal" />
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-sandigan-navy dark:text-white">
            If You Are Feeling Overwhelmed Right Now
          </h2>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
          Take a deep, gentle breath. You do not need to solve everything right at this second. Try this 1-minute physiological reset:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-sandigan-surface-cardDark border border-sandigan-teal-100 dark:border-sandigan-teal-900/60 space-y-1">
            <span className="text-xs font-bold text-sandigan-teal uppercase">Step 1 • Breathe</span>
            <h4 className="font-heading font-semibold text-sm">Long Exhale</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Inhale deeply through your nose for 4 seconds, then exhale slowly through your mouth for 7 seconds.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-sandigan-surface-cardDark border border-sandigan-teal-100 dark:border-sandigan-teal-900/60 space-y-1">
            <span className="text-xs font-bold text-sandigan-teal uppercase">Step 2 • Ground</span>
            <h4 className="font-heading font-semibold text-sm">Feel Your Feet</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Notice the solid ground beneath your feet. Touch 3 physical surfaces around you (table, fabric, cool water).
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-sandigan-surface-cardDark border border-sandigan-teal-100 dark:border-sandigan-teal-900/60 space-y-1">
            <span className="text-xs font-bold text-sandigan-teal uppercase">Step 3 • Connect</span>
            <h4 className="font-heading font-semibold text-sm">Reach Out</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pick one number from the list below and dial it. The person on the line is trained to listen with care.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link href="/services/reset-room">
            <Button variant="teal" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Guided Reset Room
            </Button>
          </Link>
        </div>
      </section>

      {/* Verified Philippine Crisis Helplines Directory */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <Badge variant="navy">Official &amp; Verified Directory</Badge>
            <h2 className="font-heading text-2xl font-bold text-sandigan-navy dark:text-white mt-1">
              Verified Philippine Crisis Helplines
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every contact number is verified by our safeguarding team. No fabricated services.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Last verified: <strong className="text-slate-300">October 30, 2026</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {verifiedHotlines.map((hl) => (
            <Card
              key={hl.name}
              className={`flex flex-col justify-between ${
                hl.featured ? "border-sandigan-teal dark:border-sandigan-teal-700 shadow-soft-md" : ""
              }`}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-sandigan-teal">
                      {hl.operator}
                    </span>
                    <CardTitle className="text-lg mt-0.5">{hl.name}</CardTitle>
                  </div>
                  <Badge variant={hl.featured ? "teal" : "neutral"}>{hl.availability}</Badge>
                </div>
                <CardDescription className="text-xs">{hl.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1.5 dark:bg-sandigan-navy-900 border border-slate-200 dark:border-sandigan-navy-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Primary Contact:</span>
                    <a
                      href={`tel:${hl.phonePrimary.replace(/[^0-9]/g, "")}`}
                      className="font-bold text-sandigan-navy dark:text-sandigan-gold hover:underline"
                    >
                      {hl.phonePrimary}
                    </a>
                  </div>
                  {hl.phoneSecondary && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Alternate:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {hl.phoneSecondary}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-sandigan-navy-800">
                    <span className="text-slate-500 dark:text-slate-400">Cost:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{hl.cost}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`tel:${hl.phonePrimary.replace(/[^0-9]/g, "")}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sandigan-navy text-white hover:bg-sandigan-navy-700 text-xs font-semibold transition-colors dark:bg-sandigan-navy-700 dark:hover:bg-sandigan-navy-600"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call {hl.phonePrimary}
                  </a>

                  <a
                    href={hl.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sandigan-teal transition-colors"
                  >
                    <span>Official Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Hospital Psychiatric Emergency Units */}
      <section className="space-y-4">
        <div>
          <Badge variant="emerald">Physical Emergency Rooms</Badge>
          <h2 className="font-heading text-xl font-bold text-sandigan-navy dark:text-white mt-1">
            Hospital Psychiatric Emergency Facilities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For acute physical medical emergencies, ingestion/overdose, or when an immediate physical hospital setting is necessary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyHospitals.map((hosp) => (
            <Card key={hosp.name} className="space-y-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{hosp.name}</CardTitle>
                <CardDescription className="text-xs">{hosp.notes}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs pt-0">
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-sandigan-teal shrink-0 mt-0.5" />
                  <span>{hosp.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <PhoneCall className="w-3.5 h-3.5 text-sandigan-gold shrink-0" />
                  <span>{hosp.contact}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Safety Plan Link Callout */}
      <div className="rounded-2xl border border-sandigan-navy-200 bg-sandigan-navy-50/60 p-6 dark:border-sandigan-navy-800 dark:bg-sandigan-navy-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
            Want to Prepare a Personal Safety Plan for Future Moments?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
            A Safety Plan helps you document personal warning signs, internal coping strategies, and trusted contacts before a crisis occurs.
          </p>
        </div>
        <Link href="/services/safety-plan">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Open Safety Plan Tool
          </Button>
        </Link>
      </div>

      {/* Safeguarding Legal & Technical Boundaries */}
      <Alert variant="info" title="Zero-Barrier Safeguarding Commitment">
        <p className="text-xs leading-relaxed">
          This emergency page requires no user registration, no password, no email, and no AI interaction. If you are browsing on a shared device, please use Incognito mode and remember that Quick Exit redirects to Google but does not erase browsing history.
        </p>
      </Alert>
    </div>
  );
}
