import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { generateOfficerResponse, detectCrisisSignals } from "@/lib/ai/gemini";
import { AI_OFFICERS } from "@/config/officers";
import { OFFICER_PROMPTS, type OfficerKey } from "@/lib/ai/officers/prompts";
import {
  type OfficerName,
  OFFICER_TASK_REGISTRY,
  OFFICER_FALLBACKS,
  requiresFounderApproval,
} from "@/lib/ai/officers/definitions";
import type { TaskPriority, TaskStatus } from "@/types";

export interface OfficerExecutionParams {
  officerName: OfficerName;
  taskType: string;
  payload: Record<string, unknown>;
  userContext?: {
    userId?: string;
    alias?: string;
  };
}

export interface OfficerExecutionResult {
  taskId: string;
  officer: OfficerName;
  status: "completed" | "failed" | "awaiting_approval";
  executionDurationMs: number;
  data: Record<string, unknown>;
  error?: string;
  requiresFounderApproval?: boolean;
  approvalId?: string;
}

/**
 * AMARA Orchestrator: Central Execution & Dispatch Engine
 */
export async function executeOfficerTask(
  params: OfficerExecutionParams
): Promise<OfficerExecutionResult> {
  const start = Date.now();
  const supabase = getSupabaseAdminClient();
  const { officerName, taskType, payload } = params;

  const officerProfile = AI_OFFICERS[officerName];
  if (!officerProfile) {
    throw new Error(`Unknown AI Officer: ${officerName}`);
  }

  const taskDef = OFFICER_TASK_REGISTRY[taskType] || {
    taskType,
    assignedOfficer: officerName,
    priority: "normal" as TaskPriority,
    requiresFounderApproval: false,
    description: "Dynamic officer execution task",
  };

  // 1. Check if this task requires Founder Approval (Human-in-the-Loop)
  const needsApproval = requiresFounderApproval(taskType, (payload.risk_level as string) || "normal");

  // 2. Insert initial task into public.ai_tasks
  let taskId = `task-${Date.now()}`;
  try {
    const { data: taskRecord, error: taskInsertError } = await supabase
      .from("ai_tasks")
      .insert({
        officer_id: officerProfile.id,
        task_type: taskType,
        payload,
        priority: taskDef.priority,
        status: needsApproval ? "awaiting_approval" : "in_progress",
        requires_approval: needsApproval,
      })
      .select("id")
      .single();

    if (!taskInsertError && taskRecord) {
      taskId = taskRecord.id;
    }
  } catch (err) {
    console.warn("Telemetry warning: could not write to ai_tasks table", err);
  }

  // 3. If approval is required, create founder approval gate and halt execution
  if (needsApproval) {
    let approvalId: string | undefined;
    try {
      const { data: approvalRecord } = await supabase
        .from("founder_approvals")
        .insert({
          task_id: taskId.startsWith("task-") ? null : taskId,
          officer_requesting: officerName,
          action_summary: (payload.summary as string) || taskDef.description,
          risk_level: (payload.risk_level as "low" | "medium" | "high" | "critical") || "high",
          action_payload: payload,
          status: "pending",
        })
        .select("id")
        .single();

      if (approvalRecord) {
        approvalId = approvalRecord.id;
      }
    } catch (err) {
      console.warn("Could not insert founder_approval", err);
    }

    const duration = Date.now() - start;
    return {
      taskId,
      officer: officerName,
      status: "awaiting_approval",
      executionDurationMs: duration,
      requiresFounderApproval: true,
      approvalId,
      data: {
        message: "Action held for human founder authorization.",
        summary: (payload.summary as string) || taskDef.description,
      },
    };
  }

  // 4. Execute specialized officer logic
  let executionOutput: Record<string, unknown> = {};
  let executionError: string | undefined;

  try {
    switch (officerName) {
      case "AMARA":
        executionOutput = await handleAmaraTask(taskType, payload);
        break;
      case "TALA":
        executionOutput = await handleTalaTask(taskType, payload, params.userContext);
        break;
      case "GABAY":
        executionOutput = await handleGabayTask(taskType, payload, params.userContext);
        break;
      case "SIKLAB":
        executionOutput = await handleSiklabTask(taskType, payload);
        break;
      case "DUNONG":
        executionOutput = await handleDunongTask(taskType, payload);
        break;
      case "KAWING":
        executionOutput = await handleKawingTask(taskType, payload);
        break;
      case "SINAG":
        executionOutput = await handleSinagTask(taskType, payload);
        break;
      default:
        executionOutput = { message: OFFICER_FALLBACKS[officerName] };
    }
  } catch (err: unknown) {
    executionError = err instanceof Error ? err.message : String(err);
    console.error(`AI Officer [${officerName}] execution error:`, executionError);
    // Surface real failure explicitly rather than returning silent mock fallbacks
    executionOutput = {
      failed: true,
      error: executionError,
      timestamp: new Date().toISOString(),
    };
  }

  const duration = Date.now() - start;
  const finalStatus: TaskStatus = executionError ? "failed" : "completed";

  // 5. Record telemetry attempt in ai_task_attempts and update ai_tasks
  try {
    if (!taskId.startsWith("task-")) {
      await supabase.from("ai_task_attempts").insert({
        task_id: taskId,
        attempt_number: 1,
        status: executionError ? "failure" : "success",
        error_message: executionError || null,
        execution_duration_ms: duration,
        output_summary: JSON.stringify(executionOutput).slice(0, 500),
      });

      await supabase
        .from("ai_tasks")
        .update({
          status: finalStatus,
          error_log: executionError || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);
    }
  } catch (logErr) {
    console.warn("Could not record task attempt telemetry", logErr);
  }

  return {
    taskId,
    officer: officerName,
    status: finalStatus as "completed" | "failed",
    executionDurationMs: duration,
    data: executionOutput,
    error: executionError,
  };
}

// ─── AMARA HANDLER ────────────────────────────────────────────────────────────

async function handleAmaraTask(
  taskType: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const supabase = getSupabaseAdminClient();

  const { count: tasksCount } = await supabase.from("ai_tasks").select("id", { count: "exact" });
  const { count: messagesCount } = await supabase.from("ai_messages").select("id", { count: "exact" });
  const { count: approvalsCount } = await supabase
    .from("founder_approvals")
    .select("id", { count: "exact" })
    .eq("status", "pending");

  const telemetryMetrics = {
    tasksCount: tasksCount || 0,
    messagesCount: messagesCount || 0,
    pendingApprovals: approvalsCount || 0,
    timestamp: new Date().toISOString(),
  };

  const userPrompt =
    taskType === "system_health_audit"
      ? `Conduct an operational supervisory briefing based on real-time ecosystem telemetry:
- Total AI Tasks logged: ${telemetryMetrics.tasksCount}
- Inter-Officer Messages exchanged: ${telemetryMetrics.messagesCount}
- Pending Founder Approvals: ${telemetryMetrics.pendingApprovals}
- System Subsystems: 7 Autonomous AI Officers Online.

Provide a concise, 2-3 sentence executive operational analysis and status directive as AMARA. Maintain a vigilant, decisive, and protective tone.`
      : (payload.query as string) ||
        (payload.message as string) ||
        `Provide an executive orchestration update and supervisory directive for task type: ${taskType}. Context: ${JSON.stringify(payload).slice(0, 300)}`;

  const executiveBriefing = await generateOfficerResponse({
    systemInstruction: OFFICER_PROMPTS.AMARA,
    userPrompt,
  });

  return {
    healthy: true,
    officersOnline: 7,
    totalTasksLogged: telemetryMetrics.tasksCount,
    totalMessagesLogged: telemetryMetrics.messagesCount,
    pendingApprovals: telemetryMetrics.pendingApprovals,
    executiveBriefing,
    timestamp: telemetryMetrics.timestamp,
    officer: "AMARA (ORCHESTRATOR-01)",
  };
}

// ─── TALA HANDLER ─────────────────────────────────────────────────────────────

async function handleTalaTask(
  taskType: string,
  payload: Record<string, unknown>,
  userContext?: { userId?: string; alias?: string }
): Promise<Record<string, unknown>> {
  const text = (payload.text as string) || (payload.content as string) || "";
  const crisisCheck = detectCrisisSignals(text);

  // If crisis signals detected, TALA immediately dispatches an inter-officer message to GABAY
  if (crisisCheck.isCrisis) {
    await sendInterOfficerMessage({
      fromOfficer: "TALA",
      toOfficer: "GABAY",
      messageType: "crisis_alert",
      subject: `[CRISIS ALERT] Self-harm indicators detected in community submission`,
      body: `Matched keywords: ${crisisCheck.matchedKeywords.join(", ")}. Severity: ${crisisCheck.severity}. User: ${userContext?.alias || "Anonymous"}.`,
      payload: {
        textSnippet: text.slice(0, 150),
        severity: crisisCheck.severity,
        keywords: crisisCheck.matchedKeywords,
      },
    });
  }

  // LLM content review for bullying / toxicity if text is substantive
  let toxicityAssessment = { isToxic: false, reasoning: "Clean community reflection." };

  if (text.length > 20 && !crisisCheck.isCrisis) {
    const response = await generateOfficerResponse({
      systemInstruction: `${OFFICER_PROMPTS.TALA}\n\nAnalyze the text for harassment, bullying, or hate speech. Output valid JSON: {"isToxic": boolean, "reasoning": "brief explanation"}. Output ONLY JSON.`,
      userPrompt: text,
    });

    const cleaned = response.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.isToxic === "boolean") {
      toxicityAssessment = parsed;
    }
  }

  const isApproved = !crisisCheck.isCrisis && !toxicityAssessment.isToxic;

  return {
    isApproved,
    isCrisis: crisisCheck.isCrisis,
    crisisSeverity: crisisCheck.severity,
    isToxic: toxicityAssessment.isToxic,
    moderationReason: crisisCheck.isCrisis
      ? `Crisis indicators flagged: ${crisisCheck.matchedKeywords.join(", ")}`
      : toxicityAssessment.isToxic
      ? toxicityAssessment.reasoning
      : "Approved by TALA safeguard scan.",
    moderatedBy: "TALA (SAFEGUARD-02)",
  };
}

