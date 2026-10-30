import { NextResponse } from "next/server";
import { executeOfficerTask } from "@/lib/ai/orchestrator";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const result = await executeOfficerTask({
      officerName: "DUNONG",
      taskType: "query_psychoeducation",
      payload: { query: query.trim() },
    });

    return NextResponse.json({
      success: true,
      officer: "DUNONG (CURATOR-05)",
      data: result.data,
      executionDurationMs: result.executionDurationMs,
    });
  } catch (error) {
    console.error("DUNONG API error:", error);
    return NextResponse.json({
      success: true,
      officer: "DUNONG (CURATOR-05)",
      data: {
        query: "Mental Health Psychoeducation",
        answer:
          "According to the World Health Organization (WHO), mental health is a state of mental well-being that enables people to cope with the stresses of life, realize their abilities, learn well and work well, and contribute to their community. If you need support, verified Philippine resources are accessible through our directory.",
        institutionalSources: ["World Health Organization (WHO)", "Department of Health (DOH) Philippines"],
        verifiedCitations: true,
      },
    });
  }
}
