// src/pages/join.tsx
import Head from "next/head";
import Link from "next/link";

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#003B49] text-white font-sans flex flex-col">
      <Head>
        <title>Join RewmoAI</title>
        <meta
          name="description"
          content="Join RewmoAI to start earning shopping rewards, referral bonuses, and unlock Pro & Business tiers."
        />
      </Head>

      <main className="flex-1 flex flex-col items-center text-center px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF9151] mb-4">
          Start Your Rewards Journey
        </h1>
        <p className="max-w-xl text-white/90 leading-relaxed mb-8">
          Create your account and unlock rewards on shopping, referrals, and training.
          Upgrade anytime to Pro ($10/mo) or Business ($20/mo).
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          {/* Free Tier */}
          <div className="rounded-2xl border border-white/20 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold text-white mb-2">Free</h2>
            <p className="text-sm text-white/80 mb-4">
              Amazon shopping rewards, referral tracking, and training access.
            </p>
            <Link
              href="/account"
              className="inline-block w-full rounded-lg bg-[#FF9151] text-[#003B49] py-2 font-semibold hover:bg-[#FFA36C]"
            >
              Sign up free →
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="rounded-2xl border border-teal-500/50 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold text-teal-300 mb-2">Pro – $10/mo</h2>
            <p className="text-sm text-white/80 mb-4">
              Unlock Walmart, Delta Airlines, and more brands. Earn 2–3x multipliers.
            </p>
            <Link
              href="/account/upgrade?plan=pro"
              className="inline-block w-full rounded-lg bg-teal-600 text-white py-2 font-semibold hover:bg-teal-500"
            >
              Upgrade to Pro →
            </Link>
          </div>

          {/* Business Tier */}
          <div className="rounded-2xl border border-amber-500/50 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold text-amber-300 mb-2">Business – $20/mo</h2>
            <p className="text-sm text-white/80 mb-4">
              Unlock bulk office supplies & SMB perks. Earn 4x multipliers.
            </p>
            <Link
              href="/account/upgrade?plan=business"
              className="inline-block w-full rounded-lg bg-amber-500 text-[#003B49] py-2 font-semibold hover:bg-amber-400"
            >
              Upgrade to Business →
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-white/70 py-6">
        © 2025 RewmoAI · <Link href="/privacy" className="underline">Privacy</Link> ·{" "}
        <Link href="/terms" className="underline">Terms</Link>
      </footer>
    </div>
  );
}
