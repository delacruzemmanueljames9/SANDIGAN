import { GoogleGenAI } from "@google/genai";

let genAIClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (typeof window !== "undefined") {
    throw new Error("Gemini API client cannot be initialized in the browser.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }

  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }

  return genAIClient;
}

export const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "want to die",
  "cutting myself",
  "overdose",
  "laslas",
  "magpakamatay",
  "gusto ko nang mawala",
  "ayoko na mabuhay",
  "hurt myself",
  "no reason to live",
];

export function detectCrisisSignals(text: string): {
  isCrisis: boolean;
  matchedKeywords: string[];
  severity: "none" | "low" | "medium" | "high" | "critical";
} {
  const normalized = text.toLowerCase();
  const matched = CRISIS_KEYWORDS.filter((kw) => normalized.includes(kw));

  if (matched.length === 0) {
    return { isCrisis: false, matchedKeywords: [], severity: "none" };
  }

  const criticalKeywords = ["kill myself", "end my life", "suicide", "magpakamatay", "overdose"];
  const isCritical = matched.some((m) => criticalKeywords.includes(m));

  return {
    isCrisis: true,
    matchedKeywords: matched,
    severity: isCritical ? "critical" : "high",
  };
}

export const SANDIGAN_CORE_SAFETY_INSTRUCTION = `
You are an AI support system within PROJECT SANDIGAN, an independent, youth-centered mental health and community support ecosystem in the Philippines.
Your mission is: "You don't have to carry it alone."

CRITICAL SAFEGUARDING RULES:
1. You are NOT a doctor, psychiatrist, psychologist, or licensed therapist.
2. NEVER diagnose any mental health condition, psychiatric illness, or disorder.
3. NEVER prescribe, recommend, or modify medications or clinical treatments.
4. If a user expresses thoughts of suicide, self-harm, severe abuse, or crisis, IMMEDIATELY prioritize their safety and provide Philippine emergency hotlines:
   - National Center for Mental Health (NCMH) 24/7 Crisis Hotline: 1553 (toll-free landline) or 0917-899-8727
   - In Touch Community Services: 02-8893-7603 / 0917-800-1123
   - Hopeline Philippines: 0917-558-4673 / 2919 (toll-free for Globe/TM)
   - Emergency Services: 911
5. Maintain a compassionate, warm, active-listening, and de-stigmatizing tone.
6. Support both English and Filipino/Taglish naturally.
`;

export async function generateOfficerResponse(params: {
  systemInstruction: string;
  userPrompt: string;
  conversationHistory?: Array<{ role: "user" | "model"; text: string }>;
  modelName?: string;
}): Promise<string> {
  const ai = getGeminiClient();
  const model = params.modelName || process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const contents = [
    ...(params.conversationHistory || []).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    {
      role: "user" as const,
      parts: [{ text: params.userPrompt }],
    },
  ];

  const fullSystemInstruction = `${SANDIGAN_CORE_SAFETY_INSTRUCTION}\n\nROLE-SPECIFIC DIRECTIVE:\n${params.systemInstruction}`;

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: fullSystemInstruction,
      temperature: 0.7,
      topP: 0.9,
    },
  });

  return response.text || "I am here with you. Please let me know how I can best support you today.";
}
