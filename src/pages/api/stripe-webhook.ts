// src/pages/api/stripe-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Stripe requires the raw body to verify the signature
export const config = { api: { bodyParser: false } };

// ---------- Init Stripe ----------
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string | undefined;
if (!STRIPE_SECRET_KEY) {
  // We still export a handler below, but fail early if key is missing
  console.warn("[webhook] STRIPE_SECRET_KEY is not set");
}
const stripe = new Stripe(STRIPE_SECRET_KEY ?? "");

// ---------- Init Firebase Admin ----------
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FB_ADMIN_PROJECT_ID,
      clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL,
      // Vercel stores multiline secrets with literal \n — convert them back.
      privateKey: (process.env.FB_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}
const db = getFirestore();

// ---------- Handler ----------
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  if (!STRIPE_SECRET_KEY) return res.status(500).send("Stripe not configured");

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) return res.status(400).send("Missing Stripe signature");

  let event: Stripe.Event;

  try {
    const raw = await getRawBody(req); // Buffer
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("[webhook] signature verify failed:", err?.message || err);
    return res
      .status(400)
      .send(`Webhook Error: ${err?.message ?? "invalid signature"}`);
  }

  try {
    // For visibility while testing
    console.log("[webhook] received:", event.type);

    switch (event.type) {
      /**
       * ✅ Carry UTM/ref metadata from Checkout Session & Subscription to Firestore
       */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Best-effort email (covers customer_details and older customer_email)
        const email =
          session.customer_details?.email ??
          (session as any).customer_email ??
          undefined;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;

        // Collect metadata: session + subscription (subscription is more durable)
        const sessionMeta = (session.metadata || {}) as Record<string, string>;
        let subMeta: Record<string, string> = {};
        let subscriptionStatus: string | undefined;

        if (typeof session.subscription === "string") {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          subMeta = (sub.metadata || {}) as Record<string, string>;
          subscriptionStatus = sub.status;
        }

        // Merge: subscription metadata wins on key collisions
        const mergedMeta: Record<string, string> = {
          ...sessionMeta,
          ...subMeta,
        };

        // Normalized UTM/ref fields for easy querying
        const utm = {
          utm_source: mergedMeta.utm_source ?? null,
          utm_medium: mergedMeta.utm_medium ?? null,
          utm_campaign: mergedMeta.utm_campaign ?? null,
          utm_term: mergedMeta.utm_term ?? null,
          utm_content: mergedMeta.utm_content ?? null,
          ref: mergedMeta.ref ?? mergedMeta.referrer ?? null,
          source: mergedMeta.source ?? mergedMeta.utm_source ?? null,
          product: mergedMeta.product ?? mergedMeta.plan ?? null,
        };

        if (email) {
          await db
            .collection("preorders")
            .doc(email)
            .set(
              {
                status: "active",
                subscriptionStatus: subscriptionStatus ?? "active",
                stripeCustomerId: customerId,
                meta: mergedMeta, // raw attribution bundle
                utm,              // normalized fields
                clientReferenceId: session.client_reference_id ?? null,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
        }
        break;
      }

      /**
       * Keep subscription state in sync, and persist metadata if present
       */
      // ===== Improved subscription branch =====
case "customer.subscription.created":
case "customer.subscription.updated":
case "customer.subscription.deleted": {
  // Extend with optional timestamp fields to satisfy TS across API versions
  const sub = event.data.object as Stripe.Subscription & {
    current_period_end?: number;
    cancel_at_period_end?: boolean;
  };

  const customerId =
    typeof sub.customer === "string"
      ? sub.customer
      : (sub.customer as any)?.id ?? null;

  // First item/price/product (typical single-plan subs)
  const price = sub.items?.data?.[0]?.price;
  const productId =
    typeof price?.product === "string"
      ? price.product
      : (price?.product as any)?.id ?? null;
  const priceId = price?.id ?? null;

  const currentPeriodEndIso = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  const payload = {
    subscriptionStatus: sub.status, // active | trialing | past_due | canceled | unpaid | paused | ...
    stripeCustomerId: customerId,
    productId,
    priceId,
    cancelAtPeriodEnd: !!sub.cancel_at_period_end,
    currentPeriodEnd: currentPeriodEndIso,
    updatedAt: new Date().toISOString(),
  };

  // Prefer match by customer id
  const byCustomer = await db
    .collection("preorders")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (!byCustomer.empty) {
    await byCustomer.docs[0].ref.set(payload, { merge: true });
  } else {
    // Fallback: upsert by email if present
    const maybeEmail = (sub as any).customer_email as string | undefined;
    if (maybeEmail) {
      await db.collection("preorders").doc(maybeEmail).set(payload, { merge: true });
    } else {
      console.warn("[webhook] subscription event with no matching preorder", { customerId });
    }
  }
  break;
}

        // Find by customer id (preferred path — we stored it on checkout)
        const byCustomer = await db
          .collection("preorders")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!byCustomer.empty) {
          await byCustomer.docs[0].ref.set(payload, { merge: true });
        } else {
          // Fallback: upsert by email if Stripe provided it on the event
          const maybeEmail = (sub as any).customer_email as string | undefined;
          if (maybeEmail) {
            await db
              .collection("preorders")
              .doc(maybeEmail)
              .set(payload, { merge: true });
          } else {
            console.warn(
              "[webhook] subscription event with no matching preorder",
              { customerId }
            );
          }
        }
        break;
      }

      default:
        // Ignore other event types
        break;
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("[webhook] handler error:", err);
    return res.status(500).send("Server error");
  }
}
