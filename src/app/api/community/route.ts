import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { executeOfficerTask } from "@/lib/ai/orchestrator";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = ["general", "gratitude", "struggles", "hope", "advice"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = supabase
      .from("community_posts")
      .select("id, author_alias, title, content, category, is_anonymous, likes_count, comments_count, created_at, moderation_status")
      .order("created_at", { ascending: false });

    // If category filter provided
    if (category && VALID_CATEGORIES.includes(category as Category)) {
      query = query.eq("category", category);
    }

    // Filter approved posts, plus current user's pending posts if authenticated
    if (user) {
      query = query.or(`moderation_status.eq.approved,author_id.eq.${user.id}`);
    } else {
      query = query.eq("moderation_status", "approved");
    }

    const { data, error } = await query.limit(30);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data });
  } catch (error) {
    console.error("Community GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const { title, content, category, is_anonymous } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    // Get user alias
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();

    const authorAlias = is_anonymous
      ? "Anonymous Peer"
      : profile?.display_name || "Community Member";

    // AI Safety scan via TALA through AMARA Orchestrator
    const combinedText = `${title} ${content}`;
    const talaResult = await executeOfficerTask({
      officerName: "TALA",
      taskType: "moderate_community_content",
      payload: { text: combinedText },
      userContext: {
        userId: user.id,
        alias: authorAlias,
      },
    });

    const isCrisis = Boolean(talaResult.data.isCrisis);
    const isApproved = Boolean(talaResult.data.isApproved);
    const moderationStatus = isCrisis ? "flagged" : isApproved ? "approved" : "flagged";
    const moderationReason = (talaResult.data.moderationReason as string) || null;

    const { data: post, error: insertError } = await supabase
      .from("community_posts")
      .insert({
        author_id: user.id,
        author_alias: authorAlias,
        title: title.trim(),
        content: content.trim(),
        category,
        is_anonymous: Boolean(is_anonymous),
        moderation_status: moderationStatus,
        moderation_flag_reason: moderationReason,
        moderated_by_officer: "TALA",
      })
      .select("id, author_alias, title, content, category, is_anonymous, moderation_status, created_at")
      .single();

    if (insertError) {
      console.error("Community post insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      post,
      isCrisis,
    });
  } catch (error) {
    console.error("Community POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
