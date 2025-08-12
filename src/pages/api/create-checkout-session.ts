import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// --- Stripe (no apiVersion arg -> use package default) ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// --- Firebase Admin ---
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

// --- CORS helper (robust) ---
function setCors(req: NextApiRequest, res: NextApiResponse) {
  const allowList = (process.env.UNICORN_ORIGIN || process.env.SITE_URL || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const origin = req.headers.origin || "";
  const allow =
    allowList.length === 0 ? "*" :
    allowList.includes(origin) ? origin :
    allowList[0];

  res.setHeader("Access-Control-Allow-Origin", allow);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { email, product = "RewmoAI + EnterpriseAI", source = "unicorn" } = req.body || {};
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    // Use a Price ID if you have one; otherwise build price_data
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
      success_url: `${process.env.SITE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/cancel`,
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

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("checkout error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}
