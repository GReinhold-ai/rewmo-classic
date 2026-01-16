// src/pages/api/affiliate/log-click.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { logAffiliateClick, generateSubId, AffiliateNetwork } from "@/lib/affiliate";
import { getRetailerById } from "@/data/retailers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify auth token
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    const memberId = decoded.uid;

    const { retailerId } = req.body;

    if (!retailerId) {
      return res.status(400).json({ error: "retailerId required" });
    }

    // Get retailer info
    const retailer = getRetailerById(retailerId);
    if (!retailer) {
      return res.status(404).json({ error: "Retailer not found" });
    }

    // Determine network from affiliate link
    let network: AffiliateNetwork = "impact"; // default
    if (retailer.affiliateLink.includes("amazon.com")) {
      network = "amazon";
    } else if (retailer.affiliateLink.includes("awin")) {
      network = "awin";
    }

    // Generate unique sub-ID for tracking
    const subId = generateSubId(memberId);

    // Log the click
    await logAffiliateClick({
      memberId,
      retailerId,
      network,
      subId,
      userAgent: req.headers["user-agent"],
    });

    // Build the tracked affiliate URL
    let trackedUrl = retailer.affiliateLink;
    
    // Append sub-ID based on network
    if (network === "amazon") {
      // Amazon uses tag parameter, add sub-tag
      trackedUrl = trackedUrl.includes("?") 
        ? `${trackedUrl}&ascsubtag=${subId}`
        : `${trackedUrl}?ascsubtag=${subId}`;
    } else if (network === "impact") {
      // Impact uses subId parameter
      trackedUrl = trackedUrl.includes("?")
        ? `${trackedUrl}&subId=${subId}`
        : `${trackedUrl}?subId=${subId}`;
    } else if (network === "awin") {
      // Awin uses clickRef parameter
      trackedUrl = trackedUrl.includes("?")
        ? `${trackedUrl}&clickRef=${subId}`
        : `${trackedUrl}?clickRef=${subId}`;
    }

    return res.status(200).json({ 
      success: true, 
      url: trackedUrl,
      subId,
    });
  } catch (err: any) {
    console.error("[log-click] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to log click" });
  }
}