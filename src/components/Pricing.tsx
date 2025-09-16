import { useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";

type Props = {
  proPriceId?: string;       // STRIPE_PRICE_PRO
  businessPriceId?: string;  // STRIPE_PRICE_BUSINESS
};

export default function Pricing({
  proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
  businessPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS!,
}: Props) {
  const { currentUser } = useAuth();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const email = currentUser?.email || "";
  const uid = currentUser?.uid || "";

  const testMode = useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    return pk.startsWith("pk_test_");
  }, []);

  async function upgrade(priceId: string) {
    if (!priceId) return;
    if (!uid || !email) {
      setErr("Please sign in to upgrade.");
      return;
    }

    try {
      setErr(null);
      setBusyId(priceId);
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, uid, email }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Unable to start checkout.");
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      setErr(e?.message || "Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-3">
      {testMode && (
        <div className="rounded-md bg-yellow-500/10 text-yellow-200 border border-yellow-500/30 px-3 py-2 text-xs">
          Stripe <b>TEST MODE</b> — use card <code>4242 4242 4242 4242</code>, any future date, any CVC.
        </div>
      )}

      {err && (
        <div className="rounded-md bg-red-500/10 text-red-200 border border-red-500/30 px-3 py-2 text-sm">
          {err}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* PRO */}
        <div className="rounded-xl border border-white/15 bg-white/5 p-6">
          <h3 className="text-xl font-bold text-[#FF9151]">Pro</h3>
          <p className="mt-2 text-white/80 text-sm copy-justify">
            Perfect for individuals. Unlock advanced training, faster rewards processing, and priority support.
            7-day money-back guarantee.
          </p>
          <div className="mt-4 text-3xl font-extrabold">$9<span className="text-lg align-top">/mo</span></div>
          <button
            onClick={() => upgrade(proPriceId)}
            disabled={!proPriceId || busyId === proPriceId}
            className="mt-4 rounded-lg bg-[#FF9151] text-[#003B49] px-5 py-2 font-semibold hover:bg-[#FFA36C] disabled:opacity-50"
          >
            {busyId === proPriceId ? "Redirecting…" : "Upgrade to Pro"}
          </button>
          <ul className="mt-4 space-y-1 text-sm text-white/80">
            <li>• Premium lessons & tools</li>
            <li>• Referral boost multipliers</li>
            <li>• Priority email support</li>
          </ul>
        </div>

        {/* BUSINESS */}
        <div className="rounded-xl border border-white/15 bg-white/5 p-6">
          <h3 className="text-xl font-bold text-teal-300">Business</h3>
          <p className="mt-2 text-white/80 text-sm copy-justify">
            For teams & small business. Everything in Pro plus team referrals, shared reporting, and priority onboarding.
          </p>
          <div className="mt-4 text-3xl font-extrabold">$29<span className="text-lg align-top">/mo</span></div>
          <button
            onClick={() => upgrade(businessPriceId)}
            disabled={!businessPriceId || busyId === businessPriceId}
            className="mt-4 rounded-lg bg-teal-400 text-[#003B49] px-5 py-2 font-semibold hover:bg-teal-300 disabled:opacity-50"
          >
            {busyId === businessPriceId ? "Redirecting…" : "Upgrade to Business"}
          </button>
          <ul className="mt-4 space-y-1 text-sm text-white/80">
            <li>• Team referral pooling</li>
            <li>• Shared analytics</li>
            <li>• Priority onboarding</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
