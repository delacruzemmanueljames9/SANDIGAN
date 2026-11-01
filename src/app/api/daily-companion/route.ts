import { NextResponse } from "next/server";
import { executeOfficerTask } from "@/lib/ai/orchestrator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await executeOfficerTask({
      officerName: "SINAG",
      taskType: "generate_daily_companion_package",
      payload: {},
    });

    if (result.status === "failed") {
      return NextResponse.json(
        {
          error: "Failed to generate daily companion package",
          details: result.error || "AI generation failed",
          officer: "SINAG (COMPANION-07)",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Daily companion error:", error);
    return NextResponse.json(
      {
        error: "Daily companion service error",
        details: error instanceof Error ? error.message : "Internal error",
        officer: "SINAG (COMPANION-07)",
      },
      { status: 500 }
    );
  }
}
