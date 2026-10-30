import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
    const {
      provider_id,
      preferred_contact_method,
      contact_value,
      intake_notes,
      consent_to_share_granted,
    } = body;

    // Strict validation
    if (!provider_id || typeof provider_id !== "string") {
      return NextResponse.json({ error: "provider_id is required" }, { status: 400 });
    }

    if (!["phone", "email"].includes(preferred_contact_method)) {
      return NextResponse.json(
        { error: "preferred_contact_method must be 'phone' or 'email'" },
        { status: 400 }
      );
    }

    if (!contact_value || typeof contact_value !== "string" || !contact_value.trim()) {
      return NextResponse.json({ error: "contact_value is required" }, { status: 400 });
    }

    if (!intake_notes || typeof intake_notes !== "string" || !intake_notes.trim()) {
      return NextResponse.json({ error: "intake_notes is required" }, { status: 400 });
    }

    // Must explicitly grant consent per RLS rule
    if (consent_to_share_granted !== true) {
      return NextResponse.json(
        { error: "Explicit consent is required to submit a referral request" },
        { status: 400 }
      );
    }

    const { data, error: insertError } = await supabase
      .from("referral_requests")
      .insert({
        user_id: user.id,
        provider_id,
        preferred_contact_method,
        contact_value: contact_value.trim(),
        intake_notes: intake_notes.trim(),
        consent_to_share_granted: true,
        status: "submitted",
      })
      .select("id, status, created_at")
      .single();

    if (insertError) {
      console.error("Referral insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, referral: data });
  } catch (error) {
    console.error("Referral API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("referral_requests")
      .select("id, provider_id, preferred_contact_method, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ referrals: data });
  } catch (error) {
    console.error("Referral GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
