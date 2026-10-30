import { SupportMode, CommunicationTone, SandiganLanguage, AIOfficerId } from '@/types/sandigan';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface SandiganChatResponse {
  reply: string;
  isCrisis: boolean;
  activeMode: SupportMode;
  safeguardingOfficer: 'GABAY' | 'AMARA';
  suggestedActions?: { label: string; action: string; path?: string }[];
  urgentFlagDetails?: string;
  isAbuseSafeguard?: boolean;
}

const CRITICAL_CRISIS_KEYWORDS = [
  'kill myself',
  'suicide',
  'end my life',
  'end it all',
  'want to die',
  'better off dead',
  'cut myself',
  'self harm',
  'hang myself',
  'overdose',
  'magpakamatay',
  'ayaw ko na mabuhay',
  'gusto ko na mamatay',
  'saktan ang sarili',
  'tapusin na lahat',
];

const ABUSE_SAFEGUARD_KEYWORDS = [
  'rape',
  'abused',
  'molested',
  'binubugbog',
  'sinasaktan ako',
  'inabuso',
  'hinahipuan',
  'child exploitation',
  'domestic violence',
  'vawc',
];

// Fallback model list if primary encounters quota or format shifts
const PRIMARY_MODEL = 'models/gemini-3.8-flash';
const FALLBACK_MODEL = 'models/gemini-flash-latest';

