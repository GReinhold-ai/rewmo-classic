import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// ---------- Env & Stripe ----------
const {
  STRIPE_SECRET_KEY,
  SITE_URL,
  UNICORN_ORIGIN, // comma-separated allowlist, e.g. "https://rewmo.ai,https://app.rewmo.ai"
  // Live/test price IDs (set these in Vercel)
  STRIPE_PRICE_BUNDLE,
  STRIPE_PRICE_REWMO,
  STRIPE_PRICE_ENTERPRISE,
} = process.env;

if (!STRIPE_SECRET_KEY) {
  console.warn("[checkout] STRIPE_SECRET_KEY is missing");
}
const stripe = new Stripe(STRIPE_SECRET_KEY ?? "");

// ---------- Firebase Admin ----------
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

// ---------- Helpers ----------
const ALLOWED = (UNICORN_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin?: string | null) {
  if (!origin) return false;
  return ALLOWED.includes(origin);
}

function setCors(res: NextApiResponse, origin?: string | null) {
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

type BodyIn = {
  product?: "RewmoAI + EnterpriseAI" | "RewmoAI" | "EnterpriseAI";
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

const PRICE_IDS: Record<string, string | undefined> = {
  "RewmoAI + EnterpriseAI": STRIPE_PRICE_BUNDLE,
  RewmoAI: STRIPE_PRICE_REWMO,
  EnterpriseAI: STRIPE_PRICE_ENTERPRISE,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin as string | undefined;
  setCors(res, origin);

  // Preflight
  if (req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) return res.status(400).end();
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return res.json({
      ok: true,
      route: "create-checkout-session",
      hint: "POST email/product/source/utm to create a Stripe Checkout session (email now taken from Firebase ID token).",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!isAllowedOrigin(origin)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });
  }

  const site = SITE_URL || origin || "";
  if (!site) {
    return res.status(500).json({ error: "Missing SITE_URL/Origin" });
  }

  // ---- Require Firebase ID token & pull trusted identity (no client email) ----
  try {
    const authz = req.headers.authorization || "";
    const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Sign-in required" });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email || decoded.firebase?.identities?.email?.[0]; // defensive

    if (!email) {
      return res.status(400).json({ error: "User email not present on token" });
    }

    // Body (product + UTM only; email is ignored)
    const body = (req.body || {}) as BodyIn;
    const product = body.product || "RewmoAI + EnterpriseAI";
    const priceId = PRICE_IDS[product];
    if (!priceId) {
      return res.status(400).json({
        error: `Unknown product '${product}'. Set STRIPE_PRICE_* envs.`,
      });
    }

    // UTM & attribution
    const source = body.source || "unicorn";
    const utm = {
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
    };

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      client_reference_id: uid,
      customer_email: email, // If a Customer already exists for this email, Stripe will attach it.
      metadata: {
        uid,
        email,
        source,
        ...utm,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${site.replace(/\/$/, "")}/thank-you?email=${encodeURIComponent(
        email
      )}`,
      cancel_url: `${site.replace(/\/$/, "")}/?canceled=1`,
    });

    // Seed/merge a pending preorder for downstream webhook to finalize
    try {
      await db
        .collection("preorders")
        .doc(email)
        .set(
          {
            status: "pending",
            subscriptionStatus: "pending",
            product,
            priceId,
            stripeSessionId: session.id,
            stripeCustomerId: session.customer || null,
            source,
            lastTouch: utm,
            clientReferenceId: uid,
            siteUrl: site,
            checkoutUrlPreview: session.url || null, // handy while testing
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
    } catch (e) {
      console.warn("[checkout] Firestore seed failed (continuing):", e);
      // Not fatal for returning the Stripe URL
    }

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
}
