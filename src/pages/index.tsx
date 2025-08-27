// src/pages/index.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#003B49] text-white font-sans flex flex-col">
      {/* BODY */}
      <main className="flex-1 flex flex-col items-center text-center px-4 py-12">
        <Image src="/logos/logo.png" alt="Rewmo Logo" width={100} height={100} priority />

        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-[#FF9151]">
          Welcome to Rewards Mobile AI
        </h1>

        <p className="mt-4 max-w-xl text-white">
          The AI-powered hub for rewards, savings, and smarter financial growth. Earn for shopping,
          referrals, and every dollar you manage smarter.
        </p>

        {/* Training promo (GenAI / TQM / Finance) */}
        <section className="mt-8 w-full max-w-2xl">
          <div className="mx-auto rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Training</h3>
            <p className="mt-1 text-sm text-white/80">Hands-on learning tracks with short modules.</p>

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

        {/* Primary CTA */}
        <Link
          href="/join"
          className="mt-8 inline-block rounded-lg bg-[#FF9151] px-6 py-3 font-bold text-[#003B49] hover:bg-[#FFA36C]"
        >
          Get Started & Earn Now
        </Link>

        {/* Beta note */}
        <div className="mt-8 w-full max-w-lg rounded border border-white p-4 text-sm">
          <p className="font-bold text-red-400">🔴 Beta is LIVE!</p>
          <p>Your rewards and referrals are being tracked. Withdrawals open after launch.</p>
          <p>
            All points follow the{" "}
            <Link href="/reward-rules" className="underline">
              Reward Rules
            </Link>
            .
          </p>
        </div>

        {/* Two-up feature tiles */}
        <div className="mt-12 grid w-full max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded border border-orange-400 p-4">
            <h2 className="font-bold text-[#FF9151]">Personal Shopping Rewards</h2>
            <p className="mt-2 text-sm">
              Earn instant cash back & bonus points when you shop your favorite brands. Simple,
              secure, automatic savings—groceries, Amazon, and more!
            </p>
            <Link href="/shopping" className="mt-2 inline-block text-orange-300 underline">
              See eligible stores →
            </Link>
          </div>

          <div className="rounded border border-teal-400 p-4">
            <h2 className="font-bold text-teal-300">Business Shopping Rewards</h2>
            <p className="mt-2 text-sm">
              Unlock rewards on business essentials, bulk orders, and expense tracking. Earn more for
              your business!
            </p>
            <Link href="/enterpriseai" className="mt-2 inline-block text-teal-300 underline">
              Shop for your business →
            </Link>
          </div>
        </div>

        {/* Lean Lab promo */}
        <div className="mt-12 w-full max-w-xl rounded border border-teal-400 p-4">
          <h2 className="font-bold text-teal-300">Lean Lab – RewmoAI Process Management</h2>
          <p className="mt-2 text-sm">
            <strong>NEW:</strong> AI-powered process improvement tools for individuals and businesses.
            Map your routines, eliminate waste, and unlock continuous improvement.
          </p>
          <Link href="/lean-lab" className="mt-2 inline-block text-teal-300 underline">
            Learn about Lean Lab →
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-sm text-white/70">
        © 2025 RewmoAI |{" "}
        <Link href="/affiliate-disclosure" className="underline">
          Affiliate Disclosure
        </Link>{" "}
        | <Link href="/privacy" className="underline">Privacy</Link> |{" "}
        <Link href="/terms" className="underline">Terms</Link>
      </footer>
    </div>
  );
}