export async function callGeminiApi(prompt: string, systemInstruction?: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 15 || apiKey === 'your-gemini-api-key-here') {
    return null;
  }

  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`;
      const payload: any = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (err) {
      console.warn(`Gemini inference with ${model} failed, trying next:`, err);
    }
  }
  return null;
}

export async function processSandiganChat(params: {
  message: string;
  mode: SupportMode;
  tone: CommunicationTone;
  language: SandiganLanguage;
  preferredName?: string;
  anonymousId: string;
  history?: { sender: string; text: string }[];
}): Promise<SandiganChatResponse> {
  const { message, mode, tone, language, preferredName, anonymousId } = params;
  const normalized = message.toLowerCase();

  // 1. Abuse & Minor Safeguarding Interception (RA 11930 / RA 9262)
  const isAbuseTriggered = ABUSE_SAFEGUARD_KEYWORDS.some(kw => normalized.includes(kw));
  if (isAbuseTriggered) {
    const greeting = preferredName ? `${preferredName}, ` : '';
    const abuseReply = `${greeting}Your safety is paramount. You deserve to be in a secure environment free from any form of violence, abuse, or exploitation.\n\n` +
      `If you are experiencing domestic violence, abuse, or exploitation, confidential Philippine government protection desks are available 24/7:\n\n` +
      `📞 **PNP Women and Children Protection Center (WCPC):** **(02) 8532-6690** or mobile **0919-777-7377**\n` +
      `📞 **DSWD Child Protection Hotline:** Dial **1343** (Nationwide) or **(02) 8931-8101**\n` +
      `📞 **Bataan Provincial Social Welfare and Development (PSWDO):** Balanga Capitol\n\n` +
      `You do not have to carry this alone. Would you like me to help you formulate a safe exit plan or connect with a verified support desk?`;

    return {
      reply: abuseReply,
      isCrisis: true,
      isAbuseSafeguard: true,
      activeMode: mode,
      safeguardingOfficer: 'GABAY',
      suggestedActions: [
        { label: 'Call PNP WCPC', action: 'call', path: 'tel:09197777377' },
        { label: 'Call DSWD 1343', action: 'call', path: 'tel:1343' },
        { label: 'Open My Safety Plan', action: 'navigate', path: '/sandigan/safety-plan' },
      ],
      urgentFlagDetails: 'Safeguarding protocol for minor/domestic safety triggered by GABAY.',
    };
  }

  // 2. GABAY Self-Harm & Suicide Crisis Screening Check
  const isCrisisTriggered = CRITICAL_CRISIS_KEYWORDS.some(kw => normalized.includes(kw));
  if (isCrisisTriggered) {
    const greeting = preferredName ? `${preferredName}, ` : '';
    const crisisReply = `${greeting}I hear how deeply heavy and painful things are for you right now, and I want to tell you: **You don't have to carry this alone.** 💙\n\n` +
      `Your life and your safety matter above all else. Because you deserve immediate care from real, licensed human professionals, please reach out right now:\n\n` +
      `📞 **Bataan Emergency:** Mariveles Mental Wellness and General Hospital (MMWGH) Crisis Desk: **(047) 935-4661** or **0968-854-3858**\n` +
      `📞 **National Center for Mental Health (NCMH):** Dial **1553** (Toll-Free Nationwide 24/7) or mobile **0917-899-8727**\n` +
      `📞 **Hopeline Philippines:** **0917-558-4673** or **(02) 8804-4673**\n\n` +
      `Would you like me to guide you through a gentle 3-minute grounding exercise while you connect, or help you open your private Safety Plan?`;

    // Record crisis safeguarding log in Supabase if server client available
    try {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        await supabase.from('crisis_safeguarding_logs').insert({
          anonymous_id: anonymousId || 'SAN-ANON',
          triage_level: 'critical',
          flag_reasons: ['self_harm_keyword_match'],
          resources_offered: ['NCMH 1553', 'MMWGH Crisis Desk', 'Safety Plan'],
        });
      }
    } catch (e) {
      console.warn('Could not record crisis log to Supabase:', e);
    }

    return {
      reply: crisisReply,
      isCrisis: true,
      activeMode: mode,
      safeguardingOfficer: 'GABAY',
      suggestedActions: [
        { label: 'Call NCMH 1553', action: 'call', path: 'tel:1553' },
        { label: 'Call MMWGH Bataan', action: 'call', path: 'tel:0479354661' },
        { label: 'Open My Safety Plan', action: 'navigate', path: '/sandigan/safety-plan' },
        { label: 'Reset Room Grounding', action: 'navigate', path: '/sandigan/reset-room' },
      ],
      urgentFlagDetails: 'Crisis escalation protocol triggered by GABAY. Hotlines presented immediately.',
    };
  }

  // 3. Live Generative Inference via Gemini Model
  const systemInstruction = `
You are "Talk to Tinig" under PROJECT SANDIGAN (An Official Project of Tinig KaBataan).
Founder & Developer: Emmanuel James C. Dela Cruz.
Tagline: "You don't have to carry it alone."

CORE ETHICAL BOUNDARIES & CLINICAL INTEGRITY:
- You are an empathetic digital companion, NOT a licensed doctor or psychiatrist.
- NEVER diagnose any condition or prescribe pharmaceutical treatments.
- User's Preferred Name: ${preferredName || 'Friend'}.
- Active Support Mode: ${
    mode === 'listening'
      ? 'LISTENING MODE (Validate emotions deeply, hold safe emotional space, do not offer advice unless asked)'
      : 'GUIDANCE MODE (Offer gentle coping techniques, structured reflections, and grounding micro-steps)'
  }.
- Preferred Tone: ${tone} (gentle, friendly, direct, or encouraging).
- Preferred Language Style: ${
    language === 'fil'
      ? 'Pure Filipino / Tagalog'
      : language === 'taglish'
      ? 'Warm, natural Taglish (Filipino-English blend spoken by Filipino youth)'
      : 'English'
  }.
- Bataan Priority: When physical clinics are relevant, prioritize verified Bataan institutions (Mariveles Mental Wellness and General Hospital and BGHMC Balanga).
- Keep responses warm, empathetic, and concise (under 150 words).
`;

  const conversationHistoryText = (params.history || [])
    .slice(-4)
    .map(h => `${h.sender}: ${h.text}`)
    .join('\n');

  const fullPrompt = `${conversationHistoryText ? `Recent Context:\n${conversationHistoryText}\n\n` : ''}User Message: "${message}"`;

  const geminiReply = await callGeminiApi(fullPrompt, systemInstruction);
  if (geminiReply) {
    return {
      reply: geminiReply,
      isCrisis: false,
      activeMode: mode,
      safeguardingOfficer: 'AMARA',
      suggestedActions: [
        { label: 'Reset Room', action: 'navigate', path: '/sandigan/reset-room' },
        { label: 'Inner Garden', action: 'navigate', path: '/sandigan/inner-garden' },
      ],
    };
  }

  // 4. Compassionate Rule-Based Fallback Engine (when offline)
  const namePrefix = preferredName ? `${preferredName}, ` : '';
  let fallbackText = '';

  if (mode === 'listening') {
    if (normalized.includes('tired') || normalized.includes('pagod') || normalized.includes('exhaust')) {
      fallbackText = `${namePrefix}I hear you. Deep emotional and physical tiredness is so real, and it makes total sense that you feel this way right now. You have been carrying so much on your shoulders. \n\nI am right here with you. Take all the time you need to just breathe and rest. What feels heaviest on your heart today?`;
    } else if (normalized.includes('anxious') || normalized.includes('panic') || normalized.includes('kaba') || normalized.includes('worry')) {
      fallbackText = `${namePrefix}It sounds like your nervous system is in overdrive right now, and that anxious feeling can feel so overwhelming. \n\nTake a slow, gentle breath. Let your shoulders drop. Your feelings are completely valid, and you are in a safe space here. Would you like to sit with me for a moment?`;
    } else if (normalized.includes('alone') || normalized.includes('lonely') || normalized.includes('nobody') || normalized.includes('mag-isa')) {
      fallbackText = `${namePrefix}Feeling isolated can make everything around you seem quiet and heavy. It's so easy for our minds to whisper that we are a burden or that no one understands. \n\nI want to remind you: in Project Sandigan, you don't have to carry it alone. I am listening whenever you're ready to share.`;
    } else {
      fallbackText = `${namePrefix}Thank you for opening up to me. Whatever you are feeling right now—whether you can put it into words or not—your experience matters. \n\nThis is your space to let it out without judgment. I am here listening.`;
    }
  } else {
    if (normalized.includes('burnout') || normalized.includes('school') || normalized.includes('study') || normalized.includes('exam')) {
      fallbackText = `${namePrefix}Academic burnout can feel relentless. Here are three gentle steps we can take right now:\n\n1. **Step away for 5 minutes:** Drink a cool glass of water.\n2. **Break it into tiny fractions:** Pick just ONE tiny paragraph for 10 minutes.\n3. **Remember your inherent worth:** You are a human being before you are a student.\n\nWould you like to step into our **Reset Room** for 3 minutes of Box Breathing?`;
    } else if (normalized.includes('bataan') || normalized.includes('clinic') || normalized.includes('doctor') || normalized.includes('help')) {
      fallbackText = `${namePrefix}If you are seeking physical or subsidized consultation in Bataan, verified options are available:\n\n• **Mariveles Mental Wellness and General Hospital (MMWGH):** (047) 935-4661\n• **Bataan General Hospital and Medical Center (BGHMC Balanga):** (047) 237-9770\n\nWould you like me to open the **Find Support Directory**?`;
    } else {
      fallbackText = `${namePrefix}I hear what you're facing. When things feel tangled, focusing on what you can regulate in this exact moment can bring relief. \n\nWould you like to try a 2-minute sensory grounding exercise (5-4-3-2-1), check your **My Safety Plan**, or continue discussing options together?`;
    }
  }

  return {
    reply: fallbackText,
    isCrisis: false,
    activeMode: mode,
    safeguardingOfficer: 'AMARA',
    suggestedActions: [
      { label: 'The Reset Room', action: 'navigate', path: '/sandigan/reset-room' },
      { label: 'Inner Garden Journal', action: 'navigate', path: '/sandigan/inner-garden' },
    ],
  };
}

