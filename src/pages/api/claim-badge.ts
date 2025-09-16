// src/pages/api/claim-badge.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "./_firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { uid, badgeId } = req.body || {};
  if (!uid || !badgeId) return res.status(400).json({ error: "uid and badgeId are required" });

  try {
    const db = getAdminDb();
    const ref = db.collection("users").doc(uid).collection("badges").doc(badgeId);

    await ref.set(
      {
        earnedAt: new Date().toISOString(),
        source: "rpm-module1-quiz",
      },
      { merge: true }
    );

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("[claim-badge] error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
}
