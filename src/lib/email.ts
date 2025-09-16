// src/lib/email.ts
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@rewmo.ai";

if (!SENDGRID_API_KEY) {
  // Do NOT put any example key here. Push protection scans comments too.
  console.warn("[email] SENDGRID_API_KEY missing. Emails will not be sent.");
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

type SendArgs = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
};

/**
 * Send a transactional email via SendGrid.
 * Returns { ok: true } on success, otherwise throws.
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  from = EMAIL_FROM,
  replyTo,
}: SendArgs): Promise<{ ok: true }> {
  if (!SENDGRID_API_KEY) {
    // no-op in dev if the key is not present
    console.log("[email] Skipped send (no SENDGRID_API_KEY).", { to, subject });
    return { ok: true };
  }

  const msg = {
    to,
    from,
    subject,
    text: text || (html ? undefined : ""),
    html,
    ...(replyTo ? { replyTo } : {}),
  };

  await sgMail.send(msg as any);
  return { ok: true };
}
