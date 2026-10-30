// =====================================================================
// PROJECT SANDIGAN — TYPE DEFINITIONS
// An Official Project of Tinig KaBataan (TK)
// Tagline: "You don't have to carry it alone."
// Founder & Developer: Emmanuel James C. Dela Cruz
// =====================================================================

export type SandiganTheme = 'auto' | 'light' | 'dark';
export type SandiganLanguage = 'en' | 'fil' | 'taglish';
export type SupportMode = 'listening' | 'guidance';
export type CommunicationTone = 'gentle' | 'friendly' | 'direct' | 'encouraging';

export interface AnonymousSession {
  anonymousId: string; // e.g. "SAN-001248"
  createdAt: string;
  lastActiveAt: string;
  preferredName?: string;
  preferredTone: CommunicationTone;
  preferredLanguage: SandiganLanguage;
  consentHistory: boolean;
  consentAiTraining: boolean;
}

// 7 AI Officers
export type AIOfficerId =
  | 'amara'
  | 'tala'
  | 'gabay'
  | 'siklab'
  | 'dunong'
  | 'kawing'
  | 'sinag';

export interface AIOfficer {
  id: AIOfficerId;
  name: string;
  role: string;
  department: string;
  avatar: string;
  color: string;
  personality: string;
  responsibilities: string[];
  activeTasksCount: number;
  completedTasksCount: number;
  status: 'active' | 'in_conference' | 'delegating' | 'monitoring';
  biography: string;
}

// Task Center & Decision Levels
export type DecisionLevel = 1 | 2 | 3;
// Level 1: Routine decisions within assigned permissions
// Level 2: AMARA coordination and approval for cross-department tasks
// Level 3: Founder approval for sensitive decisions, major policy, finances, partnerships

export interface AIOfficerTask {
  id: string;
  title: string;
  description: string;
  officerId: AIOfficerId;
  assignedBy: 'Founder' | 'AMARA';
  decisionLevel: DecisionLevel;
  status: 'pending' | 'in_progress' | 'awaiting_founder_review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  outcomeNotes?: string;
}

// Safety Plan (Section 6)
export interface MySafetyPlan {
  id: string;
  anonymousId: string;
  warningSigns: string[];
  copingStrategies: string[];
  trustedContacts: { name: string; relationship: string; phone: string }[];
  safePlaces: string[];
  emergencySteps: string[];
  lastUpdated: string;
}

// Mental Wellness Check (Section 2 & 3)
export interface WellnessQuestion {
  id: number;
  questionEn: string;
  questionFil: string;
  questionTaglish: string;
  category: 'mood' | 'anxiety' | 'sleep' | 'social' | 'academic' | 'burnout' | 'hope';
}

export interface WellnessCheckResult {
  score: number; // 0 - 21
  severity: 'mild' | 'moderate' | 'elevated' | 'high';
  summaryEn: string;
  summaryFil: string;
  recommendedPathways: string[];
  assessedByOfficer: 'SIKLAB';
  date: string;
}

// Professional Referral (Section 7 - Bataan Priority)
export interface BataanServiceResource {
  id: string;
  name: string;
  location: string; // e.g. "Balanga City, Bataan", "Mariveles, Bataan"
  type: 'Government Hospital' | 'Psychiatric Center' | 'City Health Office' | 'Crisis Support';
  phone: string;
  mobile?: string;
  email?: string;
  operatingHours: string;
  services: string[];
  isVerified: boolean;
  priorityRegion: 'Bataan' | 'Central Luzon' | 'National';
}

export interface ReferralRequest {
  id: string;
  anonymousId: string;
  facilityId: string;
  facilityName: string;
  userConcernSummary: string;
  status: 'draft' | 'pending_user_consent' | 'transmitted' | 'acknowledged';
  createdAt: string;
  transmittedAt?: string;
  notes?: string;
}

// Founder Conference Room (Section 11)
export interface ConferenceMessage {
  id: string;
  sender: 'Founder' | AIOfficerId;
  senderName: string;
  content: string;
  timestamp: string;
  isActionItem?: boolean;
}

export interface ConferenceMeeting {
  id: string;
  title: string;
  date: string;
  attendees: (AIOfficerId | 'Founder')[];
  agenda: string;
  minutesSummary: string;
  actionItems: { id: string; task: string; assignedTo: AIOfficerId; status: 'open' | 'done' }[];
  status: 'in_session' | 'adjourned';
}

// Founder Report (Section 12 - 5PM / 7PM PHT)
export interface FounderReport {
  id: string;
  type: '5PM_Partial' | '7PM_Final';
  date: string;
  totalSessionsToday: number;
  urgentFlagsCount: number;
  activeReferralsCount: number;
  officerTasksSummary: { officer: string; completed: number; active: number }[];
  systemHealthStatus: 'Healthy' | 'Needs Attention';
  highlights: string[];
  sentTo: {
    email: string;
    whatsapp: string;
  };
}
