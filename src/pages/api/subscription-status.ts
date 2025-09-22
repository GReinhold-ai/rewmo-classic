// src/pages/api/subscription-status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "@/lib/serverAdmin";

/**
 * GET /api/subscription-status?email=...
 * Returns a simple snapshot of a user's membership/entitlements based on email.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const emailRaw = (req.query.email as string | undefined)?.trim();
    if (!emailRaw) {
      return res.status(400).json({ error: "Missing email" });
    }

    const emailLower = emailRaw.toLowerCase();
    const db = getAdminDb();

    // Try exact match on common fields
    let uid: string | null = null;
    let entitlements: string[] = [];

    const tryFields = ["email", "emailLower"] as const;
    for (const field of tryFields) {
      const snap = await db.collection("users").where(field, "==", field === "email" ? emailRaw : emailLower).limit(1).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        uid = doc.id;
        const data = doc.data() || {};
        entitlements = Array.isArray(data.entitlements) ? data.entitlements : [];
        break;
      }
    }

    // If still not found, try a case-insensitive where we stored different casing
    if (!uid) {
      // (Optional extra heuristics could go here)
    }

    const premium =
      entitlements.includes("premium") ||
      entitlements.includes("pro") ||
      entitlements.includes("leanai.fundamentals"); // tweak to your logic

    return res.status(200).json({
      email: emailRaw,
      found: !!uid,
      uid,
      entitlements,
      premium,
    });
  } catch (err: any) {
    console.error("[subscription-status] error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
}
