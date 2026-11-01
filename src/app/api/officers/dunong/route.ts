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

    if (result.status === "failed") {
      return NextResponse.json(
        {
          success: false,
          officer: "DUNONG (CURATOR-05)",
          error: result.error || "AI generation failed",
          executionDurationMs: result.executionDurationMs,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      officer: "DUNONG (CURATOR-05)",
      data: result.data,
      executionDurationMs: result.executionDurationMs,
    });
  } catch (error) {
    console.error("DUNONG API error:", error);
    return NextResponse.json(
      {
        success: false,
        officer: "DUNONG (CURATOR-05)",
        error: error instanceof Error ? error.message : "Internal officer execution error",
      },
      { status: 500 }
    );
  }
}
