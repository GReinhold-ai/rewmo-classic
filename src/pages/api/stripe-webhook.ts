// src/pages/api/stripe-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// OPTIONAL (only if you created this earlier per our checklist):
// If you don't have sendEmail yet, just comment these 2 lines out.
import { sendEmail } from "@/lib/email";

// Stripe requires the raw body to verify the signature
export const config = { api: { bodyParser: false } };

// ---------- Init Stripe ----------
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string | undefined;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string | undefined;

if (!STRIPE_SECRET_KEY) console.warn("[webhook] STRIPE_SECRET_KEY is not set");
if (!STRIPE_WEBHOOK_SECRET) console.warn("[webhook] STRIPE_WEBHOOK_SECRET is not set");

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

// ---------- helpers ----------
const toIso = (unixSeconds?: number | null) =>
  typeof unixSeconds === "number" ? new Date(unixSeconds * 1000).toISOString() : null;

function extractUtmFromSession(session: Stripe.Checkout.Session) {
  const md = session.metadata || {};
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const v = md[key];
    if (typeof v === "string" && v.trim()) utm[key] = v.trim();
  }
  if (session.client_reference_id && Object.keys(utm).length === 0) {
    try {
      const parsed = JSON.parse(session.client_reference_id);
      for (const k of Object.keys(parsed || {})) {
        if (k.startsWith("utm_") && typeof parsed[k] === "string") {
          utm[k] = parsed[k];
        }
      }
    } catch {}
  }
  if (!utm["source"] && typeof md["source"] === "string") utm["source"] = md["source"];
  if (!utm["referrer"] && typeof md["referrer"] === "string") utm["referrer"] = md["referrer"];
  return utm;
}

async function findUserByEmail(email: string) {
  const snap = await db.collection("users").where("email", "==", email).limit(1).get();
  return snap.empty ? null : { id: snap.docs[0].id, ref: snap.docs[0].ref, data: snap.docs[0].data() };
}

async function mirrorOrderToUser(uid: string, sessionId: string, orderData: any) {
  await db.collection("users").doc(uid).collection("orders").doc(sessionId).set(orderData, { merge: true });
}

async function updateUserMembership(uid: string, planPriceId: string | null, stripeCustomerId: string | null) {
  await db.collection("users").doc(uid).set(
    {
      membership: {
        active: true,
        plan: planPriceId || "PRO", // or map priceId -> "PRO"/"BUSINESS"
        stripeCustomerId: stripeCustomerId,
        updatedAt: new Date(),
      },
    },
    { merge: true }
  );
}

