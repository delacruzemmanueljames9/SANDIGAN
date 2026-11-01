import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { executeOfficerTask } from "@/lib/ai/orchestrator";
import type { OfficerName } from "@/lib/ai/officers/definitions";

export const dynamic = "force-dynamic";

const VALID_OFFICERS: OfficerName[] = [
  "AMARA",
  "TALA",
  "GABAY",
  "SIKLAB",
  "DUNONG",
  "KAWING",
  "SINAG",
];

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { officerName, taskType, payload } = body;

    if (!officerName || !VALID_OFFICERS.includes(officerName as OfficerName)) {
      return NextResponse.json(
        { error: `Invalid officerName. Must be one of: ${VALID_OFFICERS.join(", ")}` },
        { status: 400 }
      );
    }

    if (!taskType || typeof taskType !== "string") {
      return NextResponse.json({ error: "taskType is required" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();

    const result = await executeOfficerTask({
      officerName: officerName as OfficerName,
      taskType,
      payload: payload || {},
      userContext: {
        userId: user.id,
        alias: profile?.display_name || "Community Member",
      },
    });

    if (result.status === "failed") {
      return NextResponse.json(result, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Officer execute API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
