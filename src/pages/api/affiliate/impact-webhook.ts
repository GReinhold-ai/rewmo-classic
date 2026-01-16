// src/pages/api/affiliate/impact-webhook.ts
// Receives conversion postbacks from Impact.com
import type { NextApiRequest, NextApiResponse } from "next";
import { recordCommission, findMemberBySubId } from "@/lib/affiliate";

// Impact.com sends conversions via HTTP GET or POST
// You configure the postback URL in Impact.com dashboard:
// https://rewmo.ai/api/affiliate/impact-webhook?action_id={ACTION_ID}&order_id={OID}&amount={AMOUNT}&subId={SUBID1}&status={STATUS}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Impact can send GET or POST
  const params = req.method === "GET" ? req.query : { ...req.query, ...req.body };

  try {
    const {
      action_id,    // Impact's action/conversion ID
      order_id,     // Merchant's order ID
      amount,       // Commission amount
      subId,        // Our tracking subId (passed through from click)
      sub1,         // Alternative subId field name
      status,       // Status: "approved", "pending", "reversed"
      event_date,   // When the conversion happened
      advertiser,   // Advertiser/merchant name
    } = params;

    const trackingId = (subId || sub1 || "") as string;
    const commissionAmount = parseFloat(amount as string) || 0;
    const orderId = (order_id || action_id || `impact_${Date.now()}`) as string;

    console.log("[impact-webhook] Received:", {
      orderId,
      amount: commissionAmount,
      subId: trackingId,
      status,
      advertiser,
    });

    // Skip if no commission amount
    if (commissionAmount <= 0) {
      console.log("[impact-webhook] Skipping - no commission amount");
      return res.status(200).json({ received: true, skipped: true });
    }

    // Find the member from the subId
    let memberId = "unknown";
    if (trackingId) {
      const foundMember = await findMemberBySubId(trackingId);
      if (foundMember) {
        memberId = foundMember;
      }
    }

    // Record the commission
    await recordCommission({
      memberId,
      network: "impact",
      orderId,
      subId: trackingId,
      grossAmount: commissionAmount,
      status: status === "approved" ? "approved" : "pending",
    });

    console.log("[impact-webhook] Recorded commission:", {
      memberId,
      orderId,
      amount: commissionAmount,
    });

    // Impact expects a 200 response
    return res.status(200).json({ received: true, success: true });
  } catch (err: any) {
    console.error("[impact-webhook] error:", err?.message || err);
    // Still return 200 to prevent retries on our errors
    return res.status(200).json({ received: true, error: err?.message });
  }
}