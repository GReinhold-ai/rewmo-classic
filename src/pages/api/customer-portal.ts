// src/pages/api/customer-portal.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// ---- ENV ----
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const RETURN_URL =
  process.env.STRIPE_BILLING_PORTAL_RETURN_URL || "https://rewmo.ai/account";

// Initialize Stripe *without* apiVersion override (lets types line up with the SDK)
const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY)
  : (null as unknown as Stripe);

// ---- CORS helper (prod + *.vercel.app previews) ----
function setCORS(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin || "";

  const allowlist = [
    /^https?:\/\/(www\.)?rewmo\.ai$/i,
    /^https?:\/\/.*-rewmo-classic-.*\.vercel\.app$/i, // project previews
    /^https?:\/\/rewmo-classic-.*\.vercel\.app$/i,
  ];

  const allowed =
    allowlist.some((re) => re.test(origin)) || origin === "http://localhost:3000";

  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
}

type CreatePortalBody = {
  customerId?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCORS(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe is not configured." });
  }

  try {
    const body = (req.body || {}) as CreatePortalBody;
    // Accept customerId from body or query (flexible)
    const customerId =
      body.customerId ||
      (typeof req.query.customerId === "string" ? req.query.customerId : "");

    if (!customerId) {
      return res.status(400).json({ error: "Missing required 'customerId'." });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: RETURN_URL,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("customer-portal error:", err);
    return res.status(500).json({
      error: err?.message || "Failed to create billing portal session.",
    });
  }
}
