import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const {
  STRIPE_SECRET_KEY = "",
  SITE_URL = "",
} = process.env;

if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
if (!SITE_URL) throw new Error("SITE_URL is not set");

const stripe = new Stripe(STRIPE_SECRET_KEY);

type Body = {
  /** Prefer passing a known Stripe customer ID if you have it */
  customerId?: string;
  /** Fallback: we can look up the customer by email (last created wins) */
  email?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { customerId, email }: Body = req.body || {};

  try {
    let customer = customerId;

    // Light fallback if you don't have the customerId handy
    if (!customer && email) {
      // Search customers by email (test-mode safe; returns most-recent first)
      const search = await stripe.customers.search({
        query: `email:'${email.replace(/'/g, "\\'")}'`,
        limit: 1,
      });
      customer = search.data[0]?.id;
    }

    if (!customer) {
      return res.status(400).json({ error: "Missing customerId or resolvable email" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${SITE_URL}/account`,
    });

    // Always JSON (so the client never hits “Unexpected end of JSON input”)
    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("[create-portal-session] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to create portal session" });
  }
}
