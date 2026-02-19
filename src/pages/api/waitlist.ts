// src/pages/api/waitlist.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/serverAdmin";

// Tiny email check (good enough for signups)
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function getClientIp(req: NextApiRequest) {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (req.socket as any)?.remoteAddress ||
    ""
  );
}

function setCors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    setCors(res);
    return res.status(200).end();
  }

  // Health check
  if (req.method === "GET") {
    setCors(res);
    return res.status(200).json({
      ok: true,
      route: "waitlist",
      hint: 'POST { email, source? } to join the waitlist',
    });
  }

  // Only allow POST for signups
  if (req.method !== "POST") {
    setCors(res);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  setCors(res);

  try {
    const { email, source } = (req.body || {}) as { email?: string; source?: string };

    const emailTrim = (email || "").trim();
    if (!emailTrim || !isEmail(emailTrim)) {
      return res.status(400).json({ error: "Please enter a valid email." });
    }

    const db = getAdminDb();

    // Use lowercase email as doc id to prevent duplicates
    const id = emailTrim.toLowerCase();

    const ref = db.collection("waitlist").doc(id);

    await ref.set(
      {
        email: id,
        source: source || null,
        userAgent: (req.headers["user-agent"] as string) || null,
        referer: (req.headers["referer"] as string) || null,
        ip: getClientIp(req) || null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    // Full diagnostics for Vercel logs
    console.error("[waitlist] error full:", err);
    console.error("[waitlist] message:", err?.message);
    console.error("[waitlist] stack:", err?.stack);

    // Also include a safe hint for debugging without exposing secrets
    const hint =
      typeof err?.message === "string" &&
      (err.message.includes("FB_ADMIN_") ||
        err.message.toLowerCase().includes("credential") ||
        err.message.toLowerCase().includes("private key") ||
        err.message.toLowerCase().includes("projectid"))
        ? "Firebase Admin init/env issue"
        : "Unknown";

    return res.status(500).json({ error: "Server error. Please try again.", hint });
  }
}
