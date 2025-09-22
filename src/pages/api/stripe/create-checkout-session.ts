// src/pages/api/stripe/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const PRICE_RPM = process.env.NEXT_PUBLIC_STRIPE_PRICE_RPM_FUNDAMENTALS!;
const PRODUCT_ID = process.env.NEXT_PUBLIC_RPM_PRODUCT_ID || "rpm-fundamentals";
const DEFAULT_SITE_URL = process.env.SITE_URL || "http://localhost:3000";

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

/** Build origin even on Vercel proxies */
function getOrigin(req: NextApiRequest) {
  const xfProto =
    (req.headers["x-forwarded-proto"] as string) ||
    (req.headers["x-forwarded-protocol"] as string);
  const xfHost = (req.headers["x-forwarded-host"] as string) || (req.headers.host as string);
  if (xfProto && xfHost) return `${xfProto}://${xfHost}`;
  return DEFAULT_SITE_URL.replace(/\/+$/, "");
}

/** Optional: light CORS (keeps previews and prod happy) */
function setCORS(req: NextApiRequest, res: NextApiResponse) {
  const origin = (req.headers.origin as string) || "";
  const allowList = new Set<string>([
    DEFAULT_SITE_URL,
    "http://localhost:3000",
    "https://rewmo.ai",
  ]);
  let allowOrigin = "";
  try {
    const u = new URL(origin);
    if (allowList.has(origin) || u.hostname.endsWith(".vercel.app")) allowOrigin = origin;
  } catch {}
  if (!allowOrigin) allowOrigin = DEFAULT_SITE_URL;
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCORS(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    // Expect the client to pass Firebase user identity
    const { uid, email } = req.body as { uid?: string; email?: string };

    if (!uid || !email) {
      return res.status(400).json({ error: "Missing uid or email" });
    }
    if (!PRICE_RPM) {
      return res.status(500).json({ error: "Missing NEXT_PUBLIC_STRIPE_PRICE_RPM_FUNDAMENTALS" });
    }

    const origin = getOrigin(req);

    // IMPORTANT: add metadata so webhook/reconcile can grant access
    const metadata = { uid, productId: PRODUCT_ID };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: PRICE_RPM, quantity: 1 }],
      metadata,
      subscription_data: { metadata },

      // Include session_id in success URL for client-side reconcile
      success_url: `${origin}/leanai/fundamentals?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/leanai/fundamentals?canceled=1`,

      allow_promotion_codes: true,
      payment_method_types: ["card"],
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("[create-checkout-session] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to create Checkout session" });
  }
}
