// src/pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>RewmoAI — Rewards Mobile AI</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>

      <div className="min-h-screen bg-[#003B49] text-white font-sans">
        <main className="mx-auto max-w-5xl px-4 py-12 text-center">
          {/* Hero */}
          <Image src="/logos/logo.png" alt="Rewmo Logo" width={100} height={100} />
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF9151] mt-6">
            Welcome to Rewards Mobile AI
          </h1>
          <p className="text-white/90 mt-4 max-w-2xl mx-auto">
            The AI-powered hub for rewards, savings, and smarter financial growth.
            Earn for shopping, referrals, and every dollar you manage smarter.
          </p>

          {/* Primary CTA */}
          <Link
            href="/join"
            className="mt-8 inline-block bg-[#FF9151] text-[#003B49] px-6 py-3 rounded-lg font-bold hover:bg-[#FFA36C]"
          >
            Get Started & Earn Now
          </Link>

          {/* --- Beta note (now ABOVE the Training block) --- */}
          <div className="mt-8 border border-white rounded p-4 max-w-lg w-full text-sm mx-auto">
            <p className="text-red-400 font-bold">🔴 Beta is LIVE!</p>
            <p>Your rewards and referrals are being tracked. Withdrawals open after launch.</p>
            <p>
              All points follow the{" "}
              <Link href="/reward-rules" className="underline">
                Reward Rules
              </Link>
              .
            </p>
          </div>

          {/* --- Training promo (MOVED BELOW the Beta note) --- */}
          <section className="mt-8 w-full max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Training</h3>
              <p className="mt-1 text-sm text-white/80">
                Hands-on learning tracks with short modules.
              </p>

              <div className="mt-4 flex items-center justify-center gap-2">
                <Link
                  href="/learn/genai"
                  className="rounded-full bg-teal-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-500"
                >
                  GenAI
                </Link>
                <Link
                  href="/learn/tqm"
                  className="rounded-full bg-slate-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-500"
                >
                  TQM
                </Link>
                <Link
                  href="/learn/finance"
                  className="rounded-full bg-amber-500/90 px-3 py-1 text-sm font-semibold text-white hover:bg-amber-400"
                >
                  Finance
                </Link>
              </div>
            </div>
          </section>

          {/* Two-up feature tiles */}
          <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl w-full mx-auto">
            <div className="border border-orange-400 p-4 rounded">
              <h2 className="text-[#FF9151] font-bold">Personal Shopping Rewards</h2>
              <p className="text-sm mt-2">
                Earn instant cash back & bonus points when you shop your favorite brands.
                Simple, secure, automatic savings—groceries, Amazon, and more!
              </p>
              <Link href="/shopping" className="mt-2 inline-block text-orange-300 underline">
                See eligible stores →
              </Link>
            </div>

            <div className="border border-teal-400 p-4 rounded">
              <h2 className="text-teal-300 font-bold">Business Shopping Rewards</h2>
              <p className="text-sm mt-2">
                Unlock rewards on business essentials, bulk orders, and expense tracking.
                Earn more for your business!
              </p>
              <Link href="/enterpriseai" className="mt-2 inline-block text-teal-300 underline">
                Shop for your business →
              </Link>
            </div>
          </div>

          {/* Lean Lab promo */}
          <div className="mt-12 p-4 border border-teal-400 rounded max-w-xl w-full mx-auto">
            <h2 className="text-teal-300 font-bold">Lean Lab – RewmoAI Process Management</h2>
            <p className="text-sm mt-2">
              <strong>NEW:</strong> AI-powered process improvement tools for individuals and businesses.
              Map your routines, eliminate waste, and unlock continuous improvement.
            </p>
            <Link href="/lean-lab" className="mt-2 inline-block text-teal-300 underline">
              Learn about Lean Lab →
            </Link>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="text-center text-sm text-white/70 py-6">
          © 2025 RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline">
            Affiliate Disclosure
          </Link>{" "}
          | <Link href="/privacy" className="underline">Privacy</Link> |{" "}
          <Link href="/terms" className="underline">Terms</Link>
        </footer>
      </div>
    </>
  );
}
