// src/pages/index.tsx
import { useEffect, useState, FormEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { saveRefFromUrl } from "@/lib/referral";

export default function HomePage() {
  // Capture ?ref=... once on load
  useEffect(() => {
    saveRefFromUrl();
  }, []);

  // Waitlist form state
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [msg, setMsg] = useState<string>("");

  async function onJoin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setOk(null);
    setMsg("");

    try {
      const r = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "home_cta" }),
      });

      if (r.ok) {
        setOk(true);
        setMsg("You're in! Check your inbox for a quick hello from us.");
        setEmail("");
      } else {
        const j = await r.json().catch(() => ({}));
        setOk(false);
        setMsg(j?.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setOk(false);
      setMsg(err?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
      <main className="flex-1 flex flex-col px-4 py-12 items-center">
        {/* Logo */}
        <div className="mx-auto w-fit text-center">
          <Image
            src="/logos/logo.png"
            alt="RewmoAI"
            priority
            width={1024}
            height={584}
            sizes="(min-width: 1024px) 20rem, (min-width: 768px) 16rem, 12rem"
            className="block mx-auto h-auto w-48 md:w-64 lg:w-80"
          />
        </div>

        {/* Hero */}
        <div className="mt-6 max-w-3xl w-full text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF9151]">
            Welcome to Rewards Mobile AI
          </h1>
          <p className="text-white/90 mt-4 leading-relaxed">
            The AI-powered hub for rewards, savings, and smarter financial growth.
            Earn for shopping, referrals, and every dollar you manage smarter.
          </p>

          {/* Primary CTA */}
          <div className="mt-6">
            <Link
              href="/account"
              aria-label="Get Started and Earn Now"
              className="inline-block bg-[#FF9151] text-[#003B49] px-6 py-3 rounded-lg font-bold hover:bg-[#FFA36C] transition"
            >
              Get Started &amp; Earn Now
            </Link>
          </div>

          {/* ======= UNICORN LP EMAIL CAPTURE FORM ======= */}
          <form
            onSubmit={onJoin}
            className="mx-auto mt-5 flex w-full max-w-md gap-2"
          >
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 outline-none focus:border-[#FF9151]"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#FF9151] px-4 py-2 font-bold text-[#003B49] hover:bg-[#FFA36C] disabled:opacity-60"
            >
              {loading ? "Joining…" : "Join free"}
            </button>
          </form>

          {/* Inline success/error note */}
          {ok !== null && (
            <div
              className={`mx-auto mt-3 w-full max-w-md rounded-lg border px-3 py-2 text-sm ${
                ok
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                  : "border-red-400/40 bg-red-500/10 text-red-200"
              }`}
            >
              {msg}
            </div>
          )}

          <p className="mx-auto mt-2 w-full max-w-md text-xs text-white/60">
            By joining, you agree to receive early-access updates. We’ll never sell your email.
          </p>
          {/* ======= /EMAIL CAPTURE FORM ======= */}
        </div>

        {/* Beta note */}
        <div className="mt-8 border border-white/20 rounded-2xl p-4 max-w-xl w-full text-sm bg-white/[0.03]">
          <p className="text-red-400 font-bold">🔴 Beta is LIVE!</p>
          <p className="mt-1">
            Your rewards and referrals are being tracked. Withdrawals open after launch.
          </p>
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
          <div className="mx-auto rounded-2xl border border-white/10 bg-white/5 p-6 text-center md:text-left">
            <h3 className="text-lg font-semibold">Training</h3>
            <p className="mt-1 text-sm text-white/80">
              Hands-on learning tracks with short modules.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Link
                href="/learn/genai"
                className="rounded-full bg-teal-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-500"
              >
                GenAI
              </Link>
              <Link
                href="/learn/rpm"
                className="rounded-full bg-slate-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-500"
              >
                R-Process Management
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
          <h2 className="text-teal-300 font-bold">
            Lean Lab – RewmoAI Process Management
          </h2>
          <p className="text-sm mt-2 text-white/90">
            <strong>NEW:</strong> AI-powered process improvement tools for individuals and businesses.
            Map your routines, eliminate waste, and unlock continuous improvement.
          </p>
          <Link
            href="/lean-lab"
            className="mt-2 inline-block text-teal-300 underline underline-offset-2"
          >
            Learn about Lean Lab →
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-sm text-white/70 py-6">
        © {new Date().getFullYear()} RewmoAI ·{" "}
        <Link href="/affiliate-disclosure" className="underline underline-offset-2">
          Affiliate Disclosure
        </Link>{" "}
        · <Link href="/privacy" className="underline underline-offset-2">Privacy</Link> ·{" "}
        <Link href="/terms" className="underline underline-offset-2">Terms</Link>
      </footer>
    </div>
  );
}
