// src/lib/stripe.ts
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

// Pin to the SDK’s typed version to satisfy TS on Vercel builds.
// If you upgrade the `stripe` package later and get a TS error here,
// copy the new literal from the error into this string.
const API_VERSION: Stripe.LatestApiVersion = "2025-08-27.basil";

export const stripe = new Stripe(key, {
  apiVersion: API_VERSION,
});

export type { Stripe };
