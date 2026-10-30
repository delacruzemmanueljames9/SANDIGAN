import { getSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all user-owned records across tables under RLS
  const [profileRes, journalsRes, safetyPlanRes, assessmentsRes, consentsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("journal_entries").select("*").eq("user_id", user.id),
    supabase.from("safety_plans").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("wellness_assessments").select("*").eq("user_id", user.id),
    supabase.from("user_consents").select("*").eq("user_id", user.id),
  ]);

  const exportPayload = {
    exportMetadata: {
      generatedAt: new Date().toISOString(),
      userAuthId: user.id,
      standardCompliance: "Republic Act No. 10173 (Data Privacy Act of 2012) Right to Data Portability",
    },
    profile: profileRes.data || null,
    journalEntries: journalsRes.data || [],
    safetyPlan: safetyPlanRes.data || null,
    wellnessAssessments: assessmentsRes.data || [],
    consents: consentsRes.data || [],
  };

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="sandigan-user-data-${user.id.slice(0, 8)}.json"`,
    },
  });
}
