import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { detectCrisisSignals } from "@/lib/ai/gemini";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ entries: data || [] });
  } catch (err) {
    console.error("[/api/journal GET]", err);
    return NextResponse.json({ error: "Unable to fetch journal entries." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = await req.json();
    const { title, content, mood, tags } = body as {
      title: string;
      content: string;
      mood: string;
      tags?: string[];
    };

    const validMoods = ["calm", "hopeful", "anxious", "exhausted", "sad", "grateful", "neutral"];
    if (!title?.trim()) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    if (!content?.trim()) return NextResponse.json({ error: "Content is required." }, { status: 400 });
    if (!validMoods.includes(mood)) return NextResponse.json({ error: "Invalid mood value." }, { status: 400 });
    if (title.length > 200) return NextResponse.json({ error: "Title too long." }, { status: 400 });
    if (content.length > 10000) return NextResponse.json({ error: "Content too long (max 10000 chars)." }, { status: 400 });

    // Crisis detection — logged but entry is still saved (user's private space)
    const crisis = detectCrisisSignals(content);

    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        mood,
        tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      entry: data,
      isCrisis: crisis.isCrisis,
      crisisSeverity: crisis.severity,
    });
  } catch (err) {
    console.error("[/api/journal POST]", err);
    return NextResponse.json({ error: "Unable to save journal entry." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Entry ID is required." }, { status: 400 });

    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // RLS also enforces this, double-checked here

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/journal DELETE]", err);
    return NextResponse.json({ error: "Unable to delete entry." }, { status: 500 });
  }
}
