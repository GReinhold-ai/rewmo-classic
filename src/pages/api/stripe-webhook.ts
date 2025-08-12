import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const config = { api: { bodyParser: false } }; // IMPORTANT

// Stripe init (no apiVersion arg needed)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Firebase Admin init (service account envs)
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
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) return res.status(400).send("Missing Stripe signature");

  let event: Stripe.Event;
  try {
    const buf = await getRawBody(req); // raw Buffer
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook signature verify failed:", err?.message || err);
    return res.status(400).send(`Webhook Error: ${err?.message ?? "invalid signature"}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_details?.email || undefined;
        const customerId = (session.customer as string) || undefined;

        if (email) {
          await db.collection("preorders").doc(email).set(
            {
              status: "active",
              subscriptionStatus: "active",
              stripeCustomerId: customerId ?? null,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const status = sub.status;

        // Find preorder by customer id
        const snap = await db
          .collection("preorders")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!snap.empty) {
          await snap.docs[0].ref.set(
            { subscriptionStatus: status, updatedAt: new Date().toISOString() },
            { merge: true }
          );
        }
        break;
      }

      default:
        // ignore other events
        break;
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).send("Server error");
  }
}
