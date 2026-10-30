"use client";

import * as React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  MessageSquareHeart,
  Sparkles,
  ShieldAlert,
  FileHeart,
  Wind,
  BookHeart,
  MapPin,
  BookText,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Heart,
  Lock,
  Eye,
  CheckCircle2,
  Users,
  Compass,
  Activity,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const [lang, setLang] = React.useState<"en" | "tl">("en");

  React.useEffect(() => {
    const saved = localStorage.getItem("sandigan-lang") as "en" | "tl" | null;
    if (saved) setLang(saved);

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<"en" | "tl">;
      if (customEvent.detail) setLang(customEvent.detail);
    };

    window.addEventListener("sandigan-lang-change", handleLangChange);
    return () => window.removeEventListener("sandigan-lang-change", handleLangChange);
  }, []);

  const content = {
    en: {
      badge: "Independent, Youth-Centered Digital Mental Health Ecosystem",
      tagline: "“You don't have to carry it alone.”",
      subtagline: "Hindi mo kailangang dalhin ito nang mag-isa.",
      description:
        "PROJECT SANDIGAN bridges technology, psychoeducation, and human-centered safeguarding to create a compassionate digital sanctuary for every Filipino youth.",
      exploreServices: "Explore 14 Core Services",
      urgentHelp: "Get Urgent Help (24/7)",
      lifelineLabel: "Immediate Crisis Lifeline (NCMH)",
      lifelineDesc: "Free, confidential, and toll-free nationwide.",
      corePrinciplesBadge: "Core Architecture",
      corePrinciplesTitle: "Grounded in Safety and Compassion",
      corePrinciplesSubtitle: "SANDIGAN is built on strict ethical principles to protect your emotional well-being and privacy.",
      pathwaysBadge: "Integrated Support Ecosystem",
      pathwaysTitle: "Essential Pathways to Support",
      pathwaysSubtitle: "Each service is thoughtfully engineered for privacy, genuine utility, and accessibility.",
      viewAll: "View All 14 Services",
      ethicalTitle: "Our Ethical Commitment to You",
      ethicalDesc:
        "PROJECT SANDIGAN is an educational and supportive platform. It does not replace licensed medical practitioners, psychiatrists, or clinical psychologists. Our AI officers (AMARA, TALA, GABAY, SIKLAB, DUNONG, KAWING, SINAG) strictly adhere to non-diagnostic boundaries. If you require medical evaluation, we facilitate verified pathways to accredited Philippine clinics and professionals.",
    },
    tl: {
      badge: "Malaya at Para sa Kabataan na Digital Mental Health Ecosystem",
      tagline: "“Hindi mo kailangang dalhin ito nang mag-isa.”",
      subtagline: "May mga taong handang makinig at umalalay sa bawat hakbang.",
      description:
        "Pinag-uugnay ng PROJECT SANDIGAN ang teknolohiya, edukasyon sa kalusugang pangkaisipan, at tunay na malasakit upang lumikha ng ligtas at mapagkalingang kanlungan para sa bawat kabataang Pilipino.",
      exploreServices: "Tingnan ang 14 Serbisyo",
      urgentHelp: "Humingi ng Saklolo (24/7)",
      lifelineLabel: "Pambansang Hotline sa Krisis (NCMH)",
      lifelineDesc: "Libre, lihim, at walang bayad tawagan saanman sa bansa.",
      corePrinciplesBadge: "Saligang Arkitektura",
      corePrinciplesTitle: "Nakatindig sa Kaligtasan at Malasakit",
      corePrinciplesSubtitle: "Itinayo ang SANDIGAN sa mahigpit na prinsipyong etikal upang pangalagaan ang iyong kapakanan at pribasiya.",
      pathwaysBadge: "Ecosystem ng Suporta",
      pathwaysTitle: "Mga Daan Tungo sa Kalinga",
      pathwaysSubtitle: "Bawat serbisyo ay maingat na binuo para sa pribasiya, tunay na kapakinabangan, at madaling pag-access.",
      viewAll: "Tingnan ang Lahat ng 14 Serbisyo",
      ethicalTitle: "Ang Aming Etikal na Pangako sa Iyo",
      ethicalDesc:
        "Ang PROJECT SANDIGAN ay isang platapormang pang-edukasyon at pangkalinga. Hindi nito pinapalitan ang mga lisensyadong doktor, psychiatrist, o psychologist. Ang aming AI officers ay sumusunod sa mahigpit na patakarang hindi magbigay ng medikal na diagnosis. Kung kailangan mo ng propesyonal na gamutan, inihahatid ka namin sa mga beripikadong klinika at espesyalista sa Pilipinas.",
    },
  };

  const t = content[lang];

  const corePrinciples = [
    { title: "Compassion Before Automation", desc: "Technology should uplift human dignity, never replace genuine empathy.", icon: Heart },
    { title: "Privacy By Design", desc: "Private reflections and personal journal notes remain strictly yours by default.", icon: Lock },
    { title: "Human Accountability", desc: "AI assists with structure and resources, while licensed humans maintain oversight.", icon: Eye },
    { title: "Safety-First Architecture", desc: "Zero-latency crisis pathways instantly accessible without chatbots or login walls.", icon: ShieldCheck },
  ];

  const featuredServices = [
    {
      title: "Talk to Tinig",
      tagline: "Compassionate AI-assisted conversation",
      desc: "Reflect in a safe, nonjudgmental space with strict safety boundaries and zero clinical diagnosis.",
      href: "/services/talk",
      icon: MessageSquareHeart,
      badge: "Supportive AI",
    },
    {
      title: "Wellness Check",
      tagline: "Non-diagnostic self-reflection",
      desc: "Track sleep, stress, and emotional rhythms through respectful check-ins without pathologizing labels.",
      href: "/services/wellness-check",
      icon: Sparkles,
      badge: "Self-Reflection",
    },
    {
      title: "Reset Room",
      tagline: "Guided sensory groundings",
      desc: "Interactive 4-7-8 and box breathing animations, 5-4-3-2-1 sensory resets, and calm auditory breaks.",
      href: "/services/reset-room",
      icon: Wind,
      badge: "Immediate Calm",
    },
    {
      title: "Safety Plan Tool",
      tagline: "Personal crisis preparation roadmap",
      desc: "Identify your personal warning signs, coping mechanisms, and trusted emergency contacts securely.",
      href: "/services/safety-plan",
      icon: FileHeart,
      badge: "Crisis Preparedness",
    },
    {
      title: "Inner Garden",
      tagline: "Private journaling sanctuary",
      desc: "Private-by-default personal journaling with mood tagging, gratitude prompts, and safe local export.",
      href: "/services/inner-garden",
      icon: BookHeart,
      badge: "Private Sanctuary",
    },
    {
      title: "Find Support Directory",
      tagline: "Verified Philippine mental health resources",
      desc: "Directory of verified hotlines, clinics, hospitals, and NGOs across Luzon, Visayas, and Mindanao.",
      href: "/find-support",
      icon: MapPin,
      badge: "Verified Directory",
    },
  ];

  return (
    <div className="flex flex-col space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-28 pb-12">
        {/* Subtle ambient gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sandigan-teal-50/40 via-sandigan-gold-50/20 to-transparent dark:from-sandigan-navy-900/60 dark:via-sandigan-navy-950/20 dark:to-transparent -z-10 pointer-events-none blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-sandigan-navy-50 text-sandigan-navy-800 dark:bg-sandigan-navy-800/80 dark:text-sandigan-gold border border-sandigan-navy-100 dark:border-sandigan-navy-700 text-xs sm:text-sm font-medium shadow-soft-sm">
            <Sparkles className="w-4 h-4 text-sandigan-gold" />
            <span>{t.badge}</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-sandigan-navy dark:text-white tracking-tight leading-[1.15]">
              {t.tagline}
            </h1>
            <p className="font-heading text-xl sm:text-2xl text-sandigan-teal dark:text-sandigan-teal-300 font-medium">
              {t.subtagline}
            </p>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
              {t.description}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/services">
              <Button size="lg" variant="teal" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t.exploreServices}
              </Button>
            </Link>
            <Link href="/get-help-now">
              <Button
                size="lg"
                variant="danger"
                className="bg-rose-600 hover:bg-rose-700 shadow-md font-semibold"
                leftIcon={<ShieldAlert className="w-5 h-5" />}
              >
                {t.urgentHelp}
              </Button>
            </Link>
          </div>

          {/* Quick Helpline Strip */}
          <div className="pt-8 max-w-xl mx-auto">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 dark:border-rose-900/60 dark:bg-rose-950/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                    {t.lifelineLabel}
                  </p>
                  <p className="text-xs text-rose-700 dark:text-rose-400">
                    {t.lifelineDesc}
                  </p>
                </div>
              </div>
              <a
                href="tel:1553"
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shrink-0 transition-colors shadow-sm"
              >
                Dial 1553
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="navy">{t.corePrinciplesBadge}</Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white">
            {t.corePrinciplesTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.corePrinciplesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {corePrinciples.map((principle) => {
            const Icon = principle.icon;
            return (
              <Card key={principle.title} className="hover:border-sandigan-teal/50 transition-colors">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 dark:text-sandigan-teal-300 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base">{principle.title}</CardTitle>
                  <CardDescription className="text-xs">{principle.desc}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-xl">
            <Badge variant="teal">{t.pathwaysBadge}</Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-sandigan-navy dark:text-white">
              {t.pathwaysTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.pathwaysSubtitle}
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              {t.viewAll}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <Card key={svc.title} className="flex flex-col justify-between hover:shadow-soft-md transition-shadow group">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sandigan-navy-50 text-sandigan-navy dark:bg-sandigan-navy-800 dark:text-sandigan-gold flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="neutral">{svc.badge}</Badge>
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-sandigan-teal transition-colors">
                      {svc.title}
                    </CardTitle>
                    <p className="text-xs font-medium text-sandigan-teal dark:text-sandigan-teal-300 mt-0.5">
                      {svc.tagline}
                    </p>
                  </div>
                  <CardDescription className="text-xs pt-1">{svc.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <Link href={svc.href} className="inline-flex items-center gap-1.5 text-xs font-semibold text-sandigan-teal hover:text-sandigan-teal-600 transition-colors">
                    <span>Enter Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Non-Clinical Ethical Disclaimer Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-sandigan-border-dark dark:bg-sandigan-surface-cardDark">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-sandigan-emerald-50 text-sandigan-emerald dark:bg-sandigan-emerald-950/60 dark:text-sandigan-emerald-300 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-sm text-sandigan-navy dark:text-white">
                {t.ethicalTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.ethicalDesc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
