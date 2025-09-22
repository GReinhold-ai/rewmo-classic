// src/pages/api/stripe/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_RPM_FUNDAMENTALS!;

// Omit apiVersion so TS doesn't choke on Stripe's evolving union type
const stripe = new Stripe(STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { uid, email } = (req.body ?? {}) as { uid?: string; email?: string };

    if (!PRICE_ID) {
      return res.status(500).json({ error: "Missing NEXT_PUBLIC_STRIPE_PRICE_RPM_FUNDAMENTALS" });
    }

    const base =
      (req.headers.origin as string) ||
      (req.headers.host ? `http://${req.headers.host}` : "http://localhost:3000");

    const successUrl = `${base}/leanai/fundamentals?success=1&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${base}/leanai/fundamentals?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",                       // recurring
      customer_email: email,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      metadata: uid ? { uid } : undefined,        // used by webhook to grant entitlement
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error", err);
    return res.status(500).json({ error: err?.message || "Internal Server Error" });
  }
}
