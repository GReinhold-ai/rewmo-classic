// src/pages/api/checkout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";

function cleanQuantity(q?: number): number {
  const n = Math.floor(Number(q));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 100); // optional cap
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const { priceId, quantity = 1, uid, email, metadata } = (req.body ?? {}) as {
      priceId?: string;
      quantity?: number;
      uid?: string;
      email?: string;
      metadata?: Record<string, string>;
    };

    if (!priceId) return res.status(400).json({ error: "Missing priceId" });
    if (!email || !uid) return res.status(400).json({ error: "Missing user info" });

    const qty = cleanQuantity(quantity);

    const base = process.env.SITE_URL || "http://localhost:3000";
    const successUrl = new URL("/account?success=1", base).toString();
    const cancelUrl = new URL("/account/upgrade?canceled=1", base).toString();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Recommended: Let Stripe enable Link, Apple Pay, etc.
      automatic_payment_methods: { enabled: true },

      customer_email: email,
      line_items: [{ price: priceId, quantity: qty }],
      allow_promotion_codes: true,

      success_url: successUrl,
      cancel_url: cancelUrl,

      // A small string OK; keep it lightweight
      client_reference_id: uid,

      // Carry context into the resulting subscription & the session object
      subscription_data: {
        metadata: {
          uid,
          email,
          ...(metadata || {}),
        },
      },
      metadata: {
        uid,
        email,
        ...(metadata || {}),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    console.error("[checkout] error:", e?.message || e);
    return res.status(500).json({ error: "Unable to create checkout session" });
  }
}
