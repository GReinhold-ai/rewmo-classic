// src/pages/api/stripe/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getAdminDb } from "@/lib/serverAdmin"; // ensures admin init is loaded
import admin from "firebase-admin";

// ---- Env & setup ------------------------------------------------------------
const {
  STRIPE_SECRET_KEY = "",
  SITE_URL = "",
  STRIPE_PRICE_PRO,
  STRIPE_PRICE_BUSINESS,
  STRIPE_PRICE_FUNDAMENTALS,
} = process.env;

if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
if (!SITE_URL) throw new Error("SITE_URL is not set");

const stripe = new Stripe(STRIPE_SECRET_KEY);

const PRICE_BY_PLAN: Record<string, string | undefined> = {
  pro: STRIPE_PRICE_PRO,
  business: STRIPE_PRICE_BUSINESS,
  fundamentals: STRIPE_PRICE_FUNDAMENTALS,
};

function getBearerToken(req: NextApiRequest) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] || "";
}

async function verifyFirebaseUser(req: NextApiRequest) {
  // Ensure admin app initialized (getAdminDb triggers init in your serverAdmin.ts)
  getAdminDb();

  const token = getBearerToken(req);
  if (!token) throw new Error("Missing Authorization Bearer token");

  const decoded = await admin.auth().verifyIdToken(token);
  return decoded; // { uid, email, ... }
}

// ---- Handler ----------------------------------------------------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { plan = "pro" } = req.body || {};
    const planKey = String(plan).toLowerCase();
    const priceId = PRICE_BY_PLAN[planKey];

    if (!priceId) {
      return res.status(400).json({
        error: `Unknown plan "${plan}". Valid options: ${Object.keys(PRICE_BY_PLAN)
          .filter((k) => !!PRICE_BY_PLAN[k])
          .join(", ")}`,
      });
    }

    const user = await verifyFirebaseUser(req);
    const uid = user.uid;
    const email = user.email || "";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      customer_email: email || undefined,

      // 🔑 This is the key: webhook can map Stripe → Firestore user
      client_reference_id: uid,
      metadata: {
        uid,
        plan: planKey,
        email,
      },

      success_url: `${SITE_URL}/account?status=success`,
      cancel_url: `${SITE_URL}/account?status=cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("[create-checkout-session] error:", err?.stack || err);
    return res.status(500).json({ error: err?.message || "Failed to create Checkout session" });
  }
}
