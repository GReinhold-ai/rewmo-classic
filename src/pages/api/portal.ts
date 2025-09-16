// src/pages/api/portal.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { getAdminDb } from "./_firebaseAdmin";

/**
 * POST /api/portal
 * Body: { email: string, returnUrl?: string }
 *
 * Looks up preorders by email to find stripeCustomerId, then opens
 * Stripe Billing Portal. If you prefer, you can switch to UID lookup.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  // since we import a shared client, just ensure env is present
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  try {
    const { email, returnUrl } = (req.body ?? {}) as { email?: string; returnUrl?: string };
    if (!email) return res.status(400).json({ error: "Missing email" });

    const db = getAdminDb();
    const doc = await db.collection("preorders").doc(email).get();
    if (!doc.exists) return res.status(404).json({ error: "No subscription found for this email" });

    const data = doc.data() || {};
    const customerId = data.stripeCustomerId as string | undefined;
    if (!customerId) return res.status(404).json({ error: "No Stripe customer attached" });

    // prefer caller-provided returnUrl, then SITE_URL, then current origin
    const defaultReturn =
      returnUrl ||
      process.env.SITE_URL ||
      `${(req.headers.origin as string) || "http://localhost:3000"}/account`;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: defaultReturn,
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    console.error("[portal] error", e?.message || e);
    return res.status(500).json({ error: "Unable to create portal session" });
  }
}
