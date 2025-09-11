// src/pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string | undefined;
const SITE_URL = (process.env.SITE_URL || "https://rewmo.ai").replace(/\/+$/, "");

// Price IDs for subscriptions (set these in .env.local)
const PRICE_PRO = process.env.STRIPE_PRICE_PRO;           // Pro monthly price
const PRICE_BUSINESS = process.env.STRIPE_PRICE_BUSINESS; // Business monthly price

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY)
  : (null as unknown as Stripe);

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

// best-effort origin (works on Vercel too)
function getOrigin(req: NextApiRequest) {
  const proto =
    (req.headers["x-forwarded-proto"] as string) ||
    (req.headers["x-forwarded-protocol"] as string) ||
    "http";
  const host = (req.headers["x-forwarded-host"] as string) || (req.headers.host as string) || "";
  if (!host) return SITE_URL;
  return `${proto}://${host}`;
}

async function getOrCreateCustomerByEmail(email: string) {
  const list = await stripe.customers.list({ email, limit: 1 });
  if (list.data.length > 0) return list.data[0];
  return stripe.customers.create({ email });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCORS(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    return res.json({
      ok: true,
      route: "create-checkout-session",
      hint: 'POST { email, plan: "pro" | "business", priceId?, source?, utm_*? } to create a Stripe Checkout session',
    });
  }

  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  if (!STRIPE_SECRET_KEY) return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });

  try {
    const origin = getOrigin(req);
    const {
      email,
      // Preferred new param:
      plan, // "pro" | "business"
      // Optional explicit price override (takes precedence)
      priceId,
      // Tracking (optional)
      source,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = (req.body || {}) as Record<string, string | undefined>;

    if (!email) return res.status(400).json({ error: "Missing email" });

    // Resolve the price to use
    let selectedPrice = priceId;
    if (!selectedPrice) {
      const normalizedPlan = (plan || "pro").toLowerCase();
      if (normalizedPlan === "business") {
        selectedPrice = PRICE_BUSINESS || undefined;
      } else {
        selectedPrice = PRICE_PRO || undefined; // default pro
      }
    }
    if (!selectedPrice) {
      return res.status(400).json({
        error:
          "No Stripe price configured. Set STRIPE_PRICE_PRO and STRIPE_PRICE_BUSINESS or pass a priceId.",
      });
    }

    // Build useful metadata
    const metadata: Record<string, string> = {
      plan: (plan || "pro").toLowerCase(),
    };
    if (email) metadata.email = email;
    if (source) metadata.source = source;
    if (utm_source) metadata.utm_source = utm_source;
    if (utm_medium) metadata.utm_medium = utm_medium;
    if (utm_campaign) metadata.utm_campaign = utm_campaign;
    if (utm_term) metadata.utm_term = utm_term;
    if (utm_content) metadata.utm_content = utm_content;

    // Use a real Stripe customer (helps the portal & receipts)
    const customer = await getOrCreateCustomerByEmail(email);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [{ price: selectedPrice, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/account?checkout=success`,
      cancel_url: `${origin}/account?checkout=cancel`,
      metadata,
      subscription_data: { metadata },
      payment_method_types: ["card"],
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] error", err?.message || err);
    return res.status(500).json({ error: "Server error creating checkout session" });
  }
}
