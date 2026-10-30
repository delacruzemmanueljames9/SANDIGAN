export interface ServiceDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  iconName: string;
  badge?: string;
  officerLead: string;
}

export interface NavItem {
  label: string;
  labelTl?: string;
  href: string;
  isExternal?: boolean;
  highlight?: boolean;
}

export const SITE_CONFIG = {
  name: "PROJECT SANDIGAN",
  shortName: "SANDIGAN",
  tagline: "You don't have to carry it alone.",
  taglineTl: "Hindi mo kailangang dalhin ito nang mag-isa.",
  founder: "Emmanuel James C. Dela Cruz",
  organization: "Project Sandigan Initiative",
  description:
    "An independent, youth-centered mental health and community support ecosystem designed to make mental health information, emotional wellness resources, and pathways to support accessible, safe, and compassionate.",
  emergency: {
    primaryNumber: "1553",
    label: "National Center for Mental Health (NCMH) Crisis Hotline",
    available: "24/7 Toll-free nationwide",
    secondaryNumber: "0917-899-8727",
    inTouchNumber: "02-8893-7603 / 0917-800-1123",
  },
  links: {
    github: "https://github.com/delacruzemmanueljames9/SANDIGAN",
    contactEmail: "support@sandigan.org.ph",
  },
  navItems: [
    { label: "Home", labelTl: "Tahanan", href: "/" },
    { label: "About", labelTl: "Tungkol", href: "/about" },
    { label: "Services", labelTl: "Mga Serbisyo", href: "/services" },
    { label: "Find Support", labelTl: "Maghanap ng Suporta", href: "/find-support" },
    { label: "Mind Library", labelTl: "Mind Library", href: "/mind-library" },
    { label: "Community", labelTl: "Komunidad", href: "/community" },
    { label: "Get Help Now", labelTl: "Humingi ng Saklolo", href: "/get-help-now", highlight: true },
  ] as NavItem[],
  footerLegal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Accessibility Statement", href: "/accessibility" },
    { label: "Mission & Vision", href: "/mission-vision" },
    { label: "Our Approach", href: "/our-approach" },
    { label: "News & Updates", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    {
      id: "talk-to-tinig",
      name: "Talk to Tinig",
      tagline: "Compassionate, nonjudgmental conversational support",
      description: "A private, context-aware AI conversation experience with strict safety boundaries and zero clinical diagnosis.",
      href: "/services/talk",
      iconName: "MessageSquareHeart",
      badge: "AI Supported",
      officerLead: "GABAY & SINAG",
    },
    {
      id: "wellness-check",
      name: "Wellness Check",
      tagline: "Reflective, non-diagnostic wellness assessment",
      description: "Structured self-reflection tracking sleep, energy, and stress patterns without medical scores or pathology labels.",
      href: "/services/wellness-check",
      iconName: "Sparkles",
      badge: "Non-Diagnostic",
      officerLead: "SIKLAB",
    },
    {
      id: "get-help-now",
      name: "Get Help Now",
      tagline: "Immediate crisis and emergency resources",
      description: "Direct, instant access to verified Philippine hotlines and emergency protocols without mandatory login or chatbot gates.",
      href: "/get-help-now",
      iconName: "ShieldAlert",
      badge: "24/7 Crisis Access",
      officerLead: "GABAY",
    },
    {
      id: "safety-plan",
      name: "Safety Plan",
      tagline: "Private, step-by-step personal crisis roadmap",
      description: "Identify personal warning signs, coping mechanisms, trusted friends, and emergency contacts in an encrypted, exportable plan.",
      href: "/services/safety-plan",
      iconName: "FileHeart",
      officerLead: "GABAY",
    },
    {
      id: "reset-room",
      name: "Reset Room",
      tagline: "Guided space for immediate sensory groundings",
      description: "Interactive 4-7-8 and box breathing animations, 5-4-3-2-1 sensory grounding, and peaceful audio-visual resets.",
      href: "/services/reset-room",
      iconName: "Wind",
      officerLead: "SINAG",
    },
    {
      id: "inner-garden",
      name: "Inner Garden",
      tagline: "Private reflection and personal journaling sanctuary",
      description: "Encrypted, private-by-default journal entries with emotion tracking, gratitude prompts, and safe personal export.",
      href: "/services/inner-garden",
      iconName: "BookHeart",
      officerLead: "SINAG",
    },
    {
      id: "find-support",
      name: "Find Support Directory",
      tagline: "Verified Philippine mental health resource directory",
      description: "Filter verified clinic, hospital, crisis hotline, and NGO contacts across Luzon, Visayas, Mindanao, and National coverage.",
      href: "/find-support",
      iconName: "MapPin",
      officerLead: "KAWING",
    },
    {
      id: "mind-library",
      name: "Mind Library",
      tagline: "Psychoeducational resources and evidence-informed guides",
      description: "Peer-reviewed guides on anxiety, burnout, sleep hygiene, emotional regulation, and student wellness with full citations.",
      href: "/mind-library",
      iconName: "BookText",
      officerLead: "DUNONG",
    },
    {
      id: "sleep-wellness",
      name: "Sleep & Relaxation",
      tagline: "Gentle bedtime routines and sleep habit architecture",
      description: "Nighttime wind-down audio guides, sleep environment checklists, and habit reflection without pharmaceutical claims.",
      href: "/services/sleep",
      iconName: "Moon",
      officerLead: "SINAG",
    },
    {
      id: "daily-companion",
      name: "Daily Companion",
      tagline: "Gentle daily check-ins and encouraging anchors",
      description: "Daily affirmation cards, morning micro-intentions, and evening reflection to anchor your routine gently.",
      href: "/services/daily-companion",
      iconName: "Sun",
      officerLead: "SINAG",
    },
    {
      id: "growth-journey",
      name: "Growth Journey",
      tagline: "Personal wellness progress and habit milestones",
      description: "Celebrate small victories, streaks of self-compassion, and personal wellness goals at your own pace.",
      href: "/services/growth-journey",
      iconName: "TrendingUp",
      officerLead: "SINAG",
    },
    {
      id: "safe-community",
      name: "Safe Community",
      tagline: "Compassionate, actively moderated peer sharing",
      description: "Share anonymous thoughts, read stories of hope, and receive empathetic comments with real-time safety moderation.",
      href: "/community",
      iconName: "Users",
      officerLead: "TALA",
    },
    {
      id: "voice-of-community",
      name: "Voice of Community",
      tagline: "Community feedback, suggestions, and youth representation",
      description: "Transparent suggestions box where user voices guide ecosystem improvements and policy governance directly.",
      href: "/services/voice-of-community",
      iconName: "Megaphone",
      officerLead: "TALA",
    },
    {
      id: "professional-referrals",
      name: "Professional Help Connection",
      tagline: "Human-reviewed referral bridge to licensed practitioners",
      description: "Explicit, consent-first referral intake reviewed by authorized safeguarding personnel before connecting with verified partners.",
      href: "/services/professional-connection",
      iconName: "HeartHandshake",
      officerLead: "KAWING",
    },
  ] as ServiceDefinition[],
};
