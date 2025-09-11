// src/pages/api/create-portal-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Create a Stripe client only if the secret exists (avoid TS errors at build)
const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY)
  : (null as unknown as Stripe);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Optional preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).end();

  try {
    if (!stripe) {
      return res
        .status(500)
        .json({ error: "Stripe not configured (missing STRIPE_SECRET_KEY)" });
    }

    // The authenticated Stripe Customer ID must come from your app/session.
    // Adjust this to your auth model (e.g., Firebase user -> Stripe customer).
    const { customerId } = (req.body || {}) as { customerId?: string };
    if (!customerId) {
      return res.status(400).json({ error: "Missing customerId" });
    }

    const returnUrl =
      process.env.STRIPE_BILLING_PORTAL_RETURN_URL ||
      "https://rewmo.ai/account";

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("create-portal-session error:", err);
    return res
      .status(500)
      .json({ error: "Stripe error", details: err?.message ?? String(err) });
  }
}
