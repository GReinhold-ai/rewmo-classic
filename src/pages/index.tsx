// src/pages/index.tsx
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 text-center">
        <Image src="/logos/logo.png" alt="Rewmo" width={80} height={80} className="mx-auto" priority />
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#FF9151]">
          Welcome to Rewards Mobile AI
        </h1>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          The AI-powered hub for rewards, savings, and smarter financial growth.
          Earn for shopping, referrals, and every dollar you manage smarter.
        </p>

        {/* Training callout */}
        <section className="mt-8 mx-auto max-w-xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Training</h3>
            <p className="mt-1 text-sm text-white/80">
              Hands-on learning tracks with short modules.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Link href="/learn/genai" className="rounded-full bg-teal-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-500">
                GenAI
              </Link>
              <Link href="/learn/tqm" className="rounded-full bg-slate-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-500">
                TQM
              </Link>
              <Link href="/learn/finance" className="rounded-full bg-amber-500/90 px-3 py-1 text-sm font-semibold text-white hover:bg-amber-400">
                Finance
              </Link>
            </div>
          </div>
        </section>

        {/* Primary CTA */}
        <Link
          href="/join"
          className="mt-8 inline-block rounded-lg bg-[#FF9151] px-6 py-3 font-bold text-[#003B49] hover:bg-[#FFA36C]"
        >
          Get Started & Earn Now
        </Link>

        {/* Beta note */}
        <div className="mt-8 mx-auto max-w-lg rounded border border-white p-4 text-sm">
          <p className="font-bold text-red-400">🔴 Beta is LIVE!</p>
          <p>Your rewards and referrals are being tracked. Withdrawals open after launch.</p>
          <p>
            All points follow the{" "}
            <Link href="/reward-rules" className="underline">Reward Rules</Link>.
          </p>
        </div>

        {/* Two feature tiles */}
        <div className="mx-auto mt-12 grid w-full max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded border border-orange-400 p-4">
            <h2 className="font-bold text-[#FF9151]">Personal Shopping Rewards</h2>
            <p className="mt-2 text-sm">
              Earn instant cash back & bonus points when you shop your favorite brands. Simple, secure, automatic savings—groceries, Amazon, and more!
            </p>
            <Link href="/shopping" className="mt-2 inline-block underline text-orange-300">
              See eligible stores →
            </Link>
          </div>
          <div className="rounded border border-teal-400 p-4">
            <h2 className="font-bold text-teal-300">Business Shopping Rewards</h2>
            <p className="mt-2 text-sm">
              Unlock rewards on business essentials, bulk orders, and expense tracking. Earn more for your business!
            </p>
            <Link href="/enterpriseai" className="mt-2 inline-block underline text-teal-300">
              Shop for your business →
            </Link>
          </div>
        </div>

        {/* Lean Lab teaser */}
        <div className="mx-auto mt-12 w-full max-w-xl rounded border border-teal-400 p-4">
          <h2 className="font-bold text-teal-300">Lean Lab – RewmoAI Process Management</h2>
          <p className="mt-2 text-sm">
            <strong>NEW:</strong> AI-powered process improvement tools for individuals and businesses. Map your routines, eliminate waste, and unlock continuous improvement.
          </p>
          <Link href="/lean-lab" className="mt-2 inline-block underline text-teal-300">
            Learn about Lean Lab →
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-white/70">
        © 2025 RewmoAI · <Link href="/affiliate-disclosure" className="underline">Affiliate Disclosure</Link> ·{" "}
        <Link href="/privacy" className="underline">Privacy</Link> ·{" "}
        <Link href="/terms" className="underline">Terms</Link>
      </footer>
    </div>
  );
}
