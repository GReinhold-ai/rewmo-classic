import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// --- CORS helper (handles preflight cleanly) ---
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

// --- Lazy Firestore (don’t crash if envs are missing) ---
function getDbOrNull() {
  try {
    if (!getApps().length) {
      const projectId   = process.env.FB_ADMIN_PROJECT_ID;
      const clientEmail = process.env.FB_ADMIN_CLIENT_EMAIL;
      const privateKey  = process.env.FB_ADMIN_PRIVATE_KEY;
      if (!projectId || !clientEmail || !privateKey) return null;

      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    }
    return getFirestore();
  } catch (e) {
    console.error("firebase admin init failed:", e);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Always set/handle CORS first
  if (applyCors(req, res)) return;

  // Lightweight GET so we can verify the route without initializing Stripe/Admin
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "create-checkout-session",
      hint: "POST to create a Stripe Checkout session",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed", method: req.method });
  }

  try {
    const { email, product = "RewmoAI + EnterpriseAI", source = "unicorn" } = (req.body || {});
    if (!email) return res.status(400).json({ error: "Email is required" });

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });

    const stripe = new Stripe(secret); // lazy

    const base =
      process.env.SITE_URL ||
      (req.headers.origin as string) ||
      `https://${req.headers.host}`;

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

    // best-effort Firestore write (skip if admin creds not set)
    const db = getDbOrNull();
    if (db) {
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
    } else {
      console.warn("Firestore not configured; skipping preorder write");
    }

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
