import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { executeOfficerTask } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";

// 15 questions across 4 domains
const QUESTION_DOMAINS: Record<string, string[]> = {
  sleep: ["q_sleep_1", "q_sleep_2", "q_sleep_3", "q_sleep_4"],
  stress: ["q_stress_1", "q_stress_2", "q_stress_3", "q_stress_4"],
  emotional_energy: ["q_emotion_1", "q_emotion_2", "q_emotion_3", "q_emotion_4"],
  social_connection: ["q_social_1", "q_social_2", "q_social_3"],
};

function computeCategoryScores(
  responses: Record<string, number>
): { sleep: number; stress: number; emotional_energy: number; social_connection: number } {
  const avg = (keys: string[]) => {
    const vals = keys.map((k) => responses[k] ?? 3);
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20);
  };
  return {
    sleep: avg(QUESTION_DOMAINS.sleep),
    stress: avg(QUESTION_DOMAINS.stress),
    emotional_energy: avg(QUESTION_DOMAINS.emotional_energy),
    social_connection: avg(QUESTION_DOMAINS.social_connection),
  };
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const { responses } = body as { responses: Record<string, number> };

    // Validate all expected keys present with values 1–5
    const allKeys = Object.values(QUESTION_DOMAINS).flat();
    for (const key of allKeys) {
      const val = responses[key];
      if (typeof val !== "number" || val < 1 || val > 5) {
        return NextResponse.json(
          { error: `Invalid value for question ${key}. Expected 1–5.` },
          { status: 400 }
        );
      }
    }

    const categoryScores = computeCategoryScores(responses);
    const overallAvg = Math.round(
      (categoryScores.sleep + categoryScores.stress + categoryScores.emotional_energy + categoryScores.social_connection) / 4
    );

    // SIKLAB generates compassionate, non-diagnostic reflection via AMARA Orchestrator
    const siklabResult = await executeOfficerTask({
      officerName: "SIKLAB",
      taskType: "analyze_wellness_assessment",
      payload: { responses },
      userContext: { userId: user.id },
    });

    const reflection =
      (siklabResult.data.reflection as string) ||
      "Thank you for completing your wellness check-in. Every reflection is a step toward greater self-awareness. Remember, this is a personal reflection tool — not a clinical assessment.";

    const recommendations = (siklabResult.data.educationalRecommendations as string[]) || [
      "Try the Reset Room for grounding exercises",
      "Write in your Inner Garden journal",
    ];

    // Save to Supabase (RLS: auth.uid() = user_id)
    const { data: saved, error: saveError } = await supabase
      .from("wellness_assessments")
      .insert({
        user_id: user.id,
        responses,
        category_scores: categoryScores,
        overall_reflection: reflection,
        educational_recommendations: recommendations,
        is_crisis_flagged: false,
      })
      .select("id")
      .single();

    if (saveError) {
      console.error("[wellness-check] Save error:", saveError);
      // Still return the result even if save fails
    }

    const scores = {
      sleep: categoryScores.sleep,
      stress: categoryScores.stress,
      emotion: categoryScores.emotional_energy,
      social: categoryScores.social_connection,
    };

    const formattedRecs = (recommendations || []).map((rec: string | { label: string; href: string }) => {
      if (typeof rec === "string") {
        return { label: rec, href: "/mind-library" };
      }
      return rec;
    });

    return NextResponse.json({
      id: saved?.id,
      categoryScores,
      scores,
      overallAvg,
      reflection,
      recommendations: formattedRecs,
    });
  } catch (err) {
    console.error("[/api/wellness-check]", err);
    return NextResponse.json({ error: "Unable to process your assessment." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("wellness_assessments")
      .select("id, category_scores, overall_reflection, educational_recommendations, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    return NextResponse.json({ assessments: data || [] });
  } catch (err) {
    console.error("[/api/wellness-check GET]", err);
    return NextResponse.json({ error: "Unable to fetch assessments." }, { status: 500 });
  }
}
