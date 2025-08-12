// src/pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// --- CORS helper (handles preflight and echoes allowed origin) ---
function applyCors(req: NextApiRequest, res: NextApiResponse) {
  const origins = (process.env.UNICORN_ORIGIN || "")
    .split(",")
    .map(o => o.trim())
    .filter(Boolean);

  const reqOrigin = (req.headers.origin as string) || "";
  const allow = reqOrigin && origins.includes(reqOrigin) ? reqOrigin : origins[0] || "*";

  res.setHeader("Access-Control-Allow-Origin", allow);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // handled preflight
  }
  return false;
}

// --- Firebase Admin init ---
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FB_ADMIN_PROJECT_ID,
      clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FB_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}
const db = getFirestore();

// --- Stripe init ---
// (no apiVersion so we use account default to avoid TS literal mismatch)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Always set CORS / handle preflight early
  if (applyCors(req, res)) return;

  // Helpful GET for verifying deployment/routes
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      info: "Use POST to create a checkout session.",
      method: req.method,
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed", method: req.method });
  }

  try {
    const { email, product = "RewmoAI + EnterpriseAI", source = "unicorn" } = (req.body || {});
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Base URL for redirects (falls back to request host)
    const base =
      process.env.SITE_URL ||
      (req.headers.origin as string) ||
      `https://${req.headers.host}`;

    // Use a Price if provided, else inline price_data
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem =
      process.env.STRIPE_PRICE_ID
        ? { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
        : {
            price_data: {
              currency: "usd",
              recurring: { interval: "month" as const },
              product_data: { name: `${product} Subscription` },
              unit_amount: 1000, // $10
            },
            quantity: 1,
          };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [lineItem],
      allow_promotion_codes: true,
      success_url: `${base}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cancel`,
      metadata: { product, source },
    });

    await db.collection("preorders").doc(email).set(
      {
        email,
        product,
        source,
        stripeSessionId: session.id,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
