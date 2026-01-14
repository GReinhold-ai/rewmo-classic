// /src/pages/api/stripe/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// ---- Env & setup ------------------------------------------------------------
const {
  STRIPE_SECRET_KEY = "",
  SITE_URL = "",
  // Price IDs (set these in your env; names can be whatever you prefer)
  STRIPE_PRICE_PRO,
  STRIPE_PRICE_BUSINESS,
  // Optional: if you also sell the Fundamentals module as a subscription
  STRIPE_PRICE_FUNDAMENTALS,
} = process.env;

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}
if (!SITE_URL) {
  throw new Error("SITE_URL is not set");
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

// Map UI plan names -> Stripe Price IDs (customize as needed)
const PRICE_BY_PLAN: Record<string, string | undefined> = {
  pro: STRIPE_PRICE_PRO,
  business: STRIPE_PRICE_BUSINESS,
  fundamentals: STRIPE_PRICE_FUNDAMENTALS,
};

// ---- Handler ----------------------------------------------------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Expecting JSON body like: { plan: "pro", email?: "user@example.com" }
  const { plan = "pro", email }: { plan?: string; email?: string } = req.body || {};
  const priceId = PRICE_BY_PLAN[String(plan).toLowerCase()];

  if (!priceId) {
    return res.status(400).json({
      error: `Unknown plan "${plan}". Valid options: ${Object.keys(PRICE_BY_PLAN)
        .filter(Boolean)
        .join(", ")}`,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      // If you have the user's email, this pre-fills Checkout and links to an existing customer by email.
      customer_email: email || undefined,
      // Send folks back to Account after success/cancel
      success_url: `${SITE_URL}/account?status=success`,
      cancel_url: `${SITE_URL}/account?status=cancel`,
      metadata: {
        plan: String(plan),
        email: email || "",
      },
    });

    // ✅ Always return JSON so the client can do: window.location = data.url
    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("[create-checkout-session] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to create Checkout session" });
  }
}
