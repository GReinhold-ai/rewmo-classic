// src/pages/account/upgrade.tsx
import { useRouter } from "next/router";
import Link from "next/link";
import { useMemo, useState } from "react";

type PlanKey = "FREE" | "PRO" | "BUSINESS";

const PLANS: Record<
  PlanKey,
  {
    name: string;
    price: string;
    blurb: string;
    features: string[];
    ctaLabel: string;
    sku?: string; // Stripe price id (optional; wire up later)
  }
> = {
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
    sku: "price_pro_monthly",
  },
  BUSINESS: {
    name: "Business",
    price: "$29/mo",
    blurb: "For small teams and businesses.",
    features: [
      "All Pro benefits",
      "Business/office rewards",
      "Team seats & analytics (soon)",
      "Priority onboarding",
    ],
    ctaLabel: "Upgrade to Business",
    sku: "price_business_monthly",
  },
};

export default function UpgradePage() {
  const router = useRouter();
  const [loadingSku, setLoadingSku] = useState<string | null>(null);

  // Preselect PRO or BUSINESS via ?plan=PRO|BUSINESS
  const preselect = useMemo<PlanKey>(() => {
    const q = String(router.query.plan || "").toUpperCase();
    if (q === "PRO") return "PRO";
    if (q === "BUSINESS") return "BUSINESS";
    return "PRO";
  }, [router.query.plan]);

  async function handleCheckout(plan: PlanKey) {
    const sku = PLANS[plan].sku;
    if (!sku) return; // FREE
    try {
      setLoadingSku(sku);
      // TODO: replace with Stripe Checkout call
      // const res = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ price: sku }) });
      // const { url } = await res.json();
      // window.location.href = url;
      await new Promise((r) => setTimeout(r, 600)); // mock
      alert(`(Mock) Redirecting to checkout for ${plan}…`);
    } finally {
      setLoadingSku(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#003B49] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black mb-2">Choose your plan</h1>
        <p className="opacity-80 mb-8">
          Unlock more shopping rewards and full training access. Cancel anytime.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {(["FREE", "PRO", "BUSINESS"] as PlanKey[]).map((key) => {
            const p = PLANS[key];
            const highlighted = key === preselect;

            return (
              <div
                key={key}
                className={`rounded-2xl border p-6 bg-white/5 ${
                  highlighted ? "border-[#15C5C1]" : "border-white/10"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xl font-bold">{p.name}</h2>
                  <div className="text-[#FF9151] font-black">{p.price}</div>
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
                      onClick={() => handleCheckout(key)}
                      disabled={!!loadingSku}
                      className="rounded-lg bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold px-5 py-2 disabled:opacity-60"
                    >
                      {loadingSku ? "Processing…" : p.ctaLabel}
                    </button>
                  </div>
                )}

                {key === "BUSINESS" && (
                  <p className="text-xs opacity-60 mt-3">
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

        <p className="text-xs opacity-60 mt-8">
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
          <Link href="/account" className="underline text-[#15C5C1]">
            ← Back to Account
          </Link>
        </div>
      </div>
    </main>
  );
}
