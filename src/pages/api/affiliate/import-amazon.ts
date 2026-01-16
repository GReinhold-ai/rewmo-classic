// src/pages/api/affiliate/import-amazon.ts
// API endpoint to import Amazon Associates commissions
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

interface ImportCommission {
  memberId: string;
  orderId: string;
  subId?: string;
  grossAmount: number; // In cents
  orderDate?: string;
  trackingId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { commissions } = req.body as { commissions: ImportCommission[] };

    if (!commissions || !Array.isArray(commissions) || commissions.length === 0) {
      return res.status(400).json({ error: "No commissions provided" });
    }

    const db = getAdminDb();
    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const commission of commissions) {
      try {
        // Validate required fields
        if (!commission.memberId || !commission.orderId || !commission.grossAmount) {
          results.errors.push(`Invalid commission data: ${JSON.stringify(commission)}`);
          results.skipped++;
          continue;
        }

        // Check for duplicate
        const existingQuery = await db
          .collection("affiliateCommissions")
          .where("orderId", "==", commission.orderId)
          .limit(1)
          .get();

        if (!existingQuery.empty) {
          results.skipped++;
          continue; // Skip duplicates silently
        }

        // Calculate 50/50 split
        const grossAmount = commission.grossAmount;
        const memberShare = Math.round(grossAmount * 0.5);
        const rewmoShare = grossAmount - memberShare;

        // Create commission record
        const commissionData = {
          memberId: commission.memberId,
          network: "amazon" as const,
          orderId: commission.orderId,
          subId: commission.subId || "",
          trackingId: commission.trackingId || "",
          grossAmount,
          memberShare,
          rewmoShare,
          status: "pending" as const,
          orderDate: commission.orderDate
            ? new Date(commission.orderDate)
            : null,
          createdAt: FieldValue.serverTimestamp(),
          importedAt: FieldValue.serverTimestamp(),
          source: "csv-import",
        };

        const docRef = await db.collection("affiliateCommissions").add(commissionData);

        // Update member's pending balance
        if (commission.memberId && commission.memberId !== "unknown") {
          await db
            .collection("users")
            .doc(commission.memberId)
            .update({
              affiliatePendingBalance: FieldValue.increment(memberShare),
              affiliateTotalEarnings: FieldValue.increment(memberShare),
            });
        }

        results.imported++;
      } catch (error) {
        results.errors.push(
          `Error importing order ${commission.orderId}: ${(error as Error).message}`
        );
      }
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error("Import error:", error);
    return res.status(500).json({ error: "Import failed: " + (error as Error).message });
  }
}
