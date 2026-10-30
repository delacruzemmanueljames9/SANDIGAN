import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  generateOfficerResponse,
  detectCrisisSignals,
} from "@/lib/ai/gemini";
import { AI_OFFICERS } from "@/config/officers";
import { executeOfficerTask } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to use Talk to Tinig." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history?: Array<{ role: "user" | "model"; text: string }>;
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.trim().length > 2000) {
      return NextResponse.json(
        { error: "Message too long. Please keep messages under 2000 characters." },
        { status: 400 }
      );
    }

    const crisis = detectCrisisSignals(message);
    const sinag = AI_OFFICERS.SINAG;

    // If crisis detected, route safeguarding telemetry through GABAY
    if (crisis.isCrisis) {
      await executeOfficerTask({
        officerName: "GABAY",
        taskType: "evaluate_crisis_signals",
        payload: { text: message.trim(), severity: crisis.severity },
        userContext: { userId: user.id },
      });
    }

    const systemInstruction = `${sinag.primaryDirective}

You are SINAG, SANDIGAN's Daily Wellness Companion. You offer warm, empathetic, active-listening support in English or Filipino/Taglish — whichever the user uses.

KEY BEHAVIORS:
- Always validate feelings before offering any perspective.
- Ask gentle, open-ended follow-up questions to understand the user better.
- Suggest professional support or SANDIGAN services (Safety Plan, Find Support) when appropriate.
- Keep responses concise and warm — never overwhelming.
${
  crisis.isCrisis
    ? `
URGENT — CRISIS DETECTED: The user's message contains crisis-related keywords (${crisis.matchedKeywords.join(", ")}). 
You MUST immediately respond with compassion AND provide these verified Philippine emergency contacts:
- NCMH 24/7 Crisis Line: 1553 (toll-free) or 0917-899-8727
- In Touch Community Services: 02-8893-7603 / 0917-800-1123  
- Hopeline Philippines: 2919 or 0917-558-4673
- Emergency Services: 911
Do NOT skip the hotlines. Do NOT continue normal conversation without first ensuring safety.`
    : ""
}`;

    const response = await generateOfficerResponse({
      systemInstruction,
      userPrompt: message.trim(),
      conversationHistory: (history || []).slice(-12),
    });

    return NextResponse.json({
      response,
      reply: response,
      isCrisis: crisis.isCrisis,
      crisisSeverity: crisis.severity,
    });
  } catch (err: unknown) {
    console.error("[/api/talk] Error:", err);
    const message =
      err instanceof Error && err.message.includes("GEMINI_API_KEY")
        ? "AI service is temporarily unavailable."
        : "Unable to process your message. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