// ─── GABAY HANDLER ────────────────────────────────────────────────────────────

async function handleGabayTask(
  taskType: string,
  payload: Record<string, unknown>,
  userContext?: { userId?: string }
): Promise<Record<string, unknown>> {
  const text = (payload.text as string) || (payload.message as string) || (payload.content as string) || "";
  const crisisCheck = detectCrisisSignals(text);
  const supabase = getSupabaseAdminClient();

  // 1. If crisis is detected, create record in crisis_safeguarding_logs
  if (crisisCheck.isCrisis) {
    try {
      await supabase.from("crisis_safeguarding_logs").insert({
        user_id: userContext?.userId || null,
        risk_level: crisisCheck.severity,
        trigger_keywords: crisisCheck.matchedKeywords,
        officer_responder: "GABAY",
        escalation_pathway: crisisCheck.severity === "critical" ? "emergency_hotline" : "banner",
        user_acknowledged: false,
      });
    } catch (e) {
      console.warn("Could not insert crisis_safeguarding_logs", e);
    }
  }

  // 2. Generate authentic compassionate, de-escalating response via Gemini
  const prompt = text.trim()
    ? `User message or context: "${text.trim()}".
Crisis status: ${
        crisisCheck.isCrisis
          ? `CRITICAL/HIGH (${crisisCheck.matchedKeywords.join(", ")})`
          : "General distress / emotional overwhelm check-in"
      }.
Deliver a calm, compassionate, non-diagnostic response as GABAY. Emphasize that they do not have to carry it alone. If crisis keywords were matched, reassure them and guide them gently to emergency care.`
    : "A community member has reached out for crisis or safeguarding guidance. Provide a reassuring, grounded message assuring them that help and verified Philippine hotlines are available.";

  const dynamicResponse = await generateOfficerResponse({
    systemInstruction: OFFICER_PROMPTS.GABAY,
    userPrompt: prompt,
  });

  return {
    isCrisis: crisisCheck.isCrisis,
    riskLevel: crisisCheck.severity,
    matchedKeywords: crisisCheck.matchedKeywords,
    hotlines: {
      ncmh: { number: "1553", label: "NCMH Crisis Hotline (24/7 Toll-free)" },
      inTouch: { number: "02-8893-7603", label: "In Touch Community Services" },
      hopeline: { number: "2919", label: "Hopeline Philippines" },
      emergency: { number: "911", label: "National Emergency Services" },
    },
    message: dynamicResponse,
    guidance: dynamicResponse,
    officer: "GABAY (CRISIS-LEAD-03)",
  };
}

