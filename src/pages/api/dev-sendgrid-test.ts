// src/pages/api/dev-sendgrid-test.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple guard: require your admin key (header or query)
  const provided =
    (req.headers["x-admin-key"] as string) || (req.query.key as string) || "";
  const expected = process.env.REWMO_ADMIN_KEY || "";
  if (!expected || provided !== expected) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const to = String(req.query.to || "").trim();
  if (!to) {
    return res
      .status(400)
      .json({ ok: false, error: "Provide ?to=email@example.com" });
  }

  try {
    await sendEmail(
      to,
      "RewmoAI SendGrid Test",
      `<p>🎉 This is a test email from RewmoAI.</p>
       <p>If you see this, your SendGrid setup is working.</p>`
    );
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Send failed" });
  }
}
