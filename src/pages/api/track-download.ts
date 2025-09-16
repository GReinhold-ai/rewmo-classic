// src/pages/api/track-download.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "./_firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Expect JSON body: { asset: string, email?: string, context?: string }
    const { asset, email, context } = (req.body ?? {}) as {
      asset?: string;
      email?: string;
      context?: string;
    };

    if (!asset || typeof asset !== "string") {
      return res.status(400).json({ error: "Missing asset" });
    }

    const db = getAdminDb();
    const now = new Date().toISOString();

    // Write a simple analytics doc
    await db.collection("downloads").add({
      asset,
      email: email || null,
      context: context || null,
      ua: req.headers["user-agent"] || null,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || null,
      ts: now,
    });

    // If you key preorders by email, optionally bump a counter
    if (email) {
      const ref = db.collection("preorders").doc(email);
      await ref.set(
        {
          lastDownloadAt: now,
          lastDownloadedAsset: asset,
        },
        { merge: true }
      );
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("[track-download] error:", e?.message || e);
    return res.status(500).json({ error: "Server error" });
  }
}
