// src/lib/affiliate.ts
// Affiliate tracking and commission management

import { getAdminDb } from "./firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export type AffiliateNetwork = "amazon" | "impact" | "awin";

export interface AffiliateClick {
  id?: string;
  memberId: string;
  retailerId: string;
  network: AffiliateNetwork;
  subId: string; // Unique tracking ID sent to network
  clickedAt: FirebaseFirestore.Timestamp;
  userAgent?: string;
  ipHash?: string; // Hashed for privacy
}

export interface AffiliateCommission {
  id?: string;
  memberId: string;
  retailerId?: string;
  network: AffiliateNetwork;
  orderId: string;
  subId: string; // Links back to the click
  grossAmount: number; // Total commission from network
  memberShare: number; // 50%
  rewmoShare: number; // 50%
  status: "pending" | "approved" | "paid";
  orderDate?: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
  paidAt?: FirebaseFirestore.Timestamp;
}

// Generate a unique sub-ID for tracking
export function generateSubId(memberId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${memberId.substring(0, 8)}_${timestamp}_${random}`;
}

// Parse sub-ID to get member ID
export function parseMemberFromSubId(subId: string): string | null {
  const parts = subId.split("_");
  if (parts.length >= 1) {
    return parts[0]; // First 8 chars of member ID
  }
  return null;
}

// Log an affiliate click
export async function logAffiliateClick(click: Omit<AffiliateClick, "id" | "clickedAt">): Promise<string> {
  const db = getAdminDb();
  const docRef = await db.collection("affiliateClicks").add({
    ...click,
    clickedAt: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

// Find member by partial ID from sub-ID
export async function findMemberBySubId(subId: string): Promise<string | null> {
  const db = getAdminDb();
  
  // First try to find the click record
  const clickQuery = await db
    .collection("affiliateClicks")
    .where("subId", "==", subId)
    .limit(1)
    .get();
  
  if (!clickQuery.empty) {
    return clickQuery.docs[0].data().memberId;
  }
  
  // Fallback: parse from subId format
  const partialId = parseMemberFromSubId(subId);
  if (partialId) {
    // Find user whose ID starts with this prefix
    const usersQuery = await db
      .collection("users")
      .orderBy("__name__")
      .startAt(partialId)
      .endAt(partialId + "\uf8ff")
      .limit(1)
      .get();
    
    if (!usersQuery.empty) {
      return usersQuery.docs[0].id;
    }
  }
  
  return null;
}

// Record a commission and update member balance
export async function recordCommission(commission: Omit<AffiliateCommission, "id" | "createdAt" | "memberShare" | "rewmoShare">): Promise<string> {
  const db = getAdminDb();
  
  // Calculate 50/50 split
  const memberShare = Math.round(commission.grossAmount * 50) / 100; // 50%
  const rewmoShare = commission.grossAmount - memberShare; // Remaining 50%
  
  // Find the member from the subId
  let memberId = commission.memberId;
  if (!memberId && commission.subId) {
    memberId = await findMemberBySubId(commission.subId) || "unknown";
  }
  
  // Create the commission record
  const commissionData: Omit<AffiliateCommission, "id"> = {
    ...commission,
    memberId,
    memberShare,
    rewmoShare,
    status: "pending",
    createdAt: FieldValue.serverTimestamp() as any,
  };
  
  const docRef = await db.collection("affiliateCommissions").add(commissionData);
  
  // Update member's pending balance
  if (memberId && memberId !== "unknown") {
    await db.collection("users").doc(memberId).update({
      affiliatePendingBalance: FieldValue.increment(memberShare),
      affiliateTotalEarnings: FieldValue.increment(memberShare),
    });
  }
  
  return docRef.id;
}

// Approve a commission (move from pending to approved)
export async function approveCommission(commissionId: string): Promise<void> {
  const db = getAdminDb();
  await db.collection("affiliateCommissions").doc(commissionId).update({
    status: "approved",
  });
}

// Mark commission as paid
export async function markCommissionPaid(commissionId: string): Promise<void> {
  const db = getAdminDb();
  const commissionDoc = await db.collection("affiliateCommissions").doc(commissionId).get();
  
  if (!commissionDoc.exists) {
    throw new Error("Commission not found");
  }
  
  const commission = commissionDoc.data() as AffiliateCommission;
  
  // Update commission status
  await db.collection("affiliateCommissions").doc(commissionId).update({
    status: "paid",
    paidAt: FieldValue.serverTimestamp(),
  });
  
  // Move from pending to paid in user's balance
  if (commission.memberId && commission.memberId !== "unknown") {
    await db.collection("users").doc(commission.memberId).update({
      affiliatePendingBalance: FieldValue.increment(-commission.memberShare),
      affiliatePaidBalance: FieldValue.increment(commission.memberShare),
    });
  }
}

// Get member's affiliate earnings summary
export async function getMemberAffiliateStats(memberId: string): Promise<{
  pendingBalance: number;
  paidBalance: number;
  totalEarnings: number;
  totalClicks: number;
  recentCommissions: AffiliateCommission[];
}> {
  const db = getAdminDb();
  
  // Get user doc
  const userDoc = await db.collection("users").doc(memberId).get();
  const userData = userDoc.data() || {};
  
  // Get recent commissions
  const commissionsQuery = await db
    .collection("affiliateCommissions")
    .where("memberId", "==", memberId)
    .orderBy("createdAt", "desc")
    .limit(20)
    .get();
  
  // Get click count
  const clicksQuery = await db
    .collection("affiliateClicks")
    .where("memberId", "==", memberId)
    .count()
    .get();
  
  return {
    pendingBalance: userData.affiliatePendingBalance || 0,
    paidBalance: userData.affiliatePaidBalance || 0,
    totalEarnings: userData.affiliateTotalEarnings || 0,
    totalClicks: clicksQuery.data().count,
    recentCommissions: commissionsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as AffiliateCommission[],
  };
}