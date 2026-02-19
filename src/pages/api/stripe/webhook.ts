// src/pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getAdminDb } from "@/lib/serverAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { grantEntitlement } from "@/lib/server/membership";

export const config = {
  api: { bodyParser: false },
};

const {
  STRIPE_SECRET_KEY = "",
  STRIPE_WEBHOOK_SECRET = "",
  FUNDAMENTALS_ENTITLEMENT = "leanai.fundamentals",
} = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

// Read raw body so Stripe can verify signature
async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function normalizeEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

async function findUidByEmail(email: string): Promise<string | null> {
  const db = getAdminDb();
  const emailLower = normalizeEmail(email);
  if (!emailLower) return null;

  const q1 = await db.collection("users").where("email", "==", emailLower).limit(1).get();
  if (!q1.empty) return q1.docs[0].id;

  const q2 = await db.collection("users").where("emailLower", "==", emailLower).limit(1).get();
  if (!q2.empty) return q2.docs[0].id;

  return null;
}

async function upsertOrderAndUser(args: {
  uid: string;
  session: Stripe.Checkout.Session;
  plan: string;
  email: string;
}) {
  const db = getAdminDb();
  const { uid, session, plan, email } = args;

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

  const orderId = session.id; // stable + idempotent
  const userRef = db.collection("users").doc(uid);
  const orderRef = userRef.collection("orders").doc(orderId);

  // Write an order record (idempotent)
  await orderRef.set(
    {
      stripeCheckoutSessionId: session.id,
      stripeCustomerId: customerId || null,
      stripeSubscriptionId: subscriptionId || null,
      type: "subscription",
      plan,
      email: normalizeEmail(email) || null,
      status: "paid",
      amount_total: session.amount_total ?? null,
      currency: session.currency ?? null,
      livemode: session.livemode ?? null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      raw: {
        payment_status: session.payment_status ?? null,
        mode: session.mode ?? null,
      },
    },
    { merge: true }
  );

  // Update user fields (idempotent)
  await userRef.set(
    {
      email: normalizeEmail(email) || null,
      emailLower: normalizeEmail(email) || null,
      stripeCustomerId: customerId || null,
      stripeSubscriptionId: subscriptionId || null,
      subscriptionStatus: "active",
      plan,
      lastCheckoutSessionId: session.id,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Stripe env vars missing" });
  }

  let event: Stripe.Event;

  // 1) Verify signature
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }

    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[stripe:webhook] signature verification failed:", err?.stack || err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // 2) Handle event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Prefer UID from session (this requires your checkout code to set it)
        const uidFromClientRef =
          typeof session.client_reference_id === "string" && session.client_reference_id.trim()
            ? session.client_reference_id.trim()
            : null;

        const uidFromMetadata =
          typeof session.metadata?.uid === "string" && session.metadata.uid.trim()
            ? session.metadata.uid.trim()
            : null;

        let uid = uidFromClientRef || uidFromMetadata || null;

        // Get email (for audit + fallback lookup)
        const email =
          session.customer_details?.email ||
          (typeof session.metadata?.email === "string" ? session.metadata.email : "") ||
          "";

        // Fallback: map by email if uid missing (legacy sessions)
        if (!uid) {
          const emailLower = normalizeEmail(email);
          if (emailLower) {
            uid = await findUidByEmail(emailLower);
            console.warn("[stripe:webhook] uid missing; used email lookup", {
              email: emailLower,
              uid: uid || null,
              sessionId: session.id,
            });
          }
        }

        if (!uid) {
          console.warn("[stripe:webhook] checkout.session.completed but no uid found", {
            sessionId: session.id,
            email: normalizeEmail(email) || null,
            client_reference_id: session.client_reference_id || null,
            metadataUid: session.metadata?.uid || null,
          });
          break; // don't 500 — just skip
        }

        const plan =
          (typeof session.metadata?.plan === "string" && session.metadata.plan) ||
          "pro";

        // 2a) Write order + update user
        await upsertOrderAndUser({ uid, session, plan: String(plan), email });

        // 2b) Grant entitlement (keep your existing behavior)
        await grantEntitlement(uid, FUNDAMENTALS_ENTITLEMENT);

        console.log("[stripe:webhook] processed checkout.session.completed", {
          uid,
          plan,
          sessionId: session.id,
        });

        break;
      }

      case "invoice.paid":
      case "invoice.payment_succeeded": {
        // Optional: on renewals, you can refresh subscriptionStatus or log invoices.
        // Keep empty for now.
        break;
      }

      case "customer.subscription.deleted": {
        // Optional: revoke access on cancel/expire
        // You need a mapping from subId -> uid (store stripeSubscriptionId on user doc above does that)
        const sub = event.data.object as Stripe.Subscription;
        const subId = sub.id;

        const db = getAdminDb();
        const snap = await db
          .collection("users")
          .where("stripeSubscriptionId", "==", subId)
          .limit(1)
          .get();

        if (!snap.empty) {
          const uid = snap.docs[0].id;
          await db.collection("users").doc(uid).set(
            {
              subscriptionStatus: "canceled",
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
          console.log("[stripe:webhook] marked subscription canceled", { uid, subId });
        }
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    // IMPORTANT: log full stack so we can see the real reason for 500
    console.error("[stripe:webhook] handler error full:", err?.stack || err);
    return res.status(500).json({ error: "Webhook handler error" });
  }
}
