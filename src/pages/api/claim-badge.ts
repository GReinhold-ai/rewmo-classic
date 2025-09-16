// src/pages/api/claim-badge.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "../_firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const db = getAdminDb();
    const { uid, badgeId, label = "Badge" } = req.body as {
      uid?: string;
      badgeId?: string;
      label?: string;
    };

    if (!badgeId) return res.status(400).json({ ok: false, error: "badgeId required" });

    // Log every claim (even without uid)
    await db.collection("events").add({
      type: "badge_claim",
      badgeId,
      label,
      uid: uid || null,
      ts: new Date(),
    });

    // If signed in, also store under the user's document
    if (uid) {
      const ref = db.collection("users").doc(uid).collection("badges").doc(badgeId);
      await ref.set(
        {
          badgeId,
          label,
          earnedAt: new Date(),
          source: "quiz_rpm_m1",
        },
        { merge: true }
      );
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "error" });
  }
}
