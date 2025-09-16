import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { getSavedRef } from "@/lib/referral";

type PlanKey = "FREE" | "PRO" | "BUSINESS";

const PRICE_PRO = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "";
const PRICE_BUSINESS = process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS || "";
const PUBLISHABLE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

type Plan = {
  name: string;
  price: string;
  blurb: string;
  features: string[];
  ctaLabel: string;
  sku?: string; // Stripe price id
};

const BASE_PLANS: Record<PlanKey, Plan> = {
  FREE: {
    name: "Free",
    price: "$0",
    blurb: "Great for getting started.",
    features: ["Amazon rewards", "LeanAI Module 1 (preview)", "Community updates"],
    ctaLabel: "You're on Free",
  },
  PRO: {
    name: "Pro",
    price: "$9/mo",
    blurb: "Unlock more shopping rewards & training.",
    features: [
      "Walmart & Delta rewards",
      "Full Lean/TQM modules",
      "Finance mini-courses",
      "Priority support",
    ],
    ctaLabel: "Upgrade to Pro",
    sku: PRICE_PRO,
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
    sku: PRICE_BUSINESS,
  },
};

// Read UTM params from the current URL (only on client)
function getUtmFromUrl(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = url.searchParams.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export default function UpgradePage() {
  const router = useRouter();
  const { currentUser, signInWithGoogle } = useAuth();

  const [loadingSku, setLoadingSku] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "info" | "error" | "ok"; text: string } | null>(null);

  // Preselect PRO or BUSINESS via ?plan=PRO|BUSINESS
  const preselect = useMemo<PlanKey>(() => {
    const q = String(router.query.plan || "").toUpperCase();
    if (q === "PRO") return "PRO";
    if (q === "BUSINESS") return "BUSINESS";
    return "PRO";
  }, [router.query.plan]);

  const testMode = useMemo(() => PUBLISHABLE.startsWith("pk_test_"), []);

  // Cache referral + utm so we can send with the checkout request
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => {
    setReferralCode(getSavedRef());
    setUtm(getUtmFromUrl());
  }, []);

  async function handleCheckout(plan: PlanKey) {
    const planDef = BASE_PLANS[plan];
    if (!planDef.sku) {
      setMsg({
        kind: "error",
        text:
          plan === "PRO"
            ? "Missing NEXT_PUBLIC_STRIPE_PRICE_PRO in .env.local"
            : "Missing NEXT_PUBLIC_STRIPE_PRICE_BUSINESS in .env.local",
      });
      return;
    }

    if (!currentUser?.uid || !currentUser.email) {
      setMsg({ kind: "info", text: "Please sign in to upgrade." });
      try {
        await signInWithGoogle?.();
        // after sign-in we land back here, so do nothing else
      } catch {
        /* ignore */
      }
      return;
    }

    try {
      setMsg(null);
      setLoadingSku(planDef.sku);

      // success/cancel are optional – Stripe will use defaults if not provided,
      // but it’s nicer to be explicit.
      const origin =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

      const successUrl = `${origin}/account?upgraded=1`;
      const cancelUrl = `${origin}/account/upgrade?plan=${plan}`;

      // NOTE: /api/checkout should accept these fields (we added them earlier)
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: planDef.sku,
          uid: currentUser.uid,
          email: currentUser.email,
          referralCode: referralCode || undefined,
          utm,
          source: "upgrade_page",
          mode: "subscription",
          successUrl,
          cancelUrl,
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
    <main className="min-h-screen bg-[#003B49] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black mb-2">Choose your plan</h1>
        <p className="opacity-80 mb-6">
          Unlock more shopping rewards and full training access. Cancel anytime.
        </p>

        {currentUser?.email && (
          <p className="mb-4 text-xs text-[#B6E7EB]">
            Signed in as <span className="font-semibold">{currentUser.email}</span>
          </p>
        )}

        {testMode && (
          <div className="mb-4 rounded-md bg-yellow-500/10 text-yellow-200 border border-yellow-500/30 px-3 py-2 text-xs">
            Stripe <b>TEST MODE</b> — use card <code>4242 4242 4242 4242</code>, any future date, any
            CVC.
          </div>
        )}
        {msg && (
          <div
            className={
              "mb-4 rounded-md px-3 py-2 text-sm border " +
              (msg.kind === "error"
                ? "bg-red-500/10 text-red-200 border-red-500/30"
                : msg.kind === "ok"
                ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/30"
                : "bg-white/10 text-white/90 border-white/20")
            }
          >
            {msg.text}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {(["FREE", "PRO", "BUSINESS"] as PlanKey[]).map((key) => {
            const p = BASE_PLANS[key];
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
                <p className="opacity-80 mt-1 copy-justify">{p.blurb}</p>

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
                      disabled={!!loadingSku && loadingSku !== p.sku}
                      className="rounded-lg bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold px-5 py-2 disabled:opacity-60"
                    >
                      {loadingSku === p.sku ? "Redirecting…" : p.ctaLabel}
                    </button>
                    {!p.sku && (
                      <p className="mt-2 text-xs text-red-200">
                        Missing Stripe price id for {key}. Set{" "}
                        {key === "PRO"
                          ? "NEXT_PUBLIC_STRIPE_PRICE_PRO"
                          : "NEXT_PUBLIC_STRIPE_PRICE_BUSINESS"}{" "}
                        in <code className="ml-1">.env.local</code>.
                      </p>
                    )}
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
