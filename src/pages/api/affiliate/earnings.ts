// src/pages/api/affiliate/earnings.ts
// API endpoint to fetch a member's affiliate earnings
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify the auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split("Bearer ")[1];
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const memberId = decodedToken.uid;

    const db = getAdminDb();

    // Get user's affiliate balances
    const userDoc = await db.collection("users").doc(memberId).get();
    const userData = userDoc.data() || {};

    const pendingBalance = userData.affiliatePendingBalance || 0;
    const paidBalance = userData.affiliatePaidBalance || 0;
    const totalEarnings = (userData.affiliateTotalEarnings || 0);

    // Get click count for this member
    const clicksQuery = await db
      .collection("affiliateClicks")
      .where("memberId", "==", memberId)
      .get();
    const totalClicks = clicksQuery.size;

    // Get recent commissions for this member
    const commissionsQuery = await db
      .collection("affiliateCommissions")
      .where("memberId", "==", memberId)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const recentCommissions = commissionsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Format currency values
    const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

    return res.status(200).json({
      pendingBalance,
      paidBalance,
      totalEarnings,
      totalClicks,
      recentCommissions,
      pendingBalanceFormatted: formatCurrency(pendingBalance),
      paidBalanceFormatted: formatCurrency(paidBalance),
      totalEarningsFormatted: formatCurrency(totalEarnings),
    });
  } catch (error: any) {
    console.error("Error fetching earnings:", error);
    
    // Handle missing index error
    if (error.code === 9) {
      return res.status(200).json({
        pendingBalance: 0,
        paidBalance: 0,
        totalEarnings: 0,
        totalClicks: 0,
        recentCommissions: [],
        pendingBalanceFormatted: "$0.00",
        paidBalanceFormatted: "$0.00",
        totalEarningsFormatted: "$0.00",
        note: "Index being created - data will appear shortly",
      });
    }
    
    return res.status(500).json({ error: "Failed to fetch earnings" });
  }
}