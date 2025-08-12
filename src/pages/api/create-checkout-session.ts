import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/** CORS helper (supports comma-separated origins in UNICORN_ORIGIN) */
function cors(req: NextApiRequest, res: NextApiResponse) {
  const origins = (process.env.UNICORN_ORIGIN || "")
    .split(",")
    .map(o => o.trim())
    .filter(Boolean);
  const reqOrigin = req.headers.origin || "";
  const allow = origins.includes(reqOrigin) ? reqOrigin : origins[0] || "*";
  res.setHeader("Access-Control-Allow-Origin", allow);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return true; }
  return false;
}

// Firebase Admin
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (cors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { email, product = "RewmoAI + EnterpriseAI", source = "unicorn" } =
      (req.body ?? {}) as { email?: string; product?: string; source?: string };

    if (!email) return res.status(400).json({ error: "Email is required" });

    // Build a strongly-typed line item to satisfy Stripe v18 types
    let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;

    if (process.env.STRIPE_PRICE_ID) {
      lineItem = { price: process.env.STRIPE_PRICE_ID as string, quantity: 1 };
    } else {
      lineItem = {
        price_data: {
          currency: "usd",
          recurring: { interval: "month" as Stripe.Price.Recurring.Interval },
          product_data: { name: `${product} Subscription` },
          unit_amount: 1000, // $10
        },
        quantity: 1,
      };
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      customer_email: email,
      line_items: [lineItem],
      allow_promotion_codes: true,
      success_url: `${process.env.SITE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/cancel`,
      metadata: { product, source },
    };

    const session = await stripe.checkout.sessions.create(params);

    await db
      .collection("preorders")
      .doc(email)
      .set(
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
    console.error("checkout error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
