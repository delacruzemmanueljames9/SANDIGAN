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

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Daily companion error:", error);
    return NextResponse.json({
      quote: "Habang may buhay, may pag-asa. (While there is life, there is hope.)",
      author: "Filipino Proverb",
      reflection_prompt: "What is one small thing that brought you comfort or peace this week?",
      micro_action: "Take three slow, deep breaths before you start your next task today.",
      date: new Date().toISOString().split("T")[0],
      officer: "SINAG (COMPANION-07)",
    });
  }
}
