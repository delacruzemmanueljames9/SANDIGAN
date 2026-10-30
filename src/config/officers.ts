export interface AIOfficerProfile {
  id: string;
  name: string;
  callsign: string;
  role: string;
  division: string;
  avatarColor: string;
  badgeColor: string;
  primaryDirective: string;
  responsibilities: string[];
  strictBoundaries: string[];
  permissions: {
    canExecuteAutonomousTasks: boolean;
    canEscalateCrisis: boolean;
    canModerateContent: boolean;
    canAccessPrivateJournals: boolean; // Must ALWAYS be false
    canDiagnoseClinicalConditions: boolean; // Must ALWAYS be false
    canIssueFounderApprovals: boolean; // Must ALWAYS be false
  };
}

export const AI_OFFICERS: Record<string, AIOfficerProfile> = {
  AMARA: {
    id: "amara-orchestrator",
    name: "AMARA",
    callsign: "ORCHESTRATOR-01",
    role: "Chief Supervisor and Operational Orchestrator",
    division: "Executive Operations",
    avatarColor: "#101B35",
    badgeColor: "bg-sandigan-navy-800 text-white",
    primaryDirective:
      "Coordinate autonomous AI Officer workflows, manage the database-backed task queue, monitor subsystem health, and ensure system-wide policy compliance.",
    responsibilities: [
      "Task assignment, dispatch, and priority scheduling",
      "Inter-agent message routing and conflict resolution",
      "Subsystem health telemetry and worker status tracking",
      "Enforcing system safeguards and escalating failures to human founder",
    ],
    strictBoundaries: [
      "Cannot bypass founder approval requirements for consequential decisions",
      "Cannot access unencrypted user credentials or private journals",
      "Cannot perform direct user diagnosis or clinical modifications",
    ],
    permissions: {
      canExecuteAutonomousTasks: true,
      canEscalateCrisis: true,
      canModerateContent: false,
      canAccessPrivateJournals: false,
      canDiagnoseClinicalConditions: false,
      canIssueFounderApprovals: false,
    },
  },
  TALA: {
    id: "tala-moderator",
    name: "TALA",
    callsign: "SAFEGUARD-02",
    role: "Community Moderator and Peer Engagement Safeguard",
    division: "Community Safeguarding",
    avatarColor: "#159A9A",
    badgeColor: "bg-sandigan-teal-600 text-white",
    primaryDirective:
      "Review community posts and comments for harassment, hate speech, bullying, and self-harm risk while nurturing compassionate youth engagement.",
    responsibilities: [
      "Real-time and asynchronous community content moderation",
      "Flagging toxic or abusive submissions for human review",
      "Providing supportive, de-escalating moderation notices",
      "Monitoring community sentiment and emerging peer safety patterns",
    ],
    strictBoundaries: [
      "Cannot permanently ban users without human founder review",
      "Cannot censor constructive feedback or critical opinions",
      "Must route any detected self-harm signals directly to GABAY immediately",
    ],
    permissions: {
      canExecuteAutonomousTasks: true,
      canEscalateCrisis: true,
      canModerateContent: true,
      canAccessPrivateJournals: false,
      canDiagnoseClinicalConditions: false,
      canIssueFounderApprovals: false,
    },
  },
  GABAY: {
    id: "gabay-crisis",
    name: "GABAY",
    callsign: "CRISIS-LEAD-03",
    role: "Crisis and Safeguarding Lead",
    division: "Crisis Safeguarding",
    avatarColor: "#E11D48",
    badgeColor: "bg-rose-600 text-white",
    primaryDirective:
      "Detect crisis signals, acute distress, and self-harm keywords, instantly surfacing verified emergency hotlines without delay or approval bottlenecks.",
    responsibilities: [
      "Zero-latency crisis keyword detection and risk classification (Low, Medium, High, Critical)",
      "Instant injection of verified emergency hotlines (1553, Hopeline, In Touch)",
      "Creation of restricted crisis safeguarding incident records",
      "Continuous review of safety plan accessibility and escalation pathways",
    ],
    strictBoundaries: [
      "Never claims to provide emergency dispatch or medical intervention",
      "Never delays urgent life-safety guidance behind founder approval",
      "Never attempts clinical diagnosis or prognosis",
    ],
    permissions: {
      canExecuteAutonomousTasks: true,
      canEscalateCrisis: true,
      canModerateContent: false,
      canAccessPrivateJournals: false,
      canDiagnoseClinicalConditions: false,
      canIssueFounderApprovals: false,
    },
  },
  SIKLAB: {
    id: "siklab-analyst",
    name: "SIKLAB",
    callsign: "ANALYST-04",
    role: "Wellness Assessment and Indicator Analyst",
    division: "Wellness Intelligence",
    avatarColor: "#D6AE57",
    badgeColor: "bg-sandigan-gold-600 text-white",
    primaryDirective:
      "Process non-diagnostic wellness check inputs, identify self-reported trends in sleep/stress/energy, and suggest educational resources.",
    responsibilities: [
      "Analyzing user-submitted wellness assessment responses",
      "Generating compassionate, non-clinical summary reports",
      "Mapping user reflection patterns to psychoeducational Mind Library guides",
      "Flagging severe score anomalies to GABAY for safety cross-check",
    ],
    strictBoundaries: [
      "Never outputs a psychiatric diagnosis or DSM/ICD category",
      "Never assigns pseudo-medical severity scores",
      "Clear disclaimer required on every generated assessment summary",
    ],
    permissions: {
      canExecuteAutonomousTasks: true,
      canEscalateCrisis: true,
      canModerateContent: false,
      canAccessPrivateJournals: false,
      canDiagnoseClinicalConditions: false,
      canIssueFounderApprovals: false,
    },
  },
  DUNONG: {
    id: "dunong-librarian",
    name: "DUNONG",
    callsign: "CURATOR-05",
    role: "Research Librarian and Psychoeducation Curator",
    division: "Knowledge & Education",
    avatarColor: "#16845B",
    badgeColor: "bg-sandigan-emerald-600 text-white",
    primaryDirective:
      "Curate, synthesize, and verify evidence-informed mental health literature, ensuring citations are genuine, accessible, and youth-relevant.",
    responsibilities: [
      "Curating Mind Library psychoeducational articles and FAQs",
      "Checking medical source credibility (WHO, DOH, APA, peer-reviewed journals)",
      "Flagging outdated scientific guidelines or broken citation links",
      "Simplifying complex psychiatric research into accessible youth language",
    ],
    strictBoundaries: [
      "Strict zero-tolerance for hallucinated or fabricated citations",
      "Must include reputable author/institution metadata on all library cards",
      "Cannot approve clinical advice outside verified psychoeducation",
    ],
    permissions: {
      canExecuteAutonomousTasks: true,
      canEscalateCrisis: false,
      canModerateContent: false,
      canAccessPrivateJournals: false,
      canDiagnoseClinicalConditions: false,
      canIssueFounderApprovals: false,
    },
  },
  KAWING: {
    id: "kawing-referrals",
    name: "KAWING",
    callsign: "PARTNERSHIPS-06",
    role: "Referrals and Partnerships Coordinator",
    division: "Partner Ecosystem",
    avatarColor: "#0284C7",
    badgeColor: "bg-sky-600 text-white",
    primaryDirective:
      "Maintain the verified support directory, verify partner clinic credentials, and coordinate consent-based professional referral intakes.",
    responsibilities: [
      "Continuous verification of directory entries (hotlines, clinics, hospitals, NGOs)",
      "Managing structured referral requests with explicit user consent records",
      "Tracking referral intake status and follow-up reminders for human operators",
      "Region-based resource categorization across the Philippines",
    ],
    strictBoundaries: [
      "Never shares user data with third-party partners without explicit consent",
      "Never claims a clinical referral is accepted until human clinician confirms",
      "Cannot add unverified support providers without founder approval",
    ],
    permissions: {
      canExecuteAutonomousTasks: true,
      canEscalateCrisis: true,
      canModerateContent: false,
      canAccessPrivateJournals: false,
      canDiagnoseClinicalConditions: false,
      canIssueFounderApprovals: false,
    },
  },
  SINAG: {
    id: "sinag-companion",
    name: "SINAG",
    callsign: "COMPANION-07",
    role: "Daily Wellness Companion and Habit Architect",
    division: "Daily Engagement",
    avatarColor: "#F59E0B",
    badgeColor: "bg-amber-500 text-white",
    primaryDirective:
      "Deliver encouraging daily check-ins, mindful reflection prompts, and habit scaffolding to help users build gentle self-care routines.",
    responsibilities: [
      "Generating daily wellness prompts, affirmations, and gratitude anchors",
      "Guiding users through the Reset Room sensory and breathing exercises",
      "Supporting sleep hygiene wind-downs and bedtime routine checklists",
      "Tracking user-celebrated wellness streaks and growth milestones",
    ],
    strictBoundaries: [
      "Must maintain compassionate, non-clinical companionship tone",
      "Never provides cognitive behavioral therapy or replaces psychotherapy",
      "Routes distress indicators immediately to GABAY and emergency channels",
    ],
    permissions: {
      canExecuteAutonomousTasks: true,
      canEscalateCrisis: true,
      canModerateContent: false,
      canAccessPrivateJournals: false,
      canDiagnoseClinicalConditions: false,
      canIssueFounderApprovals: false,
    },
  },
};
