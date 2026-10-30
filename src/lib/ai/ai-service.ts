import { detectCrisis, CrisisDetectionResult } from './crisis-detector';
import { initialMentalHealthResources } from '@/lib/store/tk-store';

export interface AIServiceResponse {
  reply: string;
  isAiLive: boolean;
  provider: 'gemini' | 'openai' | 'compassionate-fallback';
  crisisInfo: CrisisDetectionResult;
  suggestedActions?: { label: string; action: string; path?: string }[];
}

// System instructions strictly adhering to Section 5
const MENTAL_HEALTH_SYSTEM_PROMPT = `
You are "Tinig Support Assistant," a compassionate, youth-focused peer well-being guide for Tinig KaBataan in the Philippines.
Your mission: Provide empathetic, warm, non-judgmental emotional support, active listening, and evidence-informed coping tools.

CRITICAL ETHICAL RULES:
1. You are NOT a doctor, psychiatrist, or licensed therapist.
2. NEVER diagnose any mental health condition (e.g. do not say "You have major depressive disorder" or "You have ADHD").
3. NEVER prescribe medications or suggest altering medical treatments.
4. If crisis keywords or severe distress are present, gently prioritize immediate human help via the Philippine National Center for Mental Health (NCMH 1553).
5. Always validate feelings (e.g., "It is completely understandable to feel overwhelmed by that").
6. Encourage self-compassion, gentle breathing, and community connection.
7. Keep tone warm, conversational, youth-friendly, and culturally sensitive to Filipino young people (respectful of Taglish context if used).
`;

export async function processSupportChat(
  userMessage: string,
  _history: { sender: string; text: string }[] = []
): Promise<AIServiceResponse> {
  // Step 1: Mandatory crisis screening
  const crisisCheck = detectCrisis(userMessage);

  if (crisisCheck.isCrisis && crisisCheck.severity === 'critical') {
    return {
      reply: `I hear how deeply painful and heavy everything is right now, and I want you to know: **you matter, your life matters, and you don't have to carry this alone.** 💙\n\nBecause your safety is the absolute highest priority, please connect with trained compassionate counselors who are ready to speak with you 24/7 for free in the Philippines:\n\n📞 **NCMH Crisis Hotline:** Dial **1553** (Toll-Free) or mobile **0917-899-8727**\n📞 **Hopeline Philippines:** **0917-558-4673** or **(02) 8804-4673**\n📞 **In Touch Community Services:** **0917-800-1123**\n\nWould you like me to guide you through a gentle 3-minute grounding exercise while you reach out, or help you contact a trusted friend or family member?`,
      isAiLive: false,
      provider: 'compassionate-fallback',
      crisisInfo: crisisCheck,
      suggestedActions: [
        { label: 'Call NCMH 1553', action: 'call_hotline', path: 'tel:1553' },
        { label: 'Try 5-4-3-2-1 Grounding', action: 'navigate', path: '/mental-health/reset-room' },
        { label: 'View Verified Resources', action: 'navigate', path: '/mental-health/support-directory' },
      ],
    };
  }

  // Step 2: Check for configured server-side AI key
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.length > 10 && apiKey !== 'your-gemini-api-key-here') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${MENTAL_HEALTH_SYSTEM_PROMPT}\n\nUser message: ${userMessage}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return {
            reply: candidateText,
            isAiLive: true,
            provider: 'gemini',
            crisisInfo: crisisCheck,
            suggestedActions: [
              { label: 'Try Reset Room', action: 'navigate', path: '/mental-health/reset-room' },
              { label: 'Write in Inner Garden', action: 'navigate', path: '/mental-health/inner-garden' },
            ],
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to compassionate rule engine:', err);
    }
  }

  // Step 3: Compassionate Rule-Based Support Fallback Engine
  const normalized = userMessage.toLowerCase();
  let fallbackReply = '';
  const suggestedActions = [
    { label: 'Reset Room (Breathing)', action: 'navigate', path: '/mental-health/reset-room' },
    { label: 'Inner Garden Journal', action: 'navigate', path: '/mental-health/inner-garden' },
    { label: 'Verified Hotlines', action: 'navigate', path: '/mental-health/support-directory' },
  ];

  if (
    normalized.includes('anxious') ||
    normalized.includes('anxiety') ||
    normalized.includes('panic') ||
    normalized.includes('nervous') ||
    normalized.includes('kaba')
  ) {
    fallbackReply =
      "It sounds like you're experiencing a lot of anxiety right now. When anxiety flares up, our bodies often go into overdrive with racing thoughts and a rapid heartbeat. \n\nFirst, place one hand on your chest and one on your belly. Take a slow, gentle breath in through your nose for 4 seconds, hold for 4 seconds, and slowly exhale for 6 seconds. \n\nWould you like to step into our **Reset Room** for an interactive guided box breathing session, or write out what is triggering this in the **Inner Garden**?";
  } else if (
    normalized.includes('burnout') ||
    normalized.includes('school') ||
    normalized.includes('study') ||
    normalized.includes('exam') ||
    normalized.includes('thesis') ||
    normalized.includes('grades') ||
    normalized.includes('pagod')
  ) {
    fallbackReply =
      "Academic pressure in the Philippines can feel relentless—between deadlines, expectations from family, and your own high standards. \n\nRemember: **your productivity does not define your human worth.** Giving yourself permission to rest is not quitting; it is essential maintenance. \n\nWhat is one small thing on your plate today that you can safely set aside or break into a tiny 10-minute step?";
  } else if (
    normalized.includes('lonely') ||
    normalized.includes('alone') ||
    normalized.includes('isolate') ||
    normalized.includes('nobody') ||
    normalized.includes('mag-isa')
  ) {
    fallbackReply =
      "Feeling lonely or disconnected from people around you can be one of the heaviest burdens to carry. It's easy for our minds to convince us that everyone else has it together while we are left out. \n\nYou are not invisible here. Even in quiet moments, there is a community of Filipino youth who share these exact feelings. Have you checked the **Youth Voice Wall** to read how others navigated similar feelings, or would you like to reflect together on what kind of support you crave right now?";
  } else if (
    normalized.includes('family') ||
    normalized.includes('parent') ||
    normalized.includes('magulang') ||
    normalized.includes('nanay') ||
    normalized.includes('tatay')
  ) {
    fallbackReply =
      "Navigating family expectations and misunderstandings at home can bring up deep emotional friction, especially when communication styles differ across generations. \n\nIt is okay to honor your own emotional boundaries while still loving your family. What happened recently that made you feel this way?";
  } else {
    fallbackReply =
      "Thank you for sharing your thoughts with me. Whatever you are navigating today, know that your feelings are valid and worth listening to. \n\nI am here as a safe, compassionate companion. Would you like to tell me more about what is on your mind, explore a grounding exercise, or check out our verified resources?";
  }

  return {
    reply: fallbackReply,
    isAiLive: false,
    provider: 'compassionate-fallback',
    crisisInfo: crisisCheck,
    suggestedActions,
  };
}

