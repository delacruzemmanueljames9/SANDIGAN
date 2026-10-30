import { AI_OFFICERS, type AIOfficerProfile } from "@/config/officers";
import type { TaskPriority, TaskStatus } from "@/types";

export type OfficerId =
  | "amara-orchestrator"
  | "tala-moderator"
  | "gabay-crisis"
  | "siklab-analyst"
  | "dunong-librarian"
  | "kawing-referrals"
  | "sinag-companion";

export type OfficerName = "AMARA" | "TALA" | "GABAY" | "SIKLAB" | "DUNONG" | "KAWING" | "SINAG";

export interface OfficerTaskDefinition {
  taskType: string;
  assignedOfficer: OfficerName;
  priority: TaskPriority;
  requiresFounderApproval: boolean;
  description: string;
}

export const OFFICER_TASK_REGISTRY: Record<string, OfficerTaskDefinition> = {
  // AMARA Tasks
  "system_health_audit": {
    taskType: "system_health_audit",
    assignedOfficer: "AMARA",
    priority: "normal",
    requiresFounderApproval: false,
    description: "Audit operational status and error rates across all 7 AI Officers",
  },
  "route_inter_officer_message": {
    taskType: "route_inter_officer_message",
    assignedOfficer: "AMARA",
    priority: "high",
    requiresFounderApproval: false,
    description: "Route coordination message between officers",
  },
  "request_founder_action": {
    taskType: "request_founder_action",
    assignedOfficer: "AMARA",
    priority: "critical",
    requiresFounderApproval: true,
    description: "Submit consequential action for human founder authorization",
  },

  // TALA Tasks
  "moderate_community_content": {
    taskType: "moderate_community_content",
    assignedOfficer: "TALA",
    priority: "high",
    requiresFounderApproval: false,
    description: "Scan community posts/comments for toxicity, hate speech, PII, and distress signals",
  },
  "propose_user_sanction": {
    taskType: "propose_user_sanction",
    assignedOfficer: "TALA",
    priority: "high",
    requiresFounderApproval: true,
    description: "Escalate repeated abusive conduct for founder ban or suspension",
  },

  // GABAY Tasks
  "evaluate_crisis_signals": {
    taskType: "evaluate_crisis_signals",
    assignedOfficer: "GABAY",
    priority: "critical",
    requiresFounderApproval: false,
    description: "Zero-latency evaluation of distress text and immediate emergency hotline payload generation",
  },
  "log_safeguarding_incident": {
    taskType: "log_safeguarding_incident",
    assignedOfficer: "GABAY",
    priority: "critical",
    requiresFounderApproval: false,
    description: "Record crisis event into restricted safeguarding log",
  },

  // SIKLAB Tasks
  "analyze_wellness_assessment": {
    taskType: "analyze_wellness_assessment",
    assignedOfficer: "SIKLAB",
    priority: "normal",
    requiresFounderApproval: false,
    description: "Calculate 4-domain scores and generate compassionate non-diagnostic reflection",
  },

  // DUNONG Tasks
  "query_psychoeducation": {
    taskType: "query_psychoeducation",
    assignedOfficer: "DUNONG",
    priority: "normal",
    requiresFounderApproval: false,
    description: "Synthesize mental health research with authentic institutional citations",
  },
  "verify_citation_integrity": {
    taskType: "verify_citation_integrity",
    assignedOfficer: "DUNONG",
    priority: "low",
    requiresFounderApproval: false,
    description: "Check publication authenticity against WHO, APA, and DOH Philippines standards",
  },

  // KAWING Tasks
  "verify_provider_listing": {
    taskType: "verify_provider_listing",
    assignedOfficer: "KAWING",
    priority: "normal",
    requiresFounderApproval: true,
    description: "Audit support provider credentials and propose verified status change",
  },
  "package_referral_intake": {
    taskType: "package_referral_intake",
    assignedOfficer: "KAWING",
    priority: "high",
    requiresFounderApproval: false,
    description: "Format consent-verified referral intake package for partner coordination",
  },

  // SINAG Tasks
  "generate_daily_companion_package": {
    taskType: "generate_daily_companion_package",
    assignedOfficer: "SINAG",
    priority: "normal",
    requiresFounderApproval: false,
    description: "Generate culturally grounded daily quote, reflection prompt, and micro-action",
  },
  "conversational_companionship": {
    taskType: "conversational_companionship",
    assignedOfficer: "SINAG",
    priority: "normal",
    requiresFounderApproval: false,
    description: "Deliver active-listening, de-escalating companion dialogue in Talk to Tinig",
  },
};

/**
 * Checks if a requested officer action requires human founder approval.
 */
export function requiresFounderApproval(taskType: string, riskLevel?: string): boolean {
  if (riskLevel === "critical" || riskLevel === "high") {
    // Critical system mutations require human-in-the-loop
    const def = OFFICER_TASK_REGISTRY[taskType];
    return def ? def.requiresFounderApproval : true;
  }
  const def = OFFICER_TASK_REGISTRY[taskType];
  return def ? def.requiresFounderApproval : false;
}

/**
 * Default fallback responses when Gemini is unavailable or rate limited.
 */
export const OFFICER_FALLBACKS: Record<OfficerName, string> = {
  AMARA:
    "AMARA Operational Notice: Subsystem telemetry is active. All non-critical background dispatches are queued securely in the database.",
  TALA:
    "TALA Safeguarding Notice: Content has been received and safely stored. Automated moderation is queued for review.",
  GABAY:
    "GABAY Emergency Notice: If you are in crisis, help is available immediately. Call NCMH 1553 (24/7 toll-free), Hopeline 2919, or In Touch 02-8893-7603.",
  SIKLAB:
    "SIKLAB Notice: Your check-in responses have been saved. Take a moment to acknowledge your self-awareness today. Remember: you are doing your best.",
  DUNONG:
    "DUNONG Knowledge Base: For verified mental health guidance in the Philippines, consult the DOH Mental Health Portal or WHO Mental Health guidelines.",
  KAWING:
    "KAWING Coordination Notice: Your referral details have been securely recorded. Our team will coordinate with verified support partners.",
  SINAG:
    "SINAG Companionship: Kumusta? I am here with you. Take a deep, gentle breath. What's on your mind right now?",
};
