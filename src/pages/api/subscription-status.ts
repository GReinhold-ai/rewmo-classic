import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const { UNICORN_ORIGIN } = process.env;

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FB_ADMIN_PROJECT_ID,
      clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL,
      privateKey: (process.env.FB_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}
const adminAuth = getAuth();
const db = getFirestore();

const ALLOWED = (UNICORN_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin?: string | null) {
  return !!origin && ALLOWED.includes(origin);
}
function setCors(res: NextApiResponse, origin?: string | null) {
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin as string | undefined;
  setCors(res, origin);

  if (req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) return res.status(400).end();
    return res.status(204).end();
  }
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });

  try {
    const authz = req.headers.authorization || "";
    const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Sign-in required" });

    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email;
    if (!email) return res.status(400).json({ error: "No email on token" });

    const doc = await db.collection("preorders").doc(email).get();

    if (!doc.exists) {
      // Still return a useful shape
      return res.status(200).json({
        email,
        exists: false,
        subscriptionStatus: "none",
        status: "none",
        stripeCustomerId: null,
        productId: null,
        priceId: null,
      });
    }

    const data = doc.data() || {};
    return res.status(200).json({
      email,
      exists: true,
      status: data.status ?? "unknown",
      subscriptionStatus: data.subscriptionStatus ?? "unknown",
      stripeCustomerId: data.stripeCustomerId ?? null,
      productId: data.productId ?? null,
      priceId: data.priceId ?? null,
      lastTouch: data.lastTouch ?? null,
      updatedAt: data.updatedAt ?? null,
    });
  } catch (err: any) {
    console.error("[status] error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
}
