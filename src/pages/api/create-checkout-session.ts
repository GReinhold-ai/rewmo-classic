// src/pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string | undefined;
const SITE_URL = (process.env.SITE_URL || "https://rewmo.ai").replace(/\/+$/, "");

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : (null as unknown as Stripe);

// --- CORS helper: echo allowed origins (prod + any *.vercel.app preview) ---
function setCORS(req: NextApiRequest, res: NextApiResponse) {
  const origin = (req.headers.origin as string) || "";
  const allowList = new Set<string>([
    SITE_URL,
    "https://rewmo.ai",
    "https://aitools.rewmo.ai",
  ]);

  let allowOrigin = "";
  try {
    const u = new URL(origin);
    if (allowList.has(origin) || u.hostname.endsWith(".vercel.app")) {
      allowOrigin = origin;
    }
  } catch {
    /* ignore */
  }
  if (!allowOrigin) allowOrigin = SITE_URL;

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// Map your products → live/test price ids via env
const PRICE_IDS = {
  BUNDLE: process.env.STRIPE_PRICE_BUNDLE,          // RewmoAI + EnterpriseAI
  PERSONAL: process.env.STRIPE_PRICE_REWMO,         // RewmoAI only
  BUSINESS: process.env.STRIPE_PRICE_ENTERPRISE,    // EnterpriseAI only
} as const;

function resolvePriceId(product?: string): string | undefined {
  if (!product) return PRICE_IDS.BUNDLE || PRICE_IDS.PERSONAL || PRICE_IDS.BUSINESS;
  const key = product.toLowerCase();
  if (key.includes("bundle") || key.includes("+")) return PRICE_IDS.BUNDLE;
  if (key.includes("enterprise")) return PRICE_IDS.BUSINESS;
  if (key.includes("rewmo")) return PRICE_IDS.PERSONAL;
  return PRICE_IDS.BUNDLE || PRICE_IDS.PERSONAL || PRICE_IDS.BUSINESS;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCORS(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    return res.json({
      ok: true,
      route: "create-checkout-session",
      hint: "POST email/product/source/utm to create a Stripe Checkout session",
    });
  }

  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  if (!STRIPE_SECRET_KEY) return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });

  try {
    const {
      email,
      product,
      source,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = (req.body || {}) as Record<string, string | undefined>;

    const priceId = resolvePriceId(product);
    if (!priceId) {
      return res.status(400).json({ error: "No Stripe price configured. Set STRIPE_PRICE_* envs." });
    }

    const metadata: Record<string, string> = {};
    if (email) metadata.email = email;
    if (source) metadata.source = source;
    if (utm_source) metadata.utm_source = utm_source;
    if (utm_medium) metadata.utm_medium = utm_medium;
    if (utm_campaign) metadata.utm_campaign = utm_campaign;
    if (utm_term) metadata.utm_term = utm_term;
    if (utm_content) metadata.utm_content = utm_content;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${SITE_URL}/success?email=${encodeURIComponent(email || "")}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/#pricing`,
      customer_email: email || undefined,
      metadata,
      payment_method_types: ["card"],
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] error", err?.message || err);
    return res.status(500).json({ error: "Server error creating checkout session" });
  }
}