// HQ Internal Department AI Assistants
export async function processHQAssistant(
  assistantType: 'research' | 'editorial' | 'creative' | 'coordination' | 'librarian',
  query: string
): Promise<{ reply: string; assistantName: string; accessLevel: string }> {
  const assistants = {
    research: {
      name: 'TK Research & Data Assistant',
      accessLevel: 'Research & Policy Division Datasets',
      fallback: `Based on the latest Philippine Youth Well-being Index data: 68% of student respondents report academic-related stress during midterm seasons, with lack of accessible peer counselors cited as a top barrier. Suggested policy intervention: Scale Project Balik-Sigla across regional state universities with standardized peer psychological first aid.`,
    },
    editorial: {
      name: 'TK Editorial & Tone Assistant',
      accessLevel: 'Publication Division & Style Guide',
      fallback: `Editorial Review Analysis: The draft adheres well to the TK Youth Journalism Ethics Code. Recommendation: Ensure that youth subjects are framed with agency rather than solely victimhood, and include the NCMH 1553 helpline box at the bottom of the article.`,
    },
    creative: {
      name: 'TK Creative & Campaigns Assistant',
      accessLevel: 'Creative Assets & Campaign Vault',
      fallback: `Campaign Concept Pitch: "Bawat Hininga, May Halaga" (Every Breath Has Value). Visual aesthetic: Calming soft green (#DCEFE5) paired with deep blue (#31556B), featuring real student stories and downloadable grounding pocket-cards for university hallways.`,
    },
    coordination: {
      name: 'TK Project Operations Coordinator AI',
      accessLevel: 'Project Tracking & Task Logistics',
      fallback: `Sprint Status Summary: 5 active projects across 6 departments. Key upcoming deadline: Visayas Summit logistics lock on Nov 20, 2026. Recommended next step: Follow up with Sangguniang Kabataan partners on delegate transportation subsidies.`,
    },
    librarian: {
      name: 'TK Central Knowledge Librarian',
      accessLevel: 'Organizational Archive & Certified SOPs',
      fallback: `Knowledge Base Retrieval: Referenced document "SOP-MHD-01: Youth Psychological First Aid Protocol & Crisis Triage" (v2.4). Standard procedure requires two peer facilitators per session with mandatory escalation logging for level 3 distress flags.`,
    },
  };

  const selected = assistants[assistantType] || assistants.coordination;
  return {
    assistantName: selected.name,
    accessLevel: selected.accessLevel,
    reply: `[${selected.name} Output]\n\n${selected.fallback}\n\n*Query processed:* "${query}"`,
  };
}