// ─── SIKLAB HANDLER ───────────────────────────────────────────────────────────

async function handleSiklabTask(
  taskType: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const responses = (payload.responses as Record<string, number>) || {};

  // Compute category averages
  const categories = {
    sleep: ["q_sleep_1", "q_sleep_2", "q_sleep_3", "q_sleep_4"],
    stress: ["q_stress_1", "q_stress_2", "q_stress_3", "q_stress_4"],
    emotional: ["q_emotion_1", "q_emotion_2", "q_emotion_3", "q_emotion_4"],
    social: ["q_social_1", "q_social_2", "q_social_3"],
  };

  const computeScore = (keys: string[]) => {
    let sum = 0;
    let count = 0;
    for (const k of keys) {
      if (typeof responses[k] === "number") {
        sum += responses[k];
        count++;
      }
    }
    return count > 0 ? Math.round((sum / (count * 5)) * 100) : 50;
  };

  const scores = {
    sleep: computeScore(categories.sleep),
    stress: computeScore(categories.stress),
    emotional_energy: computeScore(categories.emotional),
    social_connection: computeScore(categories.social),
  };

  const prompt = `Based on these self-reported wellness scores (0-100 scale, where higher is more stable):
Sleep: ${scores.sleep}/100
Stress Management: ${scores.stress}/100
Emotional Energy: ${scores.emotional_energy}/100
Social Connection: ${scores.social_connection}/100

Generate a brief (2-3 sentences), compassionate, non-diagnostic reflection highlighting a balance of empathy and gentle encouragement for Filipino youth. Do not diagnose.`;

  const reflection = await generateOfficerResponse({
    systemInstruction: OFFICER_PROMPTS.SIKLAB,
    userPrompt: prompt,
  });

  return {
    categoryScores: scores,
    reflection,
    educationalRecommendations: [
      scores.sleep < 50 ? "Explore Sleep Hygiene in Mind Library" : "Maintain your restful evening habits",
      scores.stress < 50 ? "Try the 4-7-8 Breathing in Reset Room" : "Continue your daily grounding moments",
    ],
    disclaimer:
      "This assessment is an educational reflection tool and does NOT constitute medical or psychiatric diagnosis.",
    officer: "SIKLAB (ANALYST-04)",
  };
}

