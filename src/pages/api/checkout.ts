// src/pages/api/checkout.ts
// Wrapper that forwards to the actual Stripe checkout endpoint
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const SITE_URL = process.env.SITE_URL || "https://rewmo.ai";
const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO || "";
const STRIPE_PRICE_BUSINESS = process.env.STRIPE_PRICE_BUSINESS || "";

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { priceId, email, quantity = 1, metadata = {} } = req.body || {};

    // If priceId not provided directly, try to map from plan name
    let finalPriceId = priceId;
    if (!finalPriceId && req.body?.plan) {
      const planMap: Record<string, string> = {
        pro: STRIPE_PRICE_PRO,
        business: STRIPE_PRICE_BUSINESS,
      };
      finalPriceId = planMap[req.body.plan.toLowerCase()];
    }

    if (!finalPriceId) {
      return res.status(400).json({ error: "Missing priceId or valid plan" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: finalPriceId, quantity }],
      allow_promotion_codes: true,
      customer_email: email || undefined,
      success_url: `${SITE_URL}/account?status=success`,
      cancel_url: `${SITE_URL}/account?status=cancel`,
      metadata,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] error:", err?.message || err);
    return res.status(500).json({ error: err?.message || "Failed to create Checkout session" });
  }
}