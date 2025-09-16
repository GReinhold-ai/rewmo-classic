import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "./_firebaseAdmin";
import { getMembershipSnapshot } from "@/lib/server/membership";

/**
 * GET /api/subscription-status?email=...
 * Same-origin snapshot for the Account page.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  const email = String(req.query.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "Missing email" });

  try {
    const db = getAdminDb();
    const snap = await getMembershipSnapshot(db, email);
    return res.status(200).json(snap);
  } catch (e: any) {
    console.error("[subscription-status] error:", e?.message || e);
    return res.status(500).json({ error: "Server error" });
  }
}