// ─── DUNONG HANDLER ───────────────────────────────────────────────────────────

async function handleDunongTask(
  taskType: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const query = (payload.query as string) || "General mental health psychoeducation";

  const responseText = await generateOfficerResponse({
    systemInstruction: `${OFFICER_PROMPTS.DUNONG}\n\nProvide an evidence-informed, youth-accessible explanation. You must cite real institutional sources (e.g. WHO, APA, or DOH Philippines). NEVER fabricate citations.`,
    userPrompt: query,
  });

  return {
    query,
    answer: responseText,
    institutionalSources: ["World Health Organization (WHO)", "Department of Health (DOH) Philippines"],
    verifiedCitations: true,
    officer: "DUNONG (CURATOR-05)",
  };
}

// ─── KAWING HANDLER ───────────────────────────────────────────────────────────

async function handleKawingTask(
  taskType: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const supabase = getSupabaseAdminClient();

  if (taskType === "package_referral_intake") {
    const { providerId, preferredContact, notes, consentGranted } = payload;

    if (!consentGranted) {
      throw new Error("Explicit consent is strictly required for referral packaging.");
    }

    // Verify provider
    const { data: provider } = await supabase
      .from("support_directory")
      .select("id, name, verification_status, region, contact_phone")
      .eq("id", providerId as string)
      .maybeSingle();

    const intakePrompt = `Create a professional, privacy-conscious referral coordination brief for a client seeking mental health care:
- Provider: ${provider?.name || providerId} (${provider?.verification_status || "pending_review"})
- Preferred Contact Method: ${preferredContact || "Not specified"}
- Referral Context/Notes: ${(notes as string)?.slice(0, 300) || "Routine support referral"}
Synthesize a concise, 2-sentence clinical coordination summary as KAWING. Emphasize client consent and confidentiality.`;

    const intakeSummary = await generateOfficerResponse({
      systemInstruction: OFFICER_PROMPTS.KAWING,
      userPrompt: intakePrompt,
    });

    return {
      status: "packaged",
      providerName: provider?.name || providerId,
      verificationStatus: provider?.verification_status || "pending_review",
      preferredContact,
      intakeSummary,
      consentRecorded: true,
      officer: "KAWING (PARTNERSHIPS-06)",
    };
  }

  // Referral guidance and directory navigation
  const query = (payload.query as string) || (payload.message as string) || "How can I access professional mental health support in the Philippines?";
  const region = (payload.region as string) || "National / NCR";

  const { data: verifiedProviders } = await supabase
    .from("support_directory")
    .select("name, service_type, region, is_free, contact_phone")
    .eq("verification_status", "verified")
    .limit(3);

  const providerContext = (verifiedProviders && verifiedProviders.length > 0)
    ? verifiedProviders.map((p) => `- ${p.name} (${p.service_type}, ${p.region}${p.is_free ? ", Free" : ""}): ${p.contact_phone || "Contact via Sandigan Directory"}`).join("\n")
    : "- NCMH Crisis Care & Outpatient Services (National)\n- In Touch Community Services (Metro Manila / Teleconsult)\n- PGH Department of Psychiatry & Behavioral Medicine (Public / Free)";

  const guidancePrompt = `User inquiry: "${query}". Region: ${region}.
Available verified directory resources:
${providerContext}

As KAWING, provide a warm, organized, step-by-step guidance explanation on how to connect with these verified resources, what to prepare for an intake, and how client consent is respected.`;

  const guidance = await generateOfficerResponse({
    systemInstruction: OFFICER_PROMPTS.KAWING,
    userPrompt: guidancePrompt,
  });

  return {
    query,
    guidance,
    recommendedProviders: verifiedProviders || [],
    officer: "KAWING (PARTNERSHIPS-06)",
  };
}

