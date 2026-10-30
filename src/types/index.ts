export type UserRole = "user" | "volunteer" | "moderator" | "counselor" | "founder" | "admin";

export interface Profile {
  id: string;
  email?: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  is_minor?: boolean;
  preferred_language: "en" | "tl" | "taglish";
  created_at: string;
  updated_at: string;
}

export interface UserConsent {
  id: string;
  user_id: string;
  consent_type: "terms" | "privacy" | "ai_terms" | "referral_data_sharing" | "analytics";
  granted: boolean;
  granted_at: string;
  ip_hash?: string;
  user_agent?: string;
}

export type CrisisRiskLevel = "none" | "low" | "medium" | "high" | "critical";

export interface CrisisSafeguardingLog {
  id: string;
  session_id?: string;
  user_id?: string;
  risk_level: CrisisRiskLevel;
  trigger_keywords: string[];
  officer_responder: string;
  escalation_pathway: "banner" | "modal" | "emergency_hotline" | "founder_alert";
  user_acknowledged: boolean;
  created_at: string;
}

export interface WellnessAssessment {
  id: string;
  user_id?: string;
  responses: Record<string, number | string>;
  category_scores: {
    sleep: number;
    stress: number;
    emotional_energy: number;
    social_connection: number;
  };
  overall_reflection: string;
  educational_recommendations: string[];
  created_at: string;
}

export interface SafetyPlan {
  id: string;
  user_id: string;
  warning_signs: string[];
  internal_coping_strategies: string[];
  distraction_places_people: string[];
  trusted_contacts: Array<{ name: string; phone?: string; relationship: string }>;
  professional_contacts: Array<{ name: string; phone: string; service_type: string }>;
  safe_environment_steps: string[];
  reasons_to_live: string[];
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: "calm" | "hopeful" | "anxious" | "exhausted" | "sad" | "grateful" | "neutral";
  tags: string[];
  is_encrypted?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id?: string;
  author_alias: string;
  title: string;
  content: string;
  category: "general" | "gratitude" | "struggles" | "hope" | "advice";
  is_anonymous: boolean;
  moderation_status: "pending" | "approved" | "flagged" | "rejected";
  moderation_flag_reason?: string;
  moderated_by_officer?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id?: string;
  author_alias: string;
  content: string;
  moderation_status: "pending" | "approved" | "flagged" | "rejected";
  created_at: string;
}

export interface SupportProvider {
  id: string;
  name: string;
  organization_type: "government" | "hospital" | "ngo" | "private_clinic" | "hotline" | "university";
  description: string;
  services_offered: string[];
  contact_phone: string;
  contact_email?: string;
  website_url?: string;
  physical_address?: string;
  region: "NCR" | "Luzon" | "Visayas" | "Mindanao" | "National";
  is_24_7: boolean;
  is_free_service: boolean;
  verification_status: "verified" | "pending_review" | "unverified";
  last_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralRequest {
  id: string;
  user_id: string;
  provider_id: string;
  preferred_contact_method: "phone" | "email";
  contact_value: string;
  intake_notes: string;
  consent_to_share_granted: boolean;
  status: "submitted" | "reviewed_by_safeguarding" | "routed_to_partner" | "partner_accepted" | "closed";
  safeguarding_notes?: string;
  created_at: string;
  updated_at: string;
}

export type TaskPriority = "critical" | "high" | "normal" | "low";
export type TaskStatus = "pending" | "in_progress" | "completed" | "failed" | "dead_letter" | "awaiting_approval";

export interface AITask {
  id: string;
  officer_id: string;
  task_type: string;
  payload: Record<string, unknown>;
  priority: TaskPriority;
  status: TaskStatus;
  max_attempts: number;
  current_attempts: number;
  requires_approval: boolean;
  approval_id?: string;
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
}

export interface AITaskAttempt {
  id: string;
  task_id: string;
  attempt_number: number;
  status: "success" | "failure";
  error_message?: string;
  execution_duration_ms: number;
  output_summary?: string;
  created_at: string;
}

export interface AIMessage {
  id: string;
  from_officer: string;
  to_officer: string;
  message_type: "task_handoff" | "crisis_alert" | "moderation_flag" | "coordination";
  subject: string;
  body: string;
  payload?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface FounderApproval {
  id: string;
  task_id?: string;
  officer_requesting: string;
  action_summary: string;
  risk_level: "low" | "medium" | "high" | "critical";
  action_payload: Record<string, unknown>;
  status: "pending" | "approved" | "rejected";
  decision_notes?: string;
  decided_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_hash?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ScheduledJob {
  id: string;
  name: string;
  cron_expression: string;
  handler: string;
  last_run_at?: string | null;
  next_run_at?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SystemEvent {
  id: string;
  event_type: string;
  event_level: "info" | "warn" | "error" | "critical";
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface StrategicReportData {
  platformUsage: {
    totalProfiles: number;
    totalCommunityPosts: number;
    totalCommunityComments: number;
    totalWellnessAssessments: number;
    totalSafetyPlans: number;
    totalJournalEntries: number;
    totalReferralRequests: number;
    totalSupportProviders: number;
  };
  moderation: {
    pending: number;
    approved: number;
    flagged: number;
    rejected: number;
    total: number;
  };
  referrals: {
    submitted: number;
    reviewed_by_safeguarding: number;
    routed_to_partner: number;
    partner_accepted: number;
    closed: number;
    total: number;
  };
  safeguarding: {
    totalIncidents: number;
    byRiskLevel: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
    unacknowledgedCount: number;
    pathways: {
      emergency_hotline: number;
      founder_alert: number;
      modal: number;
      banner: number;
    };
  };
  officerPerformance: Array<{
    officer_id: string;
    totalTasks: number;
    successfulAttempts: number;
    failedAttempts: number;
    avgDurationMs: number;
  }>;
  jobsSummary: {
    totalJobs: number;
    activeJobs: number;
    pausedJobs: number;
  };
  generatedAt: string;
}
