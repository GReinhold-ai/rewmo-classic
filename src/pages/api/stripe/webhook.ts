// src/pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getAdminDb } from "@/lib/serverAdmin";
import { grantEntitlement } from "@/lib/server/membership";

export const config = {
  api: { bodyParser: false },
};

const {
  STRIPE_SECRET_KEY = "",
  STRIPE_WEBHOOK_SECRET = "",
  FUNDAMENTALS_ENTITLEMENT = "leanai.fundamentals",
} = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY);

async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function findUidByEmail(email: string): Promise<string | null> {
  const db = getAdminDb();
  const emailLower = email.trim().toLowerCase();

  const q1 = await db.collection("users").where("email", "==", emailLower).limit(1).get();
  if (!q1.empty) return q1.docs[0].id;

  const q2 = await db.collection("users").where("emailLower", "==", emailLower).limit(1).get();
  if (!q2.empty) return q2.docs[0].id;

  return null;
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

  try {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }

    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[stripe:webhook] signature verification failed:", err?.message || err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Priority 1: email from customer_details (always present when available)
        let email: string | undefined = session.customer_details?.email ?? undefined;

        // Priority 2: if we have a customer ID, retrieve and narrow the type
        if (!email && typeof session.customer === "string") {
          try {
            const customer = await stripe.customers.retrieve(session.customer);
            if (!("deleted" in customer) && customer.email) {
              email = customer.email;
            }
          } catch (e) {
            // don't fail webhook just because customer lookup failed
            console.warn("[stripe:webhook] customer retrieve failed:", (e as any)?.message || e);
          }
        }

        // Priority 3: optional metadata fallback
        if (!email && session.metadata?.email) {
          email = String(session.metadata.email);
        }

        if (!email) {
          console.warn("[stripe:webhook] checkout.session.completed but no email found on session", {
            sessionId: session.id,
          });
          break;
        }

        const uid = await findUidByEmail(email);
        if (!uid) {
          console.warn("[stripe:webhook] No user doc found for email; cannot grant entitlement", { email });
          break;
        }

        await grantEntitlement(uid, FUNDAMENTALS_ENTITLEMENT);
        console.log("[stripe:webhook] Granted entitlement", {
          uid,
          entitlement: FUNDAMENTALS_ENTITLEMENT,
          sessionId: session.id,
        });

        break;
      }

      case "invoice.payment_succeeded": {
        // Optional: handle subscription renewals if you sell recurring plans
        break;
      }

      case "customer.subscription.deleted": {
        // Optional: revoke on cancel/expire (import revokeEntitlement and implement)
        break;
      }

      default:
        // Ignore other event types
        break;
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error("[stripe:webhook] handler error:", err?.message || err);
    return res.status(500).json({ error: "Webhook handler error" });
  }
}
