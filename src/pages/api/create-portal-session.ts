// src/pages/api/create-portal-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY)
  : (null as unknown as Stripe);


  const { customerId, returnUrl } = req.body as { customerId: string; returnUrl?: string };

  if (!customerId) return res.status(400).json({ error: "Missing customerId" });

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || process.env.SITE_URL || "https://rewmo.ai",
  });

  res.json({ url: session.url });
}
