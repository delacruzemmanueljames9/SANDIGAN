/**
 * PROJECT SANDIGAN — Transactional Email Module
 * Provider: Resend (https://resend.com)
 *
 * Availability: This module is OPTIONAL. If RESEND_API_KEY is not
 * configured, all send functions return a graceful "not configured" result
 * rather than throwing. This prevents broken imports from crashing the app.
 *
 * DNS requirements for the sender domain:
 *   • SPF record:  "v=spf1 include:spf.resend.com ~all"
 *   • DKIM:        Resend provides DKIM key → add as TXT record on sending domain
 *   • DMARC:       "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com"
 *   • From address: must match a verified Resend sender domain
 *
 * Supabase already sends its own auth emails (verification, password reset).
 * This module is used for SANDIGAN-specific notifications (e.g. referrals).
 */

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
  skipped?: boolean;
  reason?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// ─────────────────────────────────────────────────────────────────────
// Core send function (Resend REST API — no SDK dependency required)
// ─────────────────────────────────────────────────────────────────────

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS =
  process.env.EMAIL_FROM_ADDRESS ?? "SANDIGAN <noreply@sandigan.ph>";

export async function sendEmail(
  options: SendEmailOptions
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      skipped: true,
      reason:
        "RESEND_API_KEY is not configured. " +
        "Transactional emails are disabled. " +
        "Set RESEND_API_KEY in your environment variables to enable.",
    };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
      }),
    });

    const data = (await response.json()) as { id?: string; message?: string };

    if (!response.ok) {
      return {
        success: false,
        error: data.message ?? `Resend API error: HTTP ${response.status}`,
      };
    }

    return { success: true, id: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Network error sending email: ${message}` };
  }
}

// ─────────────────────────────────────────────────────────────────────
// SANDIGAN-branded HTML template helper
// ─────────────────────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SANDIGAN</title>
  <style>
    body { margin: 0; padding: 0; background: #0f172a; font-family: system-ui, -apple-system, sans-serif; color: #e2e8f0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #1e293b; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
    .body { padding: 32px; }
    .footer { padding: 20px 32px; border-top: 1px solid #334155; text-align: center; font-size: 12px; color: #64748b; }
    a { color: #818cf8; }
    .btn { display: inline-block; background: #6366f1; color: #fff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🛡 SANDIGAN</h1>
      <p>You don't have to carry it alone.</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>Tinig KaBataan &bull; SANDIGAN Platform</p>
      <p>This is an automated notification. Please do not reply directly to this email.</p>
      <p>If you need support, please <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://sandigan.ph"}/services/talk">visit SANDIGAN</a>.</p>
    </div>
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────
// Pre-built email templates
// ─────────────────────────────────────────────────────────────────────

/**
 * Referral notification — sent to user when a referral has been processed.
 */
export async function sendReferralNotification(params: {
  to: string;
  userName: string;
  referralType: string;
  referredTo: string;
  notes?: string;
}): Promise<EmailResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://sandigan.ph";

  const html = baseTemplate(`
    <h2 style="color:#a5b4fc;margin-top:0">Your Referral is Being Processed</h2>
    <p>Hi ${params.userName},</p>
    <p>We wanted to let you know that your referral request has been received and is being reviewed by our team.</p>
    <table style="width:100%;background:#0f172a;border-radius:8px;padding:16px;margin:16px 0">
      <tr><td style="color:#94a3b8;padding:4px 0">Type:</td><td style="font-weight:600">${params.referralType}</td></tr>
      <tr><td style="color:#94a3b8;padding:4px 0">Referred to:</td><td style="font-weight:600">${params.referredTo}</td></tr>
      ${params.notes ? `<tr><td style="color:#94a3b8;padding:4px 0">Notes:</td><td>${params.notes}</td></tr>` : ""}
    </table>
    <p>A SANDIGAN coordinator will follow up with you shortly. You can also check your referral status at any time.</p>
    <a href="${appUrl}/services/find-support" class="btn">View Referral Status</a>
    <p style="margin-top:24px;font-size:13px;color:#64748b">
      If you are in immediate crisis, please call the National Center for Mental Health crisis hotline: 
      <strong>1553</strong> (available 24/7).
    </p>
  `);

  return sendEmail({
    to: params.to,
    subject: "SANDIGAN — Your Referral Request Has Been Received",
    html,
    text: `Hi ${params.userName}, your referral to ${params.referredTo} has been received and is being processed. Visit ${appUrl}/services/find-support to check status.`,
  });
}

/**
 * Safeguarding alert — sent internally when a crisis flag is raised.
 * This goes to the safeguarding lead, NOT to the user.
 */
export async function sendSafeguardingAlert(params: {
  to: string;
  alertLevel: "low" | "medium" | "high" | "critical";
  summary: string;
  actionUrl: string;
}): Promise<EmailResult> {
  const levelColors: Record<string, string> = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#f97316",
    critical: "#ef4444",
  };
  const color = levelColors[params.alertLevel] ?? "#6366f1";

  const html = baseTemplate(`
    <h2 style="color:${color};margin-top:0">Safeguarding Alert — ${params.alertLevel.toUpperCase()}</h2>
    <p>An automated safeguarding flag has been raised by GABAY and requires human review.</p>
    <div style="background:#0f172a;border-left:4px solid ${color};padding:16px;border-radius:0 8px 8px 0;margin:16px 0">
      <p style="margin:0">${params.summary}</p>
    </div>
    <p>Please review this alert in the Founder Command Center and take appropriate action.</p>
    <a href="${params.actionUrl}" class="btn">Review in HQ</a>
    <p style="margin-top:24px;font-size:13px;color:#94a3b8">
      <strong>Important:</strong> This alert was generated automatically. 
      No AI officer has or will take independent action without founder approval.
    </p>
  `);

  return sendEmail({
    to: params.to,
    subject: `SANDIGAN [${params.alertLevel.toUpperCase()}] Safeguarding Alert Requires Review`,
    html,
    text: `Safeguarding Alert (${params.alertLevel}): ${params.summary}. Review at: ${params.actionUrl}`,
  });
}

/**
 * Founder approval request — notifies the founder that an action requires approval.
 */
export async function sendApprovalRequest(params: {
  to: string;
  actionType: string;
  description: string;
  approvalUrl: string;
  requestedBy: string;
}): Promise<EmailResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://sandigan.ph";

  const html = baseTemplate(`
    <h2 style="color:#a5b4fc;margin-top:0">Approval Required</h2>
    <p>An action initiated by <strong>${params.requestedBy}</strong> requires your authorization before it can proceed.</p>
    <table style="width:100%;background:#0f172a;border-radius:8px;padding:16px;margin:16px 0">
      <tr><td style="color:#94a3b8;padding:4px 0">Action type:</td><td style="font-weight:600">${params.actionType}</td></tr>
      <tr><td style="color:#94a3b8;padding:4px 0">Requested by:</td><td>${params.requestedBy}</td></tr>
      <tr><td style="color:#94a3b8;padding:4px 0">Description:</td><td>${params.description}</td></tr>
    </table>
    <p>Please review this request in the Decision Center and approve or reject it.</p>
    <a href="${params.approvalUrl}" class="btn">Review &amp; Decide</a>
    <p style="margin-top:16px;font-size:13px;color:#64748b">
      You can always manage pending approvals at <a href="${appUrl}/hq">${appUrl}/hq</a>.
    </p>
  `);

  return sendEmail({
    to: params.to,
    subject: `SANDIGAN — Approval Required: ${params.actionType}`,
    html,
    text: `Approval required for "${params.actionType}" requested by ${params.requestedBy}. Review at: ${params.approvalUrl}`,
  });
}
