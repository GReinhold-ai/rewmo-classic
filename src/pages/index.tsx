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
      // Better error handling - don't show scary messages to users
      console.error('Waitlist API error:', err);
      setOk(false);
      setMsg("We're experiencing technical difficulties. Please try again later or contact support.");
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
            By joining, you agree to receive early-access updates. We'll never sell your email.
          </p>
          {/* ======= /EMAIL CAPTURE FORM ======= */}
        </div>

        {/* 🚀 LAUNCH ANNOUNCEMENT - Replaced Beta box */}
        <div className="mt-8 border border-[#15C5C1]/60 rounded-2xl p-5 max-w-xl w-full bg-gradient-to-br from-[#072b33] to-[#003B49] shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <p className="text-[#15C5C1] font-bold text-lg">
                Introducing Your First AI Agent
              </p>
              <p className="text-white/90 mt-1">
                RewmoAI is officially live! Start earning cashback rewards on shopping, 
                access AI-powered training, and let our smart tools help you save more every day.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/shopping"
                  className="inline-block px-4 py-2 bg-[#FF9151] text-[#003B49] rounded-lg font-bold text-sm hover:bg-[#FFA36C] transition"
                >
                  Start Shopping →
                </Link>
                <Link
                  href="/learn/genai"
                  className="inline-block px-4 py-2 bg-[#15C5C1]/20 text-[#15C5C1] border border-[#15C5C1]/40 rounded-lg font-bold text-sm hover:bg-[#15C5C1]/30 transition"
                >
                  AI Training →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- LeanAI Lab (single, consolidated training box) ---------- */}
        <section className="mt-8 w-full max-w-3xl">
          <div className="mx-auto rounded-2xl border border-[#15C5C1]/60 bg-[#072b33] p-6 md:p-8 shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#FF9151]">
                  LeanAI Lab
                </h2>
                <p className="text-[#B6E7EB] mt-2 max-w-3xl">
                  Learn the RewmoAI Process Management system. Start free with the{" "}
                  <span className="text-[#15C5C1] font-semibold">Intro track</span>, then
                  unlock advanced modules like{" "}
                  <span className="text-[#FFA36C] font-semibold">
                    R-PM Fundamentals — Module 1
                  </span>.
                </p>
              </div>
              <Link
                href="/lean-lab"
                className="inline-block px-6 py-3 rounded-xl bg-[#15C5C1] text-[#003B49] font-bold border-2 border-[#15C5C1] hover:bg-[#0fb5b1]"
              >
                Open LeanAI Lab
              </Link>
            </div>

            {/* Quick links (kept inside the same box) */}
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <Link
                href="/training/rpm" // Intro (free)
                className="block px-5 py-4 rounded-xl bg-[#003B49] border border-[#15C5C1] text-[#15C5C1] font-semibold hover:bg-[#0a2e35]"
              >
                Intro Track (Free)
              </Link>
              <Link
                href="/leanai/fundamentals" // Paid module
                className="block px-5 py-4 rounded-xl bg-[#003B49] border border-[#FF9151] text-[#FFA36C] font-semibold hover:bg-[#143f49]"
              >
                R-PM Fundamentals — Module 1
              </Link>
            </div>
          </div>
        </section>
        {/* ---------- /LeanAI Lab box ---------- */}

        {/* Two-up feature tiles (unchanged) */}
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
