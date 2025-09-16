import type { Firestore } from "firebase-admin/firestore";

export type Snapshot = {
  exists: boolean;
  email: string;
  subscriptionStatus: string;        // active | trialing | past_due | ...
  planTier: "FREE" | "PRO" | "BUSINESS" | "UNKNOWN";
  priceId: string | null;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  statusRaw?: string | null;
  updatedAt?: string | null;
};

function planFromPriceId(
  priceId?: string | null,
  env: NodeJS.ProcessEnv = process.env
): Snapshot["planTier"] {
  const pro = env.STRIPE_PRICE_PRO || env.NEXT_PUBLIC_STRIPE_PRICE_PRO;
  const biz = env.STRIPE_PRICE_BUSINESS || env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS;
  if (!priceId) return "FREE";
  if (priceId === pro) return "PRO";
  if (priceId === biz) return "BUSINESS";
  return "UNKNOWN";
}

export async function getMembershipSnapshot(db: Firestore, email: string): Promise<Snapshot> {
  const key = email.trim().toLowerCase();
  const snap = await db.collection("preorders").doc(key).get();

  if (!snap.exists) {
    return {
      exists: false,
      email: key,
      subscriptionStatus: "none",
      planTier: "FREE",
      priceId: null,
      currentPeriodEnd: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
  }

  const d = snap.data() || {};
  const priceId = (d.priceId as string | undefined) ?? null;
  const tier = (d.planTier as string) || planFromPriceId(priceId);

  return {
    exists: true,
    email: key,
    subscriptionStatus: (d.subscriptionStatus as string) ?? (d.status as string) ?? "unknown",
    planTier: tier as Snapshot["planTier"],
    priceId,
    currentPeriodEnd: (d.currentPeriodEnd as string) ?? null,
    stripeCustomerId: (d.stripeCustomerId as string) ?? null,
    stripeSubscriptionId: (d.stripeSubscriptionId as string) ?? null,
    statusRaw: (d.status as string) ?? null,
    updatedAt: (d.updatedAt as string) ?? null,
  };
}
