// src/pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";           // npm i micro
import { getAdminDb } from "@/lib/serverAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const config = {
  api: { bodyParser: false },             // VERY IMPORTANT for raw body verification
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const whSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let evt: Stripe.Event;
  try {
    evt = stripe.webhooks.constructEvent(buf, sig, whSecret);
  } catch (err: any) {
    console.error("[webhook] signature verification failed:", err?.message || err);
    return res.status(400).send(`Webhook Error: ${err?.message || err}`);
  }

  try {
    switch (evt.type) {
      case "checkout.session.completed": {
        const session = evt.data.object as Stripe.Checkout.Session;

        // We stored these when creating the Checkout session.
        const uid = (session.metadata?.uid || "").trim();
        const productId = (session.metadata?.productId || "").trim();

        console.log("[webhook] checkout.session.completed", {
          uid,
          productId,
          customer: session.customer,
          subscription: session.subscription,
        });

        if (!uid || !productId) {
          console.warn("[webhook] missing uid or productId in metadata");
          break;
        }

        // Write/merge entitlement
        const db = getAdminDb();
        const ref = db.doc(`users/${uid}/entitlements/${productId}`);
        await ref.set(
          {
            active: true,
            source: "stripe",
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        console.log("[webhook] entitlement written:", `users/${uid}/entitlements/${productId}`);
        break;
      }

      default:
        // You can log the rest during testing if helpful
        // console.log(`[webhook] unhandled event ${evt.type}`);
        break;
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error("[webhook] handler error:", err?.message || err);
    return res.status(500).json({ error: "Webhook handler error" });
  }
}
