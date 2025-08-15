// src/pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ----------------- CORS helper -----------------
function handleCors(req: NextApiRequest, res: NextApiResponse) {
  const origins = (process.env.UNICORN_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const reqOrigin = (req.headers.origin as string) || "";
  const allow = origins.length
    ? origins.includes(reqOrigin)
      ? reqOrigin
      : origins[0]
    : "*";

  res.setHeader("Access-Control-Allow-Origin", allow);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Reply to preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(200).end();
    return true;
  }
  return false;
}

// ----------------- Stripe init -----------------
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY || "");

// ----------------- Firebase Admin init -----------------
if (!getApps().length) {
  const projectId = process.env.FB_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FB_ADMIN_CLIENT_EMAIL;
  const privateKey = (process.env.FB_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  } else {
    console.warn(
      "[checkout] Missing one or more Firebase Admin envs (FB_ADMIN_PROJECT_ID / FB_ADMIN_CLIENT_EMAIL / FB_ADMIN_PRIVATE_KEY)"
    );
  }
}
const db = getFirestore();

// ----------------- Types -----------------
type CheckoutBody = {
  email?: string;
  product?: string;
  source?: string;
  priceId?: string; // optional override
  // UTM fields
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

// ----------------- Handler -----------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (handleCors(req, res)) return;

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "create-checkout-session",
      hint: "POST email/product/source/utm to create a Stripe Checkout session",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Basic env validation
  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });
  }
  const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
  if (!siteUrl) {
    return res.status(500).json({ error: "Missing SITE_URL" });
  }

  try {
    const {
      email,
      product = "RewmoAI + EnterpriseAI",
      source = "unicorn",
      priceId: priceIdOverride,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
    } = (req.body || {}) as CheckoutBody;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Build line item
    const envPriceId = process.env.STRIPE_PRICE_ID;
    const activePriceId = (priceIdOverride || envPriceId || "").trim();

    let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;
    if (activePriceId) {
      lineItem = { price: activePriceId, quantity: 1 };
    } else {
      // Fallback inline price: $10/month
      lineItem = {
        price_data: {
          currency: "usd",
          product_data: { name: `${product} Subscription` },
          recurring: { interval: "month" }, // literal 'month' satisfies Stripe types
          unit_amount: 1000,
        },
        quantity: 1,
      };
    }

    // Carry attribution in metadata (and store in Firestore below)
    const metadata: Record<string, string> = {
      product,
      source,
    };
    if (utm_source) metadata.utm_source = utm_source;
    if (utm_medium) metadata.utm_medium = utm_medium;
    if (utm_campaign) metadata.utm_campaign = utm_campaign;
    if (utm_content) metadata.utm_content = utm_content;
    if (utm_term) metadata.utm_term = utm_term;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [lineItem],
      allow_promotion_codes: true,
      success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      metadata,
    });

    // Seed/merge preorder keyed by email (lets the webhook “activate” later)
    await db
      .collection("preorders")
      .doc(email)
      .set(
        {
          email,
          product,
          source,
          utm: {
            utm_source: utm_source || null,
            utm_medium: utm_medium || null,
            utm_campaign: utm_campaign || null,
            utm_content: utm_content || null,
            utm_term: utm_term || null,
          },
          stripeSessionId: session.id,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] error:", err);
    // Surface Stripe validation messages when possible
    const message =
      err?.raw?.message ||
      err?.message ||
      "Server error creating checkout session";
    return res.status(500).json({ error: message });
  }
}
