// src/pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo"; // or relative path: ../../components/Logo

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#003B49] text-white font-sans flex flex-col">
      <Head>
        <title>RewmoAI — Rewards Mobile AI</title>
        <meta
          name="description"
          content="Earn rewards on shopping, learn AI/TQM/Finance with short modules, and grow your savings with RewmoAI."
        />
      </Head>

      {/* BODY */}
      <main className="flex-1 flex flex-col items-center text-center px-4 py-12">
        {/* Centered, responsive logo */}
        <Image
  src="/logos/logo.png"
  alt="RewmoAI"
  priority
  width={800}   // real width of your rectangle image
  height={456}  // real height (keeps correct ratio)
  className="mx-auto h-auto w-40 md:w-56 lg:w-72"
/>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF9151] mt-6">
          Welcome to Rewards Mobile AI
        </h1>
        <p className="text-white/90 mt-4 max-w-xl leading-relaxed">
          The AI-powered hub for rewards, savings, and smarter financial growth.
          Earn for shopping, referrals, and every dollar you manage smarter.
        </p>

        {/* Primary CTA */}
        <Link
          href="/join"
          aria-label="Get Started and Earn Now"
          className="mt-6 inline-block bg-[#FF9151] text-[#003B49] px-6 py-3 rounded-lg font-bold hover:bg-[#FFA36C] transition"
        >
          Get Started &amp; Earn Now
        </Link>

        {/* Beta note */}
        <div className="mt-6 border border-white/20 rounded-2xl p-4 max-w-xl w-full text-sm bg-white/[0.03]">
          <p className="text-red-400 font-bold">🔴 Beta is LIVE!</p>
          <p className="mt-1">Your rewards and referrals are being tracked. Withdrawals open after launch.</p>
          <p className="mt-1">
            All points follow the{" "}
            <Link href="/reward-rules" className="underline underline-offset-2">
              Reward Rules
            </Link>
            .
          </p>
        </div>

        {/* Training block */}
        <section className="mt-6 w-full max-w-3xl">
          <div className="mx-auto rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Training</h3>
            <p className="mt-1 text-sm text-white/80">
              Hands-on learning tracks with short modules.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/training/genai"
                className="rounded-full bg-teal-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-500"
              >
                GenAI
              </Link>
              <Link
                href="/training/tqm"
                className="rounded-full bg-slate-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-500"
              >
                TQM
              </Link>
              <Link
                href="/training/finance"
                className="rounded-full bg-amber-500/90 px-3 py-1 text-sm font-semibold text-white hover:bg-amber-400"
              >
                Finance
              </Link>
            </div>
          </div>
        </section>

        {/* Two-up feature tiles */}
        <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-4xl w-full">
          <div className="border border-orange-400/60 p-4 rounded-2xl bg-white/[0.03]">
            <h2 className="text-[#FF9151] font-bold">Personal Shopping Rewards</h2>
            <p className="text-sm mt-2 text-white/90">
              Earn instant cash back &amp; bonus points when you shop your favorite brands.
              Simple, secure, automatic savings—groceries, Amazon, and more!
            </p>
            <Link
              href="/shopping"
              className="mt-3 inline-block text-orange-300 underline underline-offset-2"
            >
              See eligible stores →
            </Link>
          </div>

          <div className="border border-teal-400/60 p-4 rounded-2xl bg-white/[0.03]">
            <h2 className="text-teal-300 font-bold">Business Shopping Rewards</h2>
            <p className="text-sm mt-2 text-white/90">
              Unlock rewards on business essentials, bulk orders, and expense tracking.
              Earn more for your business!
            </p>
            <Link
              href="/shopping?tab=business"
              className="mt-3 inline-block text-teal-300 underline underline-offset-2"
            >
              Shop for your business →
            </Link>
          </div>
        </div>

        {/* Lean Lab promo */}
        <div className="mt-10 p-4 border border-teal-400/60 rounded-2xl max-w-xl w-full bg-white/[0.03]">
          <h2 className="text-teal-300 font-bold">Lean Lab – RewmoAI Process Management</h2>
          <p className="text-sm mt-2 text-white/90">
            <strong>NEW:</strong> AI-powered process improvement tools for individuals and businesses.
            Map your routines, eliminate waste, and unlock continuous improvement.
          </p>
          <Link href="/lean-lab" className="mt-2 inline-block text-teal-300 underline underline-offset-2">
            Learn about Lean Lab →
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-sm text-white/70 py-6">
        © 2025 RewmoAI ·{" "}
        <Link href="/affiliate-disclosure" className="underline underline-offset-2">
          Affiliate Disclosure
        </Link>{" "}
        · <Link href="/privacy" className="underline underline-offset-2">Privacy</Link> ·{" "}
        <Link href="/terms" className="underline underline-offset-2">Terms</Link>
      </footer>
    </div>
  );
}