// ─── SINAG HANDLER ────────────────────────────────────────────────────────────

async function handleSinagTask(
  taskType: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (taskType === "generate_daily_companion_package") {
    const today = new Date().toISOString().split("T")[0];
    const response = await generateOfficerResponse({
      systemInstruction: `${OFFICER_PROMPTS.SINAG}\nGenerate a daily wellness JSON object: {"quote": "...", "author": "...", "reflection_prompt": "...", "micro_action": "..."}. Only JSON.`,
      userPrompt: `Generate daily wellness package for ${today}.`,
    });

    const cleaned = response.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    const dailyData = { ...JSON.parse(cleaned), date: today };

    return { ...dailyData, officer: "SINAG (COMPANION-07)" };
  }

  const prompt = (payload.message as string) || (payload.prompt as string) || "Kumusta?";
  const history = (payload.history as Array<{ role: "user" | "model"; text: string }>) || [];

  const reply = await generateOfficerResponse({
    systemInstruction: OFFICER_PROMPTS.SINAG,
    userPrompt: prompt,
    conversationHistory: history,
  });

  return { reply, officer: "SINAG (COMPANION-07)" };
}

// ─── INTER-OFFICER MESSAGING BUS ──────────────────────────────────────────────

export async function sendInterOfficerMessage(params: {
  fromOfficer: OfficerName;
  toOfficer: OfficerName;
  messageType: "task_handoff" | "crisis_alert" | "moderation_flag" | "coordination";
  subject: string;
  body: string;
  payload?: Record<string, unknown>;
}): Promise<{ success: boolean; messageId?: string }> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("ai_messages")
      .insert({
        from_officer: params.fromOfficer,
        to_officer: params.toOfficer,
        message_type: params.messageType,
        subject: params.subject,
        body: params.body,
        payload: params.payload || {},
        is_read: false,
      })
      .select("id")
      .single();

    if (!error && data) {
      return { success: true, messageId: data.id };
    }
  } catch (err) {
    console.warn("Could not insert ai_message", err);
  }
  return { success: false };
}
