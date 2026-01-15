// src/pages/api/status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getUserEntitlements } from "@/lib/server/membership";

const {
  UNICORN_ORIGIN = "",
  FB_ADMIN_PROJECT_ID,
  FB_ADMIN_CLIENT_EMAIL,
  FB_ADMIN_PRIVATE_KEY,
} = process.env;

// --- Initialize Firebase Admin (safe for dev hot-reload) ---
if (!getApps().length && FB_ADMIN_PROJECT_ID && FB_ADMIN_CLIENT_EMAIL && FB_ADMIN_PRIVATE_KEY) {
  try {
    initializeApp({
      credential: cert({
        projectId: FB_ADMIN_PROJECT_ID,
        clientEmail: FB_ADMIN_CLIENT_EMAIL,
        privateKey: FB_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } catch {
    // ignore re-init errors in dev
  }
}
const adminAuth = getAuth();
const db = getFirestore();

// --- CORS helpers ---
function normalizeOrigin(s: string) {
  return s.trim().replace(/\/+$/, "");
}
const ALLOWED = new Set(
  UNICORN_ORIGIN.split(",").map(s => s.trim()).filter(Boolean).map(normalizeOrigin)
);
// allow shorthand like "localhost:3000"
for (const o of Array.from(ALLOWED)) {
  if (!/^http/.test(o)) {
    ALLOWED.add(`http://${o}`);
    ALLOWED.add(`https://${o}`);
  }
}
function isAllowedOrigin(origin?: string | null) {
  return !!origin && ALLOWED.has(normalizeOrigin(origin));
}
function setCors(res: NextApiResponse, origin?: string | null) {
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin as string | undefined;
  setCors(res, origin);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) return res.status(400).end();
    return res.status(204).end();
  }
  if (req.method === "HEAD") {
    if (!isAllowedOrigin(origin)) return res.status(403).end();
    return res.status(200).end();
  }
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });

  try {
    const authz = req.headers.authorization || "";
    const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
    if (!token) {
      res.setHeader('WWW-Authenticate', 'Bearer realm="status", error="invalid_token"');
      return res.status(401).json({ error: "Sign-in required" });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const { uid, email = null } = decoded;

    // Get entitlements
    const entitlements = await getUserEntitlements(uid);

    // ✅ NEW: Fetch user document from Firestore to get tier and subscription status
    let planTier = "FREE";
    let subscriptionStatus = "none";
    let currentPeriodEnd = null;

    try {
      const userDoc = await db.collection("users").doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        
        // Check tier field first, then membership.plan as fallback
        planTier = userData?.tier || userData?.membership?.plan || "FREE";
        
        // Check subscriptionStatus field first, then membership.active as fallback
        subscriptionStatus = userData?.subscriptionStatus || 
          (userData?.membership?.active ? "active" : "none");
        
        // Get period end if available
        currentPeriodEnd = userData?.currentPeriodEnd || userData?.membership?.currentPeriodEnd || null;
      }
    } catch (dbErr: any) {
      console.error("[status] Firestore error:", dbErr?.message || dbErr);
      // Continue with defaults if Firestore fails
    }

    return res.status(200).json({
      ok: true,
      uid,
      email,
      entitlements,
      planTier,           // ✅ Now included
      subscriptionStatus, // ✅ Now included
      currentPeriodEnd,   // ✅ Now included
    });
  } catch (err: any) {
    console.error("[status] error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
}