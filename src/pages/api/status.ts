// src/pages/api/status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

// Don't pass an apiVersion literal (Stripe's types are a strict union and will break on Vercel's pinned type).
// Just construct the client; the default version on your account will be used.
const stripe: Stripe | null = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

type StatusPayload = {
  ok: boolean;
  now: string;
  env: {
    nodeEnv: string | undefined;
    hasStripeKey: boolean;
  };
  stripe?: {
    configured: boolean;
    // add lightweight checks safely behind guards
    accountEmail?: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<StatusPayload>) {
  try {
    const payload: StatusPayload = {
      ok: true,
      now: new Date().toISOString(),
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasStripeKey: Boolean(STRIPE_SECRET_KEY),
      },
    };

    if (stripe) {
      // Optional: cheap sanity call; guarded so it won't run without a key
      try {
        const acct = await stripe.accounts.retrieve();
        payload.stripe = {
          configured: true,
          accountEmail: (acct?.email as string | undefined) || undefined,
        };
      } catch {
        payload.stripe = { configured: true };
      }
    }

    res.status(200).json(payload);
  } catch {
    res.status(200).json({
      ok: false,
      now: new Date().toISOString(),
      env: { nodeEnv: process.env.NODE_ENV, hasStripeKey: Boolean(STRIPE_SECRET_KEY) },
    });
  }
}
