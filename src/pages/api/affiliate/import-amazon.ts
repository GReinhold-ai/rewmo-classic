// src/pages/api/affiliate/import-amazon.ts
// Admin endpoint to import Amazon Associates earnings reports
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { recordCommission, findMemberBySubId } from "@/lib/affiliate";

// List of admin emails allowed to import
const ADMIN_EMAILS = [
  "gary.reinhold@leafpays.com",
  // Add other admin emails here
];

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Allow larger CSV files
    },
  },
};

interface AmazonEarning {
  trackingId: string;      // The ascsubtag we passed
  orderId: string;
  amount: number;
  orderDate: string;
  productCategory?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify admin auth
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);

    if (!decoded.email || !ADMIN_EMAILS.includes(decoded.email)) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { earnings } = req.body as { earnings: AmazonEarning[] };

    if (!earnings || !Array.isArray(earnings)) {
      return res.status(400).json({ error: "earnings array required" });
    }

    let imported = 0;
    let skipped = 0;
    let errors: string[] = [];

    for (const earning of earnings) {
      try {
        if (!earning.amount || earning.amount <= 0) {
          skipped++;
          continue;
        }

        // Find member from tracking ID
        let memberId = "unknown";
        if (earning.trackingId) {
          const foundMember = await findMemberBySubId(earning.trackingId);
          if (foundMember) {
            memberId = foundMember;
          }
        }

        await recordCommission({
          memberId,
          network: "amazon",
          orderId: earning.orderId || `amazon_${Date.now()}_${imported}`,
          subId: earning.trackingId || "",
          grossAmount: earning.amount,
          status: "approved", // Amazon reports are already approved
        });

        imported++;
      } catch (err: any) {
        errors.push(`Order ${earning.orderId}: ${err?.message}`);
      }
    }

    console.log("[import-amazon] Import complete:", { imported, skipped, errors: errors.length });

    return res.status(200).json({
      success: true,
      imported,
      skipped,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // First 10 errors
    });
  } catch (err: any) {
    console.error("[import-amazon] error:", err?.message || err);
    return res.status(500).json({ error: "Import failed" });
  }
}