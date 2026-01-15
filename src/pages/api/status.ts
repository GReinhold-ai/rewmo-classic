// src/pages/api/status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getUserEntitlements } from "@/lib/server/membership";

const { UNICORN_ORIGIN = "" } = process.env;

// --- Initialize Firebase Admin ---
let adminAuth: Auth;
let db: Firestore;

function ensureFirebaseInit() {
  if (getApps().length > 0) {
    adminAuth = getAuth();
    db = getFirestore();
    return true;
  }

  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccountBase64) {
    console.error("[status] FIREBASE_SERVICE_ACCOUNT env var is missing!");
    return false;
  }

  try {
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
    );
    
    initializeApp({
      credential: cert(serviceAccount),
    });
    
    adminAuth = getAuth();
    db = getFirestore();
    console.log("[status] Firebase Admin initialized successfully");
    return true;
  } catch (e) {
    console.error("[status] Failed to initialize Firebase Admin:", e);
    return false;
  }
}

// --- CORS helpers ---
function normalizeOrigin(s: string) {
  return s.trim().replace(/\/+$/, "");
}
const ALLOWED = new Set(
  UNICORN_ORIGIN.split(",").map(s => s.trim()).filter(Boolean).map(normalizeOrigin)
);
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
    if (origin && !isAllowedOrigin(origin)) return res.status(400).end();
    return res.status(204).end();
  }
  if (req.method === "HEAD") {
    if (origin && !isAllowedOrigin(origin)) return res.status(403).end();
    return res.status(200).end();
  }
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });
  if (origin && !isAllowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });

  // Ensure Firebase is initialized
  if (!ensureFirebaseInit()) {
    return res.status(500).json({ error: "Firebase not configured" });
  }

  try {
    const authz = req.headers.authorization || "";
    const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
    if (!token) {
      res.setHeader('WWW-Authenticate', 'Bearer realm="status", error="invalid_token"');
      return res.status(401).json({ error: "Sign-in required" });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const { uid, email = null } = decoded;

    const entitlements = await getUserEntitlements(uid);

    let planTier = "FREE";
    let subscriptionStatus = "none";
    let currentPeriodEnd = null;

    try {
      const userDoc = await db.collection("users").doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        planTier = userData?.tier || userData?.membership?.plan || "FREE";
        subscriptionStatus = userData?.subscriptionStatus ||
          (userData?.membership?.active ? "active" : "none");
        currentPeriodEnd = userData?.currentPeriodEnd || userData?.membership?.currentPeriodEnd || null;
      }
    } catch (dbErr: any) {
      console.error("[status] Firestore error:", dbErr?.message || dbErr);
    }

    return res.status(200).json({
      ok: true,
      uid,
      email,
      entitlements,
      planTier,
      subscriptionStatus,
      currentPeriodEnd,
    });
  } catch (err: any) {
    console.error("[status] error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
}