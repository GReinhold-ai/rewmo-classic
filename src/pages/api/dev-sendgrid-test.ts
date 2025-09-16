// src/pages/api/dev-sendgrid-test.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  // Simple admin guard for test endpoint
  const headerKey = req.headers["x-admin-key"];
  const queryKey = req.query.key;
  const ok =
    (typeof headerKey === "string" && headerKey === process.env.REWMO_ADMIN_KEY) ||
    (typeof queryKey === "string" && queryKey === process.env.REWMO_ADMIN_KEY);

  if (!ok) return res.status(401).json({ error: "Unauthorized" });

  const to = String(req.query.to || "").trim();
  if (!to) return res.status(400).json({ error: "Missing ?to=" });

  try {
    await sendEmail({
      to,
      subject: "RewmoAI SendGrid Test",
      html: `<p>🎉 This is a test email from RewmoAI.</p>
             <p>If you see this, your SendGrid setup is working.</p>`,
    });
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("[dev-sendgrid-test] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to send" });
  }
}
