import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";

/**
 * Body: { priceId: string, email?: string, referralCode?: string }
 * Returns: { url }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { priceId, email, referralCode } = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) || {};
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });

    // Determine mode by inspecting the price
    const price = await stripe.prices.retrieve(priceId);
    const isRecurring = !!price.recurring;
    const mode: "subscription" | "payment" = isRecurring ? "subscription" : "payment";

    const origin =
      (req.headers["x-forwarded-proto"] && req.headers["x-forwarded-host"])
        ? `${req.headers["x-forwarded-proto"]}://${req.headers["x-forwarded-host"]}`
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const successUrl = `${origin}/account?status=success`;
    const cancelUrl = `${origin}/account/upgrade?status=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        referralCode: referralCode || "",
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    console.error("checkout error", e);
    return res.status(500).json({ error: e?.message || "Checkout failed" });
  }
}
