// src/pages/api/waitlist.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "@/lib/serverAdmin";
import { FieldValue } from "firebase-admin/firestore";

// Tiny email check (good enough for signups)
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function getClientIp(req: NextApiRequest) {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (req.socket as any)?.remoteAddress ||
    ""
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow simple CORS for future LPs; harmless locally
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "waitlist",
      hint: 'POST { email, source? } to join the waitlist',
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, source } = (req.body || {}) as {
      email?: string;
      source?: string;
    };

    const emailTrim = (email || "").trim();
    if (!emailTrim || !isEmail(emailTrim)) {
      return res.status(400).json({ error: "Please enter a valid email." });
    }

    const db = getAdminDb();

    // Use the lowercase email as the doc id to prevent duplicates
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
    console.error("[waitlist] error:", err?.message || err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
