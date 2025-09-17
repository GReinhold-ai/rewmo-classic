import { useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";

type PlanKey = "FREE" | "PRO" | "BUSINESS";

const PRICE_PRO = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "";
const PRICE_BUSINESS = process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS ?? "";
const PUBLISHABLE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

type Plan = {
  name: string;
  price: string;       // display only
  blurb: string;
  features: string[];
  ctaLabel: string;
  sku?: string;        // Stripe price id (price_...)
  quantity?: number;   // seats (Business = 5)
};

const PLANS: Record<PlanKey, Plan> = {
  FREE: {
    name: "Free",
    price: "$0",
    blurb: "Great for getting started.",
    features: ["Amazon rewards", "LeanAI Module 1 (preview)", "Community updates"],
    ctaLabel: "You're on Free",
  },
  PRO: {
    name: "Pro",
    price: "$10/mo",
    blurb: "Unlock more shopping rewards & training.",
    features: [
      "Walmart & Delta rewards",
      "Full Lean/TQM modules",
      "Finance mini-courses",
      "Priority support",
    ],
    ctaLabel: "Upgrade to Pro",
    sku: PRICE_PRO,
    quantity: 1,
  },
  BUSINESS: {
    name: "Business",
    price: "$125/mo",
    blurb: "For small teams and businesses (5 seats).",
    features: [
      "All Pro benefits",
      "Business/office rewards",
      "Team seats & analytics (soon)",
      "Priority onboarding",
    ],
    ctaLabel: "Upgrade to Business",
    sku: PRICE_BUSINESS,
    quantity: 5, // 5 licenses
  },
};

export default function Pricing() {
  const { currentUser, signInWithGoogle } = useAuth();
  const [loadingSku, setLoadingSku] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "info" | "error"; text: string } | null>(null);

  const testMode = useMemo(() => PUBLISHABLE.startsWith("pk_test_"), []);

  async function startCheckout(planKey: PlanKey) {
    const plan = PLANS[planKey];
    if (!plan.sku) return;

    if (!currentUser?.uid || !currentUser.email) {
      setMsg({ kind: "info", text: "Please sign in to upgrade." });
      try {
        await signInWithGoogle?.();
      } catch {/* ignore */}
      return;
    }

    try {
      setMsg(null);
      setLoadingSku(plan.sku);
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: plan.sku,
          quantity: plan.quantity ?? 1, // seats
          uid: currentUser.uid,
          email: currentUser.email,
          metadata: { product: "RewmoAI", plan: planKey },
        }),
      });
      const data = await r.json();
      if (!r.ok || !data?.url) throw new Error(data?.error || "Unable to start checkout.");
      window.location.href = data.url;
    } catch (e: any) {
      setMsg({ kind: "error", text: e?.message || "Network error. Please try again." });
      setLoadingSku(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testMode && (
        <div className="md:col-span-3 rounded-md bg-yellow-500/10 text-yellow-200 border border-yellow-500/30 px-3 py-2 text-xs">
          Stripe <b>TEST MODE</b> — use card <code>4242 4242 4242 4242</code>, any future date, any CVC.
        </div>
      )}

      {msg && (
        <div
          className={
            "md:col-span-3 rounded-md px-3 py-2 text-sm border " +
            (msg.kind === "error"
              ? "bg-red-500/10 text-red-200 border-red-500/30"
              : "bg-white/10 text-white/90 border-white/20")
          }
        >
          {msg.text}
        </div>
      )}

      {(Object.keys(PLANS) as PlanKey[]).map((key) => {
        const p = PLANS[key];
        return (
          <div key={key} className="rounded-2xl border p-6 bg-white/5 border-white/10">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold">{p.name}</h2>
              <div className="text-[#FF9151] font-black">
                {key === "BUSINESS" ? `${p.price} • 5 seats` : p.price}
              </div>
            </div>
            <p className="opacity-80 mt-1">{p.blurb}</p>

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
                  {p.ctaLabel}
                </span>
              </div>
            ) : (
              <div className="mt-6">
                <button
                  onClick={() => startCheckout(key)}
                  disabled={!p.sku || (!!loadingSku && loadingSku !== p.sku)}
                  className="rounded-lg bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold px-5 py-2 disabled:opacity-60"
                  title={!p.sku ? "Missing Stripe price id in env config" : undefined}
                >
                  {loadingSku === p.sku ? "Redirecting…" : p.ctaLabel}
                </button>
                {!p.sku && (
                  <p className="mt-2 text-xs text-red-200">
                    Missing Stripe price id. Set{" "}
                    {key === "PRO" ? "NEXT_PUBLIC_STRIPE_PRICE_PRO" : "NEXT_PUBLIC_STRIPE_PRICE_BUSINESS"} in
                    <code className="ml-1">.env / Vercel env</code>, then redeploy.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
