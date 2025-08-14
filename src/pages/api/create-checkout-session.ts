// src/pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// allow only the UTM keys we care about (prevents junk/injection)
const pickUtm = (input: any = {}) => {
  const out: Record<string, string> = {};
  const allow = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "ref",
  ];
  for (const k of allow) {
    const v = input?.[k];
    if (typeof v === "string" && v.trim()) {
      // Stripe metadata values must be <= 500 chars and strings only
      out[k] = v.trim().slice(0, 480);
    }
  }
  return out;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.json({
      ok: true,
      route: "create-checkout-session",
      hint: "POST email/product/source/utm to create a Stripe Checkout session",
    });
  }
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const {
      email,
      product = "RewmoAI + EnterpriseAI",
      source = "unicorn",
      utm = {},
    } = req.body as {
      email?: string;
      product?: string;
      source?: string;
      utm?: Record<string, string>;
    };

    if (!email) return res.status(400).json({ error: "Missing email" });
    const utmClean = pickUtm(utm);

    // 1) Upsert a pending preorder with UTM/ref data
    const nowIso = new Date().toISOString();
    await db.collection("preorders").doc(email).set(
      {
        email,
        product,
        source,
        utm: utmClean,
        status: "pending",
        updatedAt: nowIso,
        createdAt: nowIso,
      },
      { merge: true }
    );

    // 2) Get or create a Stripe customer by email so metadata can live on it too
    const list = await stripe.customers.list({ email, limit: 1 });
    const existing = list.data[0];
    const customer =
      existing ??
      (await stripe.customers.create({
        email,
        metadata: {
          product,
          source,
          ...utmClean,
        },
      }));

    // 3) Create Checkout Session (subscription)
    const bundlePrice = process.env.STRIPE_PRICE_BUNDLE_ID!; // set in env
    const successUrl = `${process.env.SITE_URL}/thank-you?email=${encodeURIComponent(
      email
    )}`;
    const cancelUrl = `${process.env.SITE_URL}/?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      // If you prefer customer_email instead of customer, you can use:
      // customer_email: email,
      line_items: [{ price: bundlePrice, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,

      // Store attribution on the session
      metadata: {
        product,
        source,
        email,
        ...utmClean,
      },

      // Also store attribution at the subscription level
      subscription_data: {
        metadata: {
          product,
          source,
          email,
          ...utmClean,
        },
      },
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}
