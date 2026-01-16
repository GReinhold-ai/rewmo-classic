// src/pages/api/affiliate/awin-webhook.ts
// Receives conversion postbacks from Awin
import type { NextApiRequest, NextApiResponse } from "next";
import { recordCommission, findMemberBySubId } from "@/lib/affiliate";

// Awin sends conversions via server-to-server postback
// Configure in Awin dashboard:
// https://rewmo.ai/api/affiliate/awin-webhook?ref={clickRef}&amount={commission}&order={orderRef}&status={commissionStatus}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const params = req.method === "GET" ? req.query : { ...req.query, ...req.body };

  try {
    const {
      ref,           // clickRef - our tracking ID
      clickRef,      // Alternative name
      amount,        // Commission amount
      commission,    // Alternative name for amount
      order,         // Order reference
      orderRef,      // Alternative name
      transactionId, // Awin transaction ID
      status,        // Status: "pending", "approved", "declined"
      commissionStatus, // Alternative status field
      advertiserName,   // Merchant name
      advertiserId,     // Merchant ID
    } = params;

    const trackingId = (ref || clickRef || "") as string;
    const commissionAmount = parseFloat((amount || commission) as string) || 0;
    const orderId = (order || orderRef || transactionId || `awin_${Date.now()}`) as string;
    const conversionStatus = (status || commissionStatus || "pending") as string;

    console.log("[awin-webhook] Received:", {
      orderId,
      amount: commissionAmount,
      clickRef: trackingId,
      status: conversionStatus,
      advertiser: advertiserName || advertiserId,
    });

    // Skip if no commission amount
    if (commissionAmount <= 0) {
      console.log("[awin-webhook] Skipping - no commission amount");
      return res.status(200).json({ received: true, skipped: true });
    }

    // Find the member from the clickRef
    let memberId = "unknown";
    if (trackingId) {
      const foundMember = await findMemberBySubId(trackingId);
      if (foundMember) {
        memberId = foundMember;
      }
    }

    // Map Awin status to our status
    let ourStatus: "pending" | "approved" = "pending";
    if (conversionStatus.toLowerCase() === "approved" || conversionStatus.toLowerCase() === "validated") {
      ourStatus = "approved";
    }

    // Record the commission
    await recordCommission({
      memberId,
      network: "awin",
      orderId,
      subId: trackingId,
      grossAmount: commissionAmount,
      status: ourStatus,
    });

    console.log("[awin-webhook] Recorded commission:", {
      memberId,
      orderId,
      amount: commissionAmount,
    });

    // Awin expects a 200 response
    return res.status(200).json({ received: true, success: true });
  } catch (err: any) {
    console.error("[awin-webhook] error:", err?.message || err);
    return res.status(200).json({ received: true, error: err?.message });
  }
}