// src/pages/api/status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import Stripe from "stripe";

// ---------- Env ----------
const {
  UNICORN_ORIGIN,
  FB_ADMIN_PROJECT_ID,
  FB_ADMIN_CLIENT_EMAIL,
  FB_ADMIN_PRIVATE_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_PRICE_PRO,
  STRIPE_PRICE_BUSINESS,
} = process.env;

// ---------- Firebase Admin ----------
if (!getApps().length) {
  if (!FB_ADMIN_PROJECT_ID || !FB_ADMIN_CLIENT_EMAIL || !FB_ADMIN_PRIVATE_KEY) {
    console.warn("[status] Missing Firebase Admin env vars; endpoint will likely fail.");
  }
  initializeApp({
    credential: cert({
      projectId: FB_ADMIN_PROJECT_ID,
      clientEmail: FB_ADMIN_CLIENT_EMAIL,
      privateKey: (FB_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}
const adminAuth = getAuth();
const db = getFirestore();

// ---------- Stripe ----------
const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : (null as unknown as Stripe);

type Tier = "free" | "pro" | "business";

// ---------- CORS ----------
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

// ---------- Stripe helpers ----------
async function getStripeCustomerByEmail(email: string) {
  if (!stripe) return null;
  const list = await stripe.customers.list({ email, limit: 1 });
  return list.data[0] || null;
}

function inferTierFromPriceId(priceId?: string | null): Tier {
  if (!priceId) return "free";
  if (STRIPE_PRICE_BUSINESS && priceId === STRIPE_PRICE_BUSINESS) return "business";
  if (STRIPE_PRICE_PRO && priceId === STRIPE_PRICE_PRO) return "pro";
  // Fallback if you add more prices later but didn't map them yet
  return "pro";
}

async function lookupStripeStatus(email: string) {
  if (!stripe) {
    return { hasCustomer: false, subscriptionStatus: "none", tier: "free" as Tier };
  }
  const customer = await getStripeCustomerByEmail(email);
  if (!customer) {
    return { hasCustomer: false, subscriptionStatus: "none", tier: "free" as Tier };
  }

  const subs = await stripe.subscriptions.list({
    customer: customer.id,
    status: "all",
    limit: 5,
    expand: ["data.items.data.price.product"],
  });

  if (!subs.data.length) {
    return { hasCustomer: true, subscriptionStatus: "none", tier: "free" as Tier };
  }

  // Prefer active/trialing; otherwise most recent
  const best =
    subs.data.find((s) => s.status === "active" || s.status === "trialing") ||
    subs.data.sort((a, b) => b.created - a.created)[0];

  const priceId = best.items?.data?.[0]?.price?.id || null;
  const tier = inferTierFromPriceId(priceId);
  return {
    hasCustomer: true,
    subscriptionStatus: best.status,
    tier,
    subscriptionId: best.id,
    currentPeriodEnd: best.current_period_end
      ? new Date(best.current_period_end * 1000).toISOString()
      : null,
    cancelAtPeriodEnd: best.cancel_at_period_end ?? false,
    priceId,
  };
}

// ---------- Handler ----------
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

    // Firestore preorder doc (your existing data)
    const doc = await db.collection("preorders").doc(email).get();
    const preorder = doc.exists ? (doc.data() || {}) : null;

    // Stripe status (new)
    const stripeStatus = await lookupStripeStatus(email);

    return res.status(200).json({
      email,
      // Firestore (existing)
      exists: !!preorder,
      preorderStatus: preorder?.status ?? "none",
      preorderSubscriptionStatus: preorder?.subscriptionStatus ?? "none",
      stripeCustomerId: preorder?.stripeCustomerId ?? null,
      productId: preorder?.productId ?? null,
      priceId: preorder?.priceId ?? null,
      lastTouch: preorder?.lastTouch ?? null,
      updatedAt: preorder?.updatedAt ?? null,

      // Stripe (new)
      stripe: stripeStatus, // { hasCustomer, subscriptionStatus, tier, ... }
      // Convenience fields for UI:
      tier: stripeStatus.tier,
      subscriptionStatus: stripeStatus.subscriptionStatus,
    });
  } catch (err: any) {
    console.error("[status] error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
}
