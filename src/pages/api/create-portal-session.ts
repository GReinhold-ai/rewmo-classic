// src/pages/api/create-portal-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Read the secret from env (don’t hardcode apiVersion)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Create a Stripe client if the key exists, otherwise a typed null
const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY)
  : (null as unknown as Stripe);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS preflight (optional; keeps OPTIONS quiet)
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).end();

  try {
    if (!stripe) {
      return res
        .status(500)
        .json({ error: "Stripe is not configured (missing STRIPE_SECRET_KEY)" });
    }

    const returnUrl =
      process.env.STRIPE_BILLING_PORTAL_RETURN_URL ||
      "https://rewmo.ai/account";

    // Expect the authenticated Stripe Customer ID in the body or session.
    // Adjust this to however you store/fetch it (Firebase user -> Stripe mapping).
    const { customerId } = (req.body || {}) as { customerId?: string };

    if (!customerId) {
      return res.status(400).json({ error: "Missing customerId" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("create-portal-session error:", err);
    return res.status(500).json({
      error: "Stripe error",
      details: err?.message ?? String(err),
    });
  }
}