// ---------- Handler ----------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return res.status(500).send("Stripe not configured");
  }

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) return res.status(400).send("Missing Stripe signature");

  let event: Stripe.Event;

  try {
    const raw = await getRawBody(req); // Buffer
    event = stripe.webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[webhook] signature verify failed:", err?.message || err);
    return res.status(400).send(`Webhook Error: ${err?.message ?? "invalid signature"}`);
  }

  try {
    console.log("[webhook] received:", event.type);

    switch (event.type) {
      // ---------------------------------------------
      // CHECKOUT COMPLETED
      // - Keep your existing "preorders" behavior
      // - Also write an "orders" doc
      // - Mirror order under user if email matches
      // - Update user.membership
      // - Send a quick email receipt (optional)
      // ---------------------------------------------
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const email =
          session.customer_details?.email ??
          (session as any).customer_email ??
          undefined;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : (session.subscription as any)?.id ?? null;

        const utm = extractUtmFromSession(session);
        const meta = session.metadata || {};

        // ----- NEW: Build order data -----
        const amountTotal = session.amount_total ?? 0; // cents
        const currency = (session.currency || "usd").toUpperCase();
        const priceId = (meta.priceId as string) || ""; // set by /api/checkout
        const referralCode = (meta.referralCode as string) || "";

        const orderData = {
          email: email || null,
          amountTotal,
          currency,
          priceId: priceId || null,
          referralCode: referralCode || null,
          stripeCustomerId: customerId || null,
          stripeSessionId: session.id,
          status: "paid",
          mode: session.mode, // 'subscription' | 'payment'
          utm,
          metadata: meta,
          createdAt: new Date(),
        };

        // ----- NEW: root orders collection -----
        await db.collection("orders").doc(session.id).set(orderData, { merge: true });

        // ----- Keep your existing preorders doc behavior -----
        if (email) {
          await db
            .collection("preorders")
            .doc(email)
            .set(
              {
                status: "active", // or "pending" if you wait for invoice.payment_succeeded
                subscriptionStatus: "active",
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                lastCheckoutSessionId: session.id,
                utm,
                metadata: meta,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
        } else {
          console.warn("[webhook] checkout.session.completed without email");
        }

        // ----- NEW: Attach order to user + mark membership -----
        if (email) {
          const user = await findUserByEmail(email);
          if (user) {
            await mirrorOrderToUser(user.id, session.id, orderData);
            await updateUserMembership(user.id, priceId || null, customerId || null);
          }
        }

        // ----- OPTIONAL: send simple receipt -----
        try {
          if (email) {
            await sendEmail?.({
              to: email,
              subject: "Thanks for upgrading to RewmoAI",
              text: `You're all set! We received your payment of ${(amountTotal / 100).toFixed(2)} ${currency}.
Plan/Price: ${priceId || "N/A"}
Referral: ${referralCode || "-"}
Session: ${session.id}

If you have any questions, just reply to this email.

— RewmoAI`,
            });
          }
        } catch (e) {
          console.warn("[webhook] sendEmail failed (non-fatal):", (e as any)?.message || e);
        }

        break;
      }

      // ---------------------------------------------
      // Subscription lifecycle (your original logic)
      // ---------------------------------------------
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription & {
          current_period_end?: number;
          cancel_at_period_end?: boolean;
        };

        const customerId =
          typeof sub.customer === "string"
            ? sub.customer
            : (sub.customer as any)?.id ?? null;

        const price = sub.items?.data?.[0]?.price;
        const productId =
          typeof price?.product === "string"
            ? price.product
            : (price?.product as any)?.id ?? null;
        const priceId = price?.id ?? null;

        const payload = {
          subscriptionStatus: sub.status,
          stripeCustomerId: customerId,
          stripeSubscriptionId: sub.id,
          productId,
          priceId,
          cancelAtPeriodEnd: !!sub.cancel_at_period_end,
          currentPeriodEnd: toIso(sub.current_period_end ?? null),
          updatedAt: new Date().toISOString(),
        };

        if (customerId) {
          const byCustomer = await db
            .collection("preorders")
            .where("stripeCustomerId", "==", customerId)
            .limit(1)
            .get();

          if (!byCustomer.empty) {
            await byCustomer.docs[0].ref.set(payload, { merge: true });
          } else {
            console.warn("[webhook] no preorder matched for customer", { customerId });
          }
        } else {
          console.warn("[webhook] subscription event missing customerId");
        }

        break;
      }

      // ---------------------------------------------
      // Successful invoice payment (your original logic)
      // ---------------------------------------------
      case "invoice.payment_succeeded": {
        const inv = event.data.object as Stripe.Invoice & { customer?: string };
        const customerId =
          typeof inv.customer === "string" ? inv.customer : (inv.customer as any)?.id ?? null;

        const amountPaid = (inv.amount_paid ?? 0) / 100;
        const currency = inv.currency?.toUpperCase() ?? "USD";

        if (customerId) {
          const byCustomer = await db
            .collection("preorders")
            .where("stripeCustomerId", "==", customerId)
            .limit(1)
            .get();

          if (!byCustomer.empty) {
            await byCustomer.docs[0].ref.set(
              {
                lastPaymentAt: new Date().toISOString(),
                lastPaymentAmount: amountPaid,
                lastPaymentCurrency: currency,
                status: "active",
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } else {
            console.warn("[webhook] invoice.paid with no matching preorder", { customerId });
          }
        } else {
          console.warn("[webhook] invoice.payment_succeeded missing customerId");
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
