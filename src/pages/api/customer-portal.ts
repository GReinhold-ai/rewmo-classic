// src/pages/api/customer-portal.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string | undefined;
const BILLING_PORTAL_RETURN_URL =
  process.env.STRIPE_BILLING_PORTAL_RETURN_URL || "https://rewmo.ai/account";

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" }) : (null as unknown as Stripe);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  if (!STRIPE_SECRET_KEY) return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });

  try {
    const { email } = (req.body || {}) as { email?: string };
    if (!email) return res.status(400).json({ error: "Missing email" });

    // Find or create customer by email
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer =
      existing.data.length > 0
        ? existing.data[0]
        : await stripe.customers.create({ email });

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: BILLING_PORTAL_RETURN_URL,
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("[portal] error", err?.message || err);
    return res.status(500).json({ error: "Server error creating billing portal session" });
  }
}
