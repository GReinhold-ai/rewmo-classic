// src/pages/api/affiliate/earnings.ts
// Returns member's affiliate earnings and stats
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { getMemberAffiliateStats } from "@/lib/affiliate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    const memberId = decoded.uid;

    const stats = await getMemberAffiliateStats(memberId);

    return res.status(200).json({
      success: true,
      ...stats,
      // Format for display
      pendingBalanceFormatted: `$${(stats.pendingBalance / 100).toFixed(2)}`,
      paidBalanceFormatted: `$${(stats.paidBalance / 100).toFixed(2)}`,
      totalEarningsFormatted: `$${(stats.totalEarnings / 100).toFixed(2)}`,
    });
  } catch (err: any) {
    console.error("[earnings] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to get earnings" });
  }
}