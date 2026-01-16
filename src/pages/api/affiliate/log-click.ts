// src/pages/api/affiliate/log-click.ts
// API endpoint to log affiliate clicks
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { getRetailerById } from "@/data/retailers";

type AffiliateNetwork = "amazon" | "impact" | "awin" | "direct";

// Generate a unique sub-ID for tracking
function generateSubId(memberId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${memberId.substring(0, 8)}_${timestamp}_${random}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { memberId, retailerId, network: providedNetwork, subId: providedSubId } = req.body;

    if (!memberId || !retailerId) {
      return res.status(400).json({ error: "Missing memberId or retailerId" });
    }

    // Generate subId if not provided
    const subId = providedSubId || generateSubId(memberId);

    // Determine network
    let network: AffiliateNetwork = providedNetwork || "direct";
    
    // If retailerId provided, try to get network from retailer data
    const retailer = getRetailerById(retailerId);
    if (retailer) {
      // Use the retailer's network setting
      if (retailer.network === "amazon") {
        network = "amazon";
      } else if (retailer.affiliateUrl?.includes("awin")) {
        network = "awin";
      } else if (retailer.affiliateUrl?.includes("impact") || retailer.affiliateUrl?.includes("pxf.io")) {
        network = "impact";
      } else {
        network = "direct";
      }
    }

    const db = getAdminDb();

    // Create click record
    const clickData = {
      memberId,
      retailerId,
      network,
      subId,
      clickedAt: FieldValue.serverTimestamp(),
      userAgent: req.headers["user-agent"] || null,
      converted: false,
    };

    const docRef = await db.collection("affiliateClicks").add(clickData);

    return res.status(200).json({
      success: true,
      clickId: docRef.id,
      subId,
      network,
    });
  } catch (error) {
    console.error("Error logging click:", error);
    return res.status(500).json({ error: "Failed to log click" });
  }
}
