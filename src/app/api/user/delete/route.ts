import { getSupabaseServerClient, getSupabaseAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete user records cascade from auth.users using admin client
    const admin = getSupabaseAdminClient();
    
    // Log deletion in audit_logs before wiping user account
    await admin.from("audit_logs").insert({
      user_id: user.id,
      action: "user_account_self_deleted",
      resource_type: "auth.users",
      resource_id: user.id,
      metadata: { reason: "User exercised RA 10173 Right to Erasure" },
    });

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Account and associated data deleted." });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
