import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { type OfficerName } from "@/lib/ai/officers/definitions";
import type { AIMessage } from "@/types";

const MAX_HOP_COUNT = 5;

export interface SendMessageParams {
  fromOfficer: OfficerName;
  toOfficer: OfficerName;
  messageType: "task_handoff" | "crisis_alert" | "moderation_flag" | "coordination";
  subject: string;
  body: string;
  payload?: Record<string, unknown>;
  hopCount?: number;
}

/**
 * Routes inter-officer messages with loop prevention and crisis priority escalation.
 */
export async function routeInterOfficerMessage(params: SendMessageParams): Promise<{
  success: boolean;
  messageId?: string;
  quarantined?: boolean;
  error?: string;
}> {
  const supabase = getSupabaseAdminClient();
  const currentHop = (params.hopCount || (params.payload?.hopCount as number) || 0) + 1;

  // Anti-loop safeguard: prevent recursive agent-to-agent loops
  if (currentHop > MAX_HOP_COUNT) {
    const errorMsg = `Loop prevention triggered: message from ${params.fromOfficer} to ${params.toOfficer} exceeded max hop count (${MAX_HOP_COUNT}).`;
    console.warn(errorMsg);

    try {
      await supabase.from("system_events").insert({
        event_type: "agent_loop_quarantined",
        event_level: "warn",
        source: `coordination:${params.fromOfficer}`,
        message: errorMsg,
        metadata: {
          from: params.fromOfficer,
          to: params.toOfficer,
          subject: params.subject,
          hopCount: currentHop,
        },
      });
    } catch {}

    return {
      success: false,
      quarantined: true,
      error: errorMsg,
    };
  }

  // Fast-path: if crisis alert, ensure to_officer is GABAY
  const effectiveRecipient = params.messageType === "crisis_alert" ? "GABAY" : params.toOfficer;

  try {
    const payloadWithHops = {
      ...(params.payload || {}),
      hopCount: currentHop,
      routedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("ai_messages")
      .insert({
        from_officer: params.fromOfficer,
        to_officer: effectiveRecipient,
        message_type: params.messageType,
        subject: params.subject,
        body: params.body,
        payload: payloadWithHops,
        is_read: false,
      })
      .select("id")
      .single();

    if (error) throw error;

    return { success: true, messageId: data?.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to route message",
    };
  }
}

/**
 * Mark an inter-officer message as read and processed.
 */
export async function acknowledgeMessage(messageId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("ai_messages")
    .update({ is_read: true })
    .eq("id", messageId);
  return !error;
}

/**
 * Fetch recent inter-agent messages.
 */
export async function getRecentCoordinationMessages(limit = 30): Promise<AIMessage[]> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("ai_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as AIMessage[]) || [];
}
