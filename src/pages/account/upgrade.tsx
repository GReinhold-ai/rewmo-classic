// src/pages/account/upgrade.tsx
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthProvider";

type PlanKey = "FREE" | "PRO" | "BUSINESS";

const PRICE_PRO = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "";
const PRICE_BUSINESS = process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS || "";
const PUBLISHABLE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

type PlanDef = {
  name: string;
  labelPrice: string;
  blurb: string;
  features: string[];
  priceId?: string;     // Stripe Price ID
  quantity?: number;    // seats (defaults to 1)
  cta: string;
  footnote?: string;
};

const PLANS: Record<PlanKey, PlanDef> = {
  FREE: {
    name: "Free",
    labelPrice: "$0",
    blurb: "Great for getting started.",
    features: ["Amazon rewards", "LeanAI Module 1 (preview)", "Community updates"],
    cta: "You're on Free",
  },
  PRO: {
    name: "Pro",
    labelPrice: "$10/mo",
    blurb: "Unlock more shopping rewards & training.",
    features: [
      "Walmart & Delta rewards",
      "Full Lean/TQM modules",
      "Finance mini-courses",
      "Priority support",
    ],
    priceId: PRICE_PRO,
    quantity: 1,
    cta: "Upgrade to Pro",
  },
  BUSINESS: {
    name: "Business",
    labelPrice: "$125/mo",
    blurb: "For small teams and businesses.",
    features: [
      "All Pro benefits",
      "Business/office rewards",
      "Team seats & analytics (soon)",
      "Priority onboarding",
    ],
    priceId: PRICE_BUSINESS,
    quantity: 5, // 5 licenses
    cta: "Upgrade to Business",
    footnote: "Includes 5 seats (additional seats coming soon).",
  },
};

export default function UpgradePage() {
  const router = useRouter();
  const { currentUser, signInWithGoogle } = useAuth();

  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "info" | "error"; text: string } | null>(null);

  const isTestMode = useMemo(() => PUBLISHABLE.startsWith("pk_test_"), []);

  async function handleCheckout(planKey: PlanKey) {
    const plan = PLANS[planKey];
    if (!plan.priceId) {
      setMsg({
        kind: "error",
        text: `Missing Stripe Price ID for ${plan.name}. Set ${
          planKey === "PRO"
            ? "NEXT_PUBLIC_STRIPE_PRICE_PRO"
            : "NEXT_PUBLIC_STRIPE_PRICE_BUSINESS"
        } in your environment and redeploy.`,
      });
      return;
    }

    if (!currentUser?.uid || !currentUser.email) {
      setMsg({ kind: "info", text: "Please sign in to upgrade." });
      try {
        await signInWithGoogle?.();
      } catch {
        /* ignore */
      }
      return;
    }

    try {
      setMsg(null);
      setLoading(plan.priceId);

      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: plan.priceId,
          quantity: plan.quantity ?? 1,            // <-- seats
          uid: currentUser.uid,
          email: currentUser.email,
          metadata: { product: "RewmoAI", plan: planKey },
        }),
      });

      const data = await r.json();
      if (!r.ok || !data?.url) {
        throw new Error(data?.error || "Unable to start checkout.");
      }
      window.location.href = data.url as string;
    } catch (e: any) {
      setMsg({ kind: "error", text: e?.message || "Network error. Please try again." });
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#003B49] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-black">Choose your plan</h1>
        <p className="mb-6 opacity-80">
          Unlock more shopping rewards and full training access. Cancel anytime.
        </p>

        {isTestMode && (
          <div className="mb-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
            Stripe <b>TEST MODE</b> — use card <code>4242 4242 4242 4242</code>, any future date, any CVC.
          </div>
        )}
        {msg && (
          <div
            className={
              "mb-4 rounded-md border px-3 py-2 text-sm " +
              (msg.kind === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-white/20 bg-white/10 text-white/90")
            }
          >
            {msg.text}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {(Object.keys(PLANS) as PlanKey[]).map((key) => {
            const p = PLANS[key];
            const isPaid = key !== "FREE";
            const isLoading = loading === p.priceId;

            return (
              <div
                key={key}
                className={`rounded-2xl border bg-white/5 p-6 ${
                  isPaid ? "border-white/10" : "border-white/10"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xl font-bold">{p.name}</h2>
                  <div className="font-black text-[#FF9151]">{p.labelPrice}</div>
                </div>
                <p className="mt-1 opacity-80">{p.blurb}</p>

                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#15C5C1]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {key === "FREE" ? (
                  <div className="mt-6">
                    <span className="inline-block rounded-lg border border-white/20 px-4 py-2 opacity-70">
                      {p.cta}
                    </span>
                  </div>
                ) : (
                  <div className="mt-6">
                    <button
                      onClick={() => handleCheckout(key)}
                      disabled={!!loading && !isLoading}
                      className="rounded-lg bg-[#FF9151] px-5 py-2 font-bold text-[#003B49] hover:bg-[#FFA36C] disabled:opacity-60"
                    >
                      {isLoading ? "Redirecting…" : p.cta}
                    </button>
                    {!p.priceId && (
                      <p className="mt-2 text-xs text-red-200">
                        Missing Stripe Price ID for {p.name}. Add it in your environment and redeploy.
                      </p>
                    )}
                    {p.footnote && (
                      <p className="mt-2 text-xs opacity-70">
                        {p.footnote}
                      </p>
                    )}
                  </div>
                )}

                {key === "BUSINESS" && (
                  <p className="mt-3 text-xs opacity-60">
                    Need help?{" "}
                    <Link href="/contact" className="underline">
                      Contact sales
                    </Link>
                    .
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-xs opacity-60">
          By subscribing, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="mt-8">
          <Link href="/account" className="text-[#15C5C1] underline">
            ← Back to Account
          </Link>
        </div>
      </div>
    </main>
  );
}
