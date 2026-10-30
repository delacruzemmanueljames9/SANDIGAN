import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { StrategicReportData } from "@/types";

export const dynamic = "force-dynamic";

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

    // Role verification: founder or admin only
    const { data: roleRecord } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["founder", "admin"])
      .maybeSingle();

    if (!roleRecord) {
      return NextResponse.json(
        { error: "Forbidden: Founder access required" },
        { status: 403 }
      );
    }

    // 1. Platform Usage Counts (Privacy preserved: aggregate count only, no PII)
    const [
      { count: profilesCount },
      { count: postsCount },
      { count: commentsCount },
      { count: assessmentsCount },
      { count: safetyPlansCount },
      { count: journalsCount },
      { count: referralsCount },
      { count: providersCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("community_posts").select("*", { count: "exact", head: true }),
      supabase.from("community_comments").select("*", { count: "exact", head: true }),
      supabase.from("wellness_assessments").select("*", { count: "exact", head: true }),
      supabase.from("safety_plans").select("*", { count: "exact", head: true }),
      supabase.from("journal_entries").select("*", { count: "exact", head: true }),
      supabase.from("referral_requests").select("*", { count: "exact", head: true }),
      supabase.from("support_directory").select("*", { count: "exact", head: true }),
    ]);

    // 2. Community Moderation Breakdown
    const [
      { count: modPending },
      { count: modApproved },
      { count: modFlagged },
      { count: modRejected },
    ] = await Promise.all([
      supabase.from("community_posts").select("*", { count: "exact", head: true }).eq("moderation_status", "pending"),
      supabase.from("community_posts").select("*", { count: "exact", head: true }).eq("moderation_status", "approved"),
      supabase.from("community_posts").select("*", { count: "exact", head: true }).eq("moderation_status", "flagged"),
      supabase.from("community_posts").select("*", { count: "exact", head: true }).eq("moderation_status", "rejected"),
    ]);

    // 3. Referral Requests Breakdown
    const [
      { count: refSubmitted },
      { count: refReviewed },
      { count: refRouted },
      { count: refAccepted },
      { count: refClosed },
    ] = await Promise.all([
      supabase.from("referral_requests").select("*", { count: "exact", head: true }).eq("status", "submitted"),
      supabase.from("referral_requests").select("*", { count: "exact", head: true }).eq("status", "reviewed_by_safeguarding"),
      supabase.from("referral_requests").select("*", { count: "exact", head: true }).eq("status", "routed_to_partner"),
      supabase.from("referral_requests").select("*", { count: "exact", head: true }).eq("status", "partner_accepted"),
      supabase.from("referral_requests").select("*", { count: "exact", head: true }).eq("status", "closed"),
    ]);

    // 4. Crisis Safeguarding Incident Breakdown
    const [
      { count: crisisTotal },
      { count: crisisLow },
      { count: crisisMed },
      { count: crisisHigh },
      { count: crisisCrit },
      { count: crisisUnack },
      { count: pathHotline },
      { count: pathAlert },
      { count: pathModal },
      { count: pathBanner },
    ] = await Promise.all([
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }),
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }).eq("risk_level", "low"),
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }).eq("risk_level", "medium"),
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }).eq("risk_level", "high"),
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }).eq("risk_level", "critical"),
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }).eq("user_acknowledged", false),
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }).eq("escalation_pathway", "emergency_hotline"),
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }).eq("escalation_pathway", "founder_alert"),
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }).eq("escalation_pathway", "modal"),
      supabase.from("crisis_safeguarding_logs").select("*", { count: "exact", head: true }).eq("escalation_pathway", "banner"),
    ]);

    // 5. Officer Task Performance Telemetry
    const { data: recentAttempts } = await supabase
      .from("ai_task_attempts")
      .select("id, task_id, status, execution_duration_ms, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    // Fetch related tasks for officer_id mapping
    const taskIds = Array.from(new Set((recentAttempts || []).map((a) => a.task_id)));
    let taskOfficerMap: Record<string, string> = {};
    if (taskIds.length > 0) {
      const { data: relatedTasks } = await supabase
        .from("ai_tasks")
        .select("id, officer_id")
        .in("id", taskIds);
      if (relatedTasks) {
        taskOfficerMap = Object.fromEntries(relatedTasks.map((t) => [t.id, t.officer_id]));
      }
    }

    // Aggregate officer performance
    const officerStatsMap: Record<
      string,
      { totalTasks: number; successfulAttempts: number; failedAttempts: number; totalDurationMs: number }
    > = {
      AMARA: { totalTasks: 0, successfulAttempts: 0, failedAttempts: 0, totalDurationMs: 0 },
      TALA: { totalTasks: 0, successfulAttempts: 0, failedAttempts: 0, totalDurationMs: 0 },
      GABAY: { totalTasks: 0, successfulAttempts: 0, failedAttempts: 0, totalDurationMs: 0 },
      SIKLAB: { totalTasks: 0, successfulAttempts: 0, failedAttempts: 0, totalDurationMs: 0 },
      DUNONG: { totalTasks: 0, successfulAttempts: 0, failedAttempts: 0, totalDurationMs: 0 },
      KAWING: { totalTasks: 0, successfulAttempts: 0, failedAttempts: 0, totalDurationMs: 0 },
      SINAG: { totalTasks: 0, successfulAttempts: 0, failedAttempts: 0, totalDurationMs: 0 },
    };

    (recentAttempts || []).forEach((attempt) => {
      const officer = taskOfficerMap[attempt.task_id] || "AMARA";
      const stats = officerStatsMap[officer] || {
        totalTasks: 0,
        successfulAttempts: 0,
        failedAttempts: 0,
        totalDurationMs: 0,
      };
      stats.totalTasks += 1;
      if (attempt.status === "success") {
        stats.successfulAttempts += 1;
      } else {
        stats.failedAttempts += 1;
      }
      stats.totalDurationMs += attempt.execution_duration_ms || 0;
      officerStatsMap[officer] = stats;
    });

    const officerPerformance = Object.entries(officerStatsMap).map(([officer_id, s]) => ({
      officer_id,
      totalTasks: s.totalTasks,
      successfulAttempts: s.successfulAttempts,
      failedAttempts: s.failedAttempts,
      avgDurationMs: s.totalTasks > 0 ? Math.round(s.totalDurationMs / s.totalTasks) : 0,
    }));

    // 6. Scheduled Jobs Summary
    const [{ count: totalJobs }, { count: activeJobs }] = await Promise.all([
      supabase.from("scheduled_jobs").select("*", { count: "exact", head: true }),
      supabase.from("scheduled_jobs").select("*", { count: "exact", head: true }).eq("is_active", true),
    ]);

    const report: StrategicReportData = {
      platformUsage: {
        totalProfiles: profilesCount || 0,
        totalCommunityPosts: postsCount || 0,
        totalCommunityComments: commentsCount || 0,
        totalWellnessAssessments: assessmentsCount || 0,
        totalSafetyPlans: safetyPlansCount || 0,
        totalJournalEntries: journalsCount || 0,
        totalReferralRequests: referralsCount || 0,
        totalSupportProviders: providersCount || 0,
      },
      moderation: {
        pending: modPending || 0,
        approved: modApproved || 0,
        flagged: modFlagged || 0,
        rejected: modRejected || 0,
        total: (modPending || 0) + (modApproved || 0) + (modFlagged || 0) + (modRejected || 0),
      },
      referrals: {
        submitted: refSubmitted || 0,
        reviewed_by_safeguarding: refReviewed || 0,
        routed_to_partner: refRouted || 0,
        partner_accepted: refAccepted || 0,
        closed: refClosed || 0,
        total:
          (refSubmitted || 0) +
          (refReviewed || 0) +
          (refRouted || 0) +
          (refAccepted || 0) +
          (refClosed || 0),
      },
      safeguarding: {
        totalIncidents: crisisTotal || 0,
        byRiskLevel: {
          low: crisisLow || 0,
          medium: crisisMed || 0,
          high: crisisHigh || 0,
          critical: crisisCrit || 0,
        },
        unacknowledgedCount: crisisUnack || 0,
        pathways: {
          emergency_hotline: pathHotline || 0,
          founder_alert: pathAlert || 0,
          modal: pathModal || 0,
          banner: pathBanner || 0,
        },
      },
      officerPerformance,
      jobsSummary: {
        totalJobs: totalJobs || 0,
        activeJobs: activeJobs || 0,
        pausedJobs: (totalJobs || 0) - (activeJobs || 0),
      },
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Strategic Reports API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