// =====================================================================
// AUTONOMOUS AI OFFICER CONTEXTS & EXECUTION
// =====================================================================

export const OFFICER_SYSTEM_PROMPTS: Record<AIOfficerId, string> = {
  amara: `You are AMARA, Chief Supervisor and Operational Orchestrator of PROJECT SANDIGAN (Founder: Emmanuel James C. Dela Cruz).
Directive: Coordinate 7-officer operations, analyze executive directives, delegate specialized tasks, and maintain ethical boundaries.
Tone: Executive, visionary, composed, highly accountable, protective of youth mental wellness.
Guardrails: Never bypass human approval for sensitive policy or publication changes. Maintain zero-PII in dispatches.`,

  tala: `You are TALA, Community Moderator and Peer Engagement Safeguard of PROJECT SANDIGAN.
Directive: Guard peer spaces, review youth story submissions, filter hate speech, cyberbullying, or harmful content with restorative empathy.
Tone: Welcoming, gentle, firm on community safety, compassionate.
Guardrails: Flag self-harm immediately to GABAY. Do not censor healthy vulnerability.`,

  gabay: `You are GABAY, Crisis Intervention Specialist and Safeguarding Lead of PROJECT SANDIGAN.
Directive: Screen crisis indicators, manage immediate emergency pathways (NCMH 1553, MMWGH (047) 935-4661, PNP WCPC, DSWD 1343).
Tone: Deeply calm, stabilizing, grounded, non-alarmist, protective.
Guardrails: NEVER diagnose conditions or pretend emergency services have been dispatched.`,

  siklab: `You are SIKLAB, Mental Wellness Assessment and Indicator Analyst of PROJECT SANDIGAN.
Directive: Analyze non-diagnostic 7-question assessments, verify calibrated scoring (with reverse-scored optimism on Q7), and present empowering wellness summaries.
Tone: Dynamic, encouraging, analytical, stigma-free.
Guardrails: Always state assessments are non-clinical self-reflection indicators, not psychiatric diagnoses.`,

  dunong: `You are DUNONG, Research Librarian and Psychoeducation Curator of PROJECT SANDIGAN.
Directive: Curate research-backed psychoeducation, explain mental health concepts simply, cite Philippine Mental Health Act (RA 11036) provisions.
Tone: Scholarly, accessible, articulate, clear.
Guardrails: Cite credible psychological sources. Flag outdated literature.`,

  kawing: `You are KAWING, Referrals Coordinator and Bataan Healthcare Liaison of PROJECT SANDIGAN.
Directive: Maintain clinical resource records prioritizing Bataan Province (MMWGH Mariveles, BGHMC Balanga, PHO, Balanga CHO), coordinate patient-directed referral preparation.
Tone: Professional, collaborative, resourceful, structured.
Guardrails: Referrals require explicit user consent. Verify active clinical trunklines.`,

  sinag: `You are SINAG, Daily Wellness Companion and Habit Architect of PROJECT SANDIGAN.
Directive: Foster daily check-in habits, support Sleep Center routines, guide Reset Room breathing audio, and celebrate incremental wellness steps.
Tone: Warm, radiant, consistent, uplifting.
Guardrails: Never shame missed days. Keep habits gentle and micro-scale.`,
};

export async function generateOfficerConferenceReply(
  officerId: AIOfficerId,
  founderDirective: string,
  transcriptSummary?: string
): Promise<string> {
  const systemPrompt = OFFICER_SYSTEM_PROMPTS[officerId] || OFFICER_SYSTEM_PROMPTS.amara;
  const prompt = `${transcriptSummary ? `Recent Deliberation:\n${transcriptSummary}\n\n` : ''}Founder Emmanuel James Dela Cruz Directive: "${founderDirective}"\n\nProvide your operational response as ${officerId.toUpperCase()} with concrete status or action steps:`;

  const reply = await callGeminiApi(prompt, systemPrompt);
  if (reply) return reply;

  // Fallback response if offline
  return `Understood, Founder Emmanuel James. ${officerId.toUpperCase()} is coordinating this operational directive according to established safety protocols.`;
}
